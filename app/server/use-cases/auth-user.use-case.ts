import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthCredentials, AuthUser, SocialAuthProfile, validateCredentials } from "../entities/auth.entity";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";

// Use case for authenticating a user with credentials
export async function authenticateUserWithCredentials(credentials: AuthCredentials): Promise<AuthUser | null> {
  // Validate credentials
  const validation = validateCredentials(credentials);
  if (!validation.isValid) {
    return null;
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  });

  if (!user || !user.password) {
    return null;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    return null;
  }

  // Return user data
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };
}

// Use case for handling social login
export async function handleSocialLogin(user: any, account: any, profile: any): Promise<boolean> {
  if (account?.provider === 'google' || account?.provider === 'instagram') {
    try {
      // Check if user has an email
      if (!user.email) {
        console.error("Social login failed: User email is missing");
        return false;
      }

      // Check if the user exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { subscriptions: true }
      });

      if (existingUser) {
        // If user exists but doesn't have a subscription, create one
        if (existingUser.subscriptions.length === 0) {
          await createStripeCustomerForUser(existingUser);
        }

        // Mark existing user as social login if not already marked
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { isSocialLogin: true }
        });

        // Extract date of birth from profile if available
        await handleProfileDateOfBirth(profile, existingUser);
      } else {
        // This is a new user being created by NextAuth
        // We'll handle post-creation tasks in a separate process
        // after NextAuth creates the user
        setTimeout(async () => {
          try {
            // Find the newly created user
            const newUser = await prisma.user.findUnique({
              where: { email: user.email },
              include: { subscriptions: true, profile: true }
            });

            if (newUser) {
              // Mark as social login
              await prisma.user.update({
                where: { id: newUser.id },
                data: { isSocialLogin: true }
              });

              // Create subscription if needed
              if (newUser.subscriptions.length === 0) {
                await createStripeCustomerForUser(newUser);
              }

              // Create profile if needed
              if (!newUser.profile) {
                await handleProfileDateOfBirth(profile, newUser);
              }

              console.log(`Social registration completed for user: ${newUser.email}`);
            }
          } catch (error) {
            console.error("Error processing new social user:", error);
          }
        }, 1000); // Wait for NextAuth to create the user
      }

      // Allow login/registration to proceed
      return true;
    } catch (error) {
      console.error("Error handling social login:", error);
      // Continue with sign in even if updating fails
      // This is more forgiving than returning false, which would block the login
      return true;
    }
  }

  // For any other providers, allow login/registration to proceed
  return true;
}

// Helper function to create a Stripe customer for a user
async function createStripeCustomerForUser(user: any): Promise<void> {
  try {
    const { stripe } = await import("@/lib/stripe");

    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      name: user.name || `User_${Date.now().toString().slice(-6)}`,
      metadata: {
        userId: user.id,
      },
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeCustomerId: stripeCustomer.id,
        planId: "free", // Plano gratuito inicial
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // Data distante no futuro para plano gratuito
      },
    });

    console.log("Created Stripe customer:", stripeCustomer.id);
  } catch (stripeError) {
    console.error("Error creating Stripe customer:", stripeError);
    // Continue even if Stripe customer creation fails
  }
}

// Helper function to handle profile date of birth
async function handleProfileDateOfBirth(profile: any, user: any): Promise<void> {
  if (!user || !user.id) return;

  let dateOfBirth = null;

  if (profile && 'birthday' in profile && profile.birthday) {
    dateOfBirth = new Date(profile.birthday);
  } else if (profile && 'birth_date' in profile && profile.birth_date) {
    dateOfBirth = new Date(profile.birth_date);
  }

  // Check if user already has a profile
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (existingProfile) {
    // Update existing profile with date of birth if available
    if (dateOfBirth) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { dateOfBirth }
      });
    }
  } else {
    // Create new profile with date of birth if available
    await prisma.profile.create({
      data: {
        userId: user.id,
        dateOfBirth: dateOfBirth || null
      }
    });
  }
}

// Get NextAuth options with the authentication logic
export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }),
      InstagramProvider({
        clientId: process.env.INSTAGRAM_CLIENT_ID || "",
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "",
      }),
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          return authenticateUserWithCredentials({
            email: credentials.email,
            password: credentials.password
          });
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    pages: {
      signIn: "/login",
      error: "/auth/error",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.id = token.sub || token.id;

          // Ensure name and image are included in the session
          if (token.name) session.user.name = token.name;
          if (token.picture) session.user.image = token.picture;
        }
        return session;
      },
      async signIn({ user, account, profile }) {
        return handleSocialLogin(user, account, profile);
      },
    },
  };
}
