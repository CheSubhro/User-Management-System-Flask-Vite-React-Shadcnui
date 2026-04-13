
# # API Endpoints (GET, POST, etc.)

# from flask import Blueprint, request, jsonify
# from bson import ObjectId
# from config import collection
# import sys
# from werkzeug.security import generate_password_hash

# item_routes = Blueprint('item_routes', __name__)

# @item_routes.route('/api/items', methods=['POST'])
# def create_item():
#     try:
#         data = request.json
#         if not data:
#             return jsonify({"error": "No data provided"}), 400

#         # --- NEW: Password Hashing ---
#         if 'password' in data and data['password']:
#             data['password'] = generate_password_hash(data['password'])
            
#         # --- NEW: Type Casting ---
#         if 'age' in data and data['age']:
#             try:
#                 data['age'] = int(data['age'])
#             except ValueError:
#                 pass 

#         result = collection.insert_one(data)
#         return jsonify({"message": "Data saved!", "id": str(result.inserted_id)}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @item_routes.route('/api/items', methods=['GET'])
# def get_items():
#     try:
#         items = []
#         for item in collection.find():
#             item['_id'] = str(item['_id'])
#             items.append(item)
#         return jsonify(items), 200
#     except Exception as e:
#         return jsonify({"error": "Failed to fetch items"}), 500

# @item_routes.route('/api/items/<id>', methods=['PUT'])
# def update_item(id):
#     try:
#         data = request.json
#         if not ObjectId.is_valid(id):
#             return jsonify({"error": "Invalid ID format"}), 400
        
#         if 'password' in data and data['password']:
#             if len(data['password']) < 20: 
#                 data['password'] = generate_password_hash(data['password'])

#         result = collection.update_one({"_id": ObjectId(id)}, {"$set": data})
        
#         if result.matched_count == 0:
#             return jsonify({"error": "Item not found"}), 404
            
#         return jsonify({"message": "Updated successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @item_routes.route('/api/items/<id>', methods=['DELETE'])
# def delete_item(id):
#     try:
#         if not ObjectId.is_valid(id):
#             return jsonify({"error": "Invalid ID format"}), 400
            
#         result = collection.delete_one({"_id": ObjectId(id)})
        
#         if result.deleted_count == 0:
#             return jsonify({"error": "Item not found"}), 404
            
#         return jsonify({"message": "Deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500