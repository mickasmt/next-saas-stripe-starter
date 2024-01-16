"use client";
import { CompleteLink } from "@/lib/db/schema/links";
import { trpc } from "@/lib/trpc/client";
import LinkModal from "./LinkModal";


export default function LinkList({ links }: { links: CompleteLink[] }) {
  const { data: l } = trpc.listlinks.getLinks.useQuery(undefined, {
    initialData: { links },
    refetchOnMount: false,
  });

  if (l.links.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {l.links.map((link) => (
        <Link link={link} key={link.id} />
      ))}
    </ul>
  );
}

const Link = ({ link }: { link: CompleteLink }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{link.title}</div>
      </div>
      <LinkModal link={link} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No links
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new link.
      </p>
      <div className="mt-6">
        <LinkModal emptyState={true} />
      </div>
    </div>
  );
};

