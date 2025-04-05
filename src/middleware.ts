import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected and public routes
const isProtectedRoute = createRouteMatcher(['/console(.*)']);
const isPublicRoute = createRouteMatcher(['/app(.*)', '/auth/sign-in(.*)', '/auth/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Get the response from Clerk middleware
  let response;

  try {
    // If the request is for a public route, allow access without authentication
    if (isPublicRoute(req)) {
      response = NextResponse.next();
    }
    // If the route is protected and the user is not authenticated, restrict access
    else if (isProtectedRoute(req)) {
      await auth.protect(); // This ensures the user is authenticated; if not, they are redirected to the sign-in page
      response = NextResponse.next();
    } else {
      response = NextResponse.next();
    }
  } catch (error) {
    // Let Clerk handle the authentication error
    return;
  }

  // Add CORS headers to all responses (including API routes)
  if (response) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, clerk-frontend-api');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return response;
    }
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};