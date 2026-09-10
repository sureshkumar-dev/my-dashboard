# CareerHub — Production-Ready Personal Job & Career Management Dashboard

A client-side personal Job Search & Career Management Dashboard designed with a **premium pink / rose aesthetic** (soft blush, rose accents, elegant cards, crisp typography, and responsive controls).

Built specifically for managing full-lifecycle job hunting, technical interview preparations (customized for Full Stack MERN engineers), checklists, daily routines, MNC tracking, and analytics.

---

## 🌟 Key Capabilities & Sections

### 1. 🏠 Command Center (Dashboard Home)
* **High-Level Metrics**: Total Applications, Interview Calls, Upcoming Rounds, Offers, Rejected, and Waiting.
* **Today's Focus**: Active day checklist tasks (with instant checkoff), today's interviews, and urgent pending recruiter follow-ups.
* **Recent Applications**: Compact 4-column overview (Company, Role, Status, Location).
* **Upcoming Interviews**: Next rounds, dates/times, and interview stage badges.
* **Quick Action Trigger**: Direct entry for adding applications, scheduling interviews, building checklists, tracking target MNCs, and creating goals.

### 2. 💼 Role-Wise Job Applications
* **Role-Wise Organization**: Applications are categorized under expandable and collapsible role accordions (e.g., *Full Stack Developer*, *React Developer*, *Node.js Developer*).
* **Dynamic Roles**: Create custom roles with `+ Add Role`.
* **Minimal First View**: Displays strictly **Company Name**, **Status** (color-coded badge), and **Location**.
* **Comprehensive Details Modal**:
  * Fields: Company, Job Title, Role, Location, Work Mode (Remote/Hybrid/On-site), Applied Date, Applied Through (LinkedIn, Naukri, Indeed, Company Website, Referral, Recruiter, Other), Job URL, Status, Interview Date & Stage, Recruiter Details (Name, Phone/Email, LinkedIn URL), Salary/Package, Priority, Next Action, Follow-up Date, Notes.
  * Instant status updating directly saves to persistent storage.
  * Delete application with safe confirmation.

### 3. 🎤 Interviews Management
* **Dedicated Section**: Separated into *Upcoming Rounds*, *Past & Feedback*, and *All Interviews*.
* **Minimal First View**: `Company | Role | Date & Time | Stage | Result`.
* **Full Feedback & Prep Tracker**:
  * Records Meeting Link, Interviewer, Recruiter, Preparation Status, Questions Asked, My Answers/Solutions, Mistakes & Areas to Improve, and Interviewer Feedback.

### 4. ☑️ Checklists & Custom Day Checklists
* **Dedicated Checklists**: First view displays name, category, progress percentage (e.g. `7 / 10 Completed = 70%`), and target due date.
* **Checklist Items**: Check/uncheck tasks, reorder, edit, set priorities (High, Medium, Low), and store notes.
* **Curated Built-In Templates**:
  * *Interview Preparation* (Company research, JD review, elevator pitch, STAR stories, setup checks).
  * *Technical Interview (MERN)* (JS, TS, React, Node.js, Express, REST APIs, JWT, MongoDB, MySQL, Redis, BullMQ, system design, and project deep dives).
  * *HR & Cultural Fit*.
  * *Before Applying Checklist*.
  * Custom user-defined templates.
* **Custom Day Checklists**:
  * Plan specific dates (e.g., *BE Engineer Interview Day*).
  * Supports recurrence: *One-time*, *Daily*, *Weekdays*, *Weekly*, *Custom*.
  * Today's tasks automatically surface on the Dashboard home page for easy completion.

### 5. 📊 Automated Analytics & Statistics
* **100% Automated Calculation**: No manual stat entry needed.
* **Time Filters**: All Time, This Month, This Week, Today.
* **Conversion Funnel**:
  * Application → Interview Call (%)
  * Interview Call → Interview Round (%)
  * Interview Round → Offer (%)
* **Role-Wise Performance Table**: Compare volume, calls, interviews, and offers per role.
* **Job Portal Analysis**: Response rates across LinkedIn, Naukri, Indeed, Referrals, etc.
* **Status Distribution**: Real-time breakdown of pipeline stages.

### 6. 🏢 MNC / Target Companies
* **Completely Independent Section**: Uncoupled from standard job applications for tracking long-term dream target employers (e.g. Microsoft, Amazon, Google, Oracle, Accenture).
* **First View**: `Company | Locations (multiple) | Status`.
* **Modal Fields**: Company Name, Locations, Careers URL, Website, Target Roles, Priority, Status, Notes.

### 7. 🎯 Career Goals
* Set milestones (e.g., *Apply to 10 jobs this week*, *Complete 5 mock interviews*, *Finish Node.js & Redis revision*).
* Visual progress bars with fast `+1` / `-1` increment buttons and completion detection.

### 8. ⚙️ Settings & Persistent Data Management
* **Centralized Storage Architecture**: Powered by browser `localStorage` (`job_dashboard_data_v1`) with versioning and validation.
* **Export JSON Backup**: Download a timestamped snapshot of all dashboard data.
* **Import JSON Backup**: Safely validate uploaded files with option to *Replace* or *Merge*.
* **Storage Reset / Wipe**: Erase data with required confirmation safeguard (`CONFIRM`).
* **Resume Profile Summary**: Contextual overview of user skills (MERN stack) and featured projects (*FarmGuard*, *Cartify*, *Vendr*, *Smart Exam Proctoring*).

---

## 🛠️ Tech Stack

* **Framework**: React 18 + Vite + TypeScript
* **Styling**: Tailwind CSS (Custom modern pink palette: rose, blush, clean neutrals)
* **Icons**: Lucide React
* **State & Persistence**: Centralized React Context (`DashboardContext`) + Versioned `localStorage`

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Type check & build production bundle
npm run build

# 4. Preview production build
npm run preview
```

---

## 📦 Production Deployment

The project builds to static files in the `/dist` directory. It can be hosted immediately on:
* **Vercel** / **Netlify** / **GitHub Pages** / **Render** / **Cloudflare Pages**.
* No server-side runtime or external database required.
