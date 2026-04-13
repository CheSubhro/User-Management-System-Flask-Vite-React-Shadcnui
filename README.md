
# 👥 User Management System

A professional **Full-Stack Application** built for managing member records efficiently. It features a clean, responsive UI with a powerful Flask backend.

---

## 🚀 Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS & Shadcn UI
* **Validation:** React Hook Form & Zod
* **Icons:** Lucide React

### **Backend**
* **Framework:** Python (Flask)
* **Environment:** Python-dotenv
* **Cross-Origin:** Flask-CORS

---

## 📁 Project Structure

```text
User Management System/
├── backend/            # Flask API & Business Logic
│   ├── .env           # Environment variables (Ignored by Git)
│   ├── app.py         # Main entry point
│   └── requirements.txt
└── frontend/           # Vite + React UI
    ├── src/
    ├── components/    # Shadcn & Custom components
    └── package.json
cd backend
python -m venv venv

# Activate virtual environment
# For Mac/Linux:
source venv/bin/activate  
# For Windows:
venv\Scripts\activate     

pip install -r requirements.txt
python app.py

cd frontend
npm install
npm run dev

Features
Advanced Form Handling: Multi-column grid layout with strict Zod validation.

Member Tracking: Manage name, email, DOB, professional skills, and GitHub profiles.

Responsive Design: Fully optimized for Mobile, Tablet, and Desktop using Tailwind CSS.

Role Management: Assign roles like Admin, Editor, or Viewer.

Security: Environment-based configuration (.env) for API keys and sensitive data.

Author
CheSubhro

GitHub: @CheSubhro
