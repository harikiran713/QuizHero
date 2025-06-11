"use client"

import * as React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import{useRouter,useSearchParams} from 'next/navigation'

export default function InputOTPControlled() {
  const [value, setValue] = React.useState("")
  const [email,setEmail]=React.useState<string>("")
  const router=useRouter()
  const searchParams=useSearchParams()
  React.useEffect(()=>{
setEmail(searchParams.get('email'))
  },[])
  async function handleOtp()
  {

    console.log(email)
    const data={
        email,
        otp:value
    }
    console.log(data)

       const res=await fetch("http://localhost:3000/api/auth/verify",{
        method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
       })
       if(res.ok)
       {
router.push("/auth/signin")
       }
  }

  return (
  
    <Card className="w-full max-w-sm">
          <CardHeader > <CardTitle>----------------Enter the otp----------------</CardTitle>
           <CardDescription>check the otp in your email:: {email}</CardDescription></CardHeader>
  <div className="space-y-2 flex flex-col max-w-sm w-full items-center">
     
       <div>   <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP></div>
   <div>  <Button onClick={handleOtp} className="cursor-pointer">submit</Button></div>
    
     
    </div>
    </Card>
  )
}
