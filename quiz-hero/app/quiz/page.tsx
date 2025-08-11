
import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import {redirect} from "next/navigation"
import QuizCreation from "../../components/quiz";


export default async function Quiz()

{
    
    const session= await getServerSession(authoptions)
    console.log("hello")
    console.log("SESSION:", session);

    if(!session?.user)
    {
     return   redirect('/')
    }
   
    return(
<div className=" min-h-screen bg-gradient-to-br from-purple-100 via white to-pink-100 ">
    <QuizCreation/>
</div>
    );
}