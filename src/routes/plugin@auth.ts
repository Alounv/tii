import { serverAuth$ } from "~/server/auth";
import GitHub from "@auth/core/providers/github";
import type { Provider } from "@auth/core/providers";
import { createUser, getUserByEmail } from "~/data/user";
import { z } from "zod";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }: { env: any }) => ({
    secret: z.string().parse(env.get("VITE_NEXTAUTH_SECRET")),
    trustHost: true,
    providers: [
      GitHub({
        clientId: z.string().parse(env.get("VITE_GITHUB_ID")),
        clientSecret: z.string().parse(env.get("VITE_GITHUB_SECRET")),
      }),
    ] as Provider[],
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
      jwt: async ({ user, token }: { user?: any; token: any }) => {
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
  }));
