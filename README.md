🎨 RangSutra AI

AI-Powered Creative Collaboration Platform

AI should amplify human imagination, not replace it.

RangSutra AI is an AI-powered creative collaboration platform designed for writers, artists, students, and creators. It helps transform initial ideas into meaningful creative projects while keeping human creativity and decision-making at the center.

✨ Key Features

- Idea Studio: Turn original ideas into creative directions.
- AI Creative Directions: Generate three creative approaches — Emotional, Cinematic, and Experimental.
- Creative Editor: Write, edit, and improve creative content.
- AI Rewrite: Get AI-powered writing suggestions.
- Grammar Improvement: Improve writing quality with AI.
- Creator Credit Ledger: Track human and AI contributions.
- Project History: Save, continue, export, and delete projects.
- Responsive Design: Works across desktop and mobile devices.

🛠️ Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript
- Lucide Icons

Backend

- Node.js
- Express.js
- REST API

AI Integration

- Google Gemini API
- "@google/genai"

Storage

- Browser LocalStorage

📁 Project Structure

RangSutra-AI/
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── index.html
│   ├── dashboard.html
│   ├── studio.html
│   └── editor.html
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── .gitignore

⚙️ Installation & Setup

1. Clone the Repository

git clone https://github.com/shantanudas20000-ship-it/RangSutra-AI.git

2. Navigate to Backend

cd RangSutra-AI/backend

3. Install Dependencies

npm install

4. Configure Environment Variables

Create a ".env" file inside the backend folder.

PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_supported_gemini_model

Replace the placeholder with your own Gemini API key.

Never upload your actual API key or ".env" file to GitHub.

5. Start the Backend

npm run dev

6. Open the Frontend

Open "frontend/index.html" in your browser.

🔐 Security

- API keys are stored in environment variables.
- ".env" files are excluded through ".gitignore".
- Never share private API credentials.

🎯 Project Vision

RangSutra AI aims to make creative technology more accessible while preserving human originality, creative ownership, and decision-making.

Human imagination leads. AI assists.

👥 Team

Team Name: MindMatrix

📄 License

This project is currently developed as a hackathon prototype.
