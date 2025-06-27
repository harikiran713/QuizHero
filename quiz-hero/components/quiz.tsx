"use client"

import type React from "react"
import {useMutation} from "@tanstack/react-query"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BookOpen, GraduationCap, FlaskConical, Brain } from "lucide-react"
import axios from "axios"

export default function QuizCreation() {
  const [formData, setFormData] = useState({
    topic: "",
    questions: "",
    mode: "",
    difficulty: "",
  })
  type QuizData = {
  topic: string;
  questions: number;
  mode: "general" | "neet" | "upsc" | "jee_inorganic";
  difficulty: "easy" | "medium" | "hard";
};

  const modes = [
    { value: "general", label: "General", icon: Brain, description: "General knowledge topics" },
    { value: "neet", label: "NEET", icon: FlaskConical, description: "Medical entrance exam prep" },
    { value: "upsc", label: "UPSC", icon: GraduationCap, description: "Civil services preparation" },
    { value: "jee_inorganic", label: "JEE Inorganic", icon: BookOpen, description: "JEE inorganic chemistry" },
  ]

  const difficulties = [
    { value: "easy", label: "Easy", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "hard", label: "Hard", color: "text-red-600" },
  ]

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    console.log("Quiz Configuration:", formData)
    await axios.post("http://localhost:3000/api/game",formData)
    
   
  }
  const { mutate, isLoading } = useMutation({
  mutationFn: async (data: QuizData) => {
    const response = await axios.post("http://localhost:3000/api/game", data);
    return response.data;
  }
});



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-900">Quiz Creation</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Configure your personalized quiz experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
          
            <div className="space-y-3">
              <Label htmlFor="topic" className="text-lg font-semibold text-gray-800">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="Enter a topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="text-base h-12"
              />
              <p className="text-sm text-gray-600">Please provide any topic you would like to be quizzed on here</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="questions" className="text-lg font-semibold text-gray-800">
                Number of Questions
              </Label>
              <Input
                id="questions"
                type="number"
                placeholder="How many questions?"
                min="1"
                max="50"
                value={formData.questions}
                onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                className="text-base h-12"
              />
              <p className="text-sm text-gray-600">
                You can choose how many questions you would like to be quizzed on here
              </p>
            </div>

         
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">Quiz Mode</Label>
              <RadioGroup
                value={formData.mode}
                onValueChange={(value) => setFormData({ ...formData, mode: value })}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {modes.map((mode) => {
                  const IconComponent = mode.icon
                  return (
                    <div key={mode.value}>
                      <RadioGroupItem value={mode.value} id={mode.value} className="peer sr-only" />
                      <Label
                        htmlFor={mode.value}
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all duration-200 h-24"
                      >
                        <IconComponent className="h-6 w-6 text-gray-600 peer-data-[state=checked]:text-blue-600" />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{mode.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{mode.description}</div>
                        </div>
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>

      
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800">Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      <span className={`font-medium ${difficulty.color}`}>{difficulty.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

    
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800">Question Type</Label>
              <div className="flex items-center justify-center">
                <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg font-medium">
                  Multiple Choice Questions
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              disabled={!formData.topic || !formData.questions || !formData.mode || !formData.difficulty}
            >
              Create Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
