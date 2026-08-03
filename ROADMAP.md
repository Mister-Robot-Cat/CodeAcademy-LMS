# CodeAcademy LMS — Roadmap

Work top to bottom, one unchecked box per session. Check a box only after
build + tests pass and it's committed. See CLAUDE.md for how to run each item.

## Phase 0 — Foundation
- [ ] Solution + project scaffolding (all 5 backend projects, project refs wired,
      empty Program.cs, builds clean)
- [ ] Shared kernel: `Result<T>`, `PagedRequest`/`PagedResult<T>`, base
      `AuditableEntity`, custom exceptions
- [ ] Serilog + Swagger + global exception middleware wired into API
- [ ] PostgreSQL connection + EF Core DbContext (empty), initial migration
- [ ] Docker Compose for local Postgres + Redis

## Phase 1 — Identity & Auth
- [ ] ASP.NET Identity setup with custom `User` entity + roles
      (SuperAdmin, Admin, Teacher, Student, Parent, Curator, Accountant)
- [ ] Register / Login / JWT issuance / refresh token flow
- [ ] Email confirmation + password reset (email service interface + dev
      implementation)
- [ ] Role-based + permission-based authorization policies
- [ ] Rate limiting + CORS configuration

## Phase 2 — Core Academic Domain
- [ ] Course, Group, Enrollment entities + CRUD (Admin/Curator)
- [ ] Teacher, Student, Parent profile entities linked to User + CRUD
- [ ] Classroom, Schedule entities + CRUD

## Phase 3 — Teaching Workflow
- [ ] Lesson entity + CRUD, linked to Group/Schedule
- [ ] Attendance tracking (per lesson, per student)
- [ ] Homework + HomeworkSubmission (with file upload)
- [ ] Grades

## Phase 4 — Communication & Money
- [ ] Messaging (user-to-user)
- [ ] Notifications (in-app + email via Hangfire background job)
- [ ] Announcements
- [ ] Payments + Invoices (manual/recorded, no live payment gateway yet)

## Phase 5 — Cross-cutting
- [ ] AuditLogs (write-side interceptor, read-side query)
- [ ] File storage abstraction (local dev + interface for cloud later)
- [ ] Global search endpoint
- [ ] Reports/statistics endpoints (attendance %, grades trend, payment status)

## Phase 6 — Frontend
- [ ] Next.js scaffold, Tailwind, shadcn/ui, auth pages (login/register/reset)
- [ ] Layout shell + role-based routing/guards
- [ ] Student dashboard
- [ ] Teacher dashboard
- [ ] Admin / Super Admin dashboard
- [ ] Remaining CRUD screens (courses, groups, schedule, homework, payments)

## Phase 7 — Hardening & Docs
- [ ] Integration test suite pass over all controllers
- [ ] README, deployment guide, developer guide
- [ ] Mermaid architecture diagram + ER diagram
- [ ] API versioning pass, OpenAPI cleanup

## Phase 8 — AI extension points (architecture only, no providers)
- [ ] Interfaces in Application for: HomeworkEvaluator, PerformanceAnalyzer,
      AttendancePredictor, QuizGenerator, RecommendationEngine, TeacherAssistant
- [ ] No-op/stub implementations registered in DI, feature-flagged off
