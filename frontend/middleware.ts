import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

// =====================================================
// PROTECTED ROUTES
// =====================================================

const protectedRoutes = [
  "/",
  "/sales",
]

// =====================================================
// MIDDLEWARE
// =====================================================

export async function middleware(
  request: NextRequest
) {

  const accessToken =
    request.cookies.get(
      "access_token"
    )?.value

  const refreshToken =
    request.cookies.get(
      "refresh_token"
    )?.value

  const pathname =
    request.nextUrl.pathname

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(route)
    )

  // ===================================================
  // NO TOKENS
  // ===================================================

  if (
    isProtectedRoute &&
    !accessToken &&
    !refreshToken
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    )
  }

  // ===================================================
  // TRY REFRESH IF ACCESS TOKEN MISSING
  // ===================================================

  if (
    isProtectedRoute &&
    !accessToken &&
    refreshToken
  ) {

    try {

      const refreshResponse =
        await fetch(
          `${API_BASE_URL}/api/auth/refresh/`,
          {
            method: "POST",

            headers: {
              cookie:
                `refresh_token=${refreshToken}`,
            },
          }
        )

      if (refreshResponse.ok) {

        const response =
          NextResponse.next()

        const setCookie =
          refreshResponse.headers.get(
            "set-cookie"
          )

        if (setCookie) {

        const accessTokenMatch =
            setCookie.match(
            /access_token=([^;]+)/
            )

        if (accessTokenMatch) {

            response.cookies.set(
            "access_token",
            accessTokenMatch[1],
            {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            }
            )
        }
        }

        return response
      }

    } catch (error) {

      console.error(error)
    }

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    )
  }

  return NextResponse.next()
}

// =====================================================
// MATCHER
// =====================================================

export const config = {

  matcher: [
    "/",
    "/sales/:path*",
  ],
}