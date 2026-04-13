
# Database logic/CRUD functionality

from bson import ObjectId
from config import collection
from werkzeug.security import generate_password_hash
from models.user_schema import user_schema
from marshmallow import ValidationError
from flask import request

def get_all_users():
    current_user_role = getattr(request, 'user_role', 'Viewer')
    
    query = {}
    
    if current_user_role == "Viewer":
        query = {"userRole": {"$ne": "Admin"}}
    else:
        query = {}

    # Database query
    users_cursor = collection.find(query)

    items = []
    for item in users_cursor:
        item['_id'] = str(item['_id'])
        if 'password' in item:
            del item['password']
        items.append(item)
        
    return items

def create_user(data):
    try:
        # Validate Data
        validated_data = user_schema.load(data)
        
        # Hash Password
        if 'password' in validated_data:
            validated_data['password'] = generate_password_hash(validated_data['password'])
            
        # Insert into DB
        result = collection.insert_one(validated_data)
        return str(result.inserted_id), None
        
    except ValidationError as err:
        return None, err.messages

def update_user(user_id, data):
    if not ObjectId.is_valid(user_id):
        return None, "Invalid ID format"

    if not data.get('password'):
        data.pop('password', None)

    data.pop('_id', None)    
    
    current_user_role = getattr(request, 'user_role', 'Viewer')
    
    # Role Protection
    if current_user_role == "Editor":
        target_user = collection.find_one({"_id": ObjectId(user_id)})
        if target_user and target_user.get("userRole") == "Admin":
            return None, "Editors cannot modify Admin data"

    try:
        validated_data = user_schema.load(data, partial=True)
        
        # Security
        if current_user_role != "Admin" and 'userRole' in validated_data:
            del validated_data['userRole']

        if 'password' in validated_data and validated_data['password']:
            if not validated_data['password'].startswith('scrypt:'): 
                validated_data['password'] = generate_password_hash(validated_data['password'])

        result = collection.update_one(
            {"_id": ObjectId(user_id)}, 
            {"$set": validated_data}
        )
        return result.matched_count, None
        
    except ValidationError as err:
        return None, err.messages

def delete_user(user_id):
    if not ObjectId.is_valid(user_id):
        return None, "Invalid ID format"
    
    current_user_role = getattr(request, 'user_role', 'Viewer')
    
    if current_user_role != "Admin":
        return None, "Only Admins can delete users"

    result = collection.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count, None