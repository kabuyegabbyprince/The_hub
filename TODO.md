# The Hub — Implementation Roadmap & TODO

This document tracks implementation progress across all 9 phases specified in Section 38 of the build prompt.

## ✅ Phase 1: Infrastructure & Baseline
- [x] Dedicated project structure (`/frontend`, `/backend`, `/docs`)
- [x] Root `package.json` with `concurrently` orchestration
- [x] Express backend on `http://localhost:5000`
- [x] React frontend on `http://localhost:3000` (development preview) with proxy to port 5000
- [x] Health check endpoint `GET /api/health` returning status and timestamp
- [x] Frontend verification component displaying connection to backend

## ✅ Phase 2: Supabase Connection & Database Automation
- [x] Supabase integration configured (`https://guvhwswopudwriwonudn.supabase.co`)
- [x] `backend/src/db/schema.sql` defining idempotent DDL (`CREATE TABLE IF NOT EXISTS`)
- [x] `backend/src/db/seed.sql` with rich realistic starter data
- [x] `backend/src/db/migrate.js` for automated migrations without manual dashboard operations
- [x] Zero credential exposure in frontend code or git files

## ✅ Phase 3: Authentication & Profiles
- [x] Supabase Auth integration with mock/demo learner fallback
- [x] Auth triggered on course selection/enrollment
- [x] User profiles table (`profiles`) linked with learning streak, location, language
- [x] Guest browsing allowed for course discovery, authentication modal on action

## ✅ Phase 4: Skills & Course Management
- [x] Diverse course categories (Technology, Data, Languages, Business, Agriculture, Tourism, Professional Skills)
- [x] Course discovery (`/courses`) with category filters, difficulty, search, and duration
- [x] Course detail page with modules, lessons, and practice assessments
- [x] Enrollment system tracking progress and active lessons

## ✅ Phase 5: Assessments & Skill Passport
- [x] Baseline and skill-specific assessments with quiz questions
- [x] Scoring mechanism updating user skill levels (Beginner to Advanced)
- [x] Skill Passport view (`/skill-passport`) displaying verified skills, evidence, completed projects, and assessments

## ✅ Phase 6: Learning Pathways & Skill Gap Engine
- [x] Deterministic skill gap calculation (`Target Skill Profile` vs `User Assessed Skills`)
- [x] Explainable recommendation engine outputting prioritized learning actions
- [x] Structured learning pathways (e.g. *Become a Data Analyst*, *Become a Web Developer*, *Professional English*)

## ✅ Phase 7: NISR Labour Market Integration
- [x] `backend/src/services/nisrService.js` normalized service layer
- [x] REST endpoints (`/api/nisr/indicators`, `/api/nisr/labour`, `/api/nisr/employment`)
- [x] `/insights` page displaying official Rwanda indicators with provenance (Source, Year, Unit, Definition)
- [x] Factual context linking NISR trends to skill demand without false employment guarantees

## ✅ Phase 8: AI Layer
- [x] Gemini 2.5 AI tutor assistant for concept explanation and learning guidance
- [x] Explainability layer supplementing deterministic skill gap recommendations
- [x] AI practice generator and lesson summarizer

## ✅ Phase 9: Peer Learning & Projects
- [x] Practical real-world project briefs (Web Dev, Data Analytics, Agribusiness, Presentation)
- [x] Peer learning matching interface by skill, availability, and language
- [x] Admin dashboard view for managing courses, skills, and indicators

## ✅ Phase 10: Futuristic Design Overhaul & Database Telemetry
- [x] **Default Light Mode with Light Gray**: Replaced harsh stark white with soothing `#f1f5f9` (Slate-100) and translucent `#e2e8f0` glass surfaces.
- [x] **Dark Blue as Main Color**: Anchor branding, navigation, buttons, and high-contrast typography in deep Midnight Navy (`#0F172A` / `#1E3A8A`).
- [x] **Electric Blue & Red Accents**: Vibrant red neon badges for high-priority skill gaps and streak counters; electric blue for metrics and interactive states.
- [x] **Minimalist + Futuristic Real Animated Cards**: Subtle micro-grids, elevation transitions (`hover:-translate-y-1.5 hover:shadow-xl`), image zooms, and gradient hairlines.
- [x] **Live Database Telemetry HUD**: Interactive widget displaying Supabase PostgreSQL connection status, project ID, latency, table readiness, and 1-click ping capability.

---

## 🚀 Implemented Framework Phases (SkillBridge Framework & Hackathon Alignment)

### ✅ Phase 11: Peer-to-Peer Matching Engine & Language Exchange (The "CONNECT" Pillar)
- [x] **Deterministic Match Scoring Algorithm**: Implemented `MatchScore = Skill compatibility + Goal + Level compatibility + Language + Availability + Preferred format`.
- [x] **Dual-Language Exchange Engine**: Matching learners for bidirectional practice (e.g., Learner A learning English/knows Kinyarwanda matched with Learner B learning Kinyarwanda/knows English).
- [x] **Curated Topic Study Groups**: Ready-to-join cohorts for "English Speaking Practice", "Python Beginners", "Excel for Accounting", "French Conversation", and "Web Development Study Group".
- [x] **Session Scheduler & Protocol**: Structured 40-minute session agendas with timekeeping (e.g., 20 mins Language A / 20 mins Language B).

### ✅ Phase 12: Youth Skills Opportunity View & Disaggregated NISR Insights
- [x] **Dedicated "Youth Skills Opportunity View"**: Interactive journey following `District → Youth Profile → Education Context → Labour Market Context → Learning Pathway`.
- [x] **Geographic Disaggregation**: Regional filter by Province (Kigali City, Northern, Southern, Eastern, Western) and key Districts (Gasabo, Kicukiro, Nyarugenge, Musanze, Huye, Rubavu, Rwamagana).
- [x] **Gender & Inclusion Metrics**: Transparent monitoring of participation by sex (LFS employment/education by gender) ensuring equity without restricting opportunity.
- [x] **Data-to-Feature Traceability Matrix**: Interactive table detailing the exact NISR dataset (LFS, EICV, Education), indicators, and processing pipeline for hackathon judges.

### ✅ Phase 13: Digital Inclusion & Low-Bandwidth Mode (NISR ICT Access Grounding)
- [x] **Text-First Low-Bandwidth Toggle**: Client-side setting prioritizing compressed text and minimal data consumption based on NISR household connectivity metrics.
- [x] **Downloadable Lesson Cheat-Sheets**: Portable offline summaries for low-data study.
- [x] **Offline Assessment & Caching**: Local storage state persistence with seamless background synchronization.

### ✅ Phase 14: Weighted Multi-Part Assessment Model (Knowledge + Practical + Project)
- [x] **Tri-Part Assessment Scoring**:
  - Theory / Concept Knowledge: 30%
  - Practical Timed Task / Code Challenge: 40%
  - Capstone Evidence Project: 30%
- [x] **Rubric-Based Level Issuance**: Standardized criteria mapping composite scores to verifiable levels (Level 1 Foundation, Level 2 Practitioner, Level 3 Specialist).
- [x] **Accreditation Disclaimer Notice**: Explicit distinction between platform verified capabilities and nationally accredited TVET/university qualifications.

### ✅ Phase 15: "Learning-by-Teaching" Mentorship Progression Loop
- [x] **Competence-Driven Role Ladder**: Progression ladder: `Learner → Assessed Competence → Verified Skill → Peer Helper → Peer Tutor → Advanced Mentor`.
- [x] **Helper Verification Badge**: Recognition on Skill Passport for learners who pass Level 3 and host verified peer study sessions.
- [x] **Community Endorsement Log**: Verified session reviews from study group peers adding qualitative evidence to the passport.

### ✅ Phase 16: Employer Challenges, Micro-Internships & Opportunity Layer
- [x] **Real-World Employer Challenge Board**: Practical industry briefs submitted by Rwandan enterprises (cooperatives, tech hubs, SMEs).
- [x] **Micro-Internship Task Submissions**: Short, 1-to-2 week portfolio challenges with automated rubric evaluation and instant verification feedback.
- [x] **Public Verifiable Skill Passport URLs**: Sharable, privacy-preserving cryptographic link (`/passport/:id`) allowing learners to view and share verified skills with learner consent.

### 📌 Phase 17: Institutional & TVET Analytics View
- [ ] **Institutional Dashboard**: Aggregated, privacy-preserving portal for universities, TVET centers, and youth programs (Rwanda Youth in Agribusiness Forum, Digital Ambassadors).
- [ ] **NST2 & Vision 2050 Alignment Matrix**: Tracking skill enrollments and assessment completions against National Strategy for Transformation (NST2) priority economic sectors.


# Server Configuration
PORT=3000

# Google Gemini API Key (Server-side AI Learning Tutor)
GEMINI_API_KEY=

# Supabase Configuration
SUPABASE_URL=https://guvhwswopudwriwonudn.supabase.co
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PUBLISHABLE_KEY=sb_publishable_yg9_DBFxvCnOFrbt3oU3WA_4KgyjoF3

# Client-Side Public Supabase Config
VITE_SUPABASE_URL=https://guvhwswopudwriwonudn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_yg9_DBFxvCnOFrbt3oU3WA_4KgyjoF3

