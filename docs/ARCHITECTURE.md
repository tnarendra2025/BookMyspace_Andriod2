# BookMySpace — Architecture

## High-level

```
┌──────────────────────────────┐
│   Flutter App (Android/iOS)   │
│  Presentation (Riverpod)      │
│  Application (use-cases)      │
│  Domain (entities, repos)     │
│  Data (repositories)          │
│  Infrastructure (Supabase/API)│
└──────────────┬───────────────┘
               │ HTTPS
┌──────────────▼───────────────┐
│   Supabase (managed)          │
│  Postgres + RLS               │
│  Auth (OTP / OAuth)           │
│  Storage (images)             │
│  Realtime (notifications)     │
│  Edge Functions (payments)    │
└──────────────┬───────────────┘
               │
      ┌────────▼────────┐
      │  Razorpay /     │
      │  Stripe (later) │
      └─────────────────┘
```

## Layers (clean architecture)

1. **Presentation** — screens, widgets, Riverpod state. No business logic.
2. **Application** — use cases orchestrating repositories.
3. **Domain** — pure Dart entities + repository interfaces. No frameworks.
4. **Data** — repository implementations mapping DTOs to entities.
5. **Infrastructure** — Supabase client, Dio, storage, external APIs.

The **domain** never depends on Supabase. Swapping the backend only changes the
data/infrastructure layers.

## Security model

- Row Level Security enforced server-side on every table.
- JWT claims drive role checks (never trust client-only checks).
- Payment secrets live only in Edge Functions; the app never sees them.
- Tokens live only in FlutterSecureStorage.

## Scalability

- Stateless Edge Functions; connection pooling via Supabase.
- Cursor-based pagination on all list endpoints.
- CDN image delivery with thumbnails.
- Queue-based async processing (notifications, webhooks).

See [ROADMAP.md](ROADMAP.md) for milestone status.

---

## Centralized Backend Integration Layer (Sections 65–99)

External-site, MCP, and API integrations are strictly architected as a **backend integration layer**, never called directly from Flutter screens:

```text
Flutter UI (iOS / Android / Web)
   ↓
Feature / Domain Layer
   ↓
Integration Repository
   ↓
Supabase Edge Function / Secure Backend API
   ↓
External API / Website / MCP / Webhook
   ↓
Normalized BookMySpace Response
   ↓
Flutter State (Riverpod)
   ↓
Consistent Multi-Platform UI
```

### Key Integration Rules:
1. **No Direct Flutter Calls**: All external API credentials, client secrets, and authentication tokens live in secure backend environment / secret storage.
2. **Official Paths Only**: If an external website has no official API, MCP server, or SDK, do NOT scrape or invent endpoints. Use official deep-link/website handoff ("Continue on partner website") or mark the integration unavailable.
3. **Data Normalization**: External models (`ExternalVenue`, `ExternalBooking`) are mapped into normalized BookMySpace domain entities before reaching client state.
4. **Resilience & Circuit Breaking**: If an external provider fails or rate-limits, core BookMySpace functionality continues operating without crashing.

