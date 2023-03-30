import GitHub from "@auth/core/providers/github";
import { createUser, getUserByEmail } from "~/data/user";
import { serverAuth$ } from "~/server/auth/auth";

export const { useAuthSignin, useAuthSignout, useAuthSession, onRequest } =
  serverAuth$(() => {
    const secret = import.meta.env.VITE_NEXTAUTH_SECRET;
    return {
      secret,
      trustHost: true,
      providers: [
        GitHub({
          clientId: import.meta.env.VITE_GITHUB_ID!,
          clientSecret: import.meta.env.VITE_GITHUB_SECRET!,
        }),
      ],
      callbacks: {
        session: async ({ session, token }: { session: any; token: any }) => {
          try {
            if (session?.user) {
              session.user.id = token.sub;
              const { email, name, image } = session.user;
              const user = await getUserByEmail(email);
              if (!user) {
                await createUser({
                  email,
                  name,
                  avatar_url: image,
                });
              }
            }
            return session;
          } catch (error) {
            console.error(error);
          }
        },
        jwt: async ({ user, token }: { user: any; token: any }) => {
          try {
            if (user) {
              token.sub = user.id;
            }
            return token;
          } catch (error) {
            console.error(error);
          }
        },
      },
      session: {
        strategy: "jwt",
      },
    };
  });
