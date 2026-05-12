from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import (
    RefreshToken,
)

from rest_framework_simplejwt.tokens import RefreshToken



# =====================================================
# LOGIN
# =====================================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get(
            "email"
        )

        password = request.data.get(
            "password"
        )

        user = authenticate(
            email=email,
            password=password,
        )

        if not user:

            return Response(
                {
                    "detail":
                        "Invalid credentials."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        access_token = str(
            refresh.access_token
        )

        refresh_token = str(refresh)

        response = Response(
            {
                "detail":
                    "Login successful."
            },
            status=status.HTTP_200_OK,
        )

        # =================================================
        # ACCESS COOKIE
        # =================================================

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # TRUE in production HTTPS
            samesite="Lax",
        )

        # =================================================
        # REFRESH COOKIE
        # =================================================

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,  # TRUE in production HTTPS
            samesite="Lax",
        )

        return response


# =====================================================
# REFRESH
# =====================================================

class RefreshView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        try:

            refresh_token = request.COOKIES.get(
                "refresh_token"
            )

            if not refresh_token:

                return Response(
                    {
                        "detail":
                            "Refresh token missing."
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            refresh = RefreshToken(
                refresh_token
            )

            access_token = str(
                refresh.access_token
            )

            response = Response(
                {
                    "detail":
                        "Token refreshed."
                },
                status=status.HTTP_200_OK,
            )

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
            )

            return response

        except Exception:

            return Response(
                {
                    "detail":
                        "Invalid refresh token."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )


# =====================================================
# LOGOUT
# =====================================================

class LogoutView(APIView):

    def post(self, request):

        try:

            refresh_token = request.COOKIES.get(
                "refresh_token"
            )

            if refresh_token:

                token = RefreshToken(
                    refresh_token
                )

                token.blacklist()

            response = Response(
                {
                    "detail":
                        "Logged out successfully."
                },
                status=status.HTTP_200_OK,
            )

            response.delete_cookie(
                "access_token"
            )

            response.delete_cookie(
                "refresh_token"
            )

            return response

        except Exception:

            return Response(
                {
                    "detail":
                        "Logout failed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# =====================================================
# CURRENT USER
# =====================================================

class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({

            "id":
                user.id,

            "email":
                user.email,

            "role":
                user.role,

            "is_staff":
                user.is_staff,

            "is_superuser":
                user.is_superuser,

            "is_active":
                user.is_active,

            "date_joined":
                user.date_joined,
        })
    
