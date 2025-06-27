
import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import {redirect} from "next/navigation"
import QuizCreation from "../../components/quiz";


export default async function Quiz()

{
   
    return(
<div className=" min-h-screen bg-gradient-to-br from-purple-100 via white to-pink-100 ">
    <QuizCreation/>
</div>
    );
}