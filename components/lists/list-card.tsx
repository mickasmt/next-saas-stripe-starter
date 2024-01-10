import Link from "next/link"
import { Button } from "@/components/ui/button"
import DeleteListButton from "@/components/lists/delete-list-button"

type ListCardProps = {
	id: string;
}
export default function ListCard({ id }: ListCardProps){
	return (
		<div>
			List ID: {id}
			<Button size="sm">
				<Link href={`/${id}`}>
					Go to List
				</Link>
			</Button>
			<DeleteListButton id={id} />
		</div>
	)
}