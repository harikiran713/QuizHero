
import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import {redirect} from "next/navigation"
import QuizCreation from "../../components/quiz";


export default async function Quiz()

{
   
    return(
<div>
    <QuizCreation/>
</div>
    );
}