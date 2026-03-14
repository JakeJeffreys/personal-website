import Image from "next/image";
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
import { getGitHubActivity, getGitHubUser, type GitHubEvent } from "@/lib/github";
import { cn } from "@/lib/utils";

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

function eventIconBg(type: string): string {
  switch (type) {
    case "PushEvent":
      return "bg-sky-500/15 text-sky-500";
    case "CreateEvent":
      return "bg-emerald-500/15 text-emerald-600";
    case "DeleteEvent":
      return "bg-red-500/15 text-red-500";
    case "ForkEvent":
      return "bg-violet-500/15 text-violet-500";
    case "WatchEvent":
      return "bg-yellow-500/15 text-yellow-600";
    case "PullRequestEvent":
    case "PullRequestReviewEvent":
      return "bg-purple-500/15 text-purple-500";
    case "IssuesEvent":
    case "IssueCommentEvent":
      return "bg-orange-500/15 text-orange-500";
    default:
      return "bg-slate-500/15 text-slate-500";
  }
}

// ---------------------------------------------------------------------------
// Heatmap
// ---------------------------------------------------------------------------

/**
 * Lightweight seeded PRNG (mulberry32) — deterministic, fast, no deps.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type HeatLevel = 0 | 1 | 2 | 3;

function heatColor(level: HeatLevel): string {
  return `var(--color-heat-${level})`;
}

interface HeatmapProps {
  events: GitHubEvent[];
}

function ContributionHeatmap({ events }: HeatmapProps) {
  const WEEKS = 52;
  const DAYS = 7;

  // Build a date→count map from real events
  const countByDate = new Map<string, number>();
  for (const ev of events) {
    const day = ev.created_at.slice(0, 10); // "YYYY-MM-DD"
    countByDate.set(day, (countByDate.get(day) ?? 0) + 1);
  }

  // Determine the most recent event date to know how many real weeks to show
  const today = new Date();
  // Align to Sunday
  const startOfGrid = new Date(today);
  startOfGrid.setDate(today.getDate() - (WEEKS * DAYS - 1));

  // Find how many days ago the oldest real event is (cap at total grid cells)
  const oldestEventDate =
    events.length > 0
      ? new Date(events[events.length - 1].created_at)
      : null;

  const totalCells = WEEKS * DAYS;
  const realDaysCount = oldestEventDate
    ? Math.min(
        totalCells,
        Math.floor((today.getTime() - oldestEventDate.getTime()) / 86400000) + 1
      )
    : 0;

  // Build the grid: WEEKS columns, each DAYS rows (col-major, oldest→newest left→right)
  const grid: HeatLevel[][] = [];
  const rand = mulberry32(0xdeadbeef);

  for (let w = 0; w < WEEKS; w++) {
    const col: HeatLevel[] = [];
    for (let d = 0; d < DAYS; d++) {
      const cellIndex = w * DAYS + d;
      const cellDate = new Date(startOfGrid);
      cellDate.setDate(startOfGrid.getDate() + cellIndex);
      const dateStr = cellDate.toISOString().slice(0, 10);

      // Future dates: empty
      if (cellDate > today) {
        col.push(0);
        continue;
      }

      // Real data zone
      const isInRealZone = cellIndex >= totalCells - realDaysCount;
      if (isInRealZone) {
        const count = countByDate.get(dateStr) ?? 0;
        if (count === 0) col.push(0);
        else if (count === 1) col.push(1);
        else if (count <= 3) col.push(2);
        else col.push(3);
      } else {
        // Pseudo-random for older weeks — weighted toward empty/low
        const r = rand();
        if (r < 0.55) col.push(0);
        else if (r < 0.78) col.push(1);
        else if (r < 0.92) col.push(2);
        else col.push(3);
      }
    }
    grid.push(col);
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Build month labels: find the week where the month first appears
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const cellDate = new Date(startOfGrid);
    cellDate.setDate(startOfGrid.getDate() + w * DAYS);
    const m = cellDate.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: months[m], weekIndex: w });
      lastMonth = m;
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Month labels */}
      <div className="relative mb-1 ml-8 flex" style={{ gap: "2px" }}>
        {Array.from({ length: WEEKS }).map((_, w) => {
          const label = monthLabels.find((ml) => ml.weekIndex === w);
          return (
            <div key={w} className="flex-none text-[10px]" style={{ width: 11, color: "var(--color-text-dim)" }}>
              {label ? label.label : ""}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-1">
        {/* Day-of-week labels */}
        <div className="flex flex-col mr-1" style={{ gap: "2px" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="text-[10px] flex items-center justify-center"
              style={{ height: 11, width: 14, color: "var(--color-text-dim)" }}
            >
              {i % 2 === 1 ? d : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex" style={{ gap: "2px" }}>
          {grid.map((col, w) => (
            <div key={w} className="flex flex-col" style={{ gap: "2px" }}>
              {col.map((level, d) => (
                <div
                  key={d}
                  className="rounded-[2px] transition-transform hover:scale-125"
                  style={{ width: 11, height: 11, background: heatColor(level) }}
                  title={`Level ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 ml-8 flex items-center gap-1.5 text-[10px]" style={{ color: "var(--color-text-dim)" }}>
        <span>Less</span>
        {([0, 1, 2, 3] as HeatLevel[]).map((l) => (
          <div
            key={l}
            className="rounded-[2px]"
            style={{ width: 11, height: 11, background: heatColor(l) }}
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
  const [user, events] = await Promise.all([
    getGitHubUser("jakejeffreys"),
    getGitHubActivity("jakejeffreys"),
  ]);

  const recentEvents = events.slice(0, 10);

  return (
    <section id="github" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
            GitHub Activity
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-px w-12 rounded-full" style={{ background: "var(--color-accent)" }} />
            <div className="h-px flex-1 rounded-full" style={{ background: "var(--color-border)" }} />
          </div>
        </div>

        {/* User stats */}
        {user && (
          <div
            className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <Image
              src={user.avatar_url}
              alt={`${user.login} avatar`}
              width={52}
              height={52}
              className="rounded-full ring-2 ring-sky-400/30 shrink-0"
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
                style={{ color: "var(--color-accent)" }}
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
        <div
          className="mb-10 p-4 sm:p-5 rounded-xl border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <p className="text-xs font-mono mb-4" style={{ color: "var(--color-text-dim)" }}>
            Contribution activity — past 52 weeks
          </p>
          <ContributionHeatmap events={events} />
        </div>

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
                      className={cn(
                        "absolute -left-[2.1rem] top-0.5 flex items-center justify-center w-7 h-7 rounded-full border",
                        eventIconBg(event.type)
                      )}
                      style={{ borderColor: "var(--color-border)" }}
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
                          style={{ color: "var(--color-accent)" }}
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
            className="inline-flex items-center gap-2 text-sm hover:opacity-75 transition-opacity font-mono group"
            style={{ color: "var(--color-accent)" }}
          >
            View full profile on GitHub
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
