import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === "kz" ? "kk-KZ" : "ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
