import CreateListButton from "@/components/lists/create-list-button"
import Lists from "@/components/lists/lists"
export default function ListsPage() {
	return (
		<main>
			<h1>Lists</h1>
			<p>This is a page for lists.</p>
			<CreateListButton />
			<Lists />
		</main>
	)
}