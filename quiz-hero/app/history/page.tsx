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
    LayoutDashboard,
    ListChecks
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
                    <Link href="/dashboard">
                        <Button variant="outline" className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {games.length === 0 ? (
                        <Card className="bg-white border-gray-200 shadow-sm text-gray-800">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-800">
                                    No quizzes played yet
                                </h3>
                                <p className="text-gray-600 mt-1 max-w-sm">
                                    Start a quiz to see your history here!
                                </p>
                                <Link
                                    href="/dashboard"
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    Start Quiz
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        games.map((game: any) => (
                            <Link href={`/history/${game.id}`} key={game.id}>
                                <Card className="hover:scale-[1.01] transition-all cursor-pointer hover:shadow-md bg-white border-gray-200">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-xl font-semibold text-gray-900">{game.topic}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            {game.difficulty === 'easy' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Easy</Badge>}
                                            {game.difficulty === 'medium' && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>}
                                            {game.difficulty === 'hard' && <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Hard</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <ListChecks className="w-4 h-4" />
                                                    <span>{game.totalQuestions || game.questions?.length || 0} Questions</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(game.timeStarted).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
