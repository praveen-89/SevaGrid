# SevaGrid Backend Documentation

## 1. Project Purpose
SevaGrid is an NGO coordination platform operating across a Node.js + Supabase stack. This backend serves as the orchestration layer enabling Field Staff to report issues, Administrators to allocate volunteers, and Volunteers to complete tasks and submit transparent cryptographic proofs.

## 2. Backend Architecture
The backend is a strictly typed Node.js/Express monolith leveraging the Controller-Service-Repository pattern. It utilizes Zod for inbound HTTP payload validation and Supabase as the underlying Postgres instance and Authentication provider. 

## 3. Folder Structure Explanation
- `src/app.ts`: Express application bootstrap and global middleware initialization.
- `src/server.ts`: HTTP listener and port binding.
- `src/config/`: Environment schemas and Supabase client intialization.
- `src/routes/`: Express routers isolating domains (Auth, Cases, Volunteers, Analytics).
- `src/controllers/`: Route handlers formatting HTTP requests and executing standard API responses.
- `src/services/`: Core business logic (Workflow validations, assignment validations).
- `src/repositories/`: Classes wrapping Supabase client queries.
- `src/middleware/`: Verification layers (AuthGuard, RoleGuard, ErrorHandler).

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
- **Volunteer Statuses**: AVAILABLE, BUSY, OFFLINE.

## 7. Auth Flow
1. The Next.js frontend authenticates a user directly with Supabase via `@supabase/ssr`.
2. The frontend attaches the active `Bearer {token}` to backend headers.
3. Express `authMiddleware` utilizes `jsonwebtoken` or `@supabase/supabase-js` `getUser()` to verify the token signature.
4. If valid, the user's `profile` is attached to `req.user`.

## 8. Role Permissions
The `roleMiddleware` wraps route handlers:
- `requireRole('ADMIN')` stops non-admins.
- `requireRole(['ADMIN', 'FIELD_STAFF'])` provides horizontal access control.

## 9. API Endpoint List

**Auth/Users**
- `GET /api/auth/me`
- `GET /api/users/:id`

**Cases**
- `GET /api/cases`
- `GET /api/cases/:id`
- `POST /api/cases`
- `PATCH /api/cases/:id`
- `PATCH /api/cases/:id/status`
- `GET /api/cases/:id/history`
- `POST /api/cases/:id/attachments`

**Assignments**
- `POST /api/cases/:id/assign`
- `POST /api/cases/:id/reassign`
- `POST /api/cases/:id/accept`
- `POST /api/cases/:id/reject`
- `POST /api/cases/:id/start`
- `POST /api/cases/:id/submit-proof`
- `POST /api/cases/:id/verify-proof`
- `POST /api/cases/:id/reject-proof`
- `POST /api/cases/:id/escalate`
- `POST /api/cases/:id/fail`

**Volunteers**
- `GET /api/volunteers`
- `GET /api/volunteers/:id`
- `GET /api/volunteers/recommended?caseId=...`

**Analytics**
- `GET /api/analytics/overview`

## 10. Workflow / Transition Rules
Enforced entirely by `CaseService.ts`. Attempts to jump from `SUBMITTED` directly to `COMPLETED` will throw a 400 Bad Request error. Every state mutation writes to `case_history` automatically within the same logical transaction.

## 11. File Upload / Storage Design
Files are uploaded from the client directly to Supabase Storage (bypassing the Node server for bandwidth efficiency), or passed to the Node server. We utilize Supabase Storage buckets: `intake` and `proof`. A subsequent request is made to `POST /api/cases/:id/attachments` containing the `file_url`, binding the Storage asset to the Postgres Row.

## 12. Volunteer Recommendation Logic
Generated via `GET /api/volunteers/recommended`.
Scoring pseudo-logic:
- +3 points for available status.
- +1 point per matching specialty.
- + (Rating * 0.5) baseline additive.
Volunteers are returned strictly sorted by highest viability rating.

## 13. Setup Instructions
- Run `npm install`.
- Configure `.env`.

## 14. Local Development Instructions
Execute `npm run dev` to boot `ts-node-dev` on `localhost:8000`.

## 15. How Frontend Integrates
Replace `mock-service.ts` references with wrapper functions firing `axios` or `fetch` against `http://localhost:8000/api/...`. Attach Supabase JWTs manually into authorization headers.

## 16. Future Improvements
- Migration generation tool sets.
- Caching analytics payload via Redis.
- Pagination layers utilizing cursors on Case lists.
