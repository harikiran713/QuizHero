import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, Trophy, Zap } from "lucide-react"
import SubHero from "./subHero"

export default function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Create Smart Quizzes with{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Magic</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform any topic into engaging, personalized quizzes in seconds. Our AI understands your content and
          creates questions that actually matter.
        </p>
        <SubHero/>

       

     
      </div>
    </section>
  )
}
