import prisma from "@/lib/db";
import { error } from "console";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import generateOTP from "@/lib/otp";
import sendOtp from "@/lib/mail";
interface details{
    email:string,
    password:string,
    name:string
}
export async function POST(req: NextRequest) {
  const { email, password, name }: details = await req.json();

  if(!email || !password || !name)
  {
    return NextResponse.json({error:"all fields are required"},{status:400})
  }
  const existingUser =await prisma.user.findUnique({
    where:{
        email
    }   
  })
 
  
 const hashedPassword =await bcrypt.hash(password,10);
 const token =generateOTP();
 const expires=new Date(Date.now()+1000*60*10)
  if(existingUser)
  {
     if(existingUser?.emailVerified==null)
  {
  //update the previous password harikiran 
    await prisma.user.update({
      where:{email},
      data:{
        password:hashedPassword
      }
    })
  //delete all the otps for that email 
    await prisma.verificationRequest.deleteMany({
      where:{identifier:email}
    })
  }
  await prisma.verificationRequest.create({
    data:{
      identifier:email,
      token,
      expires
    }
  })
  await sendOtp(email,token)
   return NextResponse.json({error:"user already exits but not verified ..updated to the password"},{status:200})
  }

const user = await prisma.user.create({
    data: {
      email,
      name,
      emailVerified: null, 
      password: hashedPassword,
      accounts: {
        create: {
          providerId: "credentials",
          providerType: "credentials",
          providerAccountId: email,
        },
      },
    },
});
  await prisma.verificationRequest.create({
    data:{
        identifier:email,
        token,
        expires
    }
  })
 
      await sendOtp(email,token)
      return NextResponse.json({message:"user created otp sent to mail"})

}


