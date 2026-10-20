# EduGuard — Student Learning Analytics, Academic Intervention & Peer Learning SaaS

EduGuard is a modern, responsive educational management web application designed for teachers, schools, and academic mentors. Built to faithfully recreate the visual design and UX architecture of the design reference, EduGuard enables educators to track daily class topics, detect learning gaps early, generate personalized catch-up plans, connect nearby classmates for peer study sessions, and communicate with parents in multiple languages in one tap.

---

## 🌟 Key Features

### 1. Daily Topics & Missed-Class Recovery (`/daily-learning`)
- **Today's Topics**: Live tracking of syllabus topics across Class 9–12 with "View Notes & Resources" modals.
- **Missed Classes & Catch-up Plan**: Direct identification of students with missed instructional units (e.g., Rohan Mehta with 2 missed classes in Mathematics & Science).
- **AI Concept Explainer**: Pedagogical concept breakdowns (e.g. Quadratic Equations in simple language, standard, or advanced levels with real-world analogies).
- **Interactive Practice Checkpoint Quiz**: Working 5-question multiple choice quiz with instant feedback, scoring, explanation breakdown, and celebratory confetti.

### 2. Student Missed Topics & Learning Recovery (`/daily-learning/student/:studentId`)
- Student summary badge with missed class count.
- Multi-subject remediation checklists with interactive **Watch**, **Read**, **Practice**, and **Quiz** action viewers.
- Working status checkboxes that sync to local application storage.
- Quick link to the student's personalized Targeted Support Plan.

### 3. Nearby Classmate & Peer Learning Connect (`/peer-learning`)
- **Interactive Leaflet & OpenStreetMap Integration**: Map view visualizing student study partner clusters with privacy-safe anonymized coordinates.
- **Classmate Search & Filtering**: Filters for "Nearby", "Same Class", and "Same Subject".
- **Peer Profile Card**: Displays preferred study modes (In-person, Online video, Group study) and weekly availability time slots.
- **Group Study Sessions**: Join live study circles (e.g., "Math Study Group", "Science Doubt Clearing").
- **Safety & Privacy Guidelines**: Verification rules protecting student home addresses.

### 4. Peer Learning Chat (`/peer-learning/chat/:studentId`)
- Direct messaging interface matching the reference design.
- Enter-to-send support, timestamped messages, simulated classmate replies, and conversation reporting.
- "Shared Study Details" sidebar displaying meeting times, locations, and modes.

### 5. Learning Gap Tracking (`/learning-gaps`)
- Diagnostic risk overview with 4 KPI cards: **Total Students (42)**, **At Risk Students (8 / 19%)**, **Improving (21 / 50%)**, and **On Track (13 / 31%)**.
- Comprehensive student gap table with sorting by Average Score and Missed Topics.
- Status badges: **High Risk**, **Medium Risk**, **Low Risk**.

### 6. Learning Gap Details (`/learning-gaps/student/:studentId`)
- Drilldown into specific weak topics (e.g. Quadratic Equations, Linear Equations, Trigonometry).
- Four targeted support recommendations: Personalized Study Plan, Additional Practice Questions, Teacher Support, and Peer Learning.

### 7. Targeted Support Plan (`/learning-gaps/student/:studentId/support`)
- 4-step structured weekly learning plan with interactive task checkboxes and progress tracking.
- Working **"Mark as Completed"** action that updates state and launches celebration confetti.
- **Quick Quiz Preview** featuring the quadratic factorization question: `x² + 3x + 2 = 0` with correct roots `x = -1, -2`.

### 8. Parent Communication Assistant (`/parent-connect`)
- Student and parent selector with automatic language and preferred channel detection.
- Selectable message types: *Missed class alert*, *Progress update*, *Meeting request*, *Appreciation*, *Fee reminder*.
- Tone options: *Friendly*, *Formal*, *Urgent*.
- **Multi-lingual AI drafting**: Instant toggling between **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- Actions: **Regenerate**, **Make Shorter**, and **Add Catch-up Link**.
- Multi-channel dispatch via **WhatsApp**, **SMS**, or **Email**.

### 9. Communication History & Insights (`/parent-connect/history`)
- 30-day analytics: Messages Sent (64), Parents Replied (46 / 64%), Awaiting Reply (17), Meetings Booked (6).
- Audit trail of sent messages with status tracking (Sent, Replied, Read, Booked, No reply).
- AI suggestions for proactive parental outreach.
- Interactive parent-teacher conference meeting scheduler.

### 10. Additional Management Pages
- **Home (`/home`)**: High-level academic overview and daily schedule.
- **Students (`/students`)**: Searchable student directory with Grid and Table view modes.
- **Predictions (`/predictions`)**: Recharts data visualizations showing term failure risk predictions and explainable academic factors.
- **Attendance (`/attendance`)**: Live daily roll-call register with one-tap Present / Absent / Late controls.
- **Reports (`/reports`)**: Academic trend charts and **CSV export** for school administrative reporting.
- **Settings (`/settings`)**: Teacher profile, notification preferences, Supabase configuration, and complete Demo Data Reset.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Build & Tooling** | Vite 5, TypeScript 5, React 18 |
| **Styling** | Tailwind CSS (exact `#003F40` teal and `#008A62` emerald palette) |
| **Icons** | Lucide React |
| **Navigation** | React Router v6 |
| **Maps** | Leaflet & React-Leaflet with OpenStreetMap tiles (no paid API key required) |
| **Charts** | Recharts (ResponsiveContainer, PieChart, BarChart, LineChart) |
| **Database & Persistence** | Supabase JS client with automatic LocalStorage demo mode fallback |
| **Animations & Confetti** | Canvas-confetti |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone or navigate to the repository
cd f:\EduGaurd

# Install dependencies (already installed)
npm install

# Start the development server
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:3000`**

---

## 🗄️ Supabase Configuration (Optional)

EduGuard works completely out-of-the-box in **Local Demo Mode** with persistent `localStorage`.

If you would like to connect a live Supabase project:
1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Execute the included SQL migration file located at:
   `supabase/migrations/20251020000000_init_eduguard_schema.sql`
3. Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart the development server (`npm run dev`). The status badge in the header will automatically switch to **"Supabase Connected"**.

---

## 📁 Project Structure

```
EduGuard/
├── public/
│   └── logo.svg                 # EduGuard brand icon
├── src/
│   ├── app/
│   │   └── router.tsx           # 15 application routes
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx   # Fixed dark teal sidebar with icons
│   │   │   ├── AppHeader.tsx    # Search, notifications, teacher profile
│   │   │   └── DashboardLayout.tsx
│   │   ├── learning/
│   │   │   ├── QuizModal.tsx    # Interactive 5-question quiz with score & explanations
│   │   │   └── AiExplanationModal.tsx # Multi-level pedagogical explainer
│   │   ├── peer-learning/
│   │   │   └── LeafletMap.tsx   # Custom animated Leaflet OpenStreetMap
│   │   └── shared/
│   │       └── ToastContainer.tsx # Toast notifications
│   ├── data/
│   │   └── mockData.ts          # Comprehensive seed data for students, classes, quizzes
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DailyLearningPage.tsx
│   │   ├── StudentCatchUpPage.tsx
│   │   ├── PeerLearningPage.tsx
│   │   ├── PeerChatPage.tsx
│   │   ├── LearningGapsPage.tsx
│   │   ├── LearningGapDetailsPage.tsx
│   │   ├── SupportPlanPage.tsx
│   │   ├── ParentConnectPage.tsx
│   │   ├── CommunicationHistoryPage.tsx
│   │   ├── StudentsPage.tsx
│   │   ├── PredictionsPage.tsx
│   │   ├── AttendancePage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   ├── aiService.ts         # Educational concept & multi-lingual drafting engine
│   │   ├── store.tsx            # Central state & localStorage persistence
│   │   └── supabaseClient.ts    # Supabase connection with graceful fallback
│   ├── types/
│   │   └── index.ts             # Domain TypeScript definitions
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 20251020000000_init_eduguard_schema.sql
├── tailwind.config.js           # Exact color definitions
├── vite.config.ts
└── package.json
```
