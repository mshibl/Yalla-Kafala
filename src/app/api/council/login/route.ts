import { NextResponse } from "next/server";
import { COUNCIL_COOKIE, councilTestMode } from "@/lib/councilTestMode";

/** Council test mode only (404 otherwise): signs the browser in as the test admin. */
export function GET(request: Request) {
  if (!councilTestMode()) return new NextResponse(null, { status: 404 });
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(COUNCIL_COOKIE, "1", { path: "/", sameSite: "lax" });
  return response;
}
