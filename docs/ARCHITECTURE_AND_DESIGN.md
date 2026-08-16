# BuildGuard Architecture & Design Document

## System Architecture Overview
BuildGuard is designed as an automated material shortage detection and cross-project inventory transfer engine for multi-site construction management.

### Key Components
- **Frontend Dashboard:** Next.js 15 App Router interface allowing site engineers to submit material requests and view automated transfer recommendations.
- **Rule Engine API:** Serverless Next.js API routes evaluating inventory levels, site allocations, and surplus availability across active projects.
- **Data Layer:** Prisma ORM connected to SQLite for local transaction tracking and audit logging.
- **Automated Validation:** Strict guardrails preventing negative quantities and invalid requests.