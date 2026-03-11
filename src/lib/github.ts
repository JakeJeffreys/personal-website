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
