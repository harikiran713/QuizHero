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
import authoptions from "@/lib/authOptions";

const handler = NextAuth(authoptions);


export { handler as GET, handler as POST };
