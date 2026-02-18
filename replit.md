# Pratap Living - Premium Stays Platform

## Overview

Pratap Living is a hospitality platform for premium homestays, suites, apartments, and villas in Lucknow, India. The application serves two primary user types: guests looking to book accommodations and property owners who want to partner with the platform. It features property listings, partner inquiry forms, contact info, and a property CMS at /admin/properties for managing listings with image upload support via ImageKit (folder-based: /properties/{property-name}/). Legacy images from Replit Object Storage (/objects/uploads/) are still supported.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (CSS variables for theming)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under /api prefix
- **Development**: tsx for TypeScript execution, Vite middleware for HMR

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Drizzle Kit with push command (db:push)

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/  # UI components (shadcn/ui + custom)
│       ├── pages/       # Route pages (home, properties, partner, contact)
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer (IStorage interface)
│   ├── db.ts         # Database connection
│   └── seed.ts       # Sample data seeding
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schemas
└── migrations/       # Database migrations (generated)
```

### Key Design Patterns
- **Storage Interface**: IStorage abstraction in server/storage.ts allows for different storage implementations
- **Schema Sharing**: Database types and validation schemas shared between frontend and backend
- **Component Architecture**: Composable UI using shadcn/ui patterns with Radix primitives
- **Theme System**: CSS variables for light/dark mode with localStorage persistence

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via DATABASE_URL environment variable
- **Connection Pool**: pg (node-postgres) with Pool for connection management
- **Session Store**: connect-pg-simple for Express session storage

### UI Framework Dependencies
- **Radix UI**: Full suite of accessible, unstyled components (dialog, dropdown, select, tabs, etc.)
- **Embla Carousel**: For carousel/slider functionality
- **Lucide React**: Icon library
- **Class Variance Authority**: For component variant management

### Third-Party Services (Configured but may not be active)
- **Stripe**: Payment processing (included in build allowlist)
- **Nodemailer**: Email sending capability
- **OpenAI / Google Generative AI**: AI integration libraries present

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Replit Plugins**: Development banner, cartographer, and runtime error overlay for Replit environment