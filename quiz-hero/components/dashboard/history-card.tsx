import { Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HistoryCard() {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
      <CardHeader className="relative z-10 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">View All</Badge>
        </div>
        <CardTitle className="text-2xl font-bold mt-4">History</CardTitle>
        <CardDescription className="text-emerald-100 text-base">
          Review your past quiz attempts and progress
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <span className="text-white font-medium">Total Quizzes</span>
            <span className="text-2xl font-bold text-white">24</span>
          </div>
          <Button
            variant="outline"
            className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold py-3 backdrop-blur-sm"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
