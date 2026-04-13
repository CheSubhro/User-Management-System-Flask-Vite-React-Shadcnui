

# API Endpoints (GET, POST, etc.)

from flask import Blueprint, request, jsonify
from controllers.user_controller import get_all_users, create_user, update_user, delete_user
from middleware.auth_middleware import token_required,admin_required

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/api/items', methods=['GET'])
@token_required
def get_items():
    try:
        users = get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_routes.route('/api/items', methods=['POST'])
@token_required
def create_item():
    data = request.json
    user_id, errors = create_user(data) 
    
    if errors:
        return jsonify({"error": "Validation Failed", "messages": errors}), 400
        
    return jsonify({"message": "Data saved!", "id": user_id}), 201

@user_routes.route('/api/items/<id>', methods=['PUT'])
@token_required
def update_item(id):
    try:
        data = request.json
        matched_count, errors = update_user(id, data)
        
        if errors:
            return jsonify({"error": "Validation Failed", "messages": errors}), 400
        
        if matched_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({"message": "Updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_routes.route('/api/items/<id>', methods=['DELETE'])
@token_required
@admin_required
def delete_item(id):
    try:
        deleted_count, error = delete_user(id)
        
        if error:
            return jsonify({"error": error}), 400
            
        if deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_routes.route('/api/items/check-email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    # MongoDB query
    exists = db.members.find_one({"email": email})
    return jsonify({"exists": True if exists else False})        