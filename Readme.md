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

## 📌 API Endpoints (with curl examples)

### 🔐 Authentication

#### Signup

```bash
curl --location 'http://localhost:7777/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
  "firstName": "YourFirstName",
  "lastName": "YourLastName",
  "emailId": "your@example.com",
  "password": "yourpassword",
  "age": "30",
  "gender": "yourgender",
  "about": "short bio"
}'
```

#### Login

```bash
curl --location 'http://localhost:7777/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "emailId": "your@example.com",
  "password": "yourpassword"
}'
```

#### Logout

```bash
curl --location 'http://localhost:7777/logout' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=<your_token>' \
--data-raw '{}'
```

---

### 📩 Requests

#### Send Interest Request

```bash
curl --location 'http://localhost:7777/request/send/interested/<targetUserId>' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=<your_token>' \
--data-raw '{}'
```

#### Review Request (Accept/Reject)

```bash
curl --location 'http://localhost:7777/request/review/rejected/<requestId>' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=<your_token>' \
--data-raw '{}'
```

---

### 👥 User

#### View Received Requests

```bash
curl --location 'http://localhost:7777/user/requests/received' \
--header 'Cookie: token=<your_token>' \
--data ''
```

#### View Connections

```bash
curl --location 'http://localhost:7777/user/connections' \
--header 'Cookie: token=<your_token>' \
--data ''
```

---

### 📰 Feed

```bash
curl --location 'http://localhost:7777/feed' \
--header 'Cookie: token=<your_token>'
```

---

### 👤 Profile

#### View Profile

```bash
curl --location 'http://localhost:7777/profile/view' \
--header 'Cookie: token=<your_token>'
```

#### Edit Profile

```bash
curl --location --request PATCH 'http://localhost:7777/profile/edit' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=<your_token>' \
--data '{
  "firstName": "NewName"
}'
```

---

## ✅ Notes

- Replace `<your_token>` with a valid JWT token after login.
- Replace placeholders like `<targetUserId>` and `<requestId>` with actual IDs from your database.
- Use tools like [Postman](https://www.postman.com/) or the provided `curl` for testing.

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
