"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";

 export default function HistoryCard()
 {
    const router=useRouter()
    return(
<Card onClick={()=>{
    router.push('/history')
}} className="cursor-pointer hover:opacity-75">
    <CardHeader className="flex flex-row justify-between">
       <CardTitle className="font-bold text-2xl">
        History
        </CardTitle> 
        <History/>
    </CardHeader>
    <CardContent>
        <p className="text-sm">view past quiz attempts</p>
    </CardContent>
</Card>
    );
 }