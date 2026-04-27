import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { solveQuestion } from "@/lib/claude";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  let questionId: string | undefined;
  try {
    ({ questionId } = await req.json());
    if (!questionId) {
      return NextResponse.json({ error: "questionId required" }, { status: 400 });
    }

    const { data: question, error: qError } = await supabase
      .from("questions")
      .select("*, subject:subjects(*)")
      .eq("id", questionId)
      .single();

    if (qError || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Don't re-solve if already done
    const { data: existing } = await supabase
      .from("answers")
      .select("id")
      .eq("question_id", questionId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, alreadySolved: true });
    }

    const result = await solveQuestion({
      questionText: question.question_text ?? undefined,
      imageUrl: question.image_url ?? undefined,
      subjectNameRu: question.subject?.name_ru ?? "Общий предмет",
      language: question.language,
    });

    const { error: answerError } = await supabase.from("answers").insert({
      question_id: questionId,
      answer_text: result.answer_text,
      steps: result.steps,
      final_answer: result.final_answer,
    });

    if (answerError) throw answerError;

    await supabase
      .from("questions")
      .update({ status: "solved" })
      .eq("id", questionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/solve error:", err);

    if (questionId) {
      await supabase
        .from("questions")
        .update({ status: "failed" })
        .eq("id", questionId);
    }

    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to solve", detail: message }, { status: 500 });
  }
}
