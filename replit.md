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
- UI improvements (October 10, 2025):
  - Optimized service card icon sizing with responsive constraints across TouchInterface and self-service pages
  - AI TAN icon maintained 21% larger on mobile, 9% larger on desktop for visual hierarchy
  - Self-service page: Regular icons 115px, AI TAN 125px (on 180px cards)
  - TouchInterface: Regular icons 70px mobile/115px desktop, AI TAN 85px mobile/125px desktop (on 110px/160px cards)
    * Self-service button positioned lower (mt-6 mobile, mt-16 desktop) for better spacing from service cards
  - Fixed title alignment across all service cards using leading-tight and consistent padding
  - Icon containers use max-height constraints to prevent overflow
  - Enhanced Alin component to support custom sizing via className utilities (max-w-[]/max-h-[])
  - Sun Beds Dialog improvements:
    * Removed interfering AlinChatBox floating bubble from dialog
    * Repositioned customer search bar above service buttons (was inline with buttons)
    * Search bar width precisely matches 2 service buttons + gap: 218px mobile (2×105px + 8px), 308px desktop (2×150px + 8px)
    * Fixed search API query to use correct parameter format: { q: searchQuery }
    * Restored full descriptive text visibility across all viewports (removed mobile text hiding)
    * Eliminated Alin avatar duplication: single responsive Alin instance using scale-[0.79] md:scale-100
    * Icon sizes optimized: AI TAN 120px mobile/170px desktop, New Customer 64px mobile/112px desktop, Bronzers 68px mobile/120px desktop, Package 88px mobile/160px desktop
    * Service button heights increased in mobile (120px) for better text visibility
    * Replaced New Customer icon with pink plus icon (PNG) for modern neon aesthetic
    * Service buttons arranged in 2 rows on mobile vs 1 row on desktop
  - Self-service splash screen: Buttons positioned lower on page (mt-24 mobile, mt-20 desktop) for better visual balance and spacing from service cards
  - Hidden Alin floating bubble footer on mobile, visible on desktop only
- Bug fixes (October 8, 2025):
  - Fixed type error in NewCustomerDialog where parseInt() received undefined values
  - Added defensive programming to HairStudio for safe array mapping
  - Improved accessibility by adding DialogDescription to all dialog components

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