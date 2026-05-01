"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center rounded-lg border border-gray-700 bg-gray-800 p-0.5">
      <button
        onClick={() => switchTo("ru")}
        className={cn(
          "rounded-md px-3 py-1 text-xs font-semibold transition-all",
          locale === "ru"
            ? "bg-white text-gray-950 shadow"
            : "text-gray-400 hover:text-white"
        )}
      >
        RU
      </button>
      <button
        onClick={() => switchTo("kz")}
        className={cn(
          "rounded-md px-3 py-1 text-xs font-semibold transition-all",
          locale === "kz"
            ? "bg-white text-gray-950 shadow"
            : "text-gray-400 hover:text-white"
        )}
      >
        ҚАЗ
      </button>
    </div>
  );
}
