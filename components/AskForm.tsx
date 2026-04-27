"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUBJECTS, getSubjectName } from "@/lib/subjects";

export default function AskForm() {
  const t = useTranslations("ask");
  const locale = useLocale();
  const router = useRouter();

  const [selectedSubject, setSelectedSubject] = useState("");
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImage(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedSubject) { setError(t("subject_error")); return; }
    if (!questionText.trim() && !imageFile) { setError(t("required_error")); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject_slug", selectedSubject);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          {t("subject_label")} <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.slug}
              type="button"
              onClick={() => setSelectedSubject(subject.slug)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                selectedSubject === subject.slug
                  ? "border-blue-500 bg-blue-600/10 text-white"
                  : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-white"
              )}
            >
              <span className="text-xl">{subject.icon}</span>
              <span className="text-xs font-medium leading-tight">
                {getSubjectName(subject, locale)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Question text */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          {t("question_label")}
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder={t("question_placeholder")}
          rows={5}
          className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          {t("image_label")}
        </label>
        {imagePreview ? (
          <div className="relative overflow-hidden rounded-xl border border-gray-700">
            <img src={imagePreview} alt="Preview" className="max-h-64 w-full object-contain bg-gray-900" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-gray-900/80 p-1.5 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 px-6 py-10 transition-colors hover:border-blue-600/50 hover:bg-gray-800/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">
                {t("image_hint")}
              </p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG до 10MB</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-400">
              <Upload className="h-4 w-4" />
              Выбрать файл
            </div>
          </div>
        )}
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
      </div>

      {error && (
        <p className="rounded-lg bg-red-900/30 border border-red-800 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> {t("submitting")}</>
        ) : (
          t("submit_button")
        )}
      </button>
    </form>
  );
}
