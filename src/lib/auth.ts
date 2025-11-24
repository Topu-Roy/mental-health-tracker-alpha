import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { cache } from "react";
import { headers } from "next/headers";
import { passkey } from "@better-auth/passkey";

export const auth = betterAuth({
  appName: "My app",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // Session cookie for client-side caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },

  // User deletion
  user: {
    deleteUser: {
      enabled: true,
    },
  },

  // Plugins
  plugins: [nextCookies(), passkey(), admin()],
});

/**
 * Get the server-side authentication session.
 *
 * @returns The server-side authentication session.
 */
export const getServerAuthSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return session;
});
