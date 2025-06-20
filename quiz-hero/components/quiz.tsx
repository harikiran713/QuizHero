"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function QuizCreation() {
  const [quesType, setQuesType] = useState("open");

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-100">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" className="grid gap-2">
            <Label htmlFor="topic" className="text-lg">Topic</Label>
            <Input placeholder="Enter a topic" id="topic" name="topic" />
            <p className="text-sm">Please provide any topic you would like to be quizzed on here</p>

            <Label className="mt-4 text-base">Number of Questions</Label>
            <Input
              placeholder="How many questions?"
              type="number"
              min={1}
              max={15}
            />
            <p>You can choose how many questions you would like to be quizzed on here</p>

            <div className="flex">
              <Button
              type="button"
                onClick={(e) =>{
                    e.preventDefault()
setQuesType("close")
                } }
                className="w-1/2 rounded-none rounded-l-lg cursor-pointer"
                variant={quesType === "open" ? "secondary" : "default"}
              >
                Multiple Choice
              </Button>
              <Button
              type="button"
                onClick={(e) => {
                     e.preventDefault()
                    setQuesType("open")}}
                className="w-1/2 rounded-none rounded-r-lg cursor-pointer"
                variant={quesType === "open" ? "default" : "secondary"}
              >
                Open Ended
              </Button>
            </div>

            <Button type="submit" className="cursor-pointer mt-2">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
