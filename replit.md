# Tan & Co CRM - Touch Kiosk System

## Overview

This is a premium touch-screen kiosk CRM system designed for Tan & Co salon/spa operations. The application features a modern Hebrew RTL interface with neon aesthetic, designed for customer self-service and salon management. The system integrates with multiple external services for payments, customer identification, access control, and automated marketing workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Component-based UI with full TypeScript support
- **Vite Build System**: Fast development and optimized production builds
- **Wouter Routing**: Lightweight client-side routing
- **TanStack Query**: Data fetching and state management with caching
- **Shadcn/ui Components**: Radix UI primitives with custom styling
- **Hebrew RTL Support**: Right-to-left layout with Hebrew-optimized fonts (Assistant, Heebo, Noto Sans Hebrew)

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware support
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Modular Storage Interface**: Abstracted storage layer supporting multiple implementations

### UI Design System
- **Neon Aesthetic**: Hot pink (#ff69b4) primary color with glow effects
- **Dark Mode Theme**: Gradient backgrounds with slate/black color scheme
- **Touch-Optimized**: Large hit areas (48-64px) for kiosk interface
- **Component Library**: Custom cards, buttons, and navigation with consistent spacing (2, 4, 8, 16 units)

### Database Schema
- **Users Table**: Basic authentication with username/password
- **Products Table**: Unified system for both physical products and services
  - Physical Products: Thatso, BALIBODY, AUSTRALIAN GOLD, PAS TOUCHER brands
  - Services: Sun beds, spray tan, hair salon, massage, facial treatments
  - Support for product type differentiation (product/service)
  - Service-specific fields: duration (minutes), sessions (package count)
  - Product-specific fields: stock, weight, SKU
  - Categories: Both product categories and service categories
  - Featured products shown in 3D carousel on shop page
- **PostgreSQL**: Primary database with UUID generation
- **Drizzle Kit**: Schema migrations and database management

### State Management
- **React Query**: Server state management with automatic caching
- **Local Component State**: React hooks for UI state
- **Form Management**: React Hook Form with Zod validation

## External Dependencies

### Development Tools
- **Replit Integration**: Runtime error overlay and development banner
- **ESBuild**: Production bundling for server code
- **TypeScript**: Full type safety across client and server

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **drizzle-kit**: Database migrations and schema management

### UI Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe component variants

### Form & Validation
- **react-hook-form**: Performance-focused form library
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema definition

### Active Integrations
- **WhatsApp Business API** ✅: Complete automated messaging system
  - Template-based messages (Hebrew support)
  - Inbound/outbound webhooks configured
  - Customer engagement workflow automation
  - Purchase options, payment confirmations, onboarding links
  - **Live Chat Interface** ✅: Real-time WhatsApp messaging
    - Server-Sent Events (SSE) for instant message delivery
    - Two-way communication with customers
    - Contact management and message history
    - Integrated with existing WhatsApp automation
    - Accessible at `/chat` route
  - **Required Environment Variables:**
    - `WA_PHONE_NUMBER_ID` - WhatsApp Business Phone Number ID
    - `CLOUD_API_ACCESS_TOKEN` - Meta Cloud API Access Token
    - `CLOUD_API_VERSION` - API Version (default: v21.0)
    - `WA_VERIFY_TOKEN` - Webhook verification token
- **Cardcom Payment Gateway** ✅: Full payment processing integration
  - Low Profile API for hosted payment pages
  - Webhook support for transaction notifications
  - Automatic membership and transaction updates
  - Invoice generation capabilities
  - **Required Environment Variables:**
    - `CARDCOM_TERMINAL_NUMBER` - Terminal number from Cardcom
    - `CARDCOM_API_USERNAME` - API username
    - `CARDCOM_API_PASSWORD` - API password (optional)
- **BioStar 2** ✅: Facial recognition and access control
  - Face identification for customer check-in
  - Face registration during onboarding
  - Remote door control with comprehensive logging
  - Door access history tracking (IP, timestamp, success/failure)
  - Multi-door support (future-ready architecture)
  - Integration with customer management system
  - **Required Environment Variables:**
    - `BIOSTAR_SERVER_URL` (e.g., http://localhost:5000 or https://IP:8443)
    - `BIOSTAR_USERNAME` (admin username)
    - `BIOSTAR_PASSWORD` (admin password)
  - Optional: `BIOSTAR_ALLOW_SELF_SIGNED=true` for self-signed certificates
  - **Remote Control UI:** `/remote-door` - Touch-optimized interface for door opening with real-time logs
  - **Security Model (Architect-Approved):** 
    - ✅ **Server Binding**: Express binds to 127.0.0.1 (localhost only) - NO LAN exposure
    - ✅ **Middleware Enforcement**: `requireLocalAccess` validates ONLY loopback IPs (127.0.0.1, ::1, ::ffff:127.0.0.1)
    - ✅ **No Bypasses**: Development mode bypass removed - security enforced unconditionally
    - ✅ **Rate Limiting**: 10 requests/minute per IP with automatic cleanup
    - ✅ **Comprehensive Logging**: All door control attempts logged (IP, timestamp, success/failure)
    - ✅ **Deployment Model**: Server and kiosk MUST run on same physical machine
    - ✅ **Security Status**: "Door control endpoints are now effectively localhost-only... Security: none observed" - Architect Review

### Social Media Automation ✅
- **Meta Marketing API** (Facebook/Instagram Ads): Full automation suite
  - Campaign creation and management
  - Real-time performance monitoring
  - Automatic budget optimization
  - Custom audience syncing from CRM
  - **Required Environment Variables:**
    - `META_ACCESS_TOKEN` - Long-lived Meta Marketing API access token
    - `META_AD_ACCOUNT_ID` - Facebook Ad Account ID (format: act_XXXXXXXXXX)
- **Google Ads API**: Complete campaign automation
  - Search campaign management
  - Responsive search ads
  - Automated bidding strategies
  - Performance tracking
  - **Required Environment Variables:**
    - `GOOGLE_ADS_CLIENT_ID` - OAuth 2.0 Client ID
    - `GOOGLE_ADS_CLIENT_SECRET` - OAuth 2.0 Client Secret
    - `GOOGLE_ADS_REFRESH_TOKEN` - OAuth 2.0 Refresh Token
    - `GOOGLE_ADS_DEVELOPER_TOKEN` - Google Ads API Developer Token
    - `GOOGLE_ADS_CUSTOMER_ID` - Customer ID (format: XXX-XXX-XXXX)
- **TikTok Ads API**: Video advertising automation
  - Campaign and ad group management
  - Video ad creation
  - Audience targeting
  - Performance analytics
  - **Required Environment Variables:**
    - `TIKTOK_ACCESS_TOKEN` - TikTok Marketing API access token
    - `TIKTOK_ADVERTISER_ID` - TikTok Advertiser Account ID

### Automation Engine Features
- **Performance Monitoring**: Automated checks every 15 minutes
- **Budget Optimization**: Automatic adjustments (±30-50%) based on performance
- **A/B Testing**: Intelligent comparison and winner identification
- **Budget Pacing**: Real-time spend rate monitoring with alerts
- **Audience Syncing**: CRM customer data → ad platform custom audiences
- **WhatsApp Alerts**: Real-time notifications for critical events
- **General Settings:**
  - `ADMIN_PHONE` - WhatsApp phone number for automation alerts (format: 972XXXXXXXXX)

### Planned Integrations
- **Jotform**: Digital health forms and signature collection
- **Airtable**: Optional extended data storage
- **Make/n8n**: Advanced workflow automation

### Styling & Animation
- **Tailwind CSS**: Utility-first styling with custom color palette
- **CSS Gradients**: Neon effects and premium visual treatments
- **Responsive Design**: Mobile-first approach with touch optimizations

The architecture supports a premium salon experience with automated customer identification, self-service capabilities, and integrated business operations through external service connections.