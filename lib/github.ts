import "server-only"

// Star count of the starter repo, refreshed at most once an hour.
// Returns null when GitHub is unreachable or rate-limited.
export async function getGithubStars() {
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
    const { stargazers_count } = (await res.json()) as {
      stargazers_count: number
    }
    return stargazers_count
  } catch {
    return null
  }
}

export function formatStars(count: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count)
}
