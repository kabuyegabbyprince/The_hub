# The Hub — Data-Informed Skills & Learning Platform

A production-quality full-stack platform that helps learners discover relevant skills, take practical assessments, explore structured learning pathways, and connect with official labour-market context from the National Institute of Statistics of Rwanda (NISR).

> **Core Recommendation Principle:**  
> USER GOAL + USER SKILLS + ASSESSMENT + SKILL REQUIREMENTS + NISR/LABOUR-MARKET CONTEXT → DATA-INFORMED LEARNING PATHWAY

---

## 1. Project Organization & Architecture

The application strictly separates frontend and backend codebases:

```text
the-hub/
│
├── package.json               # Root scripts with concurrently orchestration
├── README.md                  # Comprehensive implementation report
├── TODO.md                    # Roadmap & task checklist (Phases 1-9)
├── .env.example               # Root configuration placeholders
│
├── frontend/                  # React SPA (Vite + Tailwind CSS + Lucide Icons)
│   ├── package.json
│   ├── vite.config.js         # Port 3000 preview server with /api proxy to Express
│   ├── index.html
│   └── src/
│       ├── components/        # Navbar, CourseCard, AuthModal, BackendStatusBanner
│       ├── pages/             # Dashboard, Courses, CourseDetail, LearningPaths, NisrInsights, SkillPassport
│       ├── services/          # api.js client connecting to Express endpoints
│       ├── lib/               # Supabase public client
│       ├── App.jsx            # Router and state management
│       └── main.jsx
│
├── backend/                   # Express REST API
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/            # Supabase server client
│       ├── routes/            # /api/health, /api/courses, /api/skills, /api/nisr, /api/recommendations, /api/auth
│       ├── services/          # nisrService.js, recommendationEngine.js
│       ├── db/
│       │   ├── schema.sql     # Idempotent DDL for 12 core tables
│       │   ├── seed.sql       # Initial seed data across 7 sectors + NISR indicators
│       │   └── migrate.js     # Automated database migration tool
│       └── server.js          # Express server running on port 5000
│
└── docs/
    ├── data-model.md          # Database schema specifications
    ├── recommendation-engine.md # Deterministic skill gap calculation
    └── nisr-data.md           # Rwanda NISR indicators & provenance
```

---

## 2. Key Features

### 🚀 Direct Dashboard Landing with Course Showcase
- When users visit the application, they land directly on the **Dashboard** featuring course categories, featured pathways, and current learning metrics.

### 🔒 On-Demand Authentication Flow
- Users can freely browse, filter, and review course syllabi as guests.
- **Authentication is triggered upon course selection or enrollment**: Selecting or continuing a course immediately opens the authentication modal with instant 1-Click Demo Learner access (Kezia Umutoni, Kigali) or email registration.

### 📊 Official NISR Labour Market Integration
- Dedicated `nisrService.js` stores normalized metrics from the **National Institute of Statistics of Rwanda**:
  - Services Sector Employment Share (38.6%)
  - Youth Labour Force Participation Rate (52.4%)
  - Internet Access & Digital Connectivity (34.2%)
  - Agriculture Sector Employment Share (44.8%)
- Complete data provenance (source, dataset, definition, methodology) is transparently displayed on the `/insights` page.

### 🎯 Deterministic Skill Gap Engine
- Calculates gaps between target role requirements and user assessment scores.
- Returns explainable priority recommendations without black-box claims or employment guarantees.

### 🎖️ Skill Passport
- Distinguishes course completion from verified competence.
- Tracks assessment test scores, practical code projects, and capstone submissions.

### 🎨 Futuristic Minimalist Design System
- **Default Light Mode with Light Gray Surfaces**: The platform eschews stark pure white for a calming, futuristic light gray (`#f1f5f9` Slate-100 base and translucent `#e2e8f0` glass surfaces).
- **Dark Blue as Main Color**: Primary branding, headers, contrast typography, and primary button gradients use deep Midnight Navy (`#0F172A` and `#1E3A8A`).
- **Blue & Red Accents**: Vibrant electric blue accents (`#2563EB`) highlight active states, meters, and progress; scarlet/crimson red (`#DC2626`) accents draw focus to high-priority skill gaps, streaks, and live activity dots.
- **Real Animated Cards**: Tactile cards with smooth hover elevation (`hover:-translate-y-1.5 hover:shadow-xl`), image zooms, and animated gradient hairlines.

### ⚡ Live Supabase Database Status
The platform includes an integrated **Live Database Telemetry HUD**:
- **Status**: Connected & Active (Pool Healthy)
- **Provider**: Supabase PostgreSQL (`https://guvhwswopudwriwonudn.supabase.co`)
- **Project ID**: `guvhwswopudwriwonudn`
- **Schema & Seed**: 12 Tables Initialized & Seed Synced (Profiles, Skills, Courses, Lessons, NISR Indicators, Assessments, etc.)
- **SSL**: Enforced TLS
- **Live Ping**: Real-time round-trip latency measurement accessible directly in the UI.

---

## 3. SkillBridge Rwanda Framework: The Complete Lifecycle

SkillBridge Rwanda is built on the end-to-end learner lifecycle:

```text
DISCOVER
   ↓
CHOOSE A GOAL
   ↓
LEARN (Self-Paced + AI Assistant)
   ↓
PRACTICE (Exercises & Code Sandboxes)
   ↓
CONNECT (Peer Matching & Language Exchange)
   ↓
ASSESS (Tri-Part: Theory, Practical, Project)
   ↓
PROVE SKILL (Demonstrated Evidence Artifacts)
   ↓
BUILD SKILL PASSPORT (Verifiable Competency Record)
   ↓
FOLLOW A LEARNING / CAREER PATHWAY
   ↓
CONNECT TO PROJECTS & OPPORTUNITIES (Employer Challenges & Micro-Internships)
```

---

## 4. Lost & Upcoming Framework Ideas (Next to Implement)

Extracted from `SkillBridge Rwanda` proposal and `NISR_DATA_REQUEST.md`:

### 🤝 1. Peer-to-Peer Matching Engine & Language Exchange (The "CONNECT" Pillar)
- **The Concept**: Learning is inherently social. Rather than isolating learners in lonely video courses, the platform pairs learners for collaborative practice.
- **Dual-Language Exchange Algorithm**:
  - Example: *User A* is learning English and speaks Kinyarwanda. *User B* is learning Kinyarwanda and speaks English. The algorithm creates an automated **Language Exchange Match** with a structured 40-minute agenda (20 mins English, 20 mins Kinyarwanda).
- **Match Score Formula**:
  $$\text{MatchScore} = \text{Skill Compat} + \text{Goal} + \text{Level} + \text{Language} + \text{Availability} + \text{Format}$$
- **Curated Cohorts**: Instant study groups for *English Speaking*, *Python Beginners*, *Excel for Accounting*, and *Web Dev Study Circle*.

### 👥 2. "Youth Skills Opportunity View" & Geographic Disaggregation
- **The Concept**: Youth are Rwanda's most dynamic economic cohort.
- **Dedicated Youth Journey**:
  $$\text{District} \to \text{Youth Profile} \to \text{Education Context} \to \text{Labour Market Context} \to \text{Learning Pathway}$$
- **Geographic Filters**: Disaggregation across Rwanda's 5 provinces (Kigali City, Northern, Southern, Eastern, Western) and 30 districts to reveal local economic opportunities (e.g. Musanze tourism & agro-processing vs. Kigali digital tech).
- **Gender Monitoring**: Gender-disaggregated metrics (LFS participation & education by sex) to actively track inclusion.

### 📶 3. Digital Inclusion & Low-Bandwidth Mode (NISR ICT Grounding)
- **The Concept**: NISR data shows variable household internet penetration (34.2% national average, lower in rural areas). A national skills platform must design for these realities.
- **Platform Features**:
  - **Text-First Toggle**: Loads compressed lessons with SVG diagrams and stripped video overhead.
  - **Downloadable Lesson Cheat-Sheets**: Single-file offline summaries for review without internet.
  - **Offline Assessment Engine**: Take quizzes and submit code challenges offline via localStorage / IndexedDB; automatic background sync when connection resumes.

### 🎯 4. Tri-Part Weighted Assessment Framework
- **The Concept**: Passing a 5-question quiz does not prove workplace capability. Competency must be demonstrated through multiple evaluation vectors:
  - **Theory & Knowledge (30%)**: Conceptual comprehension questions.
  - **Practical Task (40%)**: Timed real-world exercise (e.g., debug this HTML layout, write this SQL query, clean this spreadsheet).
  - **Capstone Evidence Project (30%)**: Complete portfolio artifact (e.g., working webpage, data dashboard, business plan).
- **Verifiable Levels**: Level 1 (Foundation), Level 2 (Practitioner), Level 3 (Specialist).

### 🔄 5. "Learning-by-Teaching" Mentorship Ladder
- **The Concept**: The best learners become the next generation of mentors.
- **Progression Loop**:
  $$\text{Learner} \to \text{Skill Assessment} \to \text{Verified Skill} \to \text{Peer Helper} \to \text{Peer Tutor} \to \text{Advanced Mentor}$$
- Certified helpers gain verified teaching credentials on their Skill Passport and host weekly community practice rooms.

### 💼 6. Employer Challenges & Micro-Internships
- **The Concept**: Connecting verified capability to concrete opportunity.
- **Employer Challenge Board**: Rwandan enterprises (cooperatives, tech companies, logistics firms) post real problem briefs.
- **Micro-Internships**: 1-to-2 week bite-sized project challenges that learners complete for portfolio reviews and direct interview opportunities.
- **Public Skill Passport URLs**: Privacy-preserving, shareable links (`/passport/:id`) allowing learners to showcase verified skills to prospective clients and employers.

### 🏛️ 7. Institutional & TVET Analytics View
- **The Concept**: Empowering universities, TVET centers, and youth programs (e.g., RYAF, Digital Ambassadors) with aggregated intelligence on:
  - Learner progression across NST2 priority skills.
  - District-level skill deficit hotspots.
  - Training program evaluation benchmarks.

### 📑 8. NISR Data-to-Feature Traceability Matrix
For hackathon evaluation (Track 3: Open Innovation), maintain explicit mapping showing that NISR data genuinely drives product features:

| Feature | NISR Dataset | Key Indicator | Transformation | Application Output |
| :--- | :--- | :--- | :--- | :--- |
| **Labour Context** | Labour Force Survey (LFS) | Employment by sector (38.6% services, 44.8% agri) | Normalization & trend analysis | Macroeconomic context strip on Dashboard |
| **Youth View** | LFS / Education | Youth unemployment & participation (52.4%) | Disaggregation by cohort | Youth Skills Opportunity View |
| **Digital Design** | ICT Household Survey | Internet access (34.2%) & device ownership | Constraint-driven architecture | Text-first low-bandwidth mode |
| **Pathway Alignment** | EICV / LFS | Education attainment & formal/informal split | Skill requirement normalization | Deterministic skill gap prioritization |
| **Inclusion Monitor** | LFS / Census | Female labour participation by sector | Equity tracking | Gender-disaggregated analytics view |

---

## 5. Quick Start & Execution

### Install root dependencies
```bash
npm install
```

### Start Backend and Frontend Simultaneously
```bash
npm start
```
This runs `concurrently`:
- Express backend API → `http://localhost:5000`
- React frontend → `http://localhost:3000` (development preview) / `http://localhost:5173`

### Health Check Verification
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "success": true,
  "message": "The Hub backend is running",
  "timestamp": "2026-09-29T15:35:00.000Z"
}
```

### Run Database Migrations
```bash
npm run db:init
```

---

## 4. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend and service health check |
| `GET` | `/api/courses` | List all courses with category/difficulty filters |
| `GET` | `/api/courses/:slug` | Course detail and module syllabus |
| `POST` | `/api/courses/:id/enroll` | Enroll in course (triggers auth) |
| `GET` | `/api/skills` | Skills taxonomy |
| `GET` | `/api/nisr/indicators` | Official Rwanda NISR indicators |
| `POST` | `/api/recommendations/analyze` | Deterministic skill gap analysis |
| `GET` | `/api/assessments` | Skill quizzes and practical tasks |
| `POST` | `/api/auth/demo-login` | Instant demo learner authentication |

---

## 5. Security & Credentials
- All sensitive credentials (`SUPABASE_SECRET_KEY`, `DATABASE_URL`) are isolated to `backend/.env` and `.env`.
- Frontend only uses public/publishable credentials.
- Zero credentials committed to public files or Git history.
