"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, GraduationCap, FlaskConical, Brain, ImageIcon, Type, Upload, X } from "lucide-react";

type Mode = "general" | "neet" | "upsc" | "jee_inorganic" | "gate";
type Difficulty = "easy" | "medium" | "hard";

const modes = [
  { value: "general", label: "General", icon: Brain, description: "General knowledge topics" },
  { value: "neet", label: "NEET", icon: FlaskConical, description: "Medical entrance exam prep" },
  { value: "upsc", label: "UPSC", icon: GraduationCap, description: "Civil services preparation" },
  { value: "jee_inorganic", label: "JEE Inorganic", icon: BookOpen, description: "JEE inorganic chemistry" },
  { value: "gate", label: "GATE Exam", icon: GraduationCap, description: "Graduate Aptitude Test in Engineering" },
] as const;

const difficulties = [
  { value: "easy", label: "Easy", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "hard", label: "Hard", color: "text-red-600" },
] as const;

import { useMutation } from "@tanstack/react-query";

export default function QuizCreation() {
  const router = useRouter();

  // Tab
  const [tab, setTab] = useState<"topic" | "image">("topic");

  // Shared settings
  const [questions, setQuestions] = useState(0);
  const [mode, setMode] = useState<Mode>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  // Topic tab
  const [topic, setTopic] = useState("");

  // Image tab
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: createQuiz, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (tab === "topic") {
        const response = await axios.post(`/api/game`, { questions, topic, mode, difficulty });
        return response.data;
      } else {
        // Convert image to base64
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile!);
        });

        const response = await axios.post(`/api/game/image`, {
          imageBase64: base64,
          mimeType: imageFile!.type,
          questions,
          difficulty,
          mode,
        });
        return response.data;
      }
    },
    onSuccess: (data) => {
      router.push(`/play/${data.gameId}`);
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail ?? "";
      const failedAt = error?.response?.data?.failedAt ?? "";
      setErrorMsg(`Error at [${failedAt || "unknown"}]: ${detail || error.message}`);
    },
  });

  // ── Image helpers ──────────────────────────────────────────────
  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setErrorMsg(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    createQuiz();
  };

  const canSubmit =
    !isLoading &&
    questions > 0 &&
    !!mode &&
    !!difficulty &&
    (tab === "topic" ? !!topic.trim() : !!imageFile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-900">Quiz Creation</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Configure your personalized quiz experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
            <button
              type="button"
              onClick={() => setTab("topic")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "topic" ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Type className="w-4 h-4" /> By Topic
            </button>
            <button
              type="button"
              onClick={() => setTab("image")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "image" ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
            >
              <ImageIcon className="w-4 h-4" /> From Image
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Topic tab ── */}
            {tab === "topic" && (
              <div className="space-y-3">
                <Label htmlFor="topic" className="text-lg font-semibold text-gray-800">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter a topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-base h-12"
                />
                <p className="text-sm text-gray-600">
                  Please provide any topic you would like to be quizzed on here
                </p>
              </div>
            )}

            {/* ── Image tab ── */}
            {tab === "image" && (
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800">Upload Image</Label>
                <p className="text-sm text-gray-600">
                  Upload a photo of a textbook page, notes, diagram, or code. Gemini will read it and generate questions.
                </p>

                {!imagePreview ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                      ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/40"}`}
                  >
                    <Upload className="w-10 h-10 text-gray-400" />
                    <p className="font-medium text-gray-600">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow">
                    <img src={imagePreview} alt="Uploaded" className="w-full max-h-64 object-contain bg-gray-50" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 border border-gray-200"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="px-4 py-2 bg-white border-t text-sm text-gray-500 truncate">
                      {imageFile?.name}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Number of Questions */}
            <div className="space-y-3">
              <Label htmlFor="questions" className="text-lg font-semibold text-gray-800">
                Number of Questions
              </Label>
              <Input
                id="questions"
                type="number"
                placeholder="How many questions?"
                min="1"
                max="50"
                value={questions}
                onChange={(e) => setQuestions(Number(e.target.value))}
                className="text-base h-12"
              />
              <p className="text-sm text-gray-600">Choose between 1 and 50 questions</p>
            </div>

            {/* Quiz Mode */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">Quiz Mode</Label>
              <RadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as Mode)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {modes.map((m) => {
                  const IconComponent = m.icon;
                  return (
                    <div key={m.value}>
                      <RadioGroupItem value={m.value} id={m.value} className="peer sr-only" />
                      <Label
                        htmlFor={m.value}
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all duration-200 h-24"
                      >
                        <IconComponent className="h-6 w-6 text-gray-600 peer-data-[state=checked]:text-blue-600" />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{m.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{m.description}</div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      <span className={`font-medium ${d.color}`}>{d.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question Type badge */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800">Question Type</Label>
              <div className="flex items-center justify-center">
                <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg font-medium">
                  Multiple Choice Questions
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              disabled={!canSubmit}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  {tab === "image" ? "Analyzing image..." : "Creating quiz..."}
                </span>
              ) : (
                tab === "image" ? "Analyze & Create Quiz" : "Create Quiz"
              )}
            </Button>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 break-words">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
