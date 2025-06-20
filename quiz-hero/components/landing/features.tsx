import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Clock, Users, Zap, Trophy } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Our advanced AI analyzes your content and generates relevant, challenging questions automatically.",
      color: "purple",
    },
    {
      icon: Target,
      title: "Smart Difficulty Adjustment",
      description:
        "Questions adapt to user performance, ensuring optimal learning and engagement for every participant.",
      color: "pink",
    },
    {
      icon: Clock,
      title: "Instant Creation",
      description: "Generate comprehensive quizzes in seconds, not hours. Perfect for busy educators and trainers.",
      color: "green",
    },
    {
      icon: Users,
      title: "Real-time Analytics",
      description: "Track performance, identify knowledge gaps, and get detailed insights on quiz results.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Multiple Question Types",
      description: "Support for multiple choice, true/false, fill-in-the-blank, and essay questions.",
      color: "orange",
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Boost engagement with points, badges, leaderboards, and achievement systems.",
      color: "indigo",
    },
  ]

  const colorClasses = {
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
  }

  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose QuizAI?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of quiz creation with our intelligent features designed for educators, trainers, and
            content creators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const color = colorClasses[feature.color]
            return (
              <div key={feature.title} className="hover:scale-105 transition-transform duration-200 cursor-pointer">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center mb-4 hover:rotate-12 transition-transform duration-300`}
                    >
                      <feature.icon className={`h-6 w-6 ${color.text}`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
