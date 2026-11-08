# Husqvarna Senior Full Stack Engineer Assessment
## Team Feature Flags & Audit Log Dashboard

A production-grade, self-contained local engineering harness and full-stack vertical slice built for the Husqvarna Senior Full Stack Engineer technical assessment.

---

## ⚡ Zero-Friction Startup

Reviewers can boot the entire stack with a single standard command:

```bash
# Option 1: Using npm (recommended)
npm run dev

# Option 2: Using Docker Compose directly
docker compose -f Docker/docker-compose.yml up --build
```

That's it! Docker Compose will automatically:
1. Boot **PostgreSQL 16** with a healthy readiness probe.
2. Boot the **Node.js Express Backend** (`http://localhost:4000`), which automatically runs **version-controlled Sequelize CLI migrations** (`npm run db:migrate`), creates composite unique constraints, and **deterministically seeds 10 realistic feature flags with corresponding immutable audit logs** (`npm run db:seed`).
3. Boot the **React + Vite Frontend** (`http://localhost:3000`).

Once booted, open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Self-Contained Verification (Testing)

Run the automated verification suite with a single command:

```bash
npm test
```

This runs:
- **Backend Integration Tests** (`backend/tests/integration/`): Tests API endpoints, PostgreSQL persistence, composite unique key constraints per environment, atomic toggle transactions, and async webhook mock delivery.
- **Frontend Component Tests** (`frontend/tests/`): Tests flag rendering, environment and status filtering, optimistic toggle switches, and audit trail updates with Vitest and React Testing Library.

Additional helper scripts:
```bash
npm run down        # Gracefully stop containers and clean up
npm run lint        # Run static code analysis across backend and frontend
npm run migrate     # Run Sequelize CLI migrations in the backend container
npm run seed        # Run Sequelize CLI seeders in the backend container
```

---

## 🏛️ Architecture & Vertical Slice

```
husqvarna-assessment/
├── GEMINI.md                      # Gemini Antigravity engineering rules & guardrails
├── package.json                   # Root harness orchestration scripts
├── Docker/                        # Centralized containerization layer
│   ├── docker-compose.yml         # Multi-service stack orchestration
│   ├── Dockerfile.backend         # Express backend container definition
│   └── Dockerfile.frontend        # Vite React frontend container definition
├── backend/                       # Node.js Express + TypeScript + Sequelize CLI API
│   ├── config/                    # Centralized environment & database configuration
│   │   ├── .env.example           # Example environment template
│   │   ├── config.js              # Sequelize CLI database environment profiles
│   │   └── env.ts                 # Validated application environment variables
│   ├── db/                        # Database management layer
│   │   ├── connection.ts          # Sequelize instance & pool configuration
│   │   ├── migrations/            # Version-controlled database schema migrations
│   │   ├── models/                # Typed Sequelize models (FeatureFlag, AuditLog, WebhookDelivery)
│   │   └── seeders/               # Deterministic sample data seeders
│   ├── src/                       # Application source code (Layered Architecture)
│   │   ├── controllers/           # HTTP Request Controllers (Flag, Audit, Webhook)
│   │   ├── services/              # Core business logic & async webhook workers
│   │   ├── routes/                # Express API Route declarations
│   │   ├── dto/                   # POJO response DTOs (ApiResponse, FlagDto, AuditLogDto)
│   │   ├── validations/           # Zod payload validation schemas
│   │   ├── middleware/            # Error handling, validation, actor attribution
│   │   ├── app.ts                 # Express application definition
│   │   └── server.ts              # Server bootstrapper & listener
│   └── tests/                     # Integration tests (Supertest + Jest)
└── frontend/                      # React 18 + Vite + TypeScript + Tailwind CSS
    ├── src/
    │   ├── api/                   # Type-safe API client
    │   ├── components/            # FlagList, FlagFilter, CreateFlagModal, AuditLogFeed, WebhookDrawer
    │   └── App.tsx                # Main stateful dashboard orchestration
    └── tests/                     # Component tests (Vitest + Testing Library)
```

### 1. Persistence & State Consistency (Sequelize + PostgreSQL)
- **Composite Uniqueness**: Enforces `UNIQUE(key, environment)`. Keys can be safely reused across environments (e.g. `new-checkout-flow` in `dev` and `prod`), but duplicates within the same environment are strictly rejected with a `409 Conflict`.
- **Atomic Transactions**: All mutations (flag create and toggle) are wrapped in managed database transactions (`sequelize.transaction(...)`). The flag status update and the immutable audit log entry are guaranteed to succeed or roll back together.

### 2. The Wrinkle: Asynchronous Prod Webhooks
- When any `prod` feature flag is toggled, the Express API immediately responds to the client in **<15ms**.
- An unawaited in-process background worker concurrently dispatches an HTTP POST webhook to a built-in mock receiver (`/api/mock/webhook`) with simulated network delivery.
- The outcome (`DELIVERED` or `FAILED`) is logged to the `webhook_deliveries` database table and can be inspected in real time via the **Webhook Drawer** on the UI.

### 3. Developer Guardrails (`GEMINI.md`)
- Adheres to strict TypeScript, static analysis, parameterization against SQL injection, and zero hardcoded credentials.

---

## 📋 Feature Flags Pre-Seeded on First Boot

When the app boots for the first time, the database is populated with 10 realistic Husqvarna-themed feature flags:

| Key | Environment | Status | Description |
| :--- | :--- | :--- | :--- |
| `new-checkout-flow` | `dev` | **Enabled** | Redesigned one-step checkout with instant financing |
| `new-checkout-flow` | `staging` | **Enabled** | Redesigned one-step checkout with instant financing |
| `new-checkout-flow` | `prod` | Disabled | Redesigned one-step checkout with instant financing |
| `ai-mower-pathing-v2` | `dev` | **Enabled** | Autonomous robotic lawn mower SLAM pathing optimization |
| `ai-mower-pathing-v2` | `prod` | Disabled | Autonomous robotic lawn mower SLAM pathing optimization |
| `dark-mode-theme` | `dev` | **Enabled** | High-contrast dark mode palette for pro field app |
| `dark-mode-theme` | `staging` | Disabled | High-contrast dark mode palette for pro field app |
| `battery-telemetry-streaming` | `prod` | **Enabled** | High-frequency MQTT telemetry streaming for battery health |
| `fleet-dashboard-analytics` | `staging` | **Enabled** | Real-time equipment utilization analytics dashboard |
| `smart-scheduling-engine` | `prod` | Disabled | Automated weather-aware mowing schedule optimizer |

---

## 🔍 Trade-offs & Production Considerations

1. **Sequelize vs. Prisma**: Selected Sequelize for pure JavaScript/TypeScript execution, eliminating native Rust engine binary downloads, drastically speeding up Docker container build times, and simplifying cold-start execution.
2. **In-Process Async Worker vs. Distributed Queue**: For a local self-contained harness, an in-process decoupled dispatcher (`setImmediate` / event emitter) meets the non-blocking requirement without introducing Redis / RabbitMQ infrastructure overhead. In a distributed multi-node production setup, this would be backed by BullMQ or AWS SQS.
3. **Actor Attribution**: Provided a client actor selector and `x-actor` header fallback (`admin@husqvarna.com`), allowing reviewers to simulate different team members taking actions and inspecting multi-actor audit feeds.
