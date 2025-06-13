 import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import UserAccount from "./UserAccountNav";


import com from "./signin";
import Link from "next/link";

 export default async function Navbar()
 {
    const session= await getServerSession(authoptions);

    return(
<div className=" fixed w-full dark:bg-gray-950 z-[10]  border-b border-zinc-300 py-2 px-4 ">
  <div className="flex items-center  justify-between  gap-2 px-0 mx-auto max-w-7xl">
<Link href='/' className="flex items-center "><p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1  font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white ">QuizHero</p></Link>
<div className="flex items-center">
{session?.user?(<UserAccount user={session.user} />):(<p></p>)}
</div>
  </div>
</div>

    );
 }