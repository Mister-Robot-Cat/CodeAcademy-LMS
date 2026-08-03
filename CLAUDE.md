# CodeAcademy LMS — Project Rules

## What this is
Enterprise Learning Management System for a private programming academy.
Roles: Super Admin, Admin, Teacher, Student, Parent, Curator, Accountant.

## Golden rule: incremental delivery
This is a large project running on a metered plan. Never attempt more than
one item from ROADMAP.md per session. At the start of every session:
1. Read `ROADMAP.md`.
2. Announce which single unchecked item you're doing next and stop for my "go".
3. When done: run the build/tests, check the box in ROADMAP.md, commit, and stop.

Never generate the whole system in one pass, even if asked to "just build it all."
If a request implies multiple roadmap items, do the first one and ask before continuing.

## Tech stack
Backend: ASP.NET Core 10 Web API, C#, EF Core, PostgreSQL, ASP.NET Identity,
JWT + refresh tokens, MediatR (CQRS), FluentValidation, AutoMapper, Serilog,
Swagger, Redis, Hangfire.
Frontend: Next.js, TypeScript, Tailwind, React Query, Axios, shadcn/ui.
Architecture: Clean Architecture — Domain / Application / Infrastructure /
Persistence / API / Shared.

## Solution layout
```
/src
  CodeAcademy.Domain          # entities, enums, no dependencies
  CodeAcademy.Application     # CQRS handlers, DTOs, validators, interfaces
  CodeAcademy.Infrastructure  # external services (email, storage, jobs)
  CodeAcademy.Persistence     # EF Core, repositories, migrations
  CodeAcademy.API             # controllers, middleware, DI wiring
  CodeAcademy.Shared          # cross-cutting: Result<T>, exceptions
/tests
  CodeAcademy.UnitTests
  CodeAcademy.IntegrationTests
/frontend                     # Next.js app
/docs
```

## Conventions
- No business logic in controllers — controllers call MediatR, nothing else.
- All write operations return `Result<T>` (Shared), never throw for expected
  business failures. Reserve exceptions for truly unexpected states.
- Every entity: `Id (Guid)`, `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`,
  `IsDeleted` (soft delete, global query filter), `RowVersion` (concurrency
  token) on entities that support concurrent edits.
- Repository + Unit of Work only where they add value over EF Core directly
  (don't wrap DbSet in a pointless pass-through repo).
- All list endpoints support pagination, filtering, sorting — use a shared
  `PagedRequest` / `PagedResult<T>` in Shared, don't reinvent per endpoint.
- FluentValidation validators live next to their MediatR command/query.
- One migration per roadmap item, named after the item (not "update1").

## Commands
```
dotnet build                         # from /src
dotnet test                          # from /tests
dotnet ef migrations add <Name> -p CodeAcademy.Persistence -s CodeAcademy.API
dotnet ef database update -p CodeAcademy.Persistence -s CodeAcademy.API
npm run dev                          # from /frontend
npm run build                        # from /frontend
```

## Definition of done (every roadmap item)
- Compiles clean (`dotnet build` / `npm run build`), no warnings introduced.
- Migration created and applied where schema changed.
- Unit tests for new handlers/validators; integration test for new endpoints.
- Swagger reflects the new endpoints correctly.
- ROADMAP.md checkbox ticked, one git commit with a clear message.

## Out of scope until explicitly requested
AI features (homework evaluation, performance analysis, quiz generation, etc.)
are architecture-only for now: define interfaces/extension points in
Application, do not implement providers. Don't build these unless the
roadmap item explicitly says so.
