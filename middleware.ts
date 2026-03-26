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

  // /tenshoku 以下へのアクセスにBasic認証を適用
  if (request.nextUrl.pathname.startsWith("/tenshoku")) {
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      const base64 = authHeader.split(" ")[1];
      const decoded = Buffer.from(base64, "base64").toString("utf-8");
      const [id, pass] = decoded.split(":");

      if (id === "demo" && pass === "demo") {
        return NextResponse.next();
      }
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/demo/:path*", "/tenshoku/:path*"],
};
