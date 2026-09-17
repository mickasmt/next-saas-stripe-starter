import type { ShellUser } from "@/components/dashboard/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function UserAvatar({
  user,
  className,
  fallbackClassName,
}: {
  user: Pick<ShellUser, "name" | "image">
  className?: string
  fallbackClassName?: string
}) {
  return (
    <Avatar className={className}>
      {user.image && <AvatarImage src={user.image} alt="" />}
      <AvatarFallback className={cn(fallbackClassName)}>
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}
