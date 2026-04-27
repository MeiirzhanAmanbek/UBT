"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  questionId: string;
  locale: string;
}

export default function SolveButton({ questionId, locale }: Props) {
  const t = useTranslations("answer");
  const router = useRouter();
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState("");
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    handleSolve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSolve = async () => {
    setSolving(true);
    setError("");
    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorDetail(data.detail ?? "");
        throw new Error("Failed to solve");
      }
      router.refresh();
    } catch {
      setError(t("error_title"));
      setSolving(false);
    }
  };

  if (solving) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-blue-800/40 bg-blue-900/10 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">{t("solving")}</p>
          <p className="mt-1 text-sm text-gray-400">Claude AI обрабатывает вашу задачу...</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-800/40 bg-red-900/10 py-12">
        <p className="text-red-400">{error}</p>
        {errorDetail && <p className="text-xs text-red-300 max-w-sm text-center">{errorDetail}</p>}
        <button
          onClick={handleSolve}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Sparkles className="h-4 w-4" />
          {t("error_retry")}
        </button>
      </div>
    );
  }

  return null;
}
