import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { create } from 'domain';
import { NextResponse } from 'next/server';
// Define protected and public routes
const isProtectedRoute = createRouteMatcher(['/console(.*)']);
const isPublicRoute = createRouteMatcher(['/app(.*)', '/auth/sign-in(.*)', '/auth/sign-up(.*)']);
export default clerkMiddleware(async (auth, req) => {
  // If the request is for a public route, allow access without authentication
  if (isPublicRoute(req)) {
    return;
  }

  // If the route is protected and the user is not authenticated, restrict access
  if (isProtectedRoute(req)) {
    await auth.protect(); // This ensures the user is authenticated; if not, they are redirected to the sign-in page
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
