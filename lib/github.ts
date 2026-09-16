import "server-only"

// Star and fork counts of the starter repo, refreshed at most once an hour.
// Returns null when GitHub is unreachable or rate-limited.
export async function getGithubRepo() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/mickasmt/next-saas-stripe-starter",
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return null
    const { stargazers_count, forks_count } = (await res.json()) as {
      stargazers_count: number
      forks_count: number
    }
    return { stars: stargazers_count, forks: forks_count }
  } catch {
    return null
  }
}

export async function getGithubStars() {
  return (await getGithubRepo())?.stars ?? null
}

export function formatStars(count: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count)
}
