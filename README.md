User Management System
A professional Full-Stack Application built for managing member records efficiently. It features a clean, responsive UI with a powerful Flask backend.

Tech Stack
Frontend:
React.js (Vite)
Tailwind CSS & Shadcn UI
React Hook Form & Zod (Validation)
Lucide React (Icons)

Backend:
Python (Flask)
Python-dotenv (Environment Management)
Flask-CORS

Project Structure
User Management System/
├── backend/            # Flask API & Business Logic
│   ├── .env           # Environment variables (Ignored by Git)
│   ├── app.py         # Main entry point
│   └── requirements.txt
└── frontend/           # Vite + React UI
    ├── src/
    ├── components/    # Shadcn & Custom components
    └── package.json

 Installation & Setup
 Backend Setup
    cd backend
    python -m venv venv
    # Activate virtual environment
    source venv/bin/activate  # For Mac/Linux
    venv\Scripts\activate     # For Windows
    
    pip install -r requirements.txt
    python app.py

 Frontend Setup
    cd frontend
    npm install
    npm run dev

Features

Advanced Form Handling: Multi-column grid layout with strict Zod validation.
Member Tracking: Manage name, email, DOB, professional skills, and GitHub profiles.
Responsive Design: Fully optimized for Mobile, Tablet, and Desktop using Tailwind CSS.
Role Management: Assign roles like Admin, Editor, or Viewer.
Security: Environment-based configuration for API keys and sensitive data.  

Author
CheSubhro
GitHub: @CheSubhro
