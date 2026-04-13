# SevaGrid Backend Documentation

## 1. Project Purpose
SevaGrid is an NGO coordination platform operating across a Node.js + Supabase stack. This backend serves as the orchestration layer enabling Field Staff to report issues, Administrators to allocate volunteers, and Volunteers to complete tasks and submit transparent cryptographic proofs.

## 2. Backend Architecture
The backend is a strictly typed Node.js/Express monolith leveraging the Controller-Service-Repository pattern. It utilizes Zod for inbound HTTP payload validation and Supabase as the underlying Postgres instance and Authentication provider.

## 3. Folder Structure Explanation
- `src/app.ts`: Express application bootstrap and global middleware initialization.
- `src/server.ts`: HTTP listener and port binding.
- `src/config/`: Environment schemas and Supabase client initialization.
- `src/routes/`: Express routers isolating domains (Auth, Cases, Volunteers, Analytics).
- `src/controllers/`: Route handlers formatting HTTP requests and executing standard API responses.
- `src/services/`: Core business logic (Workflow validations, assigning, recommending).
- `src/middleware/`: Verification layers (AuthGuard, RoleGuard, ErrorHandler).
- `src/validators/`: Input validation mechanisms intercepting malformed payloads before Logic execution.

## 4. Environment Variables
Stored securely via `.env`:
- `PORT`
- `NODE_ENV`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET` (For verifying tokens directly inside middleware).

## 5. Database Schema Overview
The relational structure incorporates:
- **profiles**: Extended Auth object storing `UserRole`.
- **volunteer_profiles & volunteer_specialties**: Granular scoring and skill vectors for matching.
- **cases**: The core logic entity.
- **case_history**: Immutable timeline logs generated per status change.
- **proof_submissions & case_attachments**: Verification artifacts.
- **assignments**: Volunteer interaction tracking.

## 6. Enums and Statuses
- **Roles**: ADMIN, FIELD_STAFF, VOLUNTEER
- **Case Statuses**: DRAFT, SUBMITTED, UNDER_REVIEW, READY_FOR_ASSIGNMENT, ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED_PENDING_VERIFICATION, COMPLETED, FAILED, ESCALATED.
- **Assignment Statuses**: ASSIGNED, ACCEPTED, REJECTED, CANCELLED, COMPLETED.
- **Volunteer Statuses**: AVAILABLE, BUSY, OFFLINE.

## 7. Auth Flow
1. The Next.js frontend authenticates a user directly with Supabase via `@supabase/ssr`.
2. The frontend attaches the active `Bearer {token}` to backend headers.
3. Express `authMiddleware` utilizes `jsonwebtoken` or `@supabase/supabase-js` `getUser()` to verify the token signature.
4. If valid, the user's `profile` is attached to `req.user`.

## 8. Role Permissions
The `roleMiddleware` wraps route handlers:
- `requireRole(UserRole.ADMIN)` stops non-admins.
- `requireRole([UserRole.ADMIN, UserRole.FIELD_STAFF])` provides horizontal access control.

## 9. API Endpoint List

**Auth/Users**
- *Federated by Supabase client in Frontend. Profile queries map dynamically as needed.*

**Cases**
- `GET /api/cases`
- `GET /api/cases/:id`
- `POST /api/cases` (Field Staff creates case)
- `GET /api/cases/:id/history`

**Case Lifecycle Actions (Volunteers)**
- `POST /api/cases/:id/accept` (Volunteer accepts assignment)
- `POST /api/cases/:id/reject` (Volunteer rejects assignment)
- `POST /api/cases/:id/start` (Moves case to IN_PROGRESS)
- `POST /api/cases/:id/submit-proof` (Writes to proof_submissions, moves to COMPLETED_PENDING_VERIFICATION)

**Case Lifecycle Actions (Admins)**
- `POST /api/cases/:id/assign` (Assigns volunteer)
- `POST /api/cases/:id/reassign` (Reassigns volunteer, overriding current)
- `POST /api/cases/:id/verify-proof` (Closes case to COMPLETED)
- `POST /api/cases/:id/reject-proof` (Reverts case to IN_PROGRESS)
- `POST /api/cases/:id/escalate` (Moves case to ESCALATED)
- `POST /api/cases/:id/fail` (Marks case as FAILED)

**Volunteers**
- `GET /api/volunteers`
- `GET /api/volunteers/recommended?caseId=...`

**Analytics** (Admin Only)
- `GET /api/analytics/overview`
- `GET /api/analytics/cases-by-status`
- `GET /api/analytics/cases-by-category`
- `GET /api/analytics/weekly-trend`

## 10. Workflow / Transition Rules
Enforced entirely natively by `CaseService.ts`. Attempts to jump from `SUBMITTED` directly to `COMPLETED` will throw a logical error. Furthermore, resource constraints block Volunteers from modifying parameters of cases that do not map to their specific Profile id mapping. Every state mutation writes to `case_history` automatically within the same logical transaction.

## 11. File Upload / Storage Design
Files are uploaded from the client directly to Supabase Storage (bypassing the Node server for bandwidth efficiency). We utilize Supabase Storage buckets: `intake` and `proof`. A subsequent request is made to the backend to generate the `case_attachments` Postgres Row.

## 12. Volunteer Recommendation Logic
Generated via `GET /api/volunteers/recommended`.
Scoring logic executes natively iterating dynamically loaded variables:
- `+3 points` for available status.
- `+X points` mapping normalized rating metrics directly.
- `+2 points` intersecting Case 'Category' with Volunteer 'Specialties'.
- `-2 points` mapping high active workload penalties.

## 13. Setup Instructions
- Run `npm install`.
- Configure `.env` mapping your Supabase instances correctly.

## 14. Local Development Instructions
Execute `npm run dev` to boot `ts-node-dev` on `localhost:8000`.

## 15. How Frontend Integrates
Replace `mock-service.ts` references with wrapper functions querying against `http://localhost:8000/api/...`. Attach Supabase JWTs manually into `Authorization: Bearer <token>` headers.

## 16. Future Improvements
- Caching analytics payload calculations via Redis cache layers.
- Cursor based paginations on primary Cases index loads.
- Native PostgreSQL triggers intercepting history mapping, relieving Node.js workloads.
