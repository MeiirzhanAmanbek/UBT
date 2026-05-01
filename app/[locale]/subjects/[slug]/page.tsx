import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { getSubjectBySlug, getSubjectName } from "@/lib/subjects";
import QuestionsList from "../../QuestionsList";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const subject = getSubjectBySlug(slug);
  if (!subject) notFound();

  const t = await getTranslations("home");
  const name = getSubjectName(subject, locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href={`/${locale}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">{name}</h1>
            <p className="text-sm text-gray-400">Вопросы по предмету</p>
          </div>
        </div>
        <Link
          href={`/${locale}/ask`}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-100"
        >
          <PlusCircle className="h-4 w-4" />
          {t("ask_button")}
        </Link>
      </div>

      <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-800" />)}</div>}>
        <QuestionsList subjectSlug={slug} />
      </Suspense>
    </div>
  );
}
