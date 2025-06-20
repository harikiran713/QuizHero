"use client"
import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";
export default function Title()
{
    const router=useRouter()
    return(
 <div className="flex items-center space-x-2 hover:scale-105 transition-transform cursor-pointer" onClick={()=>{
router.push('/')
 }}>
<Brain className="h-8 w-8 text-purple-600"/>
<span className="text-2xl font-bold text-gray-900">QuizHero</span>
                </div>
    );
}