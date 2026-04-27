import Link from "next/link";
import { CheckCircle, Clock, Eye } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import SubjectBadge from "./SubjectBadge";
import { formatDate } from "@/lib/utils";
import type { Question, Subject, Answer } from "@/types";

interface Props {
  question: Question & { subject: Subject; answers: Answer[] };
}

export default function QuestionCard({ question }: Props) {
  const t = useTranslations("question_card");
  const locale = useLocale();

  const isSolved = question.status === "solved";
  const preview = question.question_text?.slice(0, 120);

  return (
    <Link
      href={`/${locale}/questions/${question.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-blue-600/50 hover:bg-gray-800/80"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {question.subject && (
            <SubjectBadge subject={question.subject} locale={locale} />
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              isSolved
                ? "bg-green-900/40 text-green-400"
                : "bg-yellow-900/40 text-yellow-400"
            }`}
          >
            {isSolved ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {isSolved ? t("solved") : t("pending")}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Eye className="h-3 w-3" />
          {question.view_count}
        </span>
      </div>

      {question.image_url && (
        <div className="h-28 overflow-hidden rounded-lg">
          <img
            src={question.image_url}
            alt="Question"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {preview && (
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-300">
          {preview}
          {(question.question_text?.length ?? 0) > 120 && "..."}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(question.created_at, locale)}
        </span>
        <span className="text-xs font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
          {t("view")} →
        </span>
      </div>
    </Link>
  );
}
