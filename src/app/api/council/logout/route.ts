import { NextResponse } from "next/server";
import { COUNCIL_COOKIE, councilTestMode } from "@/lib/councilTestMode";

/** Council test mode only (404 otherwise): signs the test admin out. */
export function GET(request: Request) {
  if (!councilTestMode()) return new NextResponse(null, { status: 404 });
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    303,
  );
  response.cookies.delete(COUNCIL_COOKIE);
  return response;
}
