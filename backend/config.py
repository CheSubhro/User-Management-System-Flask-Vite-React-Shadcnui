
# Database configuration

import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

# Load environment variables from the .env file
load_dotenv()
ca = certifi.where()

# Retrieve the MongoDB URI from the environment variables
MONGO_URI = os.getenv("MONGO_URI")

try:
    # Initialize the MongoDB client
    client = MongoClient(MONGO_URI,tlsCAFile=ca)
    
    # Define the Database and Collection
    db = client['my_crud_app']
    collection = db['items']
    
    # Send a ping to the server to verify the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
    
except Exception as e:
    # Print error details if the connection fails
    print(f"Error connecting to MongoDB: {e}")