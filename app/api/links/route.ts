import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLink,
  deleteLink,
  updateLink,
} from "@/lib/api/links/mutations";
import { 
  linkIdSchema,
  insertLinkParams,
  updateLinkParams 
} from "@/lib/db/schema/links";

export async function POST(req: Request) {
  try {
    const validatedData = insertLinkParams.parse(await req.json());
    const { success, error } = await createLink(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/links"); // optional - assumes you will have named route same as entity
    return NextResponse.json(success, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateLinkParams.parse(await req.json());
    const validatedParams = linkIdSchema.parse({ id });

    const { success, error } = await updateLink(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = linkIdSchema.parse({ id });
    const { success, error } = await deleteLink(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
