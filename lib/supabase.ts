import { createClient } from "@supabase/supabase-js";
import type { Question, Answer, Subject } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getQuestions(subjectSlug?: string, search?: string) {
  let query = supabase
    .from("questions")
    .select("*, subject:subjects(*), answers(*)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (subjectSlug && subjectSlug !== "all") {
    const { data: subject } = await supabase
      .from("subjects")
      .select("id")
      .eq("slug", subjectSlug)
      .single();
    if (subject) query = query.eq("subject_id", subject.id);
  }

  if (search) {
    query = query.ilike("question_text", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (Question & { subject: Subject; answers: Answer[] })[];
}

export async function getQuestion(id: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*, subject:subjects(*), answers(*)")
    .eq("id", id)
    .single();
  if (error) throw error;

  await supabase
    .from("questions")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", id);

  return data as Question & { subject: Subject; answers: Answer[] };
}

export async function createQuestion(payload: {
  subject_id: string;
  question_text?: string;
  image_url?: string;
  language: string;
}) {
  const { data, error } = await supabase
    .from("questions")
    .insert({ ...payload, status: "pending", view_count: 0 })
    .select()
    .single();
  if (error) throw error;
  return data as Question;
}

export async function saveAnswer(payload: {
  question_id: string;
  answer_text: string;
  steps: unknown;
  final_answer: string;
}) {
  const { data: answer, error: answerError } = await supabase
    .from("answers")
    .insert(payload)
    .select()
    .single();
  if (answerError) throw answerError;

  await supabase
    .from("questions")
    .update({ status: "solved" })
    .eq("id", payload.question_id);

  return answer as Answer;
}

export async function getSubjectsFromDB() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name_ru");
  if (error) throw error;
  return data as Subject[];
}

export async function uploadQuestionImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("question-images")
    .upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage
    .from("question-images")
    .getPublicUrl(fileName);
  return data.publicUrl;
}
