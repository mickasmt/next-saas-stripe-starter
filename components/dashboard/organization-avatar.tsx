import { cn } from "@/lib/utils"

export function OrganizationAvatar({
  organization,
  className,
}: {
  organization: { name: string; logo: string | null }
  className?: string
}) {
  if (organization.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={organization.logo}
        alt=""
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-linear-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-[10px] font-semibold text-white",
        className
      )}
    >
      {organization.name.charAt(0).toUpperCase()}
    </span>
  )
}
