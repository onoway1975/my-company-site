import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // /demo 以下へのアクセスを本番環境のみブロック
  if (request.nextUrl.pathname.startsWith("/demo")) {
    const isProduction =
      process.env.NEXT_PUBLIC_APP_ENV === "production" ||
      process.env.VERCEL_ENV === "production";

    if (isProduction) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/demo/:path*"],
};
