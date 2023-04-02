import { decode } from "@auth/core/jwt";
import type { Cookie } from "@builder.io/qwik-city";
import { z } from "zod";
import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db/client";
import type { NewUser, User } from "~/server/db/schema";
import { usersTable } from "~/server/db/schema";

export async function getUserByEmail(email: User["email"]) {
  const found = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return found[0];
}

export async function createUser({ email, name, avatar_url }: NewUser) {
  const inserted = await db
    .insert(usersTable)
    .values({ email, name, avatar_url })
    .returning();
  return inserted[0];
}

const secret = z.string().parse(import.meta.env.VITE_NEXTAUTH_SECRET);

export const getUserFromCookie = async (cookie: Cookie) => {
  const sessionToken =
    cookie.get("next-auth.session-token") ||
    cookie.get("__Secure-next-auth.session-token");

  if (!sessionToken) return null;

  const token = z.string().parse(sessionToken?.value);
  const decoded = await decode({ token, secret });
  const email = decoded?.email;
  return email ? await getUserByEmail(email) : null;
};
