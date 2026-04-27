"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, PlusCircle } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">{t("brand")}</span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href={`/${locale}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === `/${locale}` ? "text-white" : "text-gray-400"
              )}
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/ask`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                isActive("/ask") ? "text-white" : "text-gray-400"
              )}
            >
              {t("subjects")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/ask`}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("ask")}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
