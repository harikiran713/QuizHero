import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

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
        username: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.username },
        });

        if (!user || !user.password) return null;
        if (!user.emailVerified) throw new Error("Email not verified");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
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

  cookies: {
    state: {
      name: `__Secure-next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // use 'none' if your OAuth provider redirects cross-site
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

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
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Make sure this matches exactly your deployed site
  // and localhost for development
  debug: process.env.NODE_ENV === "development",
};

// Local dev
if (process.env.NODE_ENV !== "production") {
  (global as any).NEXTAUTH_URL = "http://localhost:3000";
} else {
  (global as any).NEXTAUTH_URL = "https://quiz-hero-seven.vercel.app";
}

export default authOptions;
