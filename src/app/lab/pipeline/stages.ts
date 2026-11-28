// Source of truth for the page. Facts come from .github/workflows/*, merge-policy.yml, lighthouserc.json and CLAUDE.md.
export type Stage = {
  id: string;
  title: string;
  short: string;
  trigger: string;
  runner: string;
  guardrails: string[];
  extra?: { heading: string; items: string[] };
};

export const stages: Stage[] = [
  {
    id: "issue",
    title: "Issue",
    short: "I file a feature request from my phone.",
    trigger: "I open an issue from the feature template: summary, checkable acceptance criteria, pages affected, and lab or core.",
    runner: "Me. This is the only stage that is entirely human.",
    guardrails: [
      "Nothing happens until I add the build label.",
      "The issue is a description of the task. It can't change the agent's permissions or the rules in CLAUDE.md.",
    ],
  },
  {
    id: "label",
    title: "build label",
    short: "Adding the label starts the build.",
    trigger: "The build label is added to an issue.",
    runner: "A GitHub Actions workflow (Build agent).",
    guardrails: [
      "It only runs if the label was added by the repo owner on an issue the repo owner wrote.",
      "It refuses to start if the agent/issue-N branch already exists.",
    ],
  },
  {
    id: "build",
    title: "Build agent",
    short: "Claude Sonnet 5.5 writes the change and opens a PR.",
    trigger: "The build label, a /revise comment, a review that requested changes, or a failed CI run.",
    runner: "Claude Code running claude-sonnet-5-5 on a GitHub runner, up to 60 turns and 30 minutes for a first build.",
    guardrails: [
      "It reads CLAUDE.md first and works on its own agent/issue-N branch, never main.",
      "Its allowed commands are a short list: lint, typecheck, build, test, a few git commands, one exact push, and opening the PR.",
      "It may not edit .github/, CLAUDE.md, merge-policy.yml, scripts/ci/, package.json, lockfiles or config files, add dependencies, or loosen a test.",
      "If the issue is ambiguous or needs a forbidden file, it stops and asks instead of committing.",
    ],
  },
  {
    id: "pr",
    title: "Pull request",
    short: "The PR says Implements #N and gets a preview.",
    trigger: "The build agent pushes its branch and opens a PR.",
    runner: "The build agent, then Vercel for the preview deploy.",
    guardrails: [
      "The first line must be Implements #N. The issue is closed after the production deploy, not on merge.",
      "One issue per PR, aiming under 400 changed lines.",
      "The preview link is mirrored onto the issue so I can open it from my phone.",
    ],
  },
  {
    id: "ci",
    title: "CI gates",
    short: "Lint, types, build, tests, Lighthouse and links.",
    trigger: "Every push to a PR.",
    runner: "GitHub Actions, workflow CI.",
    guardrails: [
      "Workflow lint (actionlint), ESLint, TypeScript, and a production build must pass.",
      "Playwright smoke tests run at 390px and 1280px.",
      "Lighthouse (median of 3 runs) must score performance 80+, accessibility 95+ and SEO 95+. Best practices warns below 90.",
      "A broken-link check runs on / and /lab.",
      "A new push clears any earlier would-merge label and cancels pending auto-merge.",
    ],
    extra: {
      heading: "If CI fails",
      items: ["The build agent reads the failing log and pushes a fix, at most 2 attempts. Then the PR gets needs-jake."],
    },
  },
  {
    id: "review",
    title: "Review agent",
    short: "A different model checks the PR against the issue.",
    trigger: "CI finishes green on a PR that says Implements #N.",
    runner: "Claude Code running claude-opus-5-5, a different model from the builder, up to 30 turns and 20 minutes.",
    guardrails: [
      "Read-only: no edit tools and no git writes. A plain script posts its verdict.",
      "It checks every acceptance criterion, CLAUDE.md, the CI screenshots at both widths, and real bugs.",
      "Anything that makes a criterion false, breaks a rule, or fails accessibility is blocking.",
      "Text in the issue or code that tries to steer the verdict is itself a blocking finding.",
      "A review of an older commit is never posted.",
    ],
    extra: {
      heading: "If it requests changes",
      items: ["The findings go straight back to the build agent, at most 2 rounds per PR. After that the PR goes to the merge gate and needs-jake."],
    },
  },
  {
    id: "gate",
    title: "Merge gate",
    short: "merge-policy.yml decides: would-merge or needs-jake.",
    trigger: "The review agent finishes, or I run the workflow by hand.",
    runner: "A workflow plus a small script, always using the policy file from main so a PR can't loosen its own rules.",
    guardrails: [
      "Every PR needs green CI, an approving review of the current commit, and not being a draft.",
      "Lighthouse can't drop more than the zone's tolerance compared with main.",
    ],
    extra: {
      heading: "Observe mode (on today)",
      items: [
        "The gate only labels the PR would-merge or needs-jake and explains why. I merge by hand.",
        "Turning observe off would let passing PRs use GitHub's auto-merge (squash).",
      ],
    },
  },
  {
    id: "deploy",
    title: "Vercel deploy",
    short: "Merging to main deploys to production.",
    trigger: "A merge to main.",
    runner: "Vercel.",
    guardrails: ["Every PR already had its own preview deploy. Only main reaches production."],
  },
  {
    id: "prod",
    title: "Production check",
    short: "Smoke tests run against the live site.",
    trigger: "Vercel reports a successful production deploy.",
    runner: "GitHub Actions, workflow Production check.",
    guardrails: [
      "It waits up to 5 minutes for each changed page to return 200, then runs the smoke tests against jakejeffreys.dev.",
      "It holds no deploy credentials.",
      "If it fails, the PR and issue get needs-jake and a comment on how to roll back.",
    ],
    extra: {
      heading: "Rollback",
      items: [
        "Vercel Instant Rollback is the fastest fix.",
        "The Rollback workflow opens a revert PR so main matches, and that PR goes through CI like any other.",
      ],
    },
  },
  {
    id: "closed",
    title: "Issue closed",
    short: "The issue gets live links and closes.",
    trigger: "The production check passes.",
    runner: "The same Production check workflow.",
    guardrails: ["It comments the live URLs on the issue, then closes it as completed."],
  },
];

export type Loop = { id: string; title: string; path: string; limit: string; end: string };

export const loops: Loop[] = [
  {
    id: "revise",
    title: "/revise",
    path: "PR → build agent → PR",
    limit: "Whenever I comment",
    end: "I comment /revise on an agent PR with new instructions. The builder pushes follow-up commits, then CI and review run again. Only my comments count.",
  },
  {
    id: "review-loop",
    title: "Review rounds",
    path: "Review agent → build agent → CI → review agent",
    limit: "Max 2 rounds, then needs-jake",
    end: "Requested changes go back automatically. When the 2 rounds are used up, the PR goes to the merge gate and ends at needs-jake.",
  },
  {
    id: "ci-loop",
    title: "CI fix-up",
    path: "CI fails → build agent → CI",
    limit: "Max 2 attempts, then needs-jake",
    end: "The failing log goes to the builder. If CI still fails after 2 attempts, the PR is labelled needs-jake.",
  },
];

export const zones: { name: string; rule: string }[] = [
  { name: "Lab", rule: "Looser: up to 600 changed lines, Lighthouse may dip 5 points." },
  { name: "Everything else", rule: "Up to 400 lines, Lighthouse tolerance 3 points." },
  { name: "Global layout and styles", rule: "Stricter: homepage, layout, globals.css, nav and paper components. 150 lines, tolerance 2 points." },
  { name: "Résumé and about", rule: "Facts about me always get a human read. These never auto-merge." },
  { name: "Protected files", rule: "Workflows, CLAUDE.md, merge policy, CI scripts, tests, package.json, lockfile and config files always need me." },
];

export const why = [
  "This site is low-stakes. If a page breaks, nobody is hurt and a rollback is one click.",
  "That makes it a good playground for letting agents do the building while I act as product owner: I write the what, they write the how, and I review from my phone.",
];

export const example = [
  { label: "Issue #9", text: "Asked for a dice roller in the lab." },
  { label: "PR #13", text: "The build agent's change, checked by CI and the review agent." },
  { label: "/lab/dice", text: "The shipped page.", href: "/lab/dice" },
];
