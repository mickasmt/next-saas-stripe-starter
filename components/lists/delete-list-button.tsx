'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteList } from "@/actions/delete-list"
import { useAction } from "@/hooks/use-action"
import { toast } from "@/components/ui/use-toast"
import { FormErrors } from "@/components/forms/form-errors"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Loader2, Trash } from "lucide-react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle }
from "../ui/alert-dialog"

type DeleteListButtonProps = {
	id: string;
}

export default function DeleteListButton({
	id
} : DeleteListButtonProps){
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeletePending, startDeleteTransition] = useTransition()

	const { execute, fieldErrors } = useAction(deleteList, {
    onSuccess: (data) => {
			toast({
				description: "Your list has been deleted!",
			})
    },
    onError: (error) => {
			toast({
				description: "There was an error deleting your list.",
			})
    }
  });

	const onClick = (event) => {
		event.preventDefault()
		startDeleteTransition(() => {
			console.log('delete list')
			execute({
				id: id,
			})
			setDeleteDialogOpen(false)
		})
  }

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						className="h-6 w-6 p-0 hover:bg-background"
						disabled={isDeletePending}
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash />
						<span className="sr-only">Delete</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Delete chat</TooltipContent>
			</Tooltip>
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete your chat message and remove your
							data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeletePending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isDeletePending}
							onClick={onClick}
						>
							{isDeletePending && <Loader2 className="mr-2 animate-spin" />}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}