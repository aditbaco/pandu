# Overview

FormCraft is a full-stack web application that provides a comprehensive form building and management platform. The application allows users to create custom forms with drag-and-drop functionality, manage form submissions, and view analytics. Built with modern web technologies, it features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database integration using Drizzle ORM.

## Recent Changes (August 13, 2025)
- **Added Custom URL Routing**: Implemented specialized form submission URLs with pattern `/{kunjungan_id}/{oleh}/{form_slug}` for healthcare/medical form contexts
- **Extended Database Schema**: Added new columns to form_submissions table (kunjungan_id, nopen, norm, oleh) for medical data tracking
- **Enhanced Submission Details**: Added kunjungan, nopen, and norm fields to submission detail view with auto-filled "submitted by" using oleh parameter
- **Updated CSV Export**: Enhanced export functionality to include new medical fields (kunjungan, nopen, norm, oleh)
- **Enhanced Sidebar**: Added collapsible sidebar functionality with toggle button positioned next to FormCraft logo
- **Mobile-Responsive Design**: Completed full mobile optimization across all pages and components

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing with dynamic page titles and subtitles
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Form Building**: Custom drag-and-drop interface using @dnd-kit libraries for field manipulation
- **Component Structure**: Organized into pages, layout components, UI components, and form-builder specific components

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM for type-safe database operations with PostgreSQL
- **API Design**: RESTful API endpoints for forms, submissions, and user management
- **Development Setup**: Hot module replacement with Vite integration for seamless development experience
- **Error Handling**: Centralized error handling middleware with structured error responses

## Database Schema
- **Forms Table**: Stores form metadata including name, description, fields (JSON), status, and timestamps
- **Form Submissions Table**: Stores submission data with JSON fields, submitter information, and status tracking
- **Users Table**: Basic user management with username and password fields
- **Relationships**: One-to-many relationship between forms and submissions with cascade delete

## Authentication & Authorization
- **Session Management**: Currently configured for basic session handling (infrastructure present but not fully implemented)
- **User Management**: Basic user schema with username/password structure ready for authentication implementation

## Data Management
- **Form Fields**: JSON-based flexible field configuration supporting text, email, textarea, number, select, radio, checkbox, file, and date field types
- **Validation**: Zod schemas for runtime type validation on both client and server
- **Storage Interface**: Abstracted storage layer allowing for easy database provider switching

## UI/UX Design
- **Design System**: Consistent design language with CSS variables for theming
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Accessibility**: Built on Radix UI primitives ensuring WCAG compliance
- **Dark Mode**: Theme system ready with CSS variables for light/dark mode switching

# External Dependencies

## Database
- **Primary Database**: PostgreSQL configured through Neon serverless
- **Connection Pooling**: @neondatabase/serverless for optimized database connections
- **Migration System**: Drizzle Kit for database schema migrations

## UI Libraries
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Form Handling**: React Hook Form with Zod resolvers for validation
- **Drag and Drop**: @dnd-kit ecosystem for form builder interactions

## Development Tools
- **Build Tool**: Vite with React plugin for fast development and optimized builds
- **TypeScript**: Full type safety across client, server, and shared code
- **Code Quality**: ESBuild for production bundling with external package optimization

## Runtime Environment
- **Deployment**: Replit-optimized with cartographer plugin for development environment
- **Environment Variables**: DATABASE_URL for database connection configuration
- **Process Management**: Development and production scripts with proper environment handling