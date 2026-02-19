"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface Question {
    id: string;
    question: string;
    options: string | string[]; // Can be JSON string or array
    answer: string;
    userAnswer: string | null;
    isCorrect: boolean | null;
    reason?: string | null;
}

interface Game {
    id: string;
    topic: string;
    difficulty: string;
    questions: Question[];
}

interface QuizReviewProps {
    game: Game;
}

export default function QuizReview({ game }: QuizReviewProps) {
    return (
        <div className="space-y-8">
            {game.questions.map((q, index) => {
                const options =
                    typeof q.options === "string"
                        ? JSON.parse(q.options)
                        : (q.options as string[]);

                return (
                    <Card key={q.id} className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl text-white transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-medium text-white">
                                    Question {index + 1}
                                </CardTitle>
                                {q.isCorrect ? (
                                    <Badge className="bg-green-500/20 text-green-300 border border-green-500/50 flex gap-1 hover:bg-green-500/30">
                                        <CheckCircle className="w-3 h-3" /> Correct
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="bg-red-500/20 text-red-300 border border-red-500/50 flex gap-1 hover:bg-red-500/30">
                                        <XCircle className="w-3 h-3" /> Incorrect
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/90 font-medium mb-4 text-lg leading-relaxed">{q.question}</p>
                            <div className="space-y-3">
                                {options.map((option: string, optIndex: number) => {
                                    const isUserSelected = q.userAnswer === option;
                                    const isCorrectAnswer = q.answer === option;

                                    let optionStyle = "border-white/10 bg-white/5 hover:bg-white/10 text-white/80";
                                    if (isCorrectAnswer) {
                                        optionStyle = "border-green-500/50 bg-green-500/20 ring-1 ring-green-500/50 text-white";
                                    } else if (isUserSelected && !isCorrectAnswer) {
                                        optionStyle = "border-red-500/50 bg-red-500/20 ring-1 ring-red-500/50 text-white";
                                    }

                                    return (
                                        <div
                                            key={optIndex}
                                            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${optionStyle}`}
                                        >
                                            <span className="text-sm font-medium">
                                                {option}
                                            </span>
                                            {isCorrectAnswer && (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            )}
                                            {isUserSelected && !isCorrectAnswer && (
                                                <XCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-white/70">
                                <span className="font-semibold text-white/90">Your Answer:</span>{" "}
                                {q.userAnswer || "Skipped"}
                            </div>
                            {q.reason && (
                                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                                        <span className="bg-blue-500/20 p-1 rounded text-blue-300">💡</span> Explanation
                                    </h4>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {q.reason}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
