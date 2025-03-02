export const routeConfig = {
  // Cache for 1 hour
  revalidate: 3600,
  
  // Configure dynamic behavior
  dynamic: 'force-static',
  
  // Configure runtime
  runtime: 'edge',
  
  // Configure fetch caching
  fetchCache: 'force-cache',
  
  // Configure prefetch
  prefetch: true,
} as const;

// Shared metadata configuration
export const sharedMetadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  
  // Default cache control headers
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
  },
} as const; 