# The Hub — Data Model Architecture

The Hub data model is designed to support data-informed skills development, assessment-verified capabilities, and labour-market-connected learning pathways.

## Core Entities & Relationships

### 1. Profiles (`profiles`)
Linked 1:1 with Supabase Auth (`auth.users.id`).
- `id` (UUID, PK, references auth.users)
- `full_name` (TEXT)
- `username` (TEXT, UNIQUE)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `location` (TEXT, e.g. "Kigali, Rwanda")
- `preferred_language` (TEXT, default: 'en')
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 2. Skills (`skills`)
Taxonomy of capabilities spanning technology, data, business, languages, and local economic sectors.
- `id` (TEXT/UUID, PK)
- `name` (TEXT)
- `slug` (TEXT, UNIQUE)
- `description` (TEXT)
- `category` (TEXT) - e.g., 'Technology', 'Data', 'Languages', 'Business', 'Agriculture', 'Tourism'
- `difficulty_level` (TEXT) - 'Beginner', 'Intermediate', 'Advanced'
- `created_at` (TIMESTAMPTZ)

### 3. User Skills (`user_skills`)
Tracks assessed levels and verifiable evidence.
- `id` (UUID, PK)
- `user_id` (UUID, references profiles.id)
- `skill_id` (UUID, references skills.id)
- `level` (TEXT) - 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'
- `assessment_score` (INT, 0-100)
- `verified` (BOOLEAN)
- `evidence` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 4. Courses (`courses`)
Learning modules covering foundational and specialized subjects.
- `id` (UUID, PK)
- `title` (TEXT)
- `slug` (TEXT, UNIQUE)
- `description` (TEXT)
- `short_description` (TEXT)
- `thumbnail_url` (TEXT)
- `category` (TEXT)
- `difficulty` (TEXT) - 'Beginner', 'Intermediate', 'Advanced'
- `estimated_hours` (INT)
- `instructor_name` (TEXT)
- `language` (TEXT, default: 'English')
- `is_published` (BOOLEAN, default: true)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 5. Course Modules & Lessons (`course_modules`, `lessons`)
- `course_modules`: `id`, `course_id`, `title`, `description`, `position`
- `lessons`: `id`, `module_id`, `title`, `slug`, `content`, `video_url`, `duration_minutes`, `position`, `lesson_type` ('article', 'video', 'quiz', 'exercise', 'project')

### 6. Course Enrollments (`enrollments`)
- `id`, `user_id`, `course_id`, `status` ('enrolled', 'in_progress', 'completed'), `progress_percentage`, `last_accessed_at`

### 7. Assessments & Question Items (`assessments`, `assessment_questions`)
- Multi-choice, practical exercises, and project submissions to test verified skills.

### 8. NISR Labour Market Indicators (`nisr_indicators`)
Stores normalized data retrieved from the National Institute of Statistics of Rwanda (NISR).
- `id` (UUID, PK)
- `source` (TEXT, e.g. "NISR Labour Force Survey")
- `dataset` (TEXT, e.g. "LFS Annual Report")
- `indicator` (TEXT, e.g. "Employment by Economic Activity: Services Sector")
- `indicator_code` (TEXT)
- `year` (INT)
- `period` (TEXT, e.g. "Annual")
- `geography` (TEXT, e.g. "Rwanda - National")
- `unit` (TEXT, e.g. "% of total employed")
- `value` (NUMERIC)
- `metadata` (JSONB)
- `retrieved_at` (TIMESTAMPTZ)
