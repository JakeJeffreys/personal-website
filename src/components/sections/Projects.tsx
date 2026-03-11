import { Star, GitFork, ExternalLink } from "lucide-react";
import { getGitHubRepos, type GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

// Language badge colors
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
  JavaScript: "bg-yellow-500/15 text-yellow-400 ring-yellow-500/30",
  Python: "bg-green-500/15 text-green-400 ring-green-500/30",
  Rust: "bg-orange-500/15 text-orange-400 ring-orange-500/30",
  Go: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/30",
  Java: "bg-red-500/15 text-red-400 ring-red-500/30",
  "C++": "bg-purple-500/15 text-purple-400 ring-purple-500/30",
  C: "bg-gray-500/15 text-gray-400 ring-gray-500/30",
  Ruby: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  Swift: "bg-orange-400/15 text-orange-300 ring-orange-400/30",
  Kotlin: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
  Shell: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  HTML: "bg-orange-600/15 text-orange-400 ring-orange-600/30",
  CSS: "bg-blue-600/15 text-blue-300 ring-blue-600/30",
};

const DEFAULT_LANGUAGE_COLOR = "bg-slate-500/15 text-slate-400 ring-slate-500/30";

function LanguageBadge({ language }: { language: string | null }) {
  if (!language) return null;
  const colorClass = LANGUAGE_COLORS[language] ?? DEFAULT_LANGUAGE_COLOR;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        colorClass
      )}
    >
      {language}
    </span>
  );
}

function TopicChip({ topic }: { topic: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400 ring-1 ring-slate-700">
      {topic}
    </span>
  );
}

function ProjectCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-base font-semibold text-sky-400 group-hover:text-sky-300 transition-colors duration-200 break-all">
          {repo.name}
        </h3>
        <ExternalLink
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition-colors duration-200 group-hover:text-sky-400"
          aria-hidden="true"
        />
      </div>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed text-slate-400 line-clamp-3">
        {repo.description ?? (
          <span className="italic text-slate-600">No description provided.</span>
        )}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 5).map((topic) => (
            <TopicChip key={topic} topic={topic} />
          ))}
          {repo.topics.length > 5 && (
            <span className="text-xs text-slate-600">+{repo.topics.length - 5} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
        <LanguageBadge language={repo.language} />
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
            {repo.forks_count}
          </span>
        </div>
      </div>

      {/* Accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(56,189,248,0.04), transparent 60%)",
        }}
        aria-hidden="true"
      />
    </a>
  );
}

function PlaceholderCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6 animate-pulse">
      <div className="h-5 w-2/3 rounded bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-full rounded bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-slate-800" />
        <div className="h-3 w-4/6 rounded bg-slate-800" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-16 rounded-md bg-slate-800" />
        <div className="h-5 w-12 rounded-md bg-slate-800" />
      </div>
      <div className="flex items-center justify-between border-t border-slate-800 pt-1">
        <div className="h-5 w-20 rounded-full bg-slate-800" />
        <div className="flex gap-3">
          <div className="h-4 w-8 rounded bg-slate-800" />
          <div className="h-4 w-8 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default async function Projects() {
  const repos = await getGitHubRepos("jakejeffreys");
  const topRepos = repos.slice(0, 6);
  const hasFailed = topRepos.length === 0;

  return (
    <section id="projects" className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Projects</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-sky-500/50 to-transparent" />
          </div>
          <p className="mt-3 text-slate-400 max-w-xl">
            Open-source work and personal projects. Sourced live from GitHub.
          </p>
        </div>

        {/* Grid */}
        {hasFailed ? (
          <>
            <p className="mb-6 text-sm text-slate-500">
              Could not load repositories at this time. Here are some placeholders.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topRepos.map((repo) => (
              <ProjectCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {/* Link to full profile */}
        {!hasFailed && (
          <div className="mt-10 text-center">
            <a
              href="https://github.com/jakejeffreys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-sky-500/50 hover:text-sky-400"
            >
              View all repositories on GitHub
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
