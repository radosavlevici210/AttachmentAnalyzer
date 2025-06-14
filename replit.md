# AI Studio Pro - Comprehensive Architecture Guide

## Overview

AI Studio Pro is a full-stack web application that provides professional-grade AI-powered content generation services. The platform supports movie production, music creation, voice synthesis, and content analysis through a modern, dark-themed interface with neon accents. Built with React, Express.js, and PostgreSQL, it offers a complete studio experience for AI-powered creative content generation.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom neon theme variables
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for content generation
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon Database serverless PostgreSQL
- **Migration**: Drizzle Kit for schema management
- **Schema**: Shared TypeScript schema definitions with Zod validation

## Key Components

### Core Entities
1. **Users**: Authentication and user management
2. **Projects**: Content creation projects with different types (movie, music, voice, analysis)
3. **Generations**: Individual AI generation requests and results

### Content Generation Services
1. **Movie Production**: Script-to-video generation with quality settings
2. **Music Production**: Lyrics-to-music generation with style options
3. **Voice Generation**: Text-to-speech with voice selection
4. **AI Analysis**: Content analysis for various media types

### UI Components
- **Studio Interface**: Main production dashboard
- **Sidebar**: Project management and quick tools
- **Right Panel**: AI model selection and production controls
- **Timeline**: Production progress visualization
- **Waveform**: Audio visualization component

## Data Flow

### Project Creation Flow
1. User creates a new project through the studio interface
2. Project data is validated using Zod schemas
3. Project is stored in PostgreSQL via Drizzle ORM
4. Real-time updates are managed through TanStack Query

### AI Generation Flow
1. User submits generation request (movie, music, voice, or analysis)
2. Request is validated and processed by respective service
3. OpenAI API is called with structured prompts
4. Generation results are stored and linked to the project
5. Frontend receives updates and displays results

### Data Persistence
- Projects and generations are stored in PostgreSQL
- JSON fields store flexible content data and settings
- Timestamps track creation and modification dates
- User sessions are managed with PostgreSQL-backed storage

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL)
- **AI Services**: OpenAI API
- **Development**: Replit environment with Node.js 20

### Key NPM Packages
- **Frontend**: React, Vite, TanStack Query, Radix UI, Tailwind CSS
- **Backend**: Express.js, Drizzle ORM, connect-pg-simple
- **Shared**: Zod for validation, TypeScript for type safety

### Development Tools
- **Build**: Vite for frontend, esbuild for backend
- **Database**: Drizzle Kit for migrations
- **Type Checking**: TypeScript compiler
- **Runtime**: TSX for development execution

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with HMR
- **Port Configuration**: Port 5000 for development

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Deployment**: Autoscale deployment target
- **Environment**: Production Node.js with built assets

### Environment Configuration
- **Database**: DATABASE_URL environment variable
- **AI Services**: OPENAI_API_KEY environment variable
- **Session**: Secure session configuration for production

## Changelog

Changelog:
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.