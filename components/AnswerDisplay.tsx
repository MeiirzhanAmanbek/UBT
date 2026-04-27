"use client";

import { useState } from "react";
import { CheckCircle, Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Answer } from "@/types";

interface Props {
  answer: Answer;
}

export default function AnswerDisplay({ answer }: Props) {
  const t = useTranslations("answer");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answer.answer_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">{t("solution_title")}</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-green-400" /> {t("copied")}</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> {t("share")}</>
          )}
        </button>
      </div>

      {answer.steps && answer.steps.length > 0 && (
        <div className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {t("steps_title")}
          </h3>
          <div className="space-y-4">
            {answer.steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {step.number}
                </div>
                <div className="flex-1">
                  {step.title && (
                    <p className="mb-1 font-semibold text-white">{step.title}</p>
                  )}
                  <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                    {step.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {answer.final_answer && (
        <div className="mx-6 mb-6 rounded-lg border border-green-800/40 bg-green-900/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">{t("final_answer")}</span>
          </div>
          <p className="text-base font-medium text-white">{answer.final_answer}</p>
        </div>
      )}
    </div>
  );
}
