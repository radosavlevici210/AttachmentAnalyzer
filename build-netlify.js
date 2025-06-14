import { build } from 'vite';
import { build as esbuild } from 'esbuild';
import { execSync } from 'child_process';

async function buildForNetlify() {
  console.log('🚀 Building for Netlify production deployment...');
  
  try {
    // Build frontend with Vite
    console.log('📦 Building frontend...');
    await build();
    
    // Build Netlify function
    console.log('⚡ Building Netlify functions...');
    await esbuild({
      entryPoints: ['netlify/functions/api.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: 'netlify/functions',
      outExtension: { '.js': '.mjs' },
      external: ['@neondatabase/serverless'],
      banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
      }
    });
    
    console.log('✅ Netlify build completed successfully!');
    console.log('🌐 Ready for deployment at astonishing-gelato-055adf.netlify.app');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForNetlify();