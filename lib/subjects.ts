import { Subject } from "@/types";

export const DEFAULT_SUBJECT_SLUG = "general";

export const SUBJECTS: Subject[] = [
  { id: "0", slug: "general", name_ru: "Общее", name_kz: "Жалпы", icon: "📚", color: "bg-gray-500" },
  { id: "1", slug: "math", name_ru: "Математика", name_kz: "Математика", icon: "📐", color: "bg-blue-500" },
  { id: "2", slug: "physics", name_ru: "Физика", name_kz: "Физика", icon: "⚡", color: "bg-yellow-500" },
  { id: "3", slug: "chemistry", name_ru: "Химия", name_kz: "Химия", icon: "🧪", color: "bg-green-500" },
  { id: "4", slug: "biology", name_ru: "Биология", name_kz: "Биология", icon: "🧬", color: "bg-emerald-500" },
  { id: "5", slug: "history_kz", name_ru: "История Казахстана", name_kz: "Қазақстан тарихы", icon: "🏛️", color: "bg-amber-500" },
  { id: "6", slug: "kazakh", name_ru: "Казахский язык", name_kz: "Қазақ тілі", icon: "🇰🇿", color: "bg-sky-500" },
  { id: "7", slug: "russian", name_ru: "Русский язык", name_kz: "Орыс тілі", icon: "📝", color: "bg-red-500" },
  { id: "8", slug: "english", name_ru: "Английский язык", name_kz: "Ағылшын тілі", icon: "🌐", color: "bg-indigo-500" },
  { id: "9", slug: "geography", name_ru: "География", name_kz: "География", icon: "🗺️", color: "bg-teal-500" },
  { id: "10", slug: "informatics", name_ru: "Информатика", name_kz: "Информатика", icon: "💻", color: "bg-purple-500" },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function getSubjectName(subject: Subject, locale: string): string {
  return locale === "kz" ? subject.name_kz : subject.name_ru;
}
