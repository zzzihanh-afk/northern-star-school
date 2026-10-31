# Northern Star School & College
## Complete SaaS-Standard School & College Management Platform

> **Institution:** Northern Star School & College  
> **Brand Tagline:** Learn • Grow • Achieve  
> **Country:** Bangladesh | **Currency:** Bangladeshi Taka (BDT / ৳)  
> **Languages:** Dual Language Switcher (English & বাংলা)  
> **Database:** Cloud Firestore (Spark plan optimized) & Firebase Authentication  
> **Deployment Target:** Firebase Hosting  

---

## 1. Project Overview & Architecture

Northern Star School & College is an institutional SaaS-grade management platform built with React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, and Cloud Firestore.

The platform provides:
1. **Public Institutional Portal:** Responsive website showcasing academic offerings, facilities, principal's message, verified institutional metrics, official notices, events, and an interactive online admissions enquiry form.
2. **Administrator Control Center:** Replicating the provided reference image layout with 4 stat cards (Total Students: 1,248, Total Teachers: 86, Total Classes: 42, Total Staff: 28), student enrollment line charts, quick action buttons, recent activities feed, and upcoming events.
3. **Student Portal:** Inspired by the reference design with the "Dream Big Achieve More" hero banner, roll and class cards, 92% attendance tracker, next examination countdown, daily routine schedule, and quick links to assignments, results, fees, and library.
4. **Parent / Guardian Portal:** Supporting multi-child switching (Samiul Rahman in Class 7 Science and Ayesha Rahman in Class 10 Arts), circular radial attendance gauge (94%), recent exam results by subject, and fee status with the "No Pending Dues" verified banner.
5. **Teacher Workspace:** Period schedules, class rosters, attendance entry, and examination marks grading.
6. **Academic & Examination Engine:** Conforming to the National Curriculum of Bangladesh GPA 5.0 scale (A+, A, A-, B, C, D, F) with printable official student report cards.
7. **Fee Management & Collections:** BDT currency formatting, manual cash & mobile financial services (bKash/Nagad) recording, and printable money receipt vouchers with unique identifiers (e.g. `NSC-2025-0012`).

---

## 2. Quick Start & Local Development

### Prerequisites
- Node.js v18+ (tested on v26.13.0)
- npm v9+

### Setup Commands
```bash
# 1. Clone or navigate to project directory
cd "e:\Tanzimul Hoq Zihan\School website"

# 2. Copy environment configuration
copy .env.example .env

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Run automated test suite
npm test

# 6. Build for production
npm run build
```

---

## 3. Brand Identity & Design System

- **Colors:**
  - Deep Navy Sidebar: `#061B3A`
  - Header & Brand Navy: `#082B57`
  - Royal Blue Accents & Buttons: `#1769E8`
  - Star Gold: `#F4B323`
  - Page Background: `#F4F7FC`
  - Surface White: `#FFFFFF`
  - Status Indicators: Success (`#16A878`), Amber (`#F59E0B`), Danger (`#E5484D`), Violet (`#8B5CF6`)
- **Emblem:** Scalable vector SVG (`public/logo-star.svg` & `src/components/brand/Logo.tsx`) combining the 4-point North Star, open book foundation, top-right gold accent star, and Cinzel serif display typography.

---

## 4. Role-Based Access Control (RBAC) & Accounts

The platform includes a built-in role switcher in the dashboard header for testing all roles:

| Role | Default Demo Account | Responsibilities & Access |
|---|---|---|
| `institution_admin` | `admin@northernstar.edu.bd` | Full access to academic structure, records, attendance, finance, and settings |
| `principal` | `principal@northernstar.edu.bd` | Academic oversight, approval of exam results, and notice publishing |
| `teacher` | `farhana.akhter@northernstar.edu.bd` | Class routines, daily attendance marking, and marks entry |
| `student` | `rafiq.hasan@student.northernstar.edu.bd` | Self profile, daily routine, exam results, and personal notices |
| `guardian` | `s.rahman@example.com` | Multi-child switcher (Samiul & Ayesha), attendance gauge, fee dues |
| `accountant` | `accounts@northernstar.edu.bd` | Fee structure, fee collection vouchers, and payment records |

---

## 5. Firebase Configuration & Deployment to Spark Plan

### 1. Enable Firebase Services
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g. `northern-star-school`).
2. Enable **Firebase Authentication** (Email/Password provider).
3. Enable **Cloud Firestore** in Production mode.
4. Enable **Firebase Hosting**.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=northern-star-school.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=northern-star-school
VITE_FIREBASE_STORAGE_BUCKET=northern-star-school.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Deploy Security Rules and Hosting
```bash
# Deploy Firestore rules and indexes
npx firebase-tools deploy --only firestore

# Deploy web app to Firebase Hosting
npm run build
npx firebase-tools deploy --only hosting
```

---

## 6. Firestore Security Rules Summary

Defined in `firestore.rules`:
- **Unauthenticated / Anonymous:** Read-only for public notices and events; create-only for admission enquiries with strict field validation.
- **Students:** Can only read their own profile, published results, and charges; no write access.
- **Guardians:** Can only read records for student IDs explicitly present in their verified `linkedStudentIds` metadata array.
- **Teachers:** Read/write permissions restricted to attendance and examination marks.
- **Administrators:** Authorized to modify academic structures, user accounts, and financial records.
- **Audit Logs:** Immutable create-only records.

---

## 7. Automated Testing Results

The test suite (`npm test`) runs on Vitest:
- `tests/grading.test.ts`: Verifies Bangladesh GPA 5.0 scale calculations, optional 4th subject handling, and pass/fail boundaries.
- `tests/dataService.test.ts`: Verifies institutional metric aggregations, student directory filtering, sequential voucher generation (`NSC-2025-XXXX`), and admission enquiry submissions.
- `tests/Logo.test.tsx`: Verifies brand logo variants, typography, and subtitle rendering.

---

## 8. Feature Status Checklist

- [x] Northern Star School & College brand identity & SVG assets
- [x] Dual language switcher (English & বাংলা) with Bengali digit conversion
- [x] Admin Dashboard matching reference image (Cards, Enrollment Chart, Activities, Events, Quick Actions)
- [x] Student Dashboard matching reference image ("Dream Big" banner, stats, routine, notices, quick links)
- [x] Parent Dashboard matching reference image (Child switcher, 94% radial gauge, exam results, fee checkmark)
- [x] Teacher Workspace (Assigned classes, today's schedule, attendance & marks actions)
- [x] Student Information Management (Search, division filtering, CSV export, student profile modal)
- [x] Academic Structure (School vs College divisions, classes, sections, subjects)
- [x] Attendance Management (Daily class roster, Present/Absent/Late/Excused, instant analytics)
- [x] Examinations & Results (GPA 5.0 scale, marks entry sheet, official printable report card)
- [x] Fees & Financial Management (BDT currency, cash/bKash/Nagad collection, printable money vouchers)
- [x] Public Website (Home, About, School Division, College Division, Facilities, Notices, Contact, Admissions enquiry)
- [x] Firebase Config, Auth service, and strict Firestore Security Rules
- [x] Production build verification and automated tests
