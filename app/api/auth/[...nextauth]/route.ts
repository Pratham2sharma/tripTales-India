import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../server/lib/db";
import bcrypt from "bcryptjs";
import User from "../../../../server/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = (await User.findOne({ email: credentials.email })) as {
            _id: any;
            email: string;
            password: string;
            role: string;
          } | null;

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === "google") {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            console.log("Creating Google user in JWT callback:", user.email);
            dbUser = await User.create({
              username:
                user.name?.replace(/\s+/g, "_") || user.email?.split("@")[0],
              email: user.email,
              role: "user",
              planGeneratedCount: 0,
              subscription: {
                plan: "free",
              },
            });
            console.log("Google user created in JWT:", dbUser._id);
          }

          token.role = dbUser.role;
          token.userId = dbUser._id.toString();
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      } else if (user) {
        token.role = (user as any).role || "user";
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).userId = token.userId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting after sign in, check for admin role
      if (url === baseUrl) {
        // This will be handled by frontend after session is established
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          console.log("Google sign in attempt for:", user.email);
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            console.log("Creating new Google user:", user.email);
            const newUser = await User.create({
              username:
                user.name?.replace(/\s+/g, "_") || user.email?.split("@")[0],
              email: user.email,
              role: "user",
              planGeneratedCount: 0,
              subscription: {
                plan: "free",
              },
            });
            console.log("Google user created successfully:", newUser._id);
          } else {
            console.log("Google user already exists:", existingUser._id);
          }
        } catch (error) {
          console.error("Error creating Google user:", error);
          return false;
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
