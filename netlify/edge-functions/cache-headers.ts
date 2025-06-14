export default async (request: Request, context: any) => {
  const response = await context.next();
  const url = new URL(request.url);
  
  // Cache static assets aggressively
  if (url.pathname.match(/\.(js|css|woff2|woff|png|jpg|jpeg|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Cache API responses for a short time
  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=60');
  }
  
  return response;
};

export const config = { path: "/*" };