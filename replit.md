# Pawtrait Pals - AI Art for Rescue Pets

## Overview
Pawtrait Pals is a SaaS platform for rescue organizations to transform their adoptable dogs and cats into stunning AI-generated artistic portraits. We help rescue pets find forever homes through beautiful visual appeal.

## User Preferences
- Clean, friendly UI with warm color palette
- Focus on helping rescue pets find homes
- Easy-to-use step-by-step portrait creation flow
- 30-day free trial for new organizations
- For credentials/tokens/integrations: always store once as a secret and reuse — never ask user to regenerate each time
- Prefer the simplest, most straightforward path — avoid unnecessary steps or hoops
- After completing any changes, ALWAYS do a thorough review and cleanup pass (check for unused imports, duplicated logic, consistency, etc.) without being prompted
- **COST LIMIT (HARD STOP)**: Do NOT spend more than ~$2 worth of work without checking back with the user. This is a HARD STOP — no exceptions. Break work into smaller steps, check in frequently, and avoid expensive multi-step operations without confirmation. When approaching the limit, stop immediately and ask before continuing.

## System Architecture

### Frontend (client/)
- **Framework**: React with Vite
- **Routing**: wouter
- **Styling**: Tailwind CSS with shadcn/ui components, warm and friendly color palette (orange/amber primary)
- **State Management**: TanStack Query for server state
- **Authentication**: Replit Auth via `useAuth` hook (includes `isAdmin` property for centralized admin detection)
- **UI/UX**: Single-page portrait creation flow, sticky preview panel on desktop. Image protection implemented to prevent saving of artwork. Social sharing buttons integrated for dog profiles and rescue showcases.
- **Style System**: All portrait styles, categories, species assignments, and preview image paths are centralized in `client/src/lib/portrait-styles.ts`. Both the style selector component and the styles gallery page import from this single source of truth.

### Backend (server/)
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **AI Integration**: Gemini AI (via Replit AI Integrations)
- **Security**: Prompt injection protection via `sanitizeForPrompt()`, rate limiting for AI and general API endpoints, robust input validation, sensitive data stripping from public APIs, security headers (Helmet), disabled X-Powered-By header, and family-friendly content filter (`server/content-filter.ts` and `client/src/lib/content-filter.ts`) blocking inappropriate language in pet names.
- **Core Features**: Multi-species support for dogs and cats, 40+ artistic portrait styles (species-specific), monthly credit pool system (new portraits cost 1 credit, edits are free up to 4 per portrait), subscription plans with tiered pricing and overage management, admin panel for organization management and platform statistics, robust image processing (client-side resizing, server-side fallbacks for AI generation), unified rescue information page for both admins and organization owners, searchable breed selector using official AKC (205 dog breeds) and CFA (45 cat breeds) lists with Mix options, and required adoption URL for all pets.
- **Credit Model**: Plans include monthly portrait credits (Free Trial: 9, Starter: 45, Pro: 135, Executive: 600). Each new portrait generation costs 1 credit. Edits (up to 4 per portrait) are free. Credits reset monthly based on billing cycle. Free trial hard-blocks at limit; paid plans allow overage at $3-4/portrait.
- **Portrait Reversion**: Single-step undo for portrait changes. `previousImageUrl` on portraits table stores the image before the last generation or edit. `POST /api/revert-portrait` restores the previous image and clears `previousImageUrl` (one-time undo, no toggle). Does not consume credits or affect edit count.
- **Database Schema**: Key entities include `organizations` (rescue groups with usage tracking), `dogs` (adoptable pets with info and photos), `portraitStyles` (AI art styles), `portraits` (generated AI images), `subscriptionPlans` (pricing tiers), `users`, and `sessions`.

### Shared (shared/)
- `shared/schema.ts`: Drizzle ORM schema definitions, Zod insert schemas, and TypeScript types shared between frontend and backend.

## Stripe Integration
- **Billing Identity**: Organization ID (`orgId`) is the billing identity. ALL Stripe/billing endpoints require `orgId` — never use `getOrganizationByOwner()` for billing. Frontend always passes `orgId`. Stripe customer metadata stores `orgId`.
- **Contact Email**: Organization `contactEmail` is the single source of truth for all billing/Stripe operations. No fallback to login email. Checkout blocks if `contactEmail` is missing.
- **Checkout Flow**: `POST /api/stripe/checkout` creates a Stripe Checkout session; on success redirect, `POST /api/stripe/confirm-checkout` validates the session, verifies price matches the selected plan, binds the Stripe customer/subscription IDs to the org, and sets billing cycle start from Stripe's period data.
- **Webhook Handling**: `server/webhookHandlers.ts` processes `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_succeeded` events via Replit managed webhook. Credit resets use Stripe's `period_start` for accuracy.
- **Billing Portal**: `POST /api/stripe/portal` creates a Stripe Customer Portal session for managing subscriptions.
- **Shared Constants**: `server/stripeClient.ts` exports `STRIPE_PLAN_PRICE_MAP` (price ID → plan mapping) and `mapStripeStatusToInternal()` (Stripe status → app status) used by routes, webhook handlers, and startup sync.
- **Data Hygiene**: `validateAndCleanStripeData()` validates Stripe customer/subscription IDs against live Stripe data before every Stripe-touching operation. Automatically clears stale/deleted IDs and resets dependent fields. API responses strip raw Stripe IDs from client, exposing only `hasStripeAccount`/`hasActiveSubscription` booleans.
- **Plan Changes**: `POST /api/stripe/change-plan` handles both upgrades (redirects to Stripe Checkout) and downgrades (updates Stripe subscription with `proration_behavior: 'none'` and stores `pendingPlanId` in DB). Downgrades take effect at next billing cycle via `invoice.payment_succeeded` webhook. `GET /api/subscription-info` returns current plan, pending plan, and renewal date. `POST /api/stripe/cancel-plan-change` reverts a pending downgrade. Dashboard shows a "Change Plan" button at all times.
- **Startup Sync**: Server startup syncs all orgs with Stripe subscriptions against live data. Catches missed webhook events, handles stale subscriptions, and sweeps orphaned customer IDs. Admin endpoint `POST /api/admin/sync-stripe` available as a safety net.

## External Dependencies
- **Replit Auth**: For user authentication (Google, GitHub, email).
- **Gemini AI**: Integrated via Replit AI Integrations for generating artistic pet portraits.
- **Stripe**: For subscription billing, checkout flow, and webhook handling.
- **Facebook, X (formerly Twitter), Instagram, Nextdoor, SMS**: Integrated for social sharing functionality (icon-only buttons with tooltips). SMS uses native `sms:` URI scheme to open device texting app with pre-filled message.

## Onboarding Wizard
- **Flow**: After plan selection (free trial or paid), users are redirected to `/onboarding` instead of `/settings`
- **Steps**: Welcome → Logo upload (optional) → Species selection (required) → Contact info (optional) → Location address (optional) → Billing address (same as location or different) → Finish (add first pet or review settings)
- **Tracking**: `onboardingCompleted` boolean on organizations table. Dashboard redirects users to onboarding if they have a plan but haven't completed it. Once completed, users go straight to dashboard.
- **Settings page**: Remains available for editing all organization details after onboarding is complete.

## Add-On Pet Slots
- **Feature**: Paid-plan orgs can purchase up to 5 extra pet slots at $3/slot/month via Stripe subscription item.
- **Not available** for Free Trial plans. Requires active Stripe subscription.
- **Limit calculation**: `checkDogLimit()` uses `plan.dogsLimit + org.additionalPetSlots`. All API responses include `petLimit` (effective), `basePetLimit`, `additionalPetSlots`, `maxAdditionalSlots`, `isPaidPlan`.
- **On plan upgrade**: Add-on slots reset to 0 (new plan provides more base capacity).
- **Webhook sync**: `customer.subscription.updated` syncs add-on quantity from Stripe. On cancellation, slots reset to 0.
- **UI**: Pet limit reached triggers a modal with 3 options: (1) Free up a spot, (2) Buy extra slots ($3/mo each), (3) Upgrade plan.

## Social Sharing & Open Graph
- **OG Meta Tags**: Server-side OG meta tag injection for `/rescue/:slug` and `/pawfile/:id` routes via `server/og-meta.ts`.
- **Crawler Detection**: Bot User-Agent detection (Facebook, Twitter, Nextdoor, Google, etc.) serves pre-rendered HTML with proper OG tags. Normal browsers get the SPA.
- **Image Serving**: Portrait images stored as base64 data URIs in DB are served as real images via `GET /api/portraits/:id/image` and `GET /api/dogs/:id/photo` endpoints. These URLs are used in `og:image` tags so social platforms can fetch actual images.
- **Rich Previews**: Social shares display pet name, breed, rescue org name, description, and a large portrait image preview (using `twitter:card = summary_large_image`).

## Data Integrity & Plan Enforcement
- **Startup Health Check**: Server startup runs automatic credit recalculation and scans for data integrity issues (orgs without plans, orgs over their pet limit). Warnings logged to console.
- **Plan Requirement**: All pet creation and portrait generation endpoints enforce that the org has a plan. No org can operate without a plan.
- **30-Day Free Trial Enforcement**: `isTrialExpired()` in `server/subscription.ts` checks `trialEndsAt` (with `createdAt + 30d` fallback). Trial expiry blocks pet creation, portrait generation, and portrait editing.
- **Free Trial Re-Use Prevention**: `hasUsedFreeTrial` boolean on organizations table. Once an org starts a free trial, this flag is set permanently. `canStartFreeTrial()` checks this flag. Both user and admin select-plan endpoints block duplicate trials. Frontend disables the free trial button and shows "Trial Used" when flag is set.
- **Cancellation-to-Trial Revert**: When a paid subscription is canceled and the org is still within its 30-day trial window, `handleCancellation()` automatically reverts to Free Trial instead of marking as canceled.
- **Subscription Logic Consolidation**: All trial/cancellation logic is centralized in `server/subscription.ts`. Routes, webhooks, and startup sync all use shared helpers — no duplicated trial date calculations.
- **Admin Audit Endpoints**: `GET /api/admin/data-integrity` reports all orgs with issues. `POST /api/admin/recalculate-credits` forces a credit recount from actual portrait records.
- **Credit Tracking**: `portraitsUsedThisMonth` is incremented in all portrait creation paths. Retroactive recalculation runs on startup.

## Key File Reference
| File | Purpose |
|------|---------|
| `server/routes.ts` | All API routes, startup sync, helpers (`checkDogLimit`, `createDogWithPortrait`, `computePetLimitInfo`, `validateAndCleanStripeData`) |
| `server/subscription.ts` | Consolidated subscription/trial helpers (`isTrialExpired`, `isWithinTrialWindow`, `handleCancellation`, `revertToFreeTrial`, `canStartFreeTrial`, `markFreeTrialUsed`) |
| `server/webhookHandlers.ts` | Stripe webhook event processing |
| `server/stripeClient.ts` | Stripe client, shared constants (`STRIPE_PLAN_PRICE_MAP`, `mapStripeStatusToInternal`), sync utilities |
| `server/stripeService.ts` | Stripe API wrappers (checkout, portal, subscriptions) |
| `server/storage.ts` | Database storage interface and implementation |
| `server/content-filter.ts` | Server-side content filter for pet names |
| `server/og-meta.ts` | Open Graph meta tag injection for social sharing previews |
| `shared/schema.ts` | Database schema, insert schemas, types |
| `client/src/pages/dashboard.tsx` | Main dashboard with org management |
| `client/src/pages/create.tsx` | Pet creation and portrait generation flow |
| `client/src/pages/choose-plan.tsx` | Subscription plan selection and Stripe checkout |
| `client/src/pages/onboarding.tsx` | Multi-step onboarding wizard |
| `client/src/pages/admin.tsx` | Admin panel for platform management |
| `client/src/lib/portrait-styles.ts` | Portrait style definitions (single source of truth) |
| `client/src/lib/breeds.ts` | AKC/CFA breed lists |
| `client/src/hooks/use-auth.ts` | Auth hook with `isAdmin` property |
