import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUBJECTS, DEFAULT_SUBJECT_SLUG } from "@/lib/subjects";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const subjectSlug = (formData.get("subject_slug") as string) || DEFAULT_SUBJECT_SLUG;
    const questionText = formData.get("question_text") as string | null;
    const language = (formData.get("language") as string) || "ru";
    const imageFile = formData.get("image") as File | null;

    if (!questionText?.trim() && !imageFile) {
      return NextResponse.json({ error: "Question or image required" }, { status: 400 });
    }

    const subject = SUBJECTS.find((s) => s.slug === subjectSlug) ?? SUBJECTS.find((s) => s.slug === DEFAULT_SUBJECT_SLUG)!;

    // Upsert subject to DB
    const { data: dbSubject, error: subjectError } = await supabase
      .from("subjects")
      .upsert(
        { slug: subject.slug, name_ru: subject.name_ru, name_kz: subject.name_kz, icon: subject.icon },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (subjectError) throw subjectError;

    // Upload image if provided
    let imageUrl: string | null = null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("question-images")
        .upload(fileName, buffer, { contentType: imageFile.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("question-images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        subject_id: dbSubject.id,
        question_text: questionText?.trim() || null,
        image_url: imageUrl,
        language,
        status: "pending",
        view_count: 0,
      })
      .select()
      .single();

    if (questionError) throw questionError;

    return NextResponse.json({ questionId: question.id });
  } catch (err) {
    console.error("POST /api/questions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
