"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Game {
  id: string;
  topic: string;
  difficulty: string;
  timeLimit?: number;
  questions: Question[];
}

interface QuizGameProps {
  game: Game;
}

interface AnswerResult {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}

export default function QuizGame({ game }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = game.questions[currentQuestionIndex];
  const totalQuestions = game.questions.length;

  useEffect(() => {
    if (!quizCompleted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
        }),
      });

      const data = await res.json();

      const result: AnswerResult = {
        isCorrect: data.isCorrect,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
      };

      setAnswerResult(result);
      setShowResult(true);

      if (result.isCorrect) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setShowResult(false);
      setAnswerResult(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setAnswerResult(null);
    setScore({ correct: 0, incorrect: 0 });
    setTimer(0);
    setQuizCompleted(false);
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const scorePercentage = Math.round((score.correct / totalQuestions) * 100);

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center overflow-x-hidden">
        <Card className="max-w-2xl w-full shadow-2xl backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-md" />
            <h1 className="text-4xl font-bold mb-2 text-white">Quiz Completed!</h1>
            <p className="text-lg text-white/80 mb-6">
              Great job on the {game.topic} quiz!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-500/20 p-6 rounded-xl border border-blue-500/30">
                <div className="text-4xl font-bold text-blue-300 mb-2">
                  {score.correct}/{totalQuestions}
                </div>
                <p className="text-blue-200 font-medium">Final Score</p>
              </div>
              <div className="bg-green-500/20 p-6 rounded-xl border border-green-500/30">
                <div className="text-4xl font-bold text-green-300 mb-2">
                  {scorePercentage}%
                </div>
                <p className="text-green-200 font-medium">Accuracy</p>
              </div>
              <div className="bg-purple-500/20 p-6 rounded-xl border border-purple-500/30">
                <div className="text-4xl font-bold text-purple-300 mb-2">
                  {formatTime(timer)}
                </div>
                <p className="text-purple-200 font-medium">Time Taken</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full px-4">
              <Button onClick={restartQuiz} variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 bg-transparent">
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </Button>
              <Button onClick={() => (window.location.href = "/")} className="w-full sm:w-auto bg-white text-purple-900 hover:bg-gray-100 font-bold">
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-xl backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{game.topic}</h1>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                    game.difficulty
                  ).replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-')}`}
                >
                  {game.difficulty.charAt(0).toUpperCase() +
                    game.difficulty.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg text-white/90 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                <Clock className="w-5 h-5" />
                {formatTime(timer)}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-bold text-green-300 text-lg">
                  {score.correct}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30">
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="font-bold text-red-300 text-lg">
                  {score.incorrect}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
            <span className="text-lg font-semibold text-white/90">Progress</span>
            <span className="text-lg text-white/70">
              {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
        </div>

        <Card className="mb-6 shadow-2xl backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <span className="text-lg font-semibold text-blue-200 bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-lg">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
            <h2 className="text-2xl font-medium mb-8 leading-relaxed text-white">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer border-2 transition-all ${selectedAnswer === option
                      ? "ring-2 ring-blue-500 bg-blue-500/30 border-blue-400"
                      : "hover:bg-white/10 border-white/10 bg-white/5"
                    } ${showResult && answerResult?.correctAnswer === option
                      ? "ring-2 ring-green-500 bg-green-500/30 border-green-400"
                      : showResult &&
                        selectedAnswer === option &&
                        !answerResult?.isCorrect
                        ? "ring-2 ring-red-500 bg-red-500/30 border-red-400"
                        : ""
                    }`}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                >
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center gap-4 w-full">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all ${showResult && answerResult?.correctAnswer === option
                            ? "border-green-400 bg-green-500/80 text-white"
                            : showResult &&
                              selectedAnswer === option &&
                              !answerResult?.isCorrect
                              ? "border-red-400 bg-red-500/80 text-white"
                              : selectedAnswer === option
                                ? "border-blue-400 bg-blue-500/80 text-white"
                                : "border-white/30 text-white/70"
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-white/90 text-lg">{option}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {showResult && answerResult && (
          <Card className="mb-6 shadow-xl backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-8">
              <div
                className={`flex items-center gap-3 mb-6 text-xl ${answerResult.isCorrect ? "text-green-400" : "text-red-400"
                  }`}
              >
                {answerResult.isCorrect ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
                <span className="font-bold">
                  {answerResult.isCorrect
                    ? "Correct! Well done!"
                    : "Incorrect"}
                </span>
              </div>

              {!answerResult.isCorrect && (
                <div className="mb-6 p-4 bg-green-500/10 border-l-4 border-green-400 rounded-r-lg">
                  <p className="text-green-200 text-lg">
                    <span className="font-semibold text-green-300">Correct Answer: </span>
                    {answerResult.correctAnswer}
                  </p>
                </div>
              )}

              <div className="bg-white/5 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold mb-3 text-lg text-white/90">
                  Explanation:
                </h3>
                <p className="text-white/80 leading-relaxed text-lg">
                  {answerResult.explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center pb-8 px-4">
          {!showResult ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || isLoading}
              className="px-12 py-6 text-lg font-bold w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-900 mr-2"></div>
                  Checking...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="px-12 py-6 text-lg font-bold w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all rounded-full"
              size="lg"
            >
              {currentQuestionIndex < totalQuestions - 1
                ? "Next Question →"
                : "Finish Quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
