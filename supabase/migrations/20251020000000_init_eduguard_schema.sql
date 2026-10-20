-- EduGuard Complete Database Schema
-- Multi-tenant Educational Management, Learning Analytics, and Intervention Platform

-- 1. PROFILES (Teachers / Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin', 'counselor')),
  school_name TEXT NOT NULL DEFAULT 'St. Xavier''s High School',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level TEXT NOT NULL, -- 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  section TEXT NOT NULL DEFAULT 'A',
  room_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'Mathematics', 'Science', 'English', etc.
  code TEXT,
  description TEXT
);

-- 4. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_key TEXT UNIQUE NOT NULL, -- e.g. 'rohan-mehta'
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id),
  avatar_url TEXT,
  risk_level TEXT NOT NULL DEFAULT 'Low' CHECK (risk_level IN ('High', 'Medium', 'Low')),
  risk_score INT DEFAULT 0,
  improving BOOLEAN DEFAULT FALSE,
  avg_score NUMERIC(5,2) DEFAULT 0.0,
  attendance_rate NUMERIC(5,2) DEFAULT 100.0,
  missed_classes_this_week INT DEFAULT 0,
  bio TEXT,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PARENT CONTACTS
CREATE TABLE IF NOT EXISTS public.parent_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  relationship TEXT DEFAULT 'Parent',
  phone_number TEXT NOT NULL,
  email TEXT,
  preferred_language TEXT DEFAULT 'Hindi / English',
  preferred_channel TEXT DEFAULT 'WhatsApp' CHECK (preferred_channel IN ('WhatsApp', 'SMS', 'Email')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DAILY TOPICS
CREATE TABLE IF NOT EXISTS public.daily_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id),
  subject_id UUID REFERENCES public.subjects(id),
  topic_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Live' CHECK (status IN ('Live', 'Upcoming', 'Completed')),
  topics_covered TEXT[] NOT NULL DEFAULT '{}',
  important_concepts TEXT,
  assignment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. MISSED TOPICS
CREATE TABLE IF NOT EXISTS public.missed_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  topic_name TEXT NOT NULL,
  missed_date DATE NOT NULL,
  risk_status TEXT DEFAULT 'Medium' CHECK (risk_status IN ('High', 'Medium', 'Low')),
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. LEARNING RESOURCES
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'notes', 'practice', 'quiz')),
  duration_or_pages TEXT,
  url TEXT,
  content_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id),
  title TEXT NOT NULL,
  description TEXT,
  total_questions INT DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of string options
  correct_option_index INT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_score INT NOT NULL,
  passed BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. LEARNING GAP ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.learning_gap_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  gap_severity TEXT NOT NULL CHECK (gap_severity IN ('High', 'Medium', 'Low')),
  avg_score NUMERIC(5,2),
  identified_date DATE DEFAULT CURRENT_DATE,
  remediation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. SUPPORT PLANS
CREATE TABLE IF NOT EXISTS public.support_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  overview TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. SUPPORT PLAN TASKS
CREATE TABLE IF NOT EXISTS public.support_plan_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_plan_id UUID NOT NULL REFERENCES public.support_plans(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  resource_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. PEER CONNECTIONS
CREATE TABLE IF NOT EXISTS public.peer_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id_1 UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_id_2 UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'declined')),
  study_mode TEXT DEFAULT 'In-person',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. STUDY SESSIONS
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  schedule_time TEXT NOT NULL,
  schedule_days TEXT NOT NULL,
  capacity INT DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('student', 'teacher')),
  message_text TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. PARENT MESSAGES
CREATE TABLE IF NOT EXISTS public.parent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('WhatsApp', 'SMS', 'Email')),
  message_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Sent' CHECK (status IN ('Sent', 'Replied', 'Read', 'Booked', 'No reply')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. PARENT MEETINGS
CREATE TABLE IF NOT EXISTS public.parent_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  slot_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  scheduled_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic_risk', 'attendance', 'peer_connect', 'parent')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_risk ON public.students(risk_level);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(attendance_date);
CREATE INDEX IF NOT EXISTS idx_chat_student ON public.chat_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_messages_student ON public.parent_messages(student_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_messages ENABLE ROW LEVEL SECURITY;

-- SAMPLE RLS POLICIES (School Staff Access)
CREATE POLICY "School teachers can view own student data" ON public.students
  FOR ALL USING (auth.role() = 'authenticated');
