import { decode } from "@auth/core/jwt";
import type { Cookie } from "@builder.io/qwik-city";
import type { User } from "@prisma/client";
import { prisma } from "~/server/db/client";
import { z } from "zod";

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser({
  email,
  name,
  avatar_url,
}: Pick<User, "email" | "name" | "avatar_url">) {
  return prisma.user.create({ data: { email, name, avatar_url } });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

const authSecret = process.env.VITE_NEXTAUTH_SECRET;

export const getUserFromCookie = async (cookie: Cookie) => {
  const sessionToken =
    cookie.get("next-auth.session-token") ||
    cookie.get("__Secure-next-auth.session-token");

  if (!sessionToken) return null;
  const token = z.string().parse(sessionToken?.value);
  const secret = z.string().parse(authSecret);
  const decoded = await decode({ token, secret });
  const email = decoded?.email;
  return email ? await getUserByEmail(email) : null;
};
