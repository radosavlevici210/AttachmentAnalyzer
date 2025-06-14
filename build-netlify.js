#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, copyFileSync, existsSync } from 'fs';

// Build the frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Build Netlify functions
console.log('Building Netlify functions...');
execSync('esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=netlify/functions --external:@netlify/functions', { stdio: 'inherit' });

// Copy _redirects to publish directory
const redirects = `/api/* /.netlify/functions/api/:splat 200
/* /index.html 200`;
writeFileSync('dist/public/_redirects', redirects);

// Copy _headers to publish directory
const headers = `# Cache static assets
/static/*
  Cache-Control: public, max-age=31536000, immutable

# Cache JS and CSS files
/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

# Cache fonts
/*.woff2
  Cache-Control: public, max-age=31536000, immutable

/*.woff
  Cache-Control: public, max-age=31536000, immutable

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# API headers
/api/*
  Cache-Control: no-cache, no-store, must-revalidate
  X-Content-Type-Options: nosniff`;

writeFileSync('dist/public/_headers', headers);

console.log('Netlify build complete with headers and redirects!');