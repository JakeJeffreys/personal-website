import Image from "next/image";
import { SectionHeading } from "@/components/paper";
import Link from "next/link";
import {
  GitCommit,
  Plus,
  GitFork,
  Star,
  GitPullRequest,
  GitMerge,
  AlertCircle,
  Code,
  Trash2,
  RefreshCw,
  Activity,
  Users,
  BookOpen,
} from "lucide-react";
import {
  getGitHubActivity,
  getGitHubContributions,
  getGitHubUser,
  type ContributionCalendar,
  type ContributionLevel,
  type GitHubEvent,
} from "@/lib/github";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} ${h === 1 ? "hour" : "hours"} ago`;
  }
  const d = Math.floor(diff / 86400);
  if (d < 30) return `${d} ${d === 1 ? "day" : "days"} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} ${mo === 1 ? "month" : "months"} ago`;
  const yr = Math.floor(mo / 12);
  return `${yr} ${yr === 1 ? "year" : "years"} ago`;
}

function describeEvent(event: GitHubEvent): string {
  const payload = event.payload as Record<string, unknown>;
  switch (event.type) {
    case "PushEvent": {
      const commits = (payload.commits as unknown[])?.length ?? 0;
      const branch = (payload.ref as string | undefined)?.replace("refs/heads/", "") ?? "main";
      return `Pushed ${commits} commit${commits !== 1 ? "s" : ""} to ${branch}`;
    }
    case "CreateEvent": {
      const refType = payload.ref_type as string | undefined;
      const ref = payload.ref as string | undefined;
      if (refType === "repository") return "Created a new repository";
      if (refType === "branch") return `Created branch ${ref ?? ""}`;
      if (refType === "tag") return `Created tag ${ref ?? ""}`;
      return "Created something new";
    }
    case "DeleteEvent": {
      const refType = payload.ref_type as string | undefined;
      const ref = payload.ref as string | undefined;
      return `Deleted ${refType ?? "ref"} ${ref ?? ""}`;
    }
    case "ForkEvent": {
      const forkee = (payload.forkee as { full_name?: string } | undefined)?.full_name;
      return forkee ? `Forked to ${forkee}` : "Forked a repository";
    }
    case "WatchEvent":
      return "Starred a repository";
    case "PullRequestEvent": {
      const action = payload.action as string | undefined;
      const pr = payload.pull_request as { title?: string } | undefined;
      return `${action ? action.charAt(0).toUpperCase() + action.slice(1) : "Opened"} pull request: ${pr?.title ?? ""}`;
    }
    case "PullRequestReviewEvent":
      return "Reviewed a pull request";
    case "IssuesEvent": {
      const action = payload.action as string | undefined;
      const issue = payload.issue as { title?: string } | undefined;
      return `${action ? action.charAt(0).toUpperCase() + action.slice(1) : "Opened"} issue: ${issue?.title ?? ""}`;
    }
    case "IssueCommentEvent":
      return "Commented on an issue";
    case "ReleaseEvent": {
      const release = payload.release as { tag_name?: string } | undefined;
      return `Published release ${release?.tag_name ?? ""}`;
    }
    case "PublicEvent":
      return "Made a repository public";
    case "MemberEvent": {
      const member = payload.member as { login?: string } | undefined;
      return `Added ${member?.login ?? "a collaborator"} to repository`;
    }
    default:
      return event.type.replace(/Event$/, "").replace(/([A-Z])/g, " $1").trim();
  }
}

function EventIcon({ type }: { type: string }) {
  const iconClass = "w-3.5 h-3.5";
  switch (type) {
    case "PushEvent":
      return <GitCommit className={iconClass} />;
    case "CreateEvent":
      return <Plus className={iconClass} />;
    case "DeleteEvent":
      return <Trash2 className={iconClass} />;
    case "ForkEvent":
      return <GitFork className={iconClass} />;
    case "WatchEvent":
      return <Star className={iconClass} />;
    case "PullRequestEvent":
      return <GitPullRequest className={iconClass} />;
    case "PullRequestReviewEvent":
      return <GitMerge className={iconClass} />;
    case "IssuesEvent":
    case "IssueCommentEvent":
      return <AlertCircle className={iconClass} />;
    case "ReleaseEvent":
      return <Code className={iconClass} />;
    case "PublicEvent":
      return <RefreshCw className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
}


// ---------------------------------------------------------------------------
// Heatmap
// ---------------------------------------------------------------------------

type HeatLevel = 0 | 1 | 2 | 3;

function heatColor(level: HeatLevel): string {
  return `var(--color-heat-${level})`;
}

const LEVEL_MAP: Record<ContributionLevel, HeatLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 3,
};

interface HeatmapProps {
  calendar: ContributionCalendar;
}

function ContributionHeatmap({ calendar }: HeatmapProps) {
  // GitHub returns Sunday-aligned weeks; the first and last may be partial
  const weeks = calendar.weeks.map((w) => w.contributionDays);
  const WEEKS = weeks.length;
  // A full year at phone width shrinks cells to ~4px and the month labels
  // collide, so below `sm` only the most recent half-year is shown.
  const MOBILE_WEEKS = 26;
  const desktopOnly = (w: number) => (w < WEEKS - MOBILE_WEEKS ? "hidden sm:block" : "");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Build month labels: find the week where the month first appears
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const m = Number(weeks[w][0].date.slice(5, 7)) - 1;
    if (m !== lastMonth) {
      // Labels overflow their one-week column, so when two land too close
      // (a partial first month), drop the older stub, as GitHub does.
      const prev = monthLabels[monthLabels.length - 1];
      if (prev && w - prev.weekIndex < 3) monthLabels.pop();
      monthLabels.push({ label: months[m], weekIndex: w });
      lastMonth = m;
    }
  }

  return (
    <div className="w-full">
      {/* Month labels */}
      <div className="flex mb-1" style={{ marginLeft: 22, gap: "2px" }}>
        {Array.from({ length: WEEKS }).map((_, w) => {
          const label = monthLabels.find((ml) => ml.weekIndex === w);
          return (
            <div key={w} className={`flex-1 min-w-0 whitespace-nowrap text-[10px] ${desktopOnly(w)}`} style={{ color: "var(--color-text-dim)" }}>
              {label ? label.label : ""}
            </div>
          );
        })}
      </div>

      <div className="flex" style={{ gap: "2px" }}>
        {/* Day-of-week labels */}
        <div className="flex flex-col" style={{ gap: "2px", width: 14, flexShrink: 0 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="flex-1 text-[10px] flex items-center justify-center"
              style={{ color: "var(--color-text-dim)" }}
            >
              {i % 2 === 1 ? d : ""}
            </div>
          ))}
        </div>

        <div style={{ width: 6, flexShrink: 0 }} />

        {/* Grid */}
        <div className="flex flex-1" style={{ gap: "2px" }}>
          {weeks.map((days, w) => {
            // Pad partial first week at the top so days line up with their rows
            const leading = w === 0 ? new Date(days[0].date + "T00:00:00Z").getUTCDay() : 0;
            return (
              <div key={w} className={`flex-1 flex-col ${w < WEEKS - MOBILE_WEEKS ? "hidden sm:flex" : "flex"}`} style={{ gap: "2px" }}>
                {Array.from({ length: leading }).map((_, i) => (
                  <div key={`pad-${i}`} className="w-full" style={{ aspectRatio: "1" }} />
                ))}
                {days.map((day) => (
                  <div
                    key={day.date}
                    className="w-full transition-transform hover:scale-125"
                    style={{
                      aspectRatio: "1",
                      background: heatColor(LEVEL_MAP[day.contributionLevel]),
                      border: "1px solid var(--color-border)",
                      borderRadius: "1px",
                    }}
                    title={`${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${day.date}`}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-1.5 text-[10px]" style={{ marginLeft: 22, color: "var(--color-text-dim)" }}>
        <span>Less</span>
        {([0, 1, 2, 3] as HeatLevel[]).map((l) => (
          <div
            key={l}
            className="h-3 w-3"
            style={{
              background: heatColor(l),
              border: "1px solid var(--color-border)",
              borderRadius: "1px",
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default async function GitHubActivity() {
  const [user, events, calendar] = await Promise.all([
    getGitHubUser("jakejeffreys"),
    getGitHubActivity("jakejeffreys"),
    getGitHubContributions("jakejeffreys"),
  ]);

  const recentEvents = events.slice(0, 10);

  return (
    <section id="github" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <SectionHeading title="what I've been building" eyebrow="github" variant="torn" />

        {/* User stats */}
        {user && (
          <div
            className="mb-8 flex flex-wrap items-center gap-4 border p-4"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-paper)",
            }}
          >
            <Image
              src={user.avatar_url}
              alt={`${user.login} avatar`}
              width={52}
              height={52}
              className="shrink-0 rounded-full"
              style={{ boxShadow: "0 0 0 2px var(--color-accent)" }}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-base leading-tight truncate" style={{ color: "var(--color-text)" }}>
                {user.name ?? user.login}
              </span>
              <Link
                href={`https://github.com/${user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:opacity-75 transition-opacity font-mono"
                style={{ color: "var(--color-accent-ink)" }}
              >
                @{user.login}
              </Link>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 sm:ml-auto">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 font-semibold text-base" style={{ color: "var(--color-text-muted)" }}>
                  <Users className="w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
                  {user.followers.toLocaleString()}
                </div>
                <span className="text-xs mt-0.5" style={{ color: "var(--color-text-dim)" }}>followers</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 font-semibold text-base" style={{ color: "var(--color-text-muted)" }}>
                  <BookOpen className="w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
                  {user.public_repos.toLocaleString()}
                </div>
                <span className="text-xs mt-0.5" style={{ color: "var(--color-text-dim)" }}>repos</span>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap */}
        {calendar && (
          <div
            className="mb-10 border p-4 sm:p-5"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="text-xs font-mono mb-4" style={{ color: "var(--color-text-dim)" }}>
              {calendar.totalContributions.toLocaleString()} contributions in the last year
            </p>
            <ContributionHeatmap calendar={calendar} />
          </div>
        )}

        {/* Recent activity feed */}
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>
            Recent Events
          </h3>
          {recentEvents.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>No recent public activity.</p>
          ) : (
            <ol className="relative border-l space-y-0" style={{ borderColor: "var(--color-border)" }}>
              {recentEvents.map((event, i) => {
                const repoName = event.repo.name;
                const repoUrl = `https://github.com/${repoName}`;
                return (
                  <li
                    key={event.id ?? i}
                    className="ml-5 pb-6 last:pb-0 relative"
                  >
                    {/* Timeline dot with icon */}
                    <span
                      className="absolute -left-[2.1rem] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border"
                      style={{
                        borderColor: "var(--color-border)",
                        background: "var(--color-surface-2)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <EventIcon type={event.type} />
                    </span>

                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm leading-snug" style={{ color: "var(--color-text)" }}>
                        {describeEvent(event)}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono hover:opacity-75 transition-opacity"
                          style={{ color: "var(--color-accent-ink)" }}
                        >
                          {repoName}
                        </Link>
                        <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>·</span>
                        <time
                          dateTime={event.created_at}
                          className="text-xs"
                          style={{ color: "var(--color-text-dim)" }}
                        >
                          {relativeTime(event.created_at)}
                        </time>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Link to full profile */}
        <div className="mt-8">
          <Link
            href="https://github.com/jakejeffreys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-3 text-sm hover:opacity-75 transition-opacity font-mono group"
            style={{ color: "var(--color-accent-ink)" }}
          >
            View full profile on GitHub
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
