import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/callback",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/reset-password",
  "/api/stripe/webhook",
  "/api/analyze-product",
  "/api/generate-metabolic-plan",
  "/api/generate-recipes",
  "/api/generate-workouts",
  "/api/calculate-macros",
  "/api/chatbot",
]

// Admin routes
const adminRoutes = ["/admin-dashboard", "/api/admin"]

// Protected routes (require auth)
const protectedRoutes = [
  "/dashboard",
  "/bioscan",
  "/treinos",
  "/dieta",
  "/chat",
  "/perfil",
  "/settings",
  "/subscription",
]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.stripe.com https://*.google.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    connect-src 'self' https://api.stripe.com wss://*.supabase.co https://*.supabase.co;
    block-all-mixed-content;
    ${process.env.NODE_ENV === "development" ? "" : "upgrade-insecure-requests;"}
  `
  response.headers.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim()
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}