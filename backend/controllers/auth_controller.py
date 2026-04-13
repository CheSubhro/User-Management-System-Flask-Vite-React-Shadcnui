
# login logic with JWT (JSON Web Token)

from flask import jsonify
from config import collection
from werkzeug.security import check_password_hash
import jwt
import datetime
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret_key_123")

def login_user(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return None, "Email and password are required"

    user = collection.find_one({"email": email})
    
    if not user:
        return None, "User not found"

    if check_password_hash(user['password'], password):
        
        payload = {
            'user_id': str(user['_id']),
            'role': user.get("userRole", "Viewer"),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        
        return {
            "token": token,
            "user": {
                "id": str(user['_id']),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("userRole", "Viewer")
            }
        }, None
    
    return None, "Invalid credentials"