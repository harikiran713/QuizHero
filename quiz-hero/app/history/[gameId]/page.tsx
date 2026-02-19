"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Clock, Calendar, Trophy } from "lucide-react";
import QuizReview from "@/components/history/QuizReview";
import Link from "next/link";

interface GameDetails {
    id: string;
    topic: string;
    gameType: string;
    difficulty: string;
    timeStarted: string;
    questions: any[];
}

export default function HistoryDetailPage() {
    const { gameId } = useParams();
    const [game, setGame] = useState<GameDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!gameId) return;

        const fetchGameDetails = async () => {
            try {
                const response = await fetch(`/api/history/${gameId}`);
                const data = await response.json();
                if (data.game) {
                    setGame(data.game);
                }
            } catch (error) {
                console.error("Failed to fetch game details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameDetails();
    }, [gameId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
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

    const correctAnswers = game.questions ? game.questions.filter((q) => q.isCorrect).length : 0;
    const totalQuestions = game.questions ? game.questions.length : 0;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/history"
                        className="inline-flex items-center text-sm font-medium text-white/50 hover:text-white mb-4 transition-colors p-2 rounded-md hover:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to History
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white drop-shadow-md">
                                    {game.topic}
                                </h1>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                                    {game.gameType}
                                </Badge>
                                <Badge variant="outline" className="text-white border-white/40">
                                    {game.difficulty}
                                </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-300 gap-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(game.timeStarted).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(game.timeStarted).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>

                        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-300">Score</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{correctAnswers}/{totalQuestions}</span>
                                        <span className="text-sm text-gray-400">({scorePercentage}%)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white/90">Questions Review</h2>
                    <QuizReview game={game} />
                </div>
            </div>
        </div>
    );
}
