"use client"
import { Card,CardContent,CardHeader,CardTitle } from "../ui/card";
import { BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";
export default function QuizMe()
{
    const router=useRouter()
    return(
<Card className="cursor-pointer hover:opacity-75" onClick={()=>{
router.push('/quiz')
}}>
    <CardHeader className="flex flex-row items-center justify-between" >
        <CardTitle className="text-2xl font-bold">Quiz me!</CardTitle>
        <BrainCircuit/>
    </CardHeader>
<CardContent>
    <p className="text-sm ">challenge yourself with a quiz</p>
</CardContent>
</Card>
    );
}