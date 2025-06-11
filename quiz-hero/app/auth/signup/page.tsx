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
import { useRouter } from "next/navigation";


export default  function Signup()
{
    const router=useRouter();
    interface FormData{
        email:string,
        password:string,
    name:string
    }
    const [formData,setFormData]=useState<FormData>({
        email:"",
        password:"",
        name:""
    })
    function handleform(e:React.ChangeEvent<HTMLInputElement>)
    {
        const {name,value}=e.target;
        setFormData((previous)=>({
            ...previous,[name]:value
        })

        )
    }
    async function handleSubmit(e:React.FormEvent)
    {
        e.preventDefault();
        try{
            const response=await fetch('http://localhost:3000/api/auth/signup',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            
            if(response.ok)
            {
               router.push(`/auth/verify?email=${formData.email}`)
            }
        }
        catch(err)
        {
            console.log("error")
        }
       

    }
    return(

<Card className=" w-full max-w-sm">
 <CardHeader>
    <CardTitle>create a account</CardTitle>
    <CardDescription>Enter you email below  set password to your account</CardDescription>
    <CardAction ><Button variant="link" className="cursor-pointer" onClick={()=>{router.push('/auth/signin')}}>Sign In</Button></CardAction>
 </CardHeader>
 <CardContent>
    <form action="" onSubmit={handleSubmit}>
        <div className="flex flex-col">
            <div className="grid gap-2">
                <Label>name</Label>
                <Input onChange={handleform} name="name" type="text" value={formData.name}/>
<Label htmlFor="email">Email</Label>
<Input onChange={handleform} name="email" type="email" value={formData.email}/>
   <Label>password</Label>
                <Input onChange={handleform} name="password" type="password" value={formData.password}/>
               

            </div>
           
        </div>
         <div className="flex flex-col gap-2 w-full mt-2">
         <Button className="w-full cursor-pointer ">Sign Up</Button>
      
   <Button className="w-full cursor-pointer" variant={"outline"}>Login with Google</Button>
       

    </div>
    </form>
 </CardContent>

</Card>

    );
}
