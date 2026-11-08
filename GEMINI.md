# Gemini Antigravity Engineering Guidelines & Guardrails

This project is built according to senior engineering standards for reproducibility, clean architecture, and data safety.

## 1. Architectural Guardrails
- **Modular Monolith / Clean Boundaries**:
  - `backend/src/modules/flags`: Core feature flag business logic, validation, and routes.
  - `backend/src/modules/audit`: Immutable audit trail services and querying.
  - `backend/src/modules/webhooks`: Non-blocking asynchronous event notification worker and mock external webhook receiver.
  - `backend/src/db`: Pure JavaScript/TypeScript database layer with Sequelize ORM and PostgreSQL.
- **Frontend Architecture**:
  - React 18 with TypeScript and Vite for sub-second hot reload and low memory footprint.
  - Tailwind CSS for clean, responsive UI styling.
  - Optimistic UI updates with automatic rollback on network failure.

## 2. Data Safety & State Consistency
- **Atomic Transactions**:
  - Any operation mutating feature flag status (`CREATE`, `TOGGLE_ON`, `TOGGLE_OFF`) MUST be wrapped in a managed atomic `sequelize.transaction`.
  - The audit log record must be committed within the exact same database transaction as the flag change.
- **Composite Unique Constraint**:
  - Feature flag keys are unique per environment: `(key, environment)`.
  - Duplicate keys in different environments (e.g. `checkout-v2` in `dev` and `checkout-v2` in `prod`) are permitted.
  - Duplicate keys in the same environment are strictly rejected with a `409 Conflict`.
- **Immutable Audit Trail**:
  - Records in `audit_logs` must never be updated or deleted.
  - Each entry captures `flag_id`, `flag_key`, `environment`, `actor`, `action`, `previous_state`, `new_state`, and `timestamp`.

## 3. Asynchronous Non-blocking Operations
- Toggling a `prod` flag MUST trigger an asynchronous notification (dispatched to the local mock webhook receiver) WITHOUT blocking the HTTP response.
- Response time for the flag toggle API endpoint must remain `<20ms` regardless of webhook network latency.

## 4. Local Harness Commands
- Single-command boot: `npm run dev` (orchestrates PostgreSQL, Backend, and Frontend).
- Self-contained verification: `npm test` (executes backend integration and frontend test suites).
- Teardown: `npm run down`.

