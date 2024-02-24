import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();

  return session?.user
}