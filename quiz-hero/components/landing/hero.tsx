import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, Trophy, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-100">
          <Sparkles className="w-4 h-4 mr-1" />
          Powered by Advanced AI
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Create Smart Quizzes with{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Magic</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform any topic into engaging, personalized quizzes in seconds. Our AI understands your content and
          creates questions that actually matter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Start Creating Quizzes
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:scale-105 transition-all duration-200 cursor-pointer">
            Watch Demo
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          {[
            { icon: Users, text: "10,000+ Users" },
            { icon: Trophy, text: "50,000+ Quizzes Created" },
            { icon: Zap, text: "99.9% Uptime" },
          ].map((stat) => (
            <div
              key={stat.text}
              className="flex items-center hover:scale-110 hover:text-purple-600 transition-all duration-200"
            >
              <stat.icon className="h-4 w-4 mr-1" />
              {stat.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
