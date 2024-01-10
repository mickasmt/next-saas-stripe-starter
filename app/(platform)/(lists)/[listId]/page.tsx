import AddListItems from "@/components/lists/add-list-items"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { X } from "lucide-react"
import { notFound }	from "next/navigation"

type ListIdPageProps = {
	params: {
		listId: string;
	}
}
const ListIdPage = async ({
	params: { listId },
}: ListIdPageProps) => {
	const { userId } : { userId: string | null } = auth();

	if(!userId){
    return new Response("Unauthorized", { status: 401 });
  }

	const list = await prisma.list.findUnique({
		where: {
			id: listId,
		},
	})

	
	if(!list){
		return notFound();
	}

	return (
		<div>
			<AddListItems />
		</div>
	)
}

export default ListIdPage;