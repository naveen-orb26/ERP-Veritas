import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = [
  "/sales",
  "/test",
]

export function proxy(
  request: NextRequest
) {

  const accessToken =
    request.cookies.get(
      "access_token"
    )?.value

  const pathname =
    request.nextUrl.pathname

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(route)
    )

  if (
    isProtectedRoute &&
    !accessToken
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {

  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}