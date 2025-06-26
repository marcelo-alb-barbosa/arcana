import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
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

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
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

        console.log("JWT callback - user:", JSON.stringify(user, null, 2));
        console.log("JWT callback - token:", JSON.stringify(token, null, 2));
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || token.id;

        // Ensure name and image are included in the session
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture;

        console.log("Session callback - token:", JSON.stringify(token, null, 2));
        console.log("Session callback - session:", JSON.stringify(session, null, 2));
      }
      return session;
    },
    async signIn({ user, account, profile }) {
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

          // If user doesn't exist, the PrismaAdapter will create it
          // We'll need to create a subscription in the createUser callback

          // If user exists but doesn't have a subscription, create one
          if (existingUser && existingUser.subscriptions.length === 0) {
            try {
              const { stripe } = await import("@/lib/stripe");

              const stripeCustomer = await stripe.customers.create({
                email: existingUser.email,
                name: existingUser.name || `User_${Date.now().toString().slice(-6)}`,
                metadata: {
                  userId: existingUser.id,
                },
              });

              // Create subscription record
              await prisma.subscription.create({
                data: {
                  userId: existingUser.id,
                  stripeCustomerId: stripeCustomer.id,
                  planId: "free", // Plano gratuito inicial
                  status: "active",
                  currentPeriodStart: new Date(),
                  currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // Data distante no futuro para plano gratuito
                },
              });

              console.log("Created Stripe customer for existing user:", stripeCustomer.id);
            } catch (stripeError) {
              console.error("Error creating Stripe customer for existing user:", stripeError);
              // Continue even if Stripe customer creation fails
            }
          }

          // If user doesn't exist, it will be created by the adapter
          // We need to create a subscription for the new user after they're created
          if (!existingUser) {
            // We'll handle this in a separate event after the user is created
            // The PrismaAdapter doesn't provide a direct way to hook into user creation
            // So we'll check for new users without subscriptions on each sign in

            // Get the user that was just created by the adapter
            setTimeout(async () => {
              try {
                const newUser = await prisma.user.findUnique({
                  where: { email: user.email },
                  include: { subscriptions: true }
                });

                if (newUser && newUser.subscriptions.length === 0) {
                  const { stripe } = await import("@/lib/stripe");

                  const stripeCustomer = await stripe.customers.create({
                    email: newUser.email,
                    name: newUser.name || `User_${Date.now().toString().slice(-6)}`,
                    metadata: {
                      userId: newUser.id,
                    },
                  });

                  // Create subscription record
                  await prisma.subscription.create({
                    data: {
                      userId: newUser.id,
                      stripeCustomerId: stripeCustomer.id,
                      planId: "free", // Plano gratuito inicial
                      status: "active",
                      currentPeriodStart: new Date(),
                      currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // Data distante no futuro para plano gratuito
                    },
                  });

                  console.log("Created Stripe customer for new user:", stripeCustomer.id);
                }
              } catch (error) {
                console.error("Error creating subscription for new user:", error);
              }
            }, 1000); // Wait a second for the adapter to create the user
          }

          // Extract date of birth from profile if available
          let dateOfBirth = null;

          if (profile && 'birthday' in profile && profile.birthday) {
            dateOfBirth = new Date(profile.birthday);
          } else if (profile && 'birth_date' in profile && profile.birth_date) {
            dateOfBirth = new Date(profile.birth_date);
          }

          if (dateOfBirth && existingUser.id) {
            // Check if user already has a profile
            const existingProfile = await prisma.profile.findUnique({
              where: { userId: existingUser.id }
            });

            if (existingProfile) {
              // Update existing profile with date of birth
              await prisma.profile.update({
                where: { userId: existingUser.id },
                data: { dateOfBirth }
              });
            } else {
              // Create new profile with date of birth
              await prisma.profile.create({
                data: {
                  userId: existingUser.id,
                  dateOfBirth
                }
              });
            }
          }
        } catch (error) {
          console.error("Error handling social login:", error);
          // Continue with sign in even if updating fails
        }
      }
      return true;
    },
  },
};
