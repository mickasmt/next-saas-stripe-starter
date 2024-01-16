import { Button } from "@/components/ui/button"
import { api } from "@/lib/trpc/api"
import { notFound }	from "next/navigation"
import { Icons } from "@/components/shared/icons"
import LinkItem from "@/components/links/LinkItem"

type ListIdPageProps = {
	params: {
		listId: string;
	}
}

const ListIdPage = async ({params}: ListIdPageProps) => {
	const { list } = await api.lists.getListByIdWithLinks.query({id: params.listId});
	if (!list) return notFound();
	const links = list.links;
	return (
		<>
			<header className="flex flex-col items-center border-b px-4 md:px-6 py-4">
				<Icons.gripVertical className="h-8 w-8 mb-2" />
				<h1 className="text-2xl font-semibold">{list.title}</h1>
				<p className="text-sm">
					{list.description}
				</p>
				<p className="text-sm">
					{links.length} link{links.length !== 1 && "s"}
				</p>
				<Button className="ml-auto h-8 w-8 mt-4" size="icon" variant="outline">
					<Icons.share className="h-4 w-4" />
					<span className="sr-only">Share</span>
				</Button>
			</header>
			<main className="flex-1 overflow-y-auto p-4 md:p-6">
				<div className="grid grid-cols-1 gap-4">
					{links.map((link, index) => (
						<LinkItem link={link} key={index}/>
					))}
				</div>
			</main>
		</>
	)
}

export default ListIdPage;
