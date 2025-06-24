import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// Extend the default Session type to include custom fields
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
        console.log("Authorize Start");

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.username },
        });

        if (!user || !user.email || !user.password) {
          return null;
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token }: { token: JWT }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
      }

      return token;
    },

    session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name!,
          email: token.email!,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: "harikira",
};

export default authOptions;
