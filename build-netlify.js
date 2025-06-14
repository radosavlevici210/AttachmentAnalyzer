#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Build the frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Build Netlify functions
console.log('Building Netlify functions...');
execSync('esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=netlify/functions --external:@netlify/functions', { stdio: 'inherit' });

// Create a simple _redirects file for Netlify
const redirects = `
/api/* /.netlify/functions/api/:splat 200
/* /index.html 200
`;

writeFileSync('dist/public/_redirects', redirects.trim());

console.log('Netlify build complete!');