import { hash, compare } from 'bcrypt-ts'
import type { User } from '../server/db/client'
import { prisma } from '../server/db/client'
import { z } from 'zod'

export const zUser = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string().min(8),
})

export const zCredentials = zUser.pick({ email: true, password: true })

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } })
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } })
}

export async function getUserWithPeriods(id: User['id']): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}

export async function createUser({
  email,
  password,
}: Pick<User, 'email' | 'password'>) {
  const hashedPassword = await hash(password, 10)
  return prisma.user.create({ data: { email, password: hashedPassword } })
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } })
}

export async function verifyLogin({
  email,
  password,
}: Pick<User, 'email' | 'password'>) {
  const userWithPassword = await prisma.user.findUnique({ where: { email } })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await compare(password, userWithPassword.password)

  if (!isValid) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
}
