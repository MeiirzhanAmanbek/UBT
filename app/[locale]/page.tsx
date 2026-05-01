import { Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { SUBJECTS, getSubjectName } from "@/lib/subjects";
import QuestionsList from "./QuestionsList";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="mb-12 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-gray-900 to-zinc-950 px-8 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
            <Zap className="h-3.5 w-3.5" />
            Умный ИИ-помощник
          </div>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {t("hero_title")}
          </h1>
          <p className="mb-8 text-base text-gray-400 sm:text-lg">
            {t("hero_subtitle")}
          </p>
          <Link
            href={`/${locale}/ask`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-gray-950 shadow-lg transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-xl"
          >
            {t("ask_button")} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Subject grid */}
      <section className="mb-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.slug}
              href={`/${locale}/subjects/${subject.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-center transition-all hover:border-white/25 hover:bg-gray-800"
            >
              <span className="text-3xl">{subject.icon}</span>
              <span className="text-xs font-medium text-gray-300 group-hover:text-white">
                {getSubjectName(subject, locale)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent questions */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-white">{t("recent_questions")}</h2>
        <Suspense fallback={<QuestionsSkeletons />}>
          <QuestionsList />
        </Suspense>
      </section>
    </div>
  );
}

function QuestionsSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-800" />
      ))}
    </div>
  );
}
