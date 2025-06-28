import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// === Type Augmentation ===
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
  }
}


const authOptions: NextAuthOptions = {
  providers: [
   
    CredentialsProvider({
      name: "email",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.username },
        });

        if (!user || !user.password) return null;

        if (!user.emailVerified) throw new Error("Email not verified");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
        };
      },
    }),

    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
  
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const dbUser = await prisma.user.upsert({
          where: { email: profile.email },
          update: {},
          create: {
            email: profile.email,
            name: profile.name ?? "",
            emailVerified: new Date(),
          },
        });

        token.id = dbUser.id;
        token.name = dbUser.name ?? "";
        token.email = dbUser.email ?? "";
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email ?? "" },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name ?? "";
          token.email = dbUser.email ?? "";
        }
      }

      return token;
    },

    session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },

   
    async redirect() {
      return "http://localhost:3000/dashboard";
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET, // ✅ Use from .env.local
};

export default authOptions;
