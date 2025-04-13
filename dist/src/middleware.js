"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const server_1 = require("@clerk/nextjs/server");
// Define protected and public routes
const isProtectedRoute = (0, server_1.createRouteMatcher)(['/console(.*)']);
const isPublicRoute = (0, server_1.createRouteMatcher)(['/app(.*)', '/auth/sign-in(.*)', '/auth/sign-up(.*)']);
exports.default = (0, server_1.clerkMiddleware)(async (auth, req) => {
    // If the request is for a public route, allow access without authentication
    if (isPublicRoute(req)) {
        return;
    }
    // If the route is protected and the user is not authenticated, restrict access
    if (isProtectedRoute(req)) {
        await auth.protect(); // This ensures the user is authenticated; if not, they are redirected to the sign-in page
    }
});
exports.config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
