import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, Trophy, Zap } from "lucide-react"
import SubHero from "./subHero"
import { TypewriterEffectSmooth } from "../ui/typewriter-effect"

export default function Hero() {
  const words = [
    {
      text: "Create",
      className: "text-gray-900 dark:text-gray-100",
    },
    {
      text: "Smart",
      className: "text-gray-900 dark:text-gray-100",
    },
    {
      text: "Quizzes",
      className: "text-gray-900 dark:text-gray-100",
    },
    {
      text: "with",
      className: "text-gray-900 dark:text-gray-100",
    },
    {
      text: "AI Magic.",
      className: "text-blue-600 dark:text-blue-500",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto flex flex-col items-center justify-center text-center max-w-4xl">
        <TypewriterEffectSmooth words={words} />

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          For <strong>JEE, NEET, and UPSC</strong>, <strong>recall beats revision</strong>.
          Our AI creates adaptive quizzes that boost memory, speed, and accuracy under exam pressure.
        </p>

        <SubHero />

      </div>
    </section>
  )
}
