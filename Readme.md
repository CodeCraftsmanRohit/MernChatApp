

# 💬 QuickChat – Real-Time MERN Chat Application

QuickChat is a full-stack **real-time chat application** built using the **MERN stack** with **Socket.IO** for instant messaging.
It supports user authentication, one-to-one chats, image sharing, online/offline status, unseen message count, and profile management.

🔗 **Live Demo**
- Frontend: https://chat-app-two-sage.vercel.app/
- Backend: https://chat-app-backend-gules-seven.vercel.app/api/status

---

## 🚀 Features

### 🔐 Authentication
- User signup & login with JWT
- Protected routes
- Secure password hashing using bcrypt

### 💬 Chat Functionality
- Real-time one-to-one messaging (Socket.IO)
- Online / offline user status
- Unseen message counter
- Message read (seen) handling
- Auto-scroll to latest message

### 🖼 Media & Profile
- Image messages (Cloudinary integration)
- Profile picture upload
- Edit profile (name, bio, avatar)

### 🎨 UI / UX
- Modern responsive UI (Tailwind CSS)
- Glassmorphism design
- Mobile-friendly layout
- Smooth animations & transitions

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Socket.IO Client
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary

### Deployment
- Frontend: **Vercel**
- Backend: **Vercel**
- Database: **MongoDB Atlas**

---

## 📁 Project Structure

```

MernChatApp/
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Backend (Node + Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── lib/
│   └── server.js
│
└── README.md

````

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
````

### Frontend (`client/.env`)

```env
VITE_BACKEND_URL=https://chat-app-backend-gules-seven.vercel.app/api/status
```

---

## ▶️ Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/CodeCraftsmanRohit/MernChatApp.git
cd MernChatApp
```

### 2️⃣ Start Backend

```bash
cd server
npm install
npm run server
```

Backend runs at:

```
https://chat-app-backend-gules-seven.vercel.app/api/status
```

### 3️⃣ Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
https://chat-app-two-sage.vercel.app/
```

---

## 🧪 Testing Guide

* Open app in **two browsers (normal + incognito)**
* Signup with different users
* Send messages & images
* Verify online status & unseen counters
* Update profile & avatar

---

## 🔮 Future Enhancements

* Typing indicator
* ✔✔ Read receipts
* Group chats
* Message deletion
* Push notifications
* Dark / Light theme toggle

---

## 👨‍💻 Author

**Rohit Kumar**
GitHub: [https://github.com/CodeCraftsmanRohit](https://github.com/CodeCraftsmanRohit)

---

## ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 🧑‍💻 Contribute improvements

---

```

---
