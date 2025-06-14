import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import express from 'express';
import { registerRoutes } from '../../server/routes';

const app = express();

// Register all routes
registerRoutes(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    const { path, httpMethod, headers, body } = event;
    
    // Remove /api prefix for internal routing
    const cleanPath = path.replace(/^\/api/, '') || '/';
    
    return new Promise<HandlerResponse>((resolve, reject) => {
      const req = {
        method: httpMethod,
        url: cleanPath,
        headers,
        body: body ? JSON.parse(body) : undefined,
      } as any;

      const res = {
        statusCode: 200,
        headers: {},
        body: '',
        status: function(code: number) {
          this.statusCode = code;
          return this;
        },
        json: function(data: any) {
          this.headers['Content-Type'] = 'application/json';
          this.body = JSON.stringify(data);
          return this;
        },
        send: function(data: any) {
          this.body = typeof data === 'string' ? data : JSON.stringify(data);
          return this;
        },
        end: function() {
          resolve({
            statusCode: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
        }
      } as any;

      // Handle the request through Express
      app(req, res);
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};