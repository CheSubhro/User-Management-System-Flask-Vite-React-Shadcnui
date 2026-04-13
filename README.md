
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

<img width="1115" height="641" alt="signup" src="https://github.com/user-attachments/assets/31abfb2e-6a99-4ad5-a72b-270ddb25a275" />
<img width="1115" height="641" alt="404page" src="https://github.com/user-attachments/assets/1428a412-39bd-4dc6-b6bf-e05dbff01c95" />
<img width="1100" height="1493" alt="admin" src="https://github.com/user-attachments/assets/286e885e-fd48-48a2-84d6-657caa7ad29a" />
<img width="1100" height="1493" alt="admin_edit" src="https://github.com/user-attachments/assets/caf1bb5f-cdc0-4970-888f-7a5cf8ba5ff6" />
<img width="1100" height="1525" alt="admin_delete" src="https://github.com/user-attachments/assets/639883ce-2370-4714-8fb7-47c6770c0f89" />
<img width="1100" height="1399" alt="viewer" src="https://github.com/user-attachments/assets/b48f0b4b-8569-4035-9b6a-75419883eeee" />
<img width="1100" height="1493" alt="editor" src="https://github.com/user-attachments/assets/47046755-5e7e-49f3-8092-a227b1b986ee" />
<img width="1115" height="641" alt="login" src="https://github.com/user-attachments/assets/fe431225-acd3-49f7-89de-1b27ce607257" />


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
