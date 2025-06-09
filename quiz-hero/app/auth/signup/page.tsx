"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import {useState} from "react"

export default  function Signup()
{
    interface FormData{
        email:string,
        password:string,
        conformPassword:string
    }
    const [formData,setFormData]=useState<FormData>({
        email:"",
        password:"",
        conformPassword:""
    })
    async function handleSubmit(e:React.FormEvent)
    {
        e.preventDefault();
       

    }
    return(

<Card className=" w-full max-w-sm">
 <CardHeader>
    <CardTitle>create a account</CardTitle>
    <CardDescription>Enter you email below  set password to your account</CardDescription>
    <CardAction ><Button variant="link" className="cursor-pointer">Sign In</Button></CardAction>
 </CardHeader>
 <CardContent>
    <form action="" onSubmit={handleSubmit}>
        <div className="flex flex-col">
            <div className="grid gap-2">
                <Label>name</Label>
                <Input/>
<Label htmlFor="email">Email</Label>
<Input/>
   <Label>password</Label>
                <Input/>
               

            </div>
           
        </div>
    </form>
 </CardContent>
 <CardFooter>
    
    <div className="flex flex-col gap-2 w-full">
        
       <Button className="w-full cursor-pointer ">Sign Up</Button>
   <Button className="w-full cursor-pointer" variant={"outline"}>Login with Google</Button>
       

    </div>
 </CardFooter>
</Card>

    );
}