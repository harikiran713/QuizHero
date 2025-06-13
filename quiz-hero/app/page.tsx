import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getServerSession } from "next-auth";
import authoptions from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session= await getServerSession(authoptions)
 if(!session)
 {
  redirect("/auth/signin")
 }
 else{
  redirect("/dashboard")
 }

  return (
    
   <div></div>
  );
}
