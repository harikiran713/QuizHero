"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Clock,
    Calendar,
    ChevronRight,
    Trophy,
    LayoutList,
    Loader2,
} from "lucide-react";

interface Game {
    id: string;
    topic: string;
    gameType: string;
    difficulty: string;
    timeStarted: string;
    totalQuestions: number;
    score: number;
}

export default function HistoryPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch("/api/history");
                const data = await response.json();
                if (data.games) {
                    setGames(data.games);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <LayoutList className="w-8 h-8 text-white" />
                        <h1 className="text-3xl font-bold text-white drop-shadow-md">Quiz History</h1>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm transition-all border border-white/10"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {games.length === 0 ? (
                    <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl text-white">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Clock className="w-12 h-12 text-white/50 mb-4" />
                            <h3 className="text-lg font-medium text-white">
                                No quizzes played yet
                            </h3>
                            <p className="text-white/70 mt-1 max-w-sm">
                                Start a quiz to see your history here!
                            </p>
                            <Link
                                href="/dashboard"
                                className="mt-6 px-6 py-2 bg-white text-purple-900 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Start Quiz
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {games.map((game) => (
                            <Link href={`/history/${game.id}`} key={game.id}>
                                <Card className="hover:scale-[1.01] transition-all cursor-pointer backdrop-blur-md bg-white/10 border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/15">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg text-white">
                                                        {game.topic}
                                                    </h3>
                                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                                                        {game.difficulty}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-white border-white/40">
                                                        {game.gameType}
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

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-lg drop-shadow-sm">
                                                        <Trophy className="w-5 h-5" />
                                                        {game.score} / {game.totalQuestions}
                                                    </div>
                                                    <p className="text-xs text-gray-300">Score</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-white/50" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
