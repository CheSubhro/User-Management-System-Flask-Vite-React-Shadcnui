
# Auth Routes (Login Routes)

from flask import Blueprint, request, jsonify
from controllers.auth_controller import login_user
from config import collection
from werkzeug.security import generate_password_hash

auth_routes = Blueprint('auth_routes', __name__)

# Signup Route
@auth_routes.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if collection.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        hashed_password = generate_password_hash(password)

        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "userRole": "Admin" 
        }

        collection.insert_one(new_user)
        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_routes.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        result, error = login_user(data)
        
        if error:
            return jsonify({"error": error}), 401
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500