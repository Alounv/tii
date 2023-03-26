import type { ProfileCallback } from "@auth/core/providers";
import type { GitHubProfile } from "@auth/core/providers/github";
import GitHub from "@auth/core/providers/github";
import { createUser, getUserByEmail } from "~/data/user";
import { serverAuth$ } from "~/server/auth/auth";

const githubCallback: ProfileCallback<GitHubProfile> = async ({
  email,
  login,
  avatar_url,
}) => {
  if (!email) {
    throw new Error("Email is required");
  }

  let user = await getUserByEmail(email);
  if (user) {
    console.info("Found user");
  } else {
    user = await createUser({ email, name: login, avatar_url });
    console.info("Creates user");
  }

  console.info(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.avatar_url,
  };
};

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
          profile: githubCallback,
        }),
      ],
    };
  });
