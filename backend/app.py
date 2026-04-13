from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

from routes.auth_routes import auth_routes # Login Route import
from routes.user_routes import user_routes # User Route import



app = Flask(__name__)
CORS(app)


app.register_blueprint(auth_routes) # Login routes
app.register_blueprint(user_routes) # User routes


if __name__ == '__main__':
    app.run(debug=True, port=5000)