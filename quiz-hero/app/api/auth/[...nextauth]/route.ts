// import { NextRequest,NextResponse } from "next/server";
// export async function GET(req:NextRequest,x:{params:{nextauth:string[]}})
// {
// const y= await x.params
// console.log(y.nextauth)
// return NextResponse.json({message:"this is from server "})
// }
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import authOptions from "@/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
