# AI Studio Pro - Comprehensive Architecture Guide

## Overview

AI Studio Pro is a comprehensive full-stack web application that provides unlimited AI-powered content generation services with professional-grade capabilities. The platform now supports unlimited movie production, music creation, voice synthesis, and content analysis with advanced features including batch processing, real-time preview, timeline visualization, and professional export options. Built with React, Express.js, and enhanced OpenAI integration, it offers a complete studio experience for unlimited AI-powered creative content generation.

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
1. **Unlimited Movie Production**: Professional script-to-video generation with 8K/4K/IMAX quality, Dolby Atmos audio, scene breakdown, and cinematic production planning
2. **Unlimited Music Creation**: Advanced lyrics-to-music generation with professional mastering, detailed song structure, instrumentation analysis, and high-fidelity audio output
3. **Professional Voice Generation**: Text-to-speech with multiple voice profiles, speed control, and technical audio specifications
4. **AI Content Analysis**: Comprehensive content analysis for scripts, lyrics, and multimedia with mood detection and optimization suggestions
5. **Batch Processing**: Unlimited parallel processing of multiple projects with priority queuing and real-time progress tracking

### UI Components
- **Studio Interface**: Main production dashboard with dual-view (dashboard/production)
- **Project Dashboard**: Comprehensive project management with grid/list views, search, filtering, and batch operations
- **Timeline**: Professional timeline editor with multi-track support, playback controls, and precision editing
- **AI Model Panel**: Advanced AI model selection with quality settings, batch processing, and real-time generation progress
- **Production Components**: Enhanced movie, music, voice, and analysis production interfaces
- **Navigation Sidebar**: Minimal navigation with dashboard and production mode switching
- **Waveform Visualization**: Professional audio waveform display with dynamic data

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

- June 14, 2025: Successfully migrated from Replit Agent to standard Replit environment with Netlify deployment
  - Successfully migrated project from Replit Agent to standard Replit environment
  - Configured secure OpenAI API integration with proper environment variables
  - Verified all core components working (Express server, React frontend, AI services)
  - Set up proper client/server separation with security best practices
  - Completed Netlify deployment configuration with serverless functions
  - Built production-ready application with optimized assets
  - Deployed to https://astonishing-gelato-055adf.netlify.app/
  - Connected to GitHub repository: https://github.com/radosavlevici210/AttachmentAnalyzer.git
- June 14, 2025: Enhanced AI Studio Pro with unlimited music and video creation capabilities
  - Added comprehensive ProjectDashboard component with grid/list views, search, filtering, and batch operations
  - Implemented professional Timeline component with multi-track support and playback controls
  - Created AIModelPanel with advanced model selection, quality settings (8K/4K/IMAX/HD), and real-time progress tracking
  - Extended OpenAI service with unlimited creation capabilities for movies and music
  - Added batch processing functionality for parallel project generation
  - Enhanced schema with duration, quality, and genre fields for unlimited content creation
  - Integrated professional audio enhancements (Dolby Atmos, DTS:X, Surround)
  - Implemented dual-view studio interface (dashboard/production modes)
- June 14, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.