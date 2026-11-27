#!/usr/bin/env bash
# Collects what the merge policy needs about one PR into <out-dir>/context.json.
# Usage: merge-context.sh <pr> <out-dir>    (needs GH_TOKEN with actions:read)
set -euo pipefail

pr=$1
out=$2
repo=${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}
mkdir -p "$out"

gh pr view "$pr" --repo "$repo" --json number,headRefOid,isDraft,state,baseRefName > "$out/pr.json"
sha=$(jq -r .headRefOid "$out/pr.json")

gh api "repos/$repo/pulls/$pr/files" --paginate --jq '.[] | {filename, additions, deletions}' | jq -s . > "$out/files.json"

checks=$(gh api "repos/$repo/commits/$sha/check-runs?check_name=checks" \
  --jq '.check_runs | sort_by(.completed_at) | last | .conclusion // "missing"')

review=$(gh api "repos/$repo/pulls/$pr/reviews" --paginate \
  --jq '.[] | select(.user.login == "github-actions[bot]") | .body' \
  | grep -oE 'review-agent verdict=[a-z_]+ sha=[0-9a-f]+' | tail -1 || true)

download_report() {
  gh run download "$1" --repo "$repo" --name ci-report --dir "$2" > /dev/null 2>&1 || true
}
scores() {
  if [ -f "$1/lighthouse/scores.json" ]; then cat "$1/lighthouse/scores.json"; else echo null; fi
}

# Filter on conclusion with jq: `gh run list --status success --commit` sometimes returns nothing.
pr_run=$(gh run list --repo "$repo" --workflow CI --commit "$sha" --limit 20 --json databaseId,conclusion \
  --jq '[.[] | select(.conclusion == "success")][0].databaseId // empty')
base_run=$(gh run list --repo "$repo" --workflow CI --branch main --event push --limit 20 --json databaseId,conclusion \
  --jq '[.[] | select(.conclusion == "success")][0].databaseId // empty')
[ -n "$pr_run" ] && download_report "$pr_run" "$out/pr-report"
[ -n "$base_run" ] && download_report "$base_run" "$out/base-report"

jq -n \
  --slurpfile pr "$out/pr.json" \
  --slurpfile files "$out/files.json" \
  --arg checks "$checks" \
  --arg review "$review" \
  --argjson prScores "$(scores "$out/pr-report")" \
  --argjson baseScores "$(scores "$out/base-report")" \
  '{
    number: $pr[0].number,
    sha: $pr[0].headRefOid,
    draft: $pr[0].isDraft,
    state: $pr[0].state,
    base: $pr[0].baseRefName,
    files: $files[0],
    checks: $checks,
    review: (if $review == "" then null
             else ($review | capture("verdict=(?<verdict>[a-z_]+) sha=(?<sha>[0-9a-f]+)")) end),
    lighthouse: {pr: $prScores, base: $baseScores}
  }' > "$out/context.json"
