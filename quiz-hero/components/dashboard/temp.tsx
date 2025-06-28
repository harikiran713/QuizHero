"use client"
import { Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
export default function Temp()
{
    const router=useRouter()
    return(
 <Button onClick={(e)=>{e.preventDefault()
        router.push("/quiz")
            
        }} className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
          <Zap className="w-4 h-4 mr-2" />
          Start Quiz
        </Button>
    )
}