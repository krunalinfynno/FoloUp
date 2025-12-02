import {
  clerkMiddleware,
  clerkClient,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ALLOWED_INTERNAL_EMAILS = [
  "krutik@infynno.com",
  "bhavdip@infynno.com",
  "ronak@infynno.com",
  "krunal@infynno.com",
  "krunal.infynno@gmail.com",
  "nisarg.infynno@gmail.com",
] as const;

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/403",
  "/interview(.*)",
  "/call(.*)",
  "/api/register-call(.*)",
  "/api/get-call(.*)",
  "/api/generate-interview-questions(.*)",
  "/api/create-interviewer(.*)",
  "/api/analyze-communication(.*)",
  "/api/check-invite(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/interview(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  // Require authentication for all non‑public routes.
  if (!isPublicRoute(req)) {
    await auth().protect();
  }

  // If route is marked as protected, additionally enforce the email allowlist.
  if (userId && isProtectedRoute(req)) {
    const user = await clerkClient.users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();

    const isAllowed =
      !!email &&
      ALLOWED_INTERNAL_EMAILS.some(
        (allowed) => allowed.toLowerCase() === email,
      );

    if (!isAllowed) {
      // The user is signed in but not allowed to access internal routes; show a 403 page.
      const url = new URL("/403", req.url);

      return NextResponse.redirect(url);
    }
  }

  // If route is protected and user is not signed in, send them to Clerk sign‑in.
  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
