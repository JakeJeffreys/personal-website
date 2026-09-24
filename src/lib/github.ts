const GITHUB_API_BASE = "https://api.github.com";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: Record<string, unknown>;
}

export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&type=public`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      console.error(`GitHub repos fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const repos: GitHubRepo[] = await res.json();

    return repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => {
        // Primary sort: stars descending; secondary: updated_at descending
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}

export async function getGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      console.error(`GitHub user fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch GitHub user:", error);
    return null;
  }
}

export async function getGitHubActivity(username: string): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${username}/events/public?per_page=30`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!res.ok) {
      console.error(`GitHub activity fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch GitHub activity:", error);
    return [];
  }
}

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

const LEVELS: ContributionLevel[] = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

/**
 * Fetches the past year's contribution calendar by parsing the public profile
 * graph (github.com/users/:username/contributions). The API is deliberately not
 * used: it omits contributions to SAML SSO orgs unless the token is authorized
 * for them, while this page matches exactly what the public profile shows.
 * Undocumented markup — returns null if parsing fails so the heatmap hides.
 */
export async function getGitHubContributions(
  username: string
): Promise<ContributionCalendar | null> {
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`GitHub contributions fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const html = await res.text();

    // Counts live in tooltips keyed to each cell's id: "N contributions on ..." / "No contributions on ..."
    const countById = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*(No|\d+) contributions?/g)) {
      countById.set(m[1], m[2] === "No" ? 0 : Number(m[2]));
    }

    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
      const tag = m[0];
      const date = tag.match(/data-date="([\d-]+)"/)?.[1];
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
      if (!date) continue;
      days.push({
        date,
        contributionCount: (id && countById.get(id)) || 0,
        contributionLevel: LEVELS[level] ?? "NONE",
      });
    }

    if (days.length === 0) {
      console.error("GitHub contributions: no calendar cells found in profile markup");
      return null;
    }

    // Markup is row-major (one <tr> per weekday); regroup into Sunday-aligned weeks
    days.sort((a, b) => a.date.localeCompare(b.date));
    const weeks: { contributionDays: ContributionDay[] }[] = [];
    for (const day of days) {
      const isSunday = new Date(day.date + "T00:00:00Z").getUTCDay() === 0;
      if (weeks.length === 0 || isSunday) weeks.push({ contributionDays: [] });
      weeks[weeks.length - 1].contributionDays.push(day);
    }

    const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
    const totalContributions = total
      ? Number(total.replace(/,/g, ""))
      : days.reduce((sum, d) => sum + d.contributionCount, 0);

    return { totalContributions, weeks };
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return null;
  }
}
