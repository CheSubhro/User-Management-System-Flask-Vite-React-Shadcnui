

from flask import request, jsonify
from functools import wraps
import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret_key_123")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1] 
            except IndexError:
                return jsonify({"error": "Invalid Token Format!"}), 401

        if not token:
            return jsonify({"error": "Token is missing!"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            
            request.user_id = data['user_id']
            request.user_role = data.get('role', 'Viewer') 
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid Token!"}), 401

        return f(*args, **kwargs)

    return decorated

# Role Check if admin or not
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if getattr(request, 'user_role', 'Viewer') == "Admin":
            return f(*args, **kwargs)
        else:
            return jsonify({"error": "Admin access required!"}), 403 
    return decorated  