import type { User } from "../server/db/client";
import { prisma } from "../server/db/client";

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
