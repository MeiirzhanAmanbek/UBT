export type Locale = "ru" | "kz";

export type SubjectSlug =
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "history_kz"
  | "kazakh"
  | "russian"
  | "english"
  | "geography"
  | "informatics";

export interface Subject {
  id: string;
  slug: SubjectSlug;
  name_ru: string;
  name_kz: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  subject_id: string;
  subject?: Subject;
  question_text: string | null;
  image_url: string | null;
  language: Locale;
  status: "pending" | "solved" | "failed";
  view_count: number;
  created_at: string;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  steps: AnswerStep[] | null;
  final_answer: string | null;
  created_at: string;
}

export interface AnswerStep {
  number: number;
  title: string;
  content: string;
}
