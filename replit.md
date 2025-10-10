# Tan & Co CRM - Touch Kiosk System

## Overview

This project is a premium touch-screen kiosk CRM system designed for Tan & Co salon/spa operations. It features a modern Hebrew RTL interface with a neon aesthetic, focusing on customer self-service and salon management. The system integrates with multiple external services for payments, customer identification, access control, and automated marketing workflows, aiming to streamline salon operations and enhance the customer experience.

**Recent Updates (October 2025)**:
- **Password Protection for Self-Service Exit** (October 10, 2025):
  - Added password dialog when clicking logo in self-service page to return to main screen
  - Password protection prevents unauthorized exit from self-service mode
  - Navigation from main screen to self-service is open to all users
  - Password: 1234 (configured in PasswordDialog component)
  - RTL dialog with neon aesthetic matching the app design
- **Self-Service Page Comprehensive Redesign** (October 10, 2025):
  - **Card sizing**: Reduced to 100px height on mobile (from 120px) with p-1.5 padding for compact layout
  - **Text optimization**: text-xs (12px) for descriptions, text-sm (14px) for final message on mobile
  - **AI TAN rebrand**: Replaced pink Alin with blue Alin GIF featuring cyan glow (rgb(59, 130, 246))
  - **Icon hierarchy**: Progressive sizing - AI TAN largest at 95px/155px, Hair Salon 80px/140px, Cosmetics 75px/135px, Spray Tan 70px/125px, Sun Beds/Store 60px/115px (mobile/desktop)
  - **Visual enhancements**: Added pink-purple gradient separator line under logo, removed "בחרו את השירות המועדף עליכם" header
  - **Footer optimization**: Fixed Alin duplication - consolidated to single responsive component with max-w constraints
  - **Layout**: 3-column grid (2 rows) on mobile, flex layout on desktop with all content fitting without excessive scrolling
- **Spray Tan Dialog Complete Redesign** (October 10, 2025):
  - Modern minimalist redesign based on user's design mockup featuring spray machine image
  - Desktop: Two-column layout with content left, spray machine image right with pink glow effect
  - Mobile: Single-column responsive layout with stacked content and full-width cards
  - Three pricing packages with modern design (170₪ single, 450₪ for 3 sessions, 800₪ for 6 sessions)
  - Middle package highlighted with pink border glow, shadow effect, and "פופולרי" badge
  - Dark gradient background (from-gray-900 via-black to-gray-800) with backdrop blur
  - Title with gradient pink underline and RTL Hebrew text alignment
  - Benefits list with pink bullet points describing 24/7 access and face recognition entry
  - CSS-based hover effects (no imperative handlers) for consistent touch/mouse interaction
  - Fully tested on mobile (390x844) and desktop (1280x720) viewports
- Excel import system for migrating 216 existing subscribers with packages and balances
- Successfully imported legacy customer data with automated phone normalization and membership creation
- BioStar sync system to match CRM customers with existing BioStar face recognition users
- Multilingual checkout page with Hebrew/English/French support and neon aesthetic
- PAS TOUCHER product scraper using Cheerio HTML parser to import sunglasses inventory from shop URL
- Fixed critical SSRF security vulnerabilities with strict hostname validation and HTTPS enforcement
- UI improvements (October 10, 2025):
  - Optimized service card icon sizing with responsive constraints across TouchInterface and self-service pages
  - AI TAN icon enlarged: 95px mobile (was 85px), 140px desktop (was 125px) for stronger visual hierarchy
  - Self-service page: Regular icons 115px, AI TAN 155px (on 180px cards); All titles uniformly sized at text-[10px] md:text-sm including AI TAN for consistent alignment
  - TouchInterface: Regular icons 70px mobile/115px desktop, AI TAN 95px mobile/140px desktop (on 110px/160px cards)
    * Self-service button positioned lower (mt-10 mobile, mt-16 desktop) for better spacing from service cards
    * Self-service button: Pink neon glow background (rgba(236, 72, 153)) with subtle text-shadow
    * "מעבר לשירות עצמי" and "24/7" text styled in pink neon with subtle glow effect
  - Unified button/field dimensions across all dialogs: 110px×100px mobile, 150px×145px desktop for consistent UX
  - Added back navigation arrows to NewCustomerDialog and NewClientDialog for better user flow
  - Fixed title alignment across all service cards using leading-tight and consistent padding
  - Icon containers use max-height constraints to prevent overflow
  - Enhanced Alin component to support custom sizing via className utilities (max-w-[]/max-h-[])
  - Sun Beds Dialog improvements:
    * Removed interfering AlinChatBox floating bubble from dialog
    * Alin upgraded to animated GIF with pink/transparent background (replaced white background version)
    * Alin sizing: scale 0.6 mobile, 0.9 desktop (reduced for proportional sizing)
    * Welcome header positioned at very top (top-2) with full info text now visible on both mobile and desktop
    * Info text sizing: text-xs on mobile (improved readability), text-base on desktop
    * Back button minimalist icon-only design (h-8 w-8, ArrowLeft icon, no "חזרה" text)
    * Service fields positioned lower on mobile (mt-6) with right shift (pr-8) for better layout
    * Service button dimensions: 110×100px mobile, 150×145px desktop (consistent with other dialogs)
    * Button layout: flex items-center justify-center for proper alignment
    * Text: Single line only - text-[11px] mobile, text-sm desktop (no mobile/desktop split)
    * Service buttons arranged in 2×2 grid on mobile (grid-cols-2), single row on desktop
    * Customer search bar repositioned below service buttons (was above)
    * Search bar width: 228px mobile (2×110px + 8px gap), 308px desktop (2×150px + 8px gap)
    * Search icon optimized: w-3.5 h-3.5 with pink neon glow
    * Reduced spacing between buttons and search bar (space-y-2) for compact layout
    * Icon sizes optimized proportionally: AI TAN 60×60/80×80, Package 50×50/70×70, Bronzers 45×45/65×65, New Customer 40×40/60×60 (mobile/desktop)
    * Replaced New Customer icon with pink plus icon (PNG) for modern neon aesthetic
    * AI TAN button: Blue neon Alin GIF (עיצוב ללא שם (5)_1760108712417.gif) with cyan glow (rgb(59, 130, 246)) to differentiate from pink chatbot, enhanced with contrast(1.15) brightness(1.05) for sharper visuals
    * Alin Chatbot (bottom-right corner): Clickable chatbot that opens chat interface, positioned with bottom-0 + translate-y-4 for optimal placement
    * Chatbot speech bubble: Black gradient background matching field styling (from-gray-900/90 via-black/80), pink border, typing animation (80ms/char)
    * Speech bubble displays single-line message: "היי אני אלין , אני פה לעזור לכם בכל שלב בכל שעה , מבטיחה לא לחפור"
    * Bubble positioned right of Alin avatar with -space-x-12 overlap, text-[10px] mobile / text-sm desktop, whitespace-nowrap
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