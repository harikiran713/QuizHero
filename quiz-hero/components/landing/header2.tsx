"use client"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserAccountNav from "@/components/UserAccountNav";

export default function Header2() {
    const router = useRouter()
    const session = useSession()

    if (session.status === "loading") {
        return null;
    }

    if (session.data?.user) {
        return (
            <div className="flex items-center space-x-4">
                <UserAccountNav user={session.data.user} />
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            <Button variant="ghost" className="cursor-pointer" onClick={(e) => {
                e.preventDefault()
                router.push('/auth/signin')
            }}>Sign In</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-200 cursor-pointer"
                onClick={(e) => {
                    e.preventDefault()
                    router.push('/auth/signin')
                }}>Get Started</Button>
        </div>
    );
}