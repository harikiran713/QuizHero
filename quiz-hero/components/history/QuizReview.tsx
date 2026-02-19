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
                    <Card key={q.id} className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-medium">
                                    Question {index + 1}
                                </CardTitle>
                                {q.isCorrect ? (
                                    <Badge className="bg-green-500 hover:bg-green-600 flex gap-1">
                                        <CheckCircle className="w-3 h-3" /> Correct
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="flex gap-1">
                                        <XCircle className="w-3 h-3" /> Incorrect
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-800 font-medium mb-4">{q.question}</p>
                            <div className="space-y-2">
                                {options.map((option: string, optIndex: number) => {
                                    const isUserSelected = q.userAnswer === option;
                                    const isCorrectAnswer = q.answer === option;

                                    let optionStyle = "border-gray-200 bg-white";
                                    if (isCorrectAnswer) {
                                        optionStyle = "border-green-500 bg-green-50 ring-1 ring-green-500";
                                    } else if (isUserSelected && !isCorrectAnswer) {
                                        optionStyle = "border-red-500 bg-red-50 ring-1 ring-red-500";
                                    }

                                    return (
                                        <div
                                            key={optIndex}
                                            className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${optionStyle}`}
                                        >
                                            <span className="text-sm font-medium text-gray-700">
                                                {option}
                                            </span>
                                            {isCorrectAnswer && (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            )}
                                            {isUserSelected && !isCorrectAnswer && (
                                                <XCircle className="w-4 h-4 text-red-600" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                                <span className="font-semibold">Your Answer:</span>{" "}
                                {q.userAnswer || "Skipped"}
                            </div>
                            {q.reason && (
                                <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <span className="bg-blue-100 p-1 rounded">💡</span> Explanation
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
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
