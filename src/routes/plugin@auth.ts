import type { Provider } from "@auth/core/providers";
import Auth0 from "@auth/core/providers/auth0";
import GitHub from "@auth/core/providers/github";
import Credentials from "@auth/core/providers/credentials";
import { createUser, verifyLogin, zCredentials } from "~/data/user";
import { serverAuth$ } from "~/server/auth/auth";

export const { useAuthSignin, useAuthSignout, useAuthSession, onRequest } =
  serverAuth$(() => {
    const secret = import.meta.env.VITE_NEXTAUTH_SECRET;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_AUTH0_CLIENT_SECRET;
    const issuer = import.meta.env.VITE_AUTH0_ISSUER;
    return {
      secret,
      trustHost: true,
      providers: [
        GitHub({
          clientId: import.meta.env.VITE_GITHUB_ID!,
          clientSecret: import.meta.env.VITE_GITHUB_SECRET!,
        }),
        Auth0({ clientId, clientSecret, issuer }),
        Credentials({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (credentials) {
              const { email, password } = zCredentials.parse(credentials);
              const user = await verifyLogin({ email, password });
              if (user) {
                console.info("Found user");
                return user;
              }
              console.info("Creates user");
              const newUser = await createUser({ email, password });
              return newUser;
            }

            return null;
          },
        }),
      ] as Provider[],
    };
  });
