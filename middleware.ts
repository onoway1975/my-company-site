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

  // /renewal 以下へのアクセスにBasic認証を適用
  if (request.nextUrl.pathname.startsWith("/renewal")) {
    const auth = request.headers.get("authorization");
    if (!auth || !isValidAuth(auth, "renewal")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Renewal Advisor"',
        },
      });
    }
  }

  // /flowermail 以下へのアクセスにBasic認証を適用
  if (request.nextUrl.pathname.startsWith("/flowermail")) {
    const auth = request.headers.get("authorization");
    if (!auth || !isValidAuth(auth, "flowermail")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="flowermail"',
        },
      });
    }
  }

  return NextResponse.next();
}

function isValidAuth(auth: string, scope: "renewal" | "flowermail") {
  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") return false;
  const [user, pass] = Buffer.from(credentials, "base64")
    .toString()
    .split(":");
  if (scope === "flowermail") {
    return user === "flower" && pass === "mail";
  }
  return (
    user === process.env.RENEWAL_BASIC_USER &&
    pass === process.env.RENEWAL_BASIC_PASS
  );
}

export const config = {
  matcher: ["/demo/:path*", "/renewal/:path*", "/flowermail/:path*"],
};
