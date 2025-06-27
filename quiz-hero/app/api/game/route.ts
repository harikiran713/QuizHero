import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import  authoptions  from "@/lib/authOptions"; // Make sure you have this exported from your auth config
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authoptions); 

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
   
    const {
      questions,
      topic,
      mode,
      difficulty,
    }: {
      questions: number;
      topic: string;
      mode: "general" | "neet" | "upsc" | "jee_inorganic"
      difficulty: "easy" | "medium" | "hard";
    } = body;

    const game = await prisma.game.create({
      data: {
         gameType:mode,
        timeStarted: new Date(),
        userId: session.user.id,
        topic: topic,
      },
    });

    const { data } = await axios.post("http://localhost:3000/api/questions", {
      topic: topic,
      level: difficulty,
      count: questions,
      mode: mode,
    });
    let manyData=data.questions.map((question)=>{
        let options=[question.answer,question.option1,question.option2,question.option3]
        options=options.sort(()=> Math.random()-0.5)
        return{
            question:question.question,
            answer:question.answer,
            options:JSON.stringify(options),
            gameId:game.id,
            questionType:mode

        }
    })
    await prisma.question.createMany({
        data:manyData
    })

    return NextResponse.json({
      success: true,
      game,
      questions: data,
    });
  } catch (error) {
    console.error("Error creating game or fetching questions:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
