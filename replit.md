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

### Planned Integrations (Based on Design Docs)
- **Airtable**: Primary data storage for customer records and business data
- **Cardcom**: Payment processing for purchases and subscriptions
- **WhatsApp Business API**: Automated messaging and notifications
- **BioStar 2**: Facial recognition and access control system
- **Jotform**: Digital forms and signature collection
- **Make/n8n**: Workflow automation and service orchestration

### Styling & Animation
- **Tailwind CSS**: Utility-first styling with custom color palette
- **CSS Gradients**: Neon effects and premium visual treatments
- **Responsive Design**: Mobile-first approach with touch optimizations

The architecture supports a premium salon experience with automated customer identification, self-service capabilities, and integrated business operations through external service connections.