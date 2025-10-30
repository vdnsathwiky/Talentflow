# TalentFlow — A Mini Hiring Platform 

TalentFlow is a front-end React application that simulates a hiring management system for HR teams. It allows users to manage Jobs, Candidates, and Assessments — entirely on the front-end using IndexedDB (Dexie) for persistence and MSW to mock backend APIs.

All application data (jobs, candidates, assessments) persists locally, simulating a complete full-stack experience without an actual backend server.

---
<p align="center">
  <a href="https://drive.google.com/file/d/1PLkjNwWpTwhVQYPVaG_x0e5pueOFoGF4/view?usp=sharing">
    <img src="https://img.youtube.com/vi/7PCZbwAM8UQ/0.jpg" alt="Watch the video" width="560"/>
  </a>
</p>



##  Features Overview



### 1. Jobs Management
- Create, edit, archive, and reorder jobs
- Pagination & filtering (by title, status, tags)
- Validation (title required, unique slug)
- Drag-and-drop job reordering with optimistic updates and rollback on simulated failure
- Deep linking: `/jobs/:jobId` displays job details
- Archive/Unarchive toggle with UI feedback

### 2. Candidates Management
- 1000+ seeded candidates using Faker.js
- Virtualized infinite scrolling list (using react-virtuoso)
- Client-side search (by name/email) and stage filter (applied/screen/tech/offer/hired/rejected)
- Candidate details route: `/candidates/:id` showing stage timeline
- Kanban board for moving candidates between stages using drag-and-drop
- Notes with @mentions (with suggestions from local user list)

### 3. Assessments
- Assessment builder per job: add/edit sections and questions
- Supports question types:
  - Single choice (radio)
  - Multi-choice (checkbox)
  - Short text, Long text
  - Numeric range (min-max)
  - File upload stub (UI only)
- Live preview pane showing fillable form in real-time
- Validation: required fields, numeric range, character limits
- Conditional questions (e.g., show Q3 if Q1 === "Yes")
- Persist builder state and candidate responses in IndexedDB

---

##  Tech Stack

| Layer | Library / Tool |
|-------|---------------|
| Frontend Framework | React (Vite) |
| Routing | React Router v6 |
| State & Server Cache | TanStack React Query |
| Database (Persistence) | Dexie (IndexedDB wrapper) |
| Mock API Layer | MSW (Mock Service Worker) |
| Styling | Tailwind CSS + Headless UI + Lucide Icons |
| Drag & Drop | @hello-pangea/dnd |
| Virtualized Lists | react-virtuoso / react-window |
| Animation | Framer Motion |
| Forms & Validation | React Hook Form + Yup |
| Utilities | Axios, UUID, Date-FNS, React Hot Toast |
| Development Tools | ESLint, Prettier, PostCSS, Autoprefixer |

---

## Folder Structure

```
talentflow/
├── node_modules/
├── public/
│   ├── mockServiceWorker.js
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── assessments.js
│   │   └── jobs.js
│   │
│   ├── components/
│   │   ├── assessments_temp/
│   │   │   └── RuntimeForm.jsx
│   │   ├── CandidatesTemp/
│   │   │   ├── CandidateRow.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   └── Notes.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   └── QuestionTypes.jsx
│   │   └── Jobs/
│   │       ├── JobCard.jsx
│   │       ├── JobModal.jsx
│   │       └── JobsList.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── db/
│   │   ├── candidatesAPI.js
│   │   ├── dexieDB.js
│   │   └── seedData.js
│   │
│   ├── hooks/
│   │   ├── useAssessments.js
│   │   ├── useCandidates.js
│   │   ├── useJobs.js
│   │   └── useJobsMutations.js
│   │
│   ├── mocks/
│   │   ├── handlers/
│   │   │   ├── assessmentsHandlers.js
│   │   │   ├── candidatesHandlers.js
│   │   │   ├── index.js
│   │   │   └── jobsHandlers.js
│   │   └── browser.js
│   │
│   ├── pages/
│   │   ├── AssessmentBuilderPage.jsx
│   │   ├── AssessmentPreviewPage.jsx
│   │   ├── AssessmentRuntimePage.jsx
│   │   ├── AssessmentsPage.jsx
│   │   ├── CandidateDetailPage.jsx
│   │   ├── Candidates.jsx
│   │   ├── JobDetailPage.jsx
│   │   ├── Jobs.jsx
│   │   ├── KanbanPage.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── utils/
│   │   ├── delay.js
│   │   ├── fileUpload.js
│   │   └── syncCandidatesToDexie.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── requirements.txt
├── tailwind.config.js
└── vite.config.js
```

---

## Data & API Simulation

All endpoints are simulated using MSW (Mock Service Worker), including artificial delay and random failure rates to emulate real backend conditions.

### Simulated REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs?search=&status=&page=&pageSize=&sort=` | Paginated jobs list |
| POST | `/jobs` | Create a new job |
| PATCH | `/jobs/:id` | Update job details |
| PATCH | `/jobs/:id/reorder` | Reorder jobs (with 10% random failure) |
| GET | `/candidates?search=&stage=&page=` | List/filter candidates |
| POST | `/candidates` | Add new candidate |
| PATCH | `/candidates/:id` | Update candidate stage |
| GET | `/candidates/:id/timeline` | Fetch candidate timeline |
| GET | `/assessments/:jobId` | Get assessment for job |
| PUT | `/assessments/:jobId` | Save/update assessment |
| POST | `/assessments/:jobId/submit` | Submit candidate response |

### Local Persistence

IndexedDB via Dexie.js stores:
- jobs
- candidates
- assessments
- responses

On refresh, state is restored automatically from IndexedDB.

---

##  Seeding

At initialization:
- **25 Jobs** (active + archived)
- **1000 Candidates**, distributed across stages
- **3 Assessments** (10+ questions each)
- **Latency**: 200–1200ms per request
- **Error rate**: 5–10% on write endpoints

---

##  Installation & Setup

### 1️ Clone the repository
```
git clone https://github.com/<your-username>/talentflow.git
cd talentflow
```

### 2️ Install dependencies
```
npm install
```

### 3️ Start development server
```
npm run dev
```

Visit  **http://localhost:5173**

### 4️ Build for production
```
npm run build
```

### 5️ Preview production build
```
npm run preview
```

### 6️ Lint the code
```
npm run lint
```

---

##  Deployment

You can deploy the app easily on **Vercel**, **Netlify**, or **GitHub Pages**:

```
# Example (Vercel)
npm run build
vercel deploy --prod
```

**Important:** Make sure to include `/public/mockServiceWorker.js` in your deployment so that MSW continues to intercept API calls in production preview mode.

---

##  Architecture Overview

### Architecture Principles:
- **Component-based modular structure** (separation by domain: jobs, candidates, assessments)
- **React Query** manages server-like state, caching, optimistic updates, and rollback
- **Dexie** ensures all data persists locally and syncs with MSW
- **MSW (Mock Service Worker)** intercepts API calls and simulates real REST endpoints
- **React Hook Form + Yup** handle dynamic validation and conditional rendering in assessment forms
- **React DnD (Hello-Pangea)** powers drag-and-drop for jobs and candidates
- **React Virtuoso** provides virtualization for large candidate lists

---

##  Technical Decisions

| Area | Choice | Reason |
|------|--------|--------|
| Local DB | Dexie.js | Reliable IndexedDB wrapper, async CRUD |
| API Mocking | MSW | Intercepts fetch seamlessly for a realistic network layer |
| UI Library | Tailwind + HeadlessUI | Utility-first styling with accessible primitives |
| State Management | React Query | Handles async states + caching elegantly |
| Validation | Yup + React Hook Form | Schema-based, scalable validation |
| DnD | Hello Pangea DnD | Lightweight, React 18-compatible |
| Animations | Framer Motion | For smooth Kanban transitions and modal animations |

---


##  Requirements Summary

All project dependencies are pinned for reproducibility.

### Core Dependencies
- react@18.3.1
- react-dom@18.3.1
- vite@7.1.4
- react-router-dom@6.27.0
- @tanstack/react-query@5.56.0
- dexie@4.0.4
- msw@2.6.8
- @hello-pangea/dnd@13.1.0
- tailwindcss@3.4.13
- framer-motion@8.5.0
- lucide-react@0.255.0
- react-hot-toast@3.3.0
- yup@1.7.1

---
##  License

This project is licensed under the MIT License.

---

