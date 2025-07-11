# 📺 StreamHive – Video + Social Platform Backend

> **"Where creators stream. Where communities grow."**

---

## 📌 Overview
**StreamHive** is a feature-rich and advanced backend project built using **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT**, **bcrypt**, and many other modern technologies. It serves as the **complete backend for a YouTube/Twitter-like video hosting and social platform**, implementing all essential functionalities such as:
- ✅ User Authentication (Signup/Login)
- 🎥 Video Upload & Management
- 👍 Like / Dislike System (Videos, Comments, Tweets)
- 💬 Commenting and Reply Threads
- 📣 Tweet/Micro-post Feature
- 🔔 Subscribe / Unsubscribe to Channels
- 📊 Analytics & Stats
- ☁️ Cloudinary Integration for Media Storage
  
---

## 🚀 Description

This is a robust and scalable backend designed for a modern multimedia platform combining **video content** and **social interactions**. Whether you're looking to build a **video streaming app** like YouTube or integrate **tweet-like** social features, this backend is the perfect foundation.

The project follows **industry-standard best practices**, including:

- 🔐 **JWT-based authentication** (Access + Refresh Tokens)
- 🧂 **Password hashing** using Bcrypt
- 📦 **Modular folder structure**
- 🧼 Clean, maintainable, and scalable code
- 🌐 **RESTful API architecture**
- 📁 Uses **Cloudinary** for secure media uploads

A great deal of effort has gone into designing and developing this project, and it offers an excellent opportunity to **learn real-world backend development** at scale.

---

## ⚙️ Tech Stack

| Layer       | Technology |
|-------------|------------|
| Server      | Node.js + Express.js |
| Database    | MongoDB with Mongoose |
| Auth        | JWT + Bcrypt |
| File Upload | Multer + Cloudinary |
| Utility     | Custom Error Handler, Async Middleware, API Response wrapper |

---

## 🧩 Features

- 🔑 User signup, login, and secure token management
- 🎞️ Upload videos with title, description, thumbnail, and duration
- 🗃️ Create, update, and delete playlists
- 🔄 Like/unlike videos, comments, and tweets
- 🗨️ Comment and reply system for videos
- 🐦 Post, like, and delete tweets (text-based micro-posts)
- 🧑‍🤝‍🧑 Subscribe / unsubscribe to channels
- 📊 Fetch stats: total views, subscribers, likes, etc.
- 🔍 Query + pagination with search, sort, and filters
- ☁️ Cloudinary support for video/image upload

---

## 📸 ER Diagram: [[View on Eraser.io](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)](https://app.eraser.io/workspace/czLtukFVBHsuC1nazGkg)



---

## 🔐 API Routes (Examples)

### Auth Routes
POST   /api/auth/register
POST   /api/auth/login

### Video Routes
POST   /api/videos/upload
GET    /api/videos/:id
PUT    /api/videos/:id
DELETE /api/videos/:id

### Subscription
POST   /api/subscribe/:channelId
GET    /api/subscribe/subscribers/:channelId

### Tweet Routes
POST   /api/tweets
GET    /api/tweets/:id

### Playlist
POST   /api/playlist
POST   /api/playlist/:playlistId/video/:videoId

### Full list of routes can be found in the routes directory.

## 🔧 Setup Instructions

### 1. Clone the Repository

git clone https://github.com/punithchavan/StreamHive.git

cd StreamHive

### 2. Install Dependencies

npm install

### 3. Set up .env file:

PORT=5000

MONGODB_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET=your_secret

REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret


### 4. Run the Server:
npm run dev

## Folder Structure

📦 streamhive-backend/
├── 📁 controllers       # All route logic and controller functions

├── 📁 db                # Database connection and setup

├── 📁 middlewares       # Custom middlewares (auth, error handling, etc.)

├── 📁 models            # Mongoose schema models

├── 📁 routes            # Route definitions for various modules

├── 📁 utils             # Helper functions (e.g., ApiResponse, cloudinary, etc.)

├── 📄 app.js            # Express app setup and middleware integration

├── 📄 constants.js      # Constants used across the app

├── 📄 index.js          # Entry point of the application (starts the server)

## 💡 Learning Highlights

🔐 Real-world JWT + Refresh Token workflow

🗂️ Modular structure (routes/controllers/middleware)

☁️ Cloudinary file uploads (video/image)

🧠 Mongoose aggregate, populate, and schema design

⚠️ Error handling and clean response formatting

📁 File handling using Multer

🔄 Like/Comment/Subscribe feature logic

## ⭐ Final Note

If you're preparing for backend developer roles or want to build a production-ready backend from scratch, this project is an excellent reference. Feel free to fork, modify, and extend!

## Connect With Me

LinkedIn: https://www.linkedin.com/in/punithchavan/

