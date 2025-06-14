# AI Studio Pro - Netlify Deployment Guide

## Overview

AI Studio Pro is a comprehensive full-stack web application providing unlimited AI-powered content generation with professional-grade capabilities including movie production, music creation, voice synthesis, and content analysis.

## Quick Netlify Deployment

### 1. Environment Variables

Set these in your Netlify dashboard under Site Settings > Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

### 2. Build Settings

- Build command: `npm run build`
- Publish directory: `dist/public`
- Functions directory: `netlify/functions`

### 3. Deploy

Connect your repository to Netlify and deploy. The application will automatically:
- Build the React frontend
- Create serverless functions for the API
- Configure proper redirects and caching

## Local Development

```bash
npm install
npm run dev
```

The application runs on port 5000 with both frontend and backend.

## Features

- **Unlimited Movie Production**: Script-to-video with 8K/4K quality
- **Music Creation**: Lyrics-to-music with professional mastering
- **Voice Generation**: Text-to-speech with multiple profiles
- **Content Analysis**: AI-powered content optimization
- **Batch Processing**: Parallel project generation
- **Professional Timeline**: Multi-track editing interface

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js serverless functions
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API integration
- **Deployment**: Netlify with edge functions

## Performance Optimizations

- Static asset caching (1 year)
- Code splitting and lazy loading
- Edge function caching
- Optimized bundle sizes
- Progressive web app features

## Security

- Environment variable isolation
- CORS protection
- Content Security Policy headers
- Input validation with Zod schemas
- Secure session management