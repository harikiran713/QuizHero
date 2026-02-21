"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, CheckCircle2 } from "lucide-react";
import { MathText } from "@/components/ui/math-text";

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
            {game.questions.map((q, index) => (
                <Card key={q.id} className="w-full bg-white border-gray-200 shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center">
                        <CardTitle className="mr-5 text-center divide-y divide-gray-200">
                            <div className="text-gray-900">{index + 1}</div>
                            <div className="text-base text-gray-500">
                                {game.questions.length}
                            </div>
                        </CardTitle>
                        <CardDescription className="flex-grow text-lg text-gray-800 font-medium">
                            <MathText text={q.question} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {Array.isArray(JSON.parse(q.options as string)) &&
                                JSON.parse(q.options as string).map((option: string, i: number) => {
                                    let optionColor = 'bg-gray-100 border-gray-200';
                                    let textColor = 'text-gray-700';

                                    if (q.userAnswer === option) {
                                        if (q.isCorrect) {
                                            optionColor = 'bg-green-100 border-green-500';
                                            textColor = 'text-green-800 font-semibold';
                                        } else {
                                            optionColor = 'bg-red-100 border-red-500';
                                            textColor = 'text-red-800 font-semibold';
                                        }
                                    } else if (q.answer === option) {
                                        optionColor = 'bg-green-100 border-green-500';
                                        textColor = 'text-green-800 font-semibold';
                                    }

                                    return (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg border-2 ${optionColor} ${textColor} flex items-center justify-between`}
                                        >
                                            <MathText text={option} />
                                            {q.userAnswer === option && !q.isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                                            {q.answer === option && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                            {q.userAnswer === option && q.isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Explanation Section */}
                        {q.reason && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <span className="bg-blue-100 p-1 rounded">💡</span> Explanation
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    <MathText text={q.reason ?? ""} />
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
