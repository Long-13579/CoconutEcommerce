from rest_framework_simplejwt.authentication import JWTAuthentication

def get_user_id_from_request(request):
    jwt_auth = JWTAuthentication()
    result = jwt_auth.authenticate(request)
    if result is not None:
        user, token = result
        return token.payload["user_id"]   # <- here
    return None
