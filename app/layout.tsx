import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UBT — Образовательная платформа Казахстана",
  description: "ИИ решает школьные задачи пошагово для подготовки к ЕНТ. Математика, физика, химия и другие предметы.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-950 text-white">{children}</body>
    </html>
  );
}
