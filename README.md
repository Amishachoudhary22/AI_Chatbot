🤖 AI Chatbot Web Application

An intelligent, full-stack AI Chatbot that enables real-time, context-aware conversations using the Google Gemini API, built with Spring Boot, React.js, and MongoDB Atlas.
The project supports secure authentication, chat history management, and a sleek dark/light mode interface for a modern user experience.

🚀 Features

🔐 User Authentication — Register and log in securely with JWT tokens and BCrypt password encryption

💬 AI Conversations — Real-time AI chat powered by Google Gemini API

🧠 Persistent Chat History — Retrieve and continue previous chats seamlessly

📝 Chat Management — Rename or delete chats dynamically

🌗 Dark / Light Mode — Switch themes instantly for better usability

⚡ Full-Stack Integration — Frontend (React.js) + Backend (Spring Boot) + Database (MongoDB Atlas)

☁️ Cloud Database — All user and chat data stored securely in MongoDB Atlas

🏗️ Tech Stack
Layer	Technology Used	Purpose
Frontend	React.js, Tailwind CSS	User Interface & Interaction
Backend	Spring Boot (Java)	REST APIs, Business Logic
Database	MongoDB Atlas	Cloud Storage for Users & Chats
AI API	Google Gemini API	AI-based Chat Responses
Security	JWT, BCrypt	Authentication & Password Encryption
🧩 Project Structure
ai-chatbot-app/
│
├── backend/
│   ├── src/main/java/com/chatbot/backend/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── BackendApplication.java
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/Amishachoudhary22/AI-Chatbot.git
cd AI-Chatbot

2️⃣ Backend Setup
cd backend


Open application.properties and configure:

spring.data.mongodb.uri=your_mongodb_connection_string
gemini.api.key=your_gemini_api_key
jwt.secret=your_jwt_secret_key


Run the backend:

mvn spring-boot:run


Server will start at: http://localhost:8080

3️⃣ Frontend Setup
cd frontend
npm install
npm start


App will start at: http://localhost:3000

🧠 How It Works

Users register or log in securely (credentials hashed using BCrypt).

The backend authenticates users with JWT tokens.

Chat sessions are created and stored in MongoDB.

Messages are sent to the Gemini API, and responses are returned to the frontend.

Each conversation is saved and retrieved dynamically for continuity.

🧾 API Endpoints
Endpoint	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	Log in user and generate JWT
/api/chat/history	GET	Fetch user’s chat history
/api/chat/new	POST	Create a new chat session
/api/chat/{chatId}/message	POST	Send message & get AI response
/api/chat/{chatId}/rename	PUT	Rename existing chat
/api/chat/{chatId}	DELETE	Delete a chat session
🧑‍💻 Example .env (Frontend)
REACT_APP_BACKEND_URL=http://localhost:8080

📸 Screenshots (Optional)

Add screenshots here once deployed

/frontend/public/screenshots/

🌐 Deployment

Backend: Deploy using Render, Railway, or Heroku

Frontend: Deploy using Vercel, Netlify, or Firebase

Database: Hosted on MongoDB Atlas

👩‍💻 Author

Amisha Choudhary
AI & Full Stack Developer | Spring Boot • React • Machine Learning
📧 amishachoudhary22@gmail.com
