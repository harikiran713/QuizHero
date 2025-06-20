import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getServerSession } from "next-auth";
import authoptions from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Features from "@/components/landing/features";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export default async function Home() {


  return (
    
   <div className="min-h-screen bg-gradient-to-br from-purple-50 via white to-pink-50 px-4"> 
    <Hero/>
    <Features/>
    <HowItWorks/></div>
  );
}
