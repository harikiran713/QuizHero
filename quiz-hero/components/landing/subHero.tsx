"use client";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export default function SubHero()

{ 
const session=useSession()
const router=useRouter()
    return(
 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={(e)=>{
                e.preventDefault()
                if(session.data)
                {
router.push('/dashboard')
                }
                else{
                    router.push('/auth/signin')
                }
                

            }}
          >
            Start Creating Quizzes
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:scale-105 transition-all duration-200 cursor-pointer">
            Watch Demo
          </Button>
        </div>
    );

}