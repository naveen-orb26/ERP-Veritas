from rest_framework_simplejwt.authentication import (
    JWTAuthentication,
)


class CookieJWTAuthentication(
    JWTAuthentication
):

    def authenticate(self, request):

        print("\n=== COOKIE AUTH START ===")

        access_token = request.COOKIES.get(
            "access_token"
        )

        print("TOKEN:", access_token)

        if not access_token:

            print("NO TOKEN FOUND")

            return None

        try:

            validated_token = (
                self.get_validated_token(
                    access_token
                )
            )

            print("TOKEN VALIDATED")

            user = self.get_user(
                validated_token
            )

            print("USER:", user)

            return (user, validated_token)

        except Exception as e:

            print("AUTH ERROR:", str(e))

            return None