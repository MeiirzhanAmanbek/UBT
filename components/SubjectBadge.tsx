import { cn } from "@/lib/utils";
import type { Subject } from "@/types";

interface Props {
  subject: Subject;
  locale: string;
  size?: "sm" | "md";
}

export default function SubjectBadge({ subject, locale, size = "sm" }: Props) {
  const name = locale === "kz" ? subject.name_kz : subject.name_ru;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        subject.color,
        "text-white"
      )}
    >
      <span>{subject.icon}</span>
      {name}
    </span>
  );
}
