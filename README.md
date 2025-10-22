# 🤖 AI Chatbot Web Application

An intelligent full-stack **AI Chatbot** that enables real-time, context-aware conversations using the **Google Gemini API**, built with **Spring Boot**, **React.js**, and **MongoDB Atlas**.  
The project supports **secure authentication**, **chat history management**, and a sleek **dark/light mode interface** for a modern user experience.

---

## 🚀 Features
- 🔐 **User Authentication** — Secure login and registration with JWT and BCrypt  
- 💬 **AI Conversations** — Real-time AI chat using Google Gemini API  
- 🧠 **Persistent Chat History** — Retrieve past chats per user  
- 📝 **Chat Management** — Rename or delete chats  
- 🌗 **Dark / Light Mode** — Seamless UI toggle  
- ⚡ **Full-Stack Integration** — React + Spring Boot + MongoDB  
- ☁️ **Cloud Database** — MongoDB Atlas for reliable data storage  

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:------|:------------|:--------|
| **Frontend** | React.js, Tailwind CSS | User Interface |
| **Backend** | Spring Boot (Java) | REST APIs & Logic |
| **Database** | MongoDB Atlas | Cloud Storage |
| **AI Engine** | Google Gemini API | AI Chat Responses |
| **Security** | JWT, BCrypt | Authentication & Encryption |

---

## 🧩 Project Structure

ai-chatbot-app/
│
├── backend/
│ ├── src/main/java/com/chatbot/backend/
│ │ ├── controller/
│ │ ├── model/
│ │ ├── repository/
│ │ ├── security/
│ │ ├── service/
│ │ └── BackendApplication.java
│ └── src/main/resources/
│ └── application.properties
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── .env
│
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Amishachoudhary22/AI-Chatbot.git
cd AI-Chatbot
Backend Setup
cd backend


Update application.properties:

spring.data.mongodb.uri=your_mongodb_connection_string
gemini.api.key=your_gemini_api_key
jwt.secret=your_jwt_secret_key


Run the backend:

mvn spring-boot:run


Server runs at http://localhost:8080

# Frontend Setup
cd frontend
npm install
npm start


App runs at http://localhost:3000

# How It Works

User registers or logs in using credentials.

Backend authenticates via JWT and stores data in MongoDB.

User messages are sent to Gemini API for responses.

Each chat and message is stored and retrievable anytime.

Chats can be renamed or deleted as desired.
Example .env (Frontend)
REACT_APP_BACKEND_URL=http://localhost:8080
