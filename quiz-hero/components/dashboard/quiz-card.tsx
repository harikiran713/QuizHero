import { Brain, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import Temp from "./temp"

export default function QuizCard() {

  return (
    <Card className=" cursor-pointer group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
      <CardHeader className="relative z-10 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Start Now</Badge>
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Quiz me!</CardTitle>
        <CardDescription className="text-blue-100 text-base">
          Challenge yourself with an interactive quiz
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
       <Temp/>
      </CardContent>
    </Card>
  )
}
