"use client";

import { Link, NewLinkParams, insertLinkParams } from "@/lib/db/schema/links";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { OgType } from "@prisma/client"

const LinkForm = ({
  link,
  closeModal,
}: {
  link?: Link;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();
  const { data: lists } = trpc.lists.getLists.useQuery();
  const editing = !!link?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertLinkParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertLinkParams),
    defaultValues: link ?? {
      title: "",
      url: "",
      description: "",
      order: 0,
      type: OgType.WEBSITE,
      listId: ""
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
        if (data?.error) {
      toast({
        title: `${action
          .slice(0, 1)
          .toUpperCase()
          .concat(action.slice(1))} Failed`,
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    await utils.listlinks.getLinks.invalidate();
    router.refresh();
    if (closeModal) closeModal();
        toast({
      title: 'Success',
      description: `Link ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createLink, isLoading: isCreating } =
    trpc.listlinks.createLink.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateLink, isLoading: isUpdating } =
    trpc.listlinks.updateLink.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteLink, isLoading: isDeleting } =
    trpc.listlinks.deleteLink.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewLinkParams) => {
    if (editing) {
      updateLink({ ...values, id: link.id });
    } else {
      createLink(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (<FormItem>
              <FormLabel>Title</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (<FormItem>
              <FormLabel>Url</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (<FormItem>
              <FormLabel>Description</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (<FormItem>
              <FormLabel>Order</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (<FormItem>
              <FormLabel>Type</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="listId"
          render={({ field }) => (<FormItem>
              <FormLabel>List Id</FormLabel>
                <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists?.lists.map((list) => (
                      <SelectItem key={list.id} value={list.id.toString()}>
                        {list.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteLink({ id: link.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default LinkForm;
