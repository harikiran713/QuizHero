"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Clock, Calendar, Trophy, ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
const QuizReview = dynamic(() => import("@/components/history/QuizReview"), {
    loading: () => <div className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>,
});
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface GameDetails {
    id: string;
    topic: string;
    gameType: string;
    difficulty: string;
    timeStarted: string;
    questions: any[];
}

import { useQuery } from "@tanstack/react-query";

export default function HistoryDetailPage() {
    const { gameId } = useParams();

    const { data: gameData, isLoading } = useQuery({
        queryKey: ["game", gameId],
        queryFn: async () => {
            const response = await fetch(`/api/history/${gameId}`);
            if (!response.ok) throw new Error("Failed to fetch game details");
            return response.json();
        },
        enabled: !!gameId,
    });

    const game = gameData?.game;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Game not found</h2>
                <Link href="/history">
                    <Button>Back to History</Button>
                </Link>
            </div>
        );
    }

    const correctAnswers = game.questions ? game.questions.filter((q: any) => q.isCorrect).length : 0;
    const totalQuestions = game.questions ? game.questions.length : 0;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/history">
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{game.topic}</h1>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(game.timeStarted).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Total Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Correct Answers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{scorePercentage}%</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <QuizReview game={game} />
            </div>
        </div>
    );
}
