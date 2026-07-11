# Placement_management_system

A full-stack MERN web app that automates college placement management — student profiles,
eligibility checks, recruitment drives, and round-by-round application tracking, with
JWT-based role access for students, admins, and recruiters.

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application that digitizes
the college placement process — replacing spreadsheets and email threads with structured
student data, automated eligibility checks, and round-by-round tracking of every recruitment
drive.

---

## Problem it solves

Traditional college placement cells manage everything manually: eligibility is checked by
eyeballing spreadsheets, students find out about drives via WhatsApp, and nobody has a single
place to see who cleared which round. This system automates that workflow end-to-end.

## Core features

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure signup/login with role-based access — Student, Placement Admin (TPO), Recruiter |
| **Structured student data** | Roll no., branch, CGPA, 10th/12th %, backlogs, skills, placement status |
| **Eligibility engine** | Every drive defines its own criteria (min CGPA, max backlogs, allowed branches, batch); the API auto-checks and enforces this — a student physically cannot apply if ineligible |
| **Drive management** | Admins/recruiters create drives with custom multi-round pipelines (e.g. Aptitude → Technical → HR) |
| **Application tracking** | Students see a live pipeline view of their application; recruiters move candidates round-by-round with one click |
| **Role-based dashboards** | Students see their applications/offers; admins/recruiters see drive and placement statistics |

## Tech stack

- **Frontend:** React 18 (Vite), React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

## Architecture

```
placement-management-system/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Drive, Application (Mongoose schemas)
│   ├── middleware/auth.js        # JWT verification + role-based authorization
│   ├── controllers/              # Business logic (auth, students, drives, applications)
│   ├── routes/                   # Express route definitions
│   ├── seed/seedData.js          # Demo data seeder
│   └── server.js                 # App entry point
└── frontend/
    └── src/
        ├── context/AuthContext.jsx   # Global auth state
        ├── services/api.js           # Axios instance + JWT interceptor
        ├── components/               # Navbar, RoundPipeline, DriveCard, StatCard, PrivateRoute
        └── pages/                    # Login, Register, Dashboard, Drives, DriveDetails,
                                       # Applications, Students, Profile
```

### Data model relationships

- **User** — one document handles all three roles (`student` / `admin` / `recruiter`) via a
  discriminated `role` field, with nested `studentProfile` / `recruiterProfile` sub-documents.
- **Drive** — a recruitment drive owned by an admin/recruiter, with an `eligibility` object and
  an ordered array of `rounds`.
- **Application** — links a `student` to a `drive`, with a `roundResults` array that mirrors the
  drive's rounds and tracks `pending / cleared / rejected` per round. A compound unique index on
  `(student, drive)` prevents duplicate applications at the database level.

## Getting started

### Prerequisites
- Node.js v18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed               # populates demo admin, recruiter, students & drives
npm run dev                 # starts API on http://localhost:5000
```

### 2. Frontend setup
```bash
cd frontend
npm install
npm run dev                 # starts app on http://localhost:5173
```

### 3. Log in with seeded demo accounts
| Role | Email | Password |
|---|---|---|
| Admin (TPO) | admin@college.edu | admin123 |
| Recruiter | recruiter@techcorp.com | recruiter123 |
| Student (eligible for TechCorp drive) | aarav@college.edu | student123 |
| Student (not eligible — fewer branches match) | rohan@college.edu | student123 |

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Get JWT |
| GET | `/api/auth/me` | Private | Current user |
| PUT | `/api/students/profile` | Student | Update placement profile |
| GET | `/api/students/eligibility/:driveId` | Student | Check eligibility for a drive |
| GET | `/api/students` | Admin/Recruiter | List/filter students |
| POST/GET/PUT/DELETE | `/api/drives` | Mixed | Manage recruitment drives |
| GET | `/api/drives/:id/applicants` | Admin/Recruiter | View applicants + progress |
| POST | `/api/applications` | Student | Apply (server re-checks eligibility) |
| GET | `/api/applications/my` | Student | My applications |
| PUT | `/api/applications/:id/round` | Admin/Recruiter | Advance/reject a round |
| PUT | `/api/applications/:id/withdraw` | Student | Withdraw application |

---

## Talking points for your placement interview

Since this project is likely to come up in a technical interview, here's how to speak to it:

1. **Why MERN?** JavaScript across the stack means one language, one mental model, and JSON
   flows naturally from MongoDB → Express → React without transformation layers.
2. **Why JWT over sessions?** Stateless auth scales horizontally without server-side session
   storage — the token itself carries identity, verified on every request via middleware.
3. **Role-based access control** is enforced at two layers: route-level (`authorize()` middleware
   on the backend) and UI-level (`PrivateRoute` on the frontend) — be ready to explain *why both
   are necessary* (frontend checks are UX only; the backend is the real security boundary).
4. **Eligibility logic lives in the backend, not just the UI.** Even if someone bypasses the
   React app and hits the API directly, `applyToDrive` re-validates CGPA/backlogs/branch before
   creating an application — a good example of never trusting client-side validation alone.
5. **Schema design tradeoffs:** `roundResults` is denormalized (copied) from the drive's `rounds`
   at application time rather than referenced live. Be ready to explain why: it preserves a
   historical record even if the drive's rounds are edited later.
6. **What you'd add with more time:** email/SMS notifications on round updates, resume file
   upload (multer + S3), pagination on the student directory, and a recruiter-only company
   analytics view.

## Possible extensions (good "future work" answers)
- Resume upload & parsing
- Email notifications on shortlisting
- Analytics dashboard (placement % by branch, package trends)
- Bulk CSV import of student data for the admin
- Interview scheduling with calendar integration
