import HistoryCard from "@/components/dashboard/HistoryCard";
import QuizMe from "@/components/dashboard/quizMe";
import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import HotTopics from "./HotTopicsCard";
import RecentActivities from "./RecentActivities"
export default async function Dashboard()
{
    const session= await getServerSession(authoptions)
    if(!session?.user)
    {
     return   redirect('/')
    }
    return(
        <main className="p-18 mx-auto max-w-7xl">
            <div className="flex items-center" >
                <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
<div className="grid gap-4 mt-4 md:grid-cols-2">
<QuizMe  />
<HistoryCard/>
</div>
<div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
{/* <HotTopics/> */}
<RecentActivities/>
</div>


        </main>

    );
}