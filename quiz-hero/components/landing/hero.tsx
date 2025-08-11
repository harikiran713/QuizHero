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
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Magic
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          For <strong>JEE, NEET, and UPSC</strong>, <strong>recall beats revision</strong>.  
          Our AI creates adaptive quizzes that boost memory, speed, and accuracy under exam pressure.
        </p>

        <SubHero />

      </div>
    </section>
  )
}
