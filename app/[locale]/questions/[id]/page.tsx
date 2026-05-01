import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Eye } from "lucide-react";
import { getQuestion } from "@/lib/supabase";
import SubjectBadge from "@/components/SubjectBadge";
import AnswerDisplay from "@/components/AnswerDisplay";
import SolveButton from "./SolveButton";
import { formatDate } from "@/lib/utils";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("answer");
  const tCommon = await getTranslations("common");

  let question;
  try {
    question = await getQuestion(id);
  } catch {
    notFound();
  }

  const answer = question.answers?.[0] ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/${locale}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {tCommon("back")}
      </Link>

      {/* Question block */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {question.subject && (
            <SubjectBadge subject={question.subject} locale={locale} size="md" />
          )}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="h-3.5 w-3.5" />
            {question.view_count}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(question.created_at, locale)}
          </span>
        </div>

        {question.image_url && (
          <div className="mb-4 overflow-hidden rounded-xl border border-gray-700">
            <img
              src={question.image_url}
              alt="Question"
              className="max-h-96 w-full object-contain bg-gray-950"
            />
          </div>
        )}

        {question.question_text && (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-200">
            {question.question_text}
          </p>
        )}
      </div>

      {/* Answer block */}
      {answer ? (
        <div className="space-y-4">
          <AnswerDisplay answer={answer} />
          <Link
            href={`/${locale}/ask`}
            className="flex w-full items-center justify-center rounded-xl border border-gray-700 bg-gray-800 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-white/25 hover:text-white"
          >
            {t("ask_another")}
          </Link>
        </div>
      ) : (
        <SolveButton questionId={id} locale={locale} />
      )}
    </div>
  );
}
