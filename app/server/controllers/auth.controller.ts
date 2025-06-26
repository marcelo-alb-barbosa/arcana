import NextAuth from "next-auth/next";
import { getAuthOptions } from "../use-cases/auth-user.use-case";

// Export the NextAuth handler with the auth options from the use case
export const authController = NextAuth(getAuthOptions());
