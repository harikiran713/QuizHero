// import { NextRequest,NextResponse } from "next/server";
// export async function GET(req:NextRequest,x:{params:{nextauth:string[]}})
// {
// const y= await x.params
// console.log(y.nextauth)
// return NextResponse.json({message:"this is from server "})
// }
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "email",
      credentials: {
        username: { label: "email", type: "text", placeholder: "lodeharikiran" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("hellofirst");

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        console.log("hello");

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username, 
          },
        });
        console.log("hello middle")

        if (!user?.email || !user.password) {
          return null;
        }

        console.log("hello last");

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
  pages:{
signIn:'/auth/signin'
  },
  secret: "harikira",
});

export { handler as GET, handler as POST };
