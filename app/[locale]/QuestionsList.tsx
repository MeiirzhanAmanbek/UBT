import { useTranslations } from "next-intl";
import { getQuestions } from "@/lib/supabase";
import QuestionCard from "@/components/QuestionCard";
import type { Question, Subject, Answer } from "@/types";

export default async function QuestionsList({
  subjectSlug,
  search,
}: {
  subjectSlug?: string;
  search?: string;
}) {
  const t = useTranslations("home");

  let questions: (Question & { subject: Subject; answers: Answer[] })[] = [];
  try {
    questions = await getQuestions(subjectSlug, search);
  } catch {
    questions = [];
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-700 py-16 text-center">
        <span className="text-4xl">📚</span>
        <p className="text-gray-400">{t("no_questions")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  );
}
