'use client'

import { Button } from "@/components/ui/button"
import { createList } from "@/actions/create-list"
import { useAction } from "@/hooks/use-action"
import { startTransition } from "react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { FormErrors } from "@/components/forms/form-errors"

export default function CreateListButton(){
	const { user } = useUser()
	const router = useRouter()

	const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
			toast({
				description: "Your list has been created successfully!",
			})
      router.push(`/${data.id}`);
    },
    onError: (error) => {
			toast({
				description: "There was an error creating your list.",
			})
    }
  });

	const onClick = () => {
    if(user) {
      execute({userId: user.id})
    }
  }

	return (
		<>
			<Button variant="outline" size="lg" onClick={() => startTransition(() =>{
				onClick()
			})}>
				Create a list
			</Button>
			{user && <FormErrors
				id={user.id}
				errors={fieldErrors}
			/>}
		</>
	)
}