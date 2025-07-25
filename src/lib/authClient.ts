import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: env.NEXT_PUBLIC_URL, // the base url of your auth server
  });
