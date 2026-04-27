import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/routing";
import Header from "@/components/Header";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "kz")) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col bg-gray-950">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
          © 2025 UBT — Образовательная платформа для Казахстана
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
