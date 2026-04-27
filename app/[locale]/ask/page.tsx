import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import AskForm from "@/components/AskForm";

export default function AskPage() {
  const t = useTranslations("ask");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <Lightbulb className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">{t("title")}</h1>
        <p className="mt-2 text-gray-400">{t("subtitle")}</p>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
        <AskForm />
      </div>
    </div>
  );
}
