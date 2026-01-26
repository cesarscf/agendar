# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Agendar API" - a Portuguese appointment booking system API for beauty salons and similar establishments. It's built with Fastify, TypeScript, Drizzle ORM with PostgreSQL, and includes subscription management via Stripe.

## Development Commands

- **Start development server**: `npm run dev` (watches files with tsx, loads .env)
- **Start local development**: `npm run local` (uses .env.local instead)
- **Format code**: `npm run format` (uses Biome)
- **Build project**: `npm run build` (uses tsup)
- **Start production**: `npm start`

## Database Commands

- **Generate migrations**: `npm run db:generate`
- **Run migrations**: `npm run db:migrate`
- **Seed database**: `npm run db:seed`

## Architecture

### Core Stack
- **Framework**: Fastify with fastify-type-provider-zod for type-safe schemas
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens (@fastify/jwt)
- **Validation**: Zod schemas throughout
- **Payments**: Stripe integration with webhooks
- **Push Notifications**: Firebase Admin SDK
- **Email**: Resend API
- **Documentation**: Swagger/OpenAPI auto-generated

### Project Structure
```
src/
├── @types/           # TypeScript type definitions
├── clients/          # External service clients (Firebase, Stripe, Resend)
├── db/              # Database connection and schema definitions
├── enums/           # Shared enumerations
├── middlewares/     # Authentication and authorization middleware
├── routes/          # Feature-based route handlers
├── utils/           # Shared utilities and schemas
├── env.ts           # Environment variable validation
└── server.ts        # Main application setup
```

### Route Organization
Routes are organized by feature domain:
- `/admin` - Admin panel operations
- `/public` - Public-facing endpoints (via establishment slug)
- Root level routes for core entities (appointments, customers, employees, etc.)

### Key Patterns

#### Authentication Layers
- `auth.ts` - Basic JWT authentication
- `admin-auth.ts` - Admin user authorization
- `customer-auth.ts` - Customer authorization
- `require-active-subscription.ts` - Subscription validation

#### Multi-tenancy
The system uses establishment-based multi-tenancy:
- Partners own establishments
- `getCurrentEstablishmentId()` helper retrieves the current establishment from `x-establishment-id` header or defaults to partner's first establishment
- Most routes are scoped to an establishment via this pattern

#### Database Schema
- Located in `src/db/schema/` with individual files per entity
- Uses Drizzle ORM with full TypeScript integration
- Migration files generated in `/drizzle` directory
- Schema exports centralized in `src/db/schema/index.ts`

#### Error Handling
- Centralized error handler in `utils/error-handler.ts`
- Custom error classes: `BadRequestError`, `UnauthorizedError`, `ForbiddenError`
- Automatic Zod validation error formatting
- Consistent error responses across the API

#### Environment Configuration
- Zod-validated environment variables in `src/env.ts`
- Separate `.env` and `.env.local` files supported
- Required variables: DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, FIREBASE_SERVICE_ACCOUNT_KEY_ENCODED_JSON, RESEND_API_KEY, RESEND_EMAIL

#### Stripe Integration
- Webhook handler in `routes/subscription/stripe-webhook.ts`
- Handles subscription lifecycle events (created, updated, deleted)
- Payment method management via setup intents
- Invoice payment tracking (paid/failed)

## Code Style

- **Formatter**: Biome (configured in `biome.json`)
- **Spacing**: 2 spaces, line width 80 characters
- **Semicolons**: As needed only
- **Quotes**: Double quotes for JSX, arrow parens as needed
- **Imports**: Organized automatically by Biome
- **Path Aliases**: `@/*` maps to `./src/*`

## Business Logic Context

This is a multi-tenant SaaS for appointment booking with:
- **Establishments** (beauty salons) with custom slugs for public booking
- **Partners** (establishment owners) with subscription plans
- **Employees/Professionals** who provide services
- **Customers** who book appointments
- **Services** with categories and pricing
- **Packages** (service bundles) and loyalty programs
- **Subscription tiers** based on employee count (handled via Stripe)

The system supports both admin panel management and public booking flows via establishment slug URLs.
