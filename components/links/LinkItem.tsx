import Link from "next/link"
import { Link as LinkType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { api } from "@/lib/trpc/api"

const ListItem = async ({ link } : { link: LinkType }) => {
	const linkData = await api.listlinks.getLinkOgData.query({ url: link.url });
	return (
		<Link href={link.url} key={link.id}>
			<div className="flex items-center gap-4 p-4 rounded-md shadow-md">
				<img
					alt={linkData?.title || "Link Image"}
					className="rounded-md"
					height="64"
					src={linkData?.image || "https://via.placeholder.com/64"}
					style={{
						aspectRatio: "64/64",
						objectFit: "cover",
					}}
					width="64"
				/>
				<div className="flex-1">
					<p>{linkData?.title || "Link Title"}</p>
					<p className="text-xs truncate">{linkData?.description || "Link Description"}</p>
				</div>
				<Button className="rounded-full" size="icon" variant="ghost">
					<Icons.gripVertical className="h-4 w-4" />
					<span className="sr-only">Drag</span>
				</Button>
			</div>
		</Link>
	)
}

export default ListItem;