// API configuration for production and development
const getBaseUrl = () => {
  if (typeof window === 'undefined') return '';
  
  // Check if we're in production (Netlify)
  if (window.location.hostname.includes('netlify.app')) {
    return window.location.origin;
  }
  
  // Development mode
  return '';
};

export const API_BASE_URL = getBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  projects: '/api/projects',
  generateMovie: '/api/generate/movie',
  generateMusic: '/api/generate/music',
  generateVoice: '/api/generate/voice',
  analyze: '/api/analyze',
  batchGenerate: '/api/generate/batch',
} as const;

// Helper function for making API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}