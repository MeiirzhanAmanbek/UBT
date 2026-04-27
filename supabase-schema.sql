-- Run this in your Supabase SQL editor

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ru TEXT NOT NULL,
  name_kz TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  question_text TEXT,
  image_url TEXT,
  language TEXT NOT NULL DEFAULT 'ru',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'solved', 'failed')),
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answers
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  steps JSONB,
  final_answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Storage bucket for question images
-- Run in Supabase Dashboard → Storage → New bucket:
-- Name: question-images, Public: true

-- RLS Policies (allow public read, authenticated write)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read answers" ON answers FOR SELECT USING (true);

-- Service role can write (used in API routes with service key)
CREATE POLICY "Service role write subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Service role write questions" ON questions FOR ALL USING (true);
CREATE POLICY "Service role write answers" ON answers FOR ALL USING (true);
