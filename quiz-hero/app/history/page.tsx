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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <LayoutList className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {games.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Clock className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No quizzes played yet
                            </h3>
                            <p className="text-gray-500 mt-1 max-w-sm">
                                Start a quiz to see your history here!
                            </p>
                            <Link
                                href="/dashboard"
                                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Start Quiz
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {games.map((game) => (
                            <Link href={`/history/${game.id}`} key={game.id}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {game.topic}
                                                    </h3>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {game.difficulty}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {game.gameType}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 gap-4">
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
                                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-lg">
                                                        <Trophy className="w-5 h-5" />
                                                        {game.score} / {game.totalQuestions}
                                                    </div>
                                                    <p className="text-xs text-gray-500">Score</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
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
