"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { X, Loader2, Paperclip, ArrowUp } from "lucide-react";

export default function AskForm() {
  const t = useTranslations("ask");
  const locale = useLocale();
  const router = useRouter();

  const [questionText, setQuestionText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImage = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!questionText.trim() && !imageFile) {
      setError(t("required_error"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("language", locale);
      if (questionText.trim()) formData.append("question_text", questionText.trim());
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/questions", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      const { questionId } = await res.json();

      router.push(`/${locale}/questions/${questionId}`);
    } catch {
      setError("Произошла ошибка. Попробуйте снова.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Image preview chip */}
      {imagePreview && (
        <div className="relative inline-flex">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-20 w-20 rounded-xl border border-gray-700 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -right-2 -top-2 rounded-full bg-gray-700 p-1 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Chat input with bottom toolbar */}
      <div className="relative rounded-2xl border border-gray-700 bg-gray-800/50 transition-colors focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/10">
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder={t("question_placeholder")}
          rows={6}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          className="w-full resize-none rounded-2xl bg-transparent px-4 pb-14 pt-4 text-sm text-white placeholder-gray-500 outline-none"
        />

        {/* Bottom bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={t("image_label")}
            className="flex items-center gap-1.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-100 disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t("submitting")}</>
            ) : (
              <><ArrowUp className="h-4 w-4" /> {t("submit_button")}</>
            )}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImage(file);
        }}
      />

      {error && (
        <p className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
