# Tan & Co CRM - Touch Kiosk System

## Overview

This project is a premium touch-screen kiosk CRM system designed for Tan & Co salon/spa operations. It features a modern Hebrew RTL interface with a neon aesthetic, focusing on customer self-service and salon management. The system integrates with multiple external services for payments, customer identification, access control, and automated marketing workflows, aiming to streamline salon operations and enhance the customer experience.

**Recent Updates (October 2025)**:
- Excel import system for migrating 216 existing subscribers with packages and balances
- Successfully imported legacy customer data with automated phone normalization and membership creation
- BioStar sync system to match CRM customers with existing BioStar face recognition users
- Multilingual checkout page with Hebrew/English/French support and neon aesthetic
- PAS TOUCHER product scraper using Cheerio HTML parser to import sunglasses inventory from shop URL
- Fixed critical SSRF security vulnerabilities with strict hostname validation and HTTPS enforcement

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Technology Stack**: React, TypeScript, Vite, Wouter (routing), TanStack Query (data fetching), Shadcn/ui (components).
- **UI/UX**: Neon aesthetic (hot pink, glow effects), dark mode theme, touch-optimized design (large hit areas), Hebrew RTL support with optimized fonts.
- **State Management**: React Query for server state, React Hooks for local component state, React Hook Form with Zod for form management.

### Backend
- **Technology Stack**: Express.js (RESTful API), Drizzle ORM (PostgreSQL), Connect-pg-simple (session management).
- **Storage**: Modular storage interface with PostgreSQL as the primary database.

### Database
- **Type**: PostgreSQL with Drizzle ORM for type-safe operations.
- **Schema Highlights**:
    - **Users**: Basic authentication.
    - **Health Forms**: Digital questionnaires with signatures.
    - **Session Usage**: Tracks customer service usage and access.
    - **Products**: Unified for physical products (Thatso, BALIBODY) and services (sun beds, spray tan, massage).
    - **Persistence**: All CRM data (customers, memberships, transactions, automation) is persisted to PostgreSQL.

### System Design Choices
- **Security**: Robust webhook security (signature verification, HMAC, rate limiting), localhost binding for sensitive endpoints (BioStar 2), and local access enforcement.
- **Scalability**: Abstracted storage layer and modular design for future integrations.

## External Dependencies

### Development & Core
- **Database**: `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`.
- **UI**: `@radix-ui/*`, `tailwindcss`, `lucide-react`, `class-variance-authority`.
- **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod`.
- **File Processing**: `xlsx` (Excel parsing), `multer` (file uploads), `cheerio` (HTML parsing for web scraping).

### Active Integrations
- **WhatsApp Business API**: Automated messaging, live chat (SSE), template-based messages, customer engagement workflows.
- **Cardcom Payment Gateway**: Full payment processing, hosted payment pages, webhooks, invoice generation.
- **BioStar 2**: Facial recognition for check-in/registration, remote door control with logging, multi-door support.
- **Meta Marketing API (Facebook/Instagram Ads)**: Campaign management, budget optimization, custom audience syncing.
- **Google Ads API**: Search campaign management, bidding strategies, performance tracking.
- **TikTok Ads API**: Campaign and ad group management, video ad creation, audience targeting.

### Automation Engine
- **Features**: Performance monitoring, budget optimization, A/B testing, budget pacing, audience syncing, WhatsApp alerts.

### Planned Integrations
- **Jotform**: Digital health forms.
- **Airtable**: Extended data storage.
- **Make/n8n**: Advanced workflow automation.