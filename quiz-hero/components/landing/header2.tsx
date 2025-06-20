"use client"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Header2()
{
    const router=useRouter()
    const session=useSession()
    return(
         <div className="flex items-center space-x-4">
                    <Button variant="ghost" className="cursor-pointer" onClick={(e)=>{
e.preventDefault()
router.push('/auth/signin')
                    }}>Sign In</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={(e)=>{
                        e.preventDefault()
                        if(session.data)
                        {
  router.push("/dashboard")
                        }
                        else{
                            router.push('/auth/signin')
                        }
                      

                    }}>Get Started</Button>
                </div>

    );
}