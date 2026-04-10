# SevaGrid Documentation (Phase 1 Frontend MVP)

SevaGrid is a web-first NGO coordination platform designed to streamline community service delivery. This documentation covers the **Frontend-Only MVP**, which serves as a high-fidelity prototype with fully functional flows using mock data and local persistence.

## 1. Project Overview
The goal of Phase 1 is to create a production-ready user experience that demonstrates the end-to-end lifecycle of a community service case:
- **Intake**: Reporting a need from the field.
- **Coordination**: Administrative review and assignment.
- **Action**: Volunteer execution and proof submission.
- **Verification**: Administrative verification and case closure.

## 2. User Roles & Journeys

### Admin Portal (`/admin`)
- **Primary Goal**: Oversee all operations, manage the case queue, and verify results.
- **Key Features**: Analytics dashboard, case filtering, volunteer assignment, and proof verification.
- **Workflow**: Receives new cases → Prioritizes → Assigns Volunteer → Verifies Completion.

### Field Staff Portal (`/fieldstaff`)
- **Primary Goal**: Rapid and structured data intake from the community.
- **Key Features**: Multi-step intake form, submission history, and draft management.
- **Workflow**: Identifies need → Completes 5-step form (with GPS/Photo simulation) → Submits once verified.

### Volunteer Portal (`/volunteer`)
- **Primary Goal**: Execute tasks and provide proof of impact.
- **Key Features**: Task management, in-progress tracking, and proof submission flow.
- **Workflow**: Views assigned tasks → Accepts → Marks In-Progress → Submits Notes/Photo proof.

## 3. Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui (Radix UI based)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/Auth**: React Context + Mock Service Layer
- **Animations**: Framer Motion / Tailwind Animate

## 4. Frontend Architecture & Folder Structure

```text
/app
  ├── (auth)/             # Authentication routes (Login, Signup)
  ├── admin/              # Admin-specific portal routes
  ├── fieldstaff/         # Field Staff portal routes
  ├── volunteer/          # Volunteer portal routes
  ├── demo-select/        # Role selection entry point
  └── page.tsx            # High-trust landing page
/components
  ├── shared/             # Reusable UI across all portals (Badges, Shells)
  ├── ui/                 # shadcn/ui core components
  └── [portal]/           # Portal-specific components
/context
  ├── AuthContext.tsx     # Mock authentication and session state
/lib
  ├── types.ts            # Global TypeScript interfaces
  ├── mock-service.ts     # Data access layer with localStorage persistence
  ├── mock-data.ts        # Seed data for demo purposes
  └── navigation.ts       # Portal-specific sidebar configurations
```

## 5. Mock Data & Service Strategy
Since this is a frontend MVP, the project uses a **Simulated Service Layer** (`mock-service.ts`):
- **Data Model**: Strictly typed interfaces for `Case`, `User`, `Volunteer`, and `Analytics`.
- **Persistence**: Uses `localStorage` to persist status changes, assignments, and new cases across browser refreshes.
- **Network Simulation**: Artificial delays (e.g., 800ms) are added to service calls to demonstrate loading states and skeletons.
- **Seeding**: Initial data is automatically seeded on the first load from `mock-data.ts`.

## 6. Case Status Flow
The platform follows a deterministic status state machine:
1. `DRAFT` (Field Staff only)
2. `SUBMITTED` (Pending Admin review)
3. `READY_FOR_ASSIGNMENT` (Approved by Admin)
4. `ASSIGNED` (Volunteer assigned but hasn't accepted)
5. `ACCEPTED` (Volunteer committed to work)
6. `IN_PROGRESS` (Active work on the field)
7. `COMPLETED_PENDING_VERIFICATION` (Proof submitted by Volunteer)
8. `COMPLETED` (Verified and closed by Admin)

## 7. Phase 2 Backend Integration Plan
To transition to a real backend:
1. **API Integration**: Replace `lib/mock-service.ts` with a real API client (e.g., using TanStack Query or Server Actions).
2. **Authentication**: Swap the `AuthContext` logic with a real provider like NextAuth.js or Supabase Auth.
3. **Database**: Implement a relational database (PostgreSQL recommended) to handle complex relationships between Cases and Volunteers.
4. **Real-time**: Use WebSockets (Pusher/Supabase) for real-time notifications when a case is assigned or completed.

## 8. Setup & Development
1. **Initialize**: `npm install`
2. **Run**: `npm run dev`
3. **Access**: Open `http://localhost:3000` and start with the "Live Demo" button on the landing page.
