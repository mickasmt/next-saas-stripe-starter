"use client";
import { CompleteList } from "@/lib/db/schema/lists";
import { trpc } from "@/lib/trpc/client";
import ListModal from "./ListModal";
import Link from "next/link"


export default function ListList({ lists }: { lists: CompleteList[] }) {
  const { data: l } = trpc.lists.getLists.useQuery(undefined, {
    initialData: { lists },
    refetchOnMount: false,
  });

  if (l.lists.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {l.lists.map((list) => (
        <List list={list} key={list.id} />
      ))}
    </ul>
  );
}

const List = ({ list }: { list: CompleteList }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{list.title}</div>
      </div>
      <Link href={`/${list.id}`}>
        Public Page
      </Link>
      <ListModal list={list} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No lists
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new list.
      </p>
      <div className="mt-6">
        <ListModal emptyState={true} />
      </div>
    </div>
  );
};

