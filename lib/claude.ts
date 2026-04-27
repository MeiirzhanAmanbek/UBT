import Anthropic from "@anthropic-ai/sdk";
import type { AnswerStep } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SolveResult {
  steps: AnswerStep[];
  final_answer: string;
  answer_text: string;
}

export async function solveQuestion(params: {
  questionText?: string;
  imageUrl?: string;
  subjectNameRu: string;
  language: string;
}): Promise<SolveResult> {
  const { questionText, imageUrl, subjectNameRu, language } = params;

  const langInstruction =
    language === "kz"
      ? "Жауапты толығымен қазақ тілінде бер."
      : "Отвечай полностью на русском языке.";

  const systemPrompt = `Ты — умный образовательный помощник для школьников Казахстана.
Предмет: ${subjectNameRu}.
${langInstruction}
Решай задачи пошагово, объясняй каждый шаг понятно.
Отвечай строго в JSON формате:
{
  "steps": [
    {"number": 1, "title": "Название шага", "content": "Объяснение шага"},
    ...
  ],
  "final_answer": "Итоговый ответ",
  "answer_text": "Краткое резюме решения"
}`;

  const contentBlocks: Anthropic.MessageParam["content"] = [];

  if (questionText) {
    contentBlocks.push({ type: "text", text: questionText });
  }

  if (imageUrl) {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    contentBlocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: base64,
      },
    });
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: contentBlocks }],
  });

  const rawText = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid response from AI");

  return JSON.parse(jsonMatch[0]) as SolveResult;
}
