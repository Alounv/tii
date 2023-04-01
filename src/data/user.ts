import { decode } from "@auth/core/jwt";
import type { Cookie } from "@builder.io/qwik-city";
import { z } from "zod";
import { eq } from "drizzle-orm/expressions";
import { pgTable, text } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";
import { db } from "~/server/db/client-drizzle";
import { v4 } from "uuid";

export const user = pgTable("User", {
  id: text("id").primaryKey().default(v4()),
  email: text("email").notNull(),
  name: text("name"),
  avatar_url: text("avatar_url"),
  // objectives: text("objectives").references(() => cities.id),
});

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;

export async function getUserByEmail(email: User["email"]) {
  const test = await db.select().from(user).where(eq(user.email, email));
  return test[0];
}

export async function createUser({
  email,
  name,
  avatar_url,
}: Pick<User, "email" | "name" | "avatar_url">) {
  const insertedUsers = await db
    .insert(user)
    .values({ email, name, avatar_url })
    .returning();
  return insertedUsers[0];
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
