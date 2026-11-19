import { SignIn } from "@clerk/nextjs";
import { councilTestMode } from "@/lib/councilTestMode";

export default function LoginPage() {
  // Council test mode (src/lib/councilTestMode.ts): no Clerk, a link instead.
  if (councilTestMode()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Admin sign-in (test mode)</h1>
        <p className="max-w-sm text-center text-sm text-gray-600">
          This copy of the site runs on a throwaway local backend. Sign-in with
          Clerk is switched off here.
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- an API route, not a page */}
        <a
          href="/api/council/login"
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Sign in as the test admin
        </a>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn path="/admin/login" />
    </div>
  );
}
