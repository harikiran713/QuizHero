
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(req: NextRequest) {
  console.log("Received request to /api/auth/verify")

  const { email, otp } = await req.json()
  console.log("Received email:", email)
  console.log("Received otp:", otp)

  if (!email || !otp) {
    return NextResponse.json(
      { message: "email and otp both required" },
      { status: 400 }
    )
  }

  try {
    const res = await prisma.verificationRequest.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!res) {
      return NextResponse.json(
        { message: "OTP is invalid or expired" },
        { status: 400 }
      )
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
        },
      }),
      prisma.verificationRequest.deleteMany({
        where: {
          identifier: email,
        },
      }),
    ])

    return NextResponse.json({ message: "OTP verified and user updated" })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
