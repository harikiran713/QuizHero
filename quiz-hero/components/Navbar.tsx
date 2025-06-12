 import authoptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from 'next/link'
import UserAccount from "./UserAccountNav";
import com from "./signin";

 export default async function Navbar()
 {
    const session= await getServerSession(authoptions);

    return(
<div className="flex flex-row items-center justify-between h-16 px-6 bg-white shadow-md border-b border-gray-200">
    <Link href='/'>  <div className="text-2xl font-bold text-indigo-600 " >
    Quiz<span className="text-gray-800">Hero</span>
  </div>
  </Link>

  <div>
{session?.user?(<UserAccount/>):<
  
  
  
  
  com/>}
  </div>
</div>

    );
 }