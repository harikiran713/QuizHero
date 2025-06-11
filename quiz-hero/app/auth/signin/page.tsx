"use client"
import { Card,CardContent,CardHeader,CardFooter,CardTitle,CardAction,CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import React, {useState} from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signin()
{
    const router=useRouter()
    interface formData{
        email:string,
        password:string
    }
    const [formData,setFormData]=useState<formData>({
        email:"",
        password:""
    })
    async function inputCollector(e:React.ChangeEvent<HTMLInputElement>)
    {
        const {name,value}=e.target
        setFormData((formData)=>({...formData,[name]:value}))
    }
    async function formHandler(e:React.FormEvent)
    {
e.preventDefault();
console.log("entering")
signIn("credentials",{
    username:formData.email,
    password:formData.password,
    callbackUrl:'/'
})
    }
    return(
<div>
    <Card className=" w-full max-w-sm">
        <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter you email below to login to your account</CardDescription>
            <CardAction><Button variant='link' className="cursor-pointer" onClick={()=>{router.push('/auth/signup')}}>Sign Up</Button></CardAction>
        </CardHeader>
        <CardContent>
            <form action="" onSubmit={formHandler}>
                <div className="grid gap-2">
                    <Label >Email</Label>
                    <Input name="email" value={formData.email} onChange={inputCollector}/>
                    <Label>Password</Label>
                    <Input name="password" value={formData.password} onChange={inputCollector}/>
                      <Button className="cursor-pointer" type="submit">Login</Button>
                <Button variant="outline" className="cursor-pointer">Login with Google</Button>

                </div>
                
          
            </form>
        </CardContent>
      
    </Card>
</div>
    );
}