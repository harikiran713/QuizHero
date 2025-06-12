import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 

 const authoptions={
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

  callbacks:{
jwt:async  ({token}:any)=>{


  const db_user=await prisma.user.findFirst(
    {
      where:{
        email:token?.email
      }
    }

  )
  if(db_user)
  {
    token.id=db_user.id
    token.name=db_user.name
  }

  return token;
},
session:({session,token}:any)=>{
 
  if(token){
    session.user.id=token.id
    session.user.name=token.name
    session.user.email=token.email
    session.user
  }

  return session
}
  },
  pages:{
signIn:'/auth/signin'
  },
  secret: "harikira",
}
export default authoptions