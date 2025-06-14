import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import serverless from 'serverless-http';

// Create Express app
const app = express();

// Add JSON parsing middleware with increased limit for AI content
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add comprehensive CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://astonishing-gelato-055adf.netlify.app',
    'http://localhost:5000',
    'http://localhost:3000'
  ];
  
  if (allowedOrigins.includes(origin as string)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Environment setup for Netlify
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Register all routes
registerRoutes(app);

// Create serverless handler
const serverlessHandler = serverless(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    // Set function timeout
    context.callbackWaitsForEmptyEventLoop = false;

    // Modify the path to remove the /.netlify/functions/api prefix
    const modifiedEvent = {
      ...event,
      path: event.path.replace(/^\/\.netlify\/functions\/api/, '') || '/',
      headers: {
        ...event.headers,
        'host': 'localhost:5000' // Normalize host for Express
      }
    };

    // Log request for debugging
    console.log(`${modifiedEvent.httpMethod} ${modifiedEvent.path}`);

    const result = await serverlessHandler(modifiedEvent, context);
    
    // Ensure proper response format
    const response = result as HandlerResponse;
    if (!response.headers) {
      response.headers = {};
    }
    
    // Add security headers
    response.headers['X-Content-Type-Options'] = 'nosniff';
    response.headers['X-Frame-Options'] = 'DENY';
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    
    return response;
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    };
  }
};