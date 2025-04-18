# DevConnect

DevConnect is a Node.js-based backend API application designed for user authentication, request handling, profile management, and user data operations. Built using Express, MongoDB, and modern middleware like `cookie-parser` and `cors`.

---

## 📁 Project Structure

```
DevConnect/
├── config/
│   └── database.js
├── routes/
│   ├── auth.js
│   ├── request.js
│   ├── profile.js
│   └── user.js
├── .env
├── app.js
├── package.json
└── README.md
```

---

## 🚀 Features

- User Authentication (Login, Register, etc.)
- Request Submission & Handling
- User Profile Management
- Token-based Auth with Cookies
- CORS Configured for Frontend (e.g. React)

---

## 🛠️ Tech Stack

- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **cookie-parser**
- **dotenv**
- **cors**

---

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/)

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/DevConnect.git
cd DevConnect
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

---

## 🧪 Running the Server

```bash
node app.js
```

Server runs on: `http://localhost:7777`

---

## 🌐 CORS Configuration

This app is preconfigured to accept frontend requests from:

```
http://localhost:5173
```

To change this, update the `cors()` settings in `app.js`.

---

## 🧹 Linting & Code Standards

You can optionally set up ESLint + Prettier for maintaining code style.

---

## 🛡️ Security Tips

- Never push `.env` to version control
- Use HTTPS in production
- Set secure cookie flags in production

---
