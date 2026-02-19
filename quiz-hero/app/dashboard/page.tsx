import HistoryCard from "@/components/dashboard/header1";
import QuizMe from "@/components/dashboard/quiz-card";
import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import Header from "@/components/dashboard/header1";
import DashboardGrid from "@/components/dashboard/dashboard-grid";
export default async function Dashboard() {

    const session = await getServerSession(authoptions)
    console.log("hello")
    console.log("SESSION:", session);

    if (!session?.user) {
        return redirect('/')
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
            <div className="max-w-6xl mx-auto">
                <Header />
                <div className="py-12"> <DashboardGrid /></div>
            </div>
        </div>
    );
}