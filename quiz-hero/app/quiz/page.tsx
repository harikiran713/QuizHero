
import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"
import dynamic from "next/dynamic";
const QuizCreation = dynamic(() => import("../../components/quiz"), {
    loading: () => <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>,
});


export default async function Quiz() {

    const session = await getServerSession(authoptions)
    console.log("hello")
    console.log("SESSION:", session);

    if (!session?.user) {
        return redirect('/')
    }

    return (
        <div className=" min-h-screen bg-gradient-to-br from-purple-100 via white to-pink-100 ">
            <QuizCreation />
        </div>
    );
}