import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COUNCIL_COOKIE, councilTestMode } from "@/lib/councilTestMode";

/**
 * Council test mode only (404 otherwise): hands the signed-in test admin the
 * admin key of the throwaway local Convex backend (COUNCIL_CONVEX_ADMIN_KEY,
 * set by scripts/lib/localApp.ts at run time, never built into the bundle), so
 * the browser's Convex client can act as the test admin.
 */
export async function GET() {
  if (!councilTestMode()) return new NextResponse(null, { status: 404 });
  const signedIn = (await cookies()).get(COUNCIL_COOKIE)?.value === "1";
  const adminKey = process.env.COUNCIL_CONVEX_ADMIN_KEY;
  if (!signedIn || !adminKey) return new NextResponse(null, { status: 401 });
  return NextResponse.json(
    { adminKey },
    { headers: { "cache-control": "no-store" } },
  );
}
