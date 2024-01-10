import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import ListCard from "@/components/lists/list-card"
export default async function Lists(){
	const { user } = auth()
	const lists = await prisma.list.findMany({
		where: {
			userId: user?.id
		}
	})
	return (
		<div>
			<h1>Lists</h1>
			{lists.map((list) => (
				<ListCard key={list.id} id={list.id} />
			))}
		</div>
	)
}