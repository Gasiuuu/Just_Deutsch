import jwt
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken



class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access')
        if raw_token is None:
            return None
        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except(InvalidToken, TokenError):
            return None


class JWTRefreshMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get('access')
        refresh_token = request.COOKIES.get('refresh')

        if not access_token and not refresh_token:
            return None

        if access_token:
            try:
                decoded = jwt.decode(
                    access_token,
                    options={"verify_signature": False}
                )
                return None
            except jwt.ExpiredSignatureError:
                pass
            except jwt.InvalidTokenError:
                request._jwt_refresh_failed = True
                return None

        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                new_access_token = str(refresh.access_token)

                request._new_access_token = new_access_token

                if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
                    request._new_refresh_token = str(refresh)

                request.COOKIES = request.COOKIES.copy()
                request.COOKIES['access'] = new_access_token

            except TokenError:
                request._jwt_refresh_failed = True

        return None

    def process_response(self, request, response):
        if hasattr(request, '_jwt_refresh_failed'):
            self.delete_jwt_cookies(response)
            return response

        if hasattr(request, '_new_access_token'):
            access_max_age = int(
                settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
            )

            response.set_cookie(
                key='access',
                value=request._new_access_token,
                max_age=access_max_age,
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/'
            )

        if hasattr(request, '_new_refresh_token'):
            refresh_max_age = int(
                settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
            )

            response.set_cookie(
                key='refresh',
                value=request._new_refresh_token,
                max_age=refresh_max_age,
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/'
            )

        return response