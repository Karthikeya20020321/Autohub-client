# 🚗 AutoHub – Car E-Commerce Platform

A full-stack car e-commerce web application built with React, Node.js, Express, and MongoDB.

## 🌐 Live Project

### 👉 [🚗 Visit AutoHub](https://6aae71a1699140f1b8a808ff--autohub-28d0b6.netlify.app/)

## 💻 GitHub Repositories

* **Frontend:** [AutoHub Client](https://github.com/Karthikeya20020321/Autohub-client)
* **Backend:** [AutoHub Server](https://github.com/Karthikeya20020321/Autohub-server)

## 🔗 Backend API

[AutoHub Backend API](https://autohub-server-woz6.onrender.com)

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* Axios
* React Router
* CSS

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcryptjs
* Express Validator
* CORS

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Deployment

* Netlify – Frontend
* Render – Backend
* MongoDB Atlas – Database

## ✨ Features

* 🔐 User Registration and Login
* 🔑 JWT Authentication
* 🚗 Browse Cars
* 🔎 Car Details
* ❤️ Wishlist
* 📅 Car Booking
* 👤 User Dashboard
* 🏷️ Sell Car
* 🛡️ Protected Routes
* 🔄 REST API Integration
* 💾 MongoDB Database Integration
* 📱 Responsive User Interface

## 🏗️ Application Architecture

```text
                 ┌──────────────────────┐
                 │     React + Vite     │
                 │      Frontend        │
                 └──────────┬───────────┘
                            │
                            │ Axios / REST API
                            ▼
                 ┌──────────────────────┐
                 │   Node.js + Express  │
                 │       Backend        │
                 └──────────┬───────────┘
                            │
                            │ Mongoose
                            ▼
                 ┌──────────────────────┐
                 │    MongoDB Atlas     │
                 │       Database       │
                 └──────────────────────┘
```

## 📁 Frontend Structure

```text
client
├── public
├── src
│   ├── assets
│   ├── components
│   ├── pages
│   ├── store
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 📁 Backend Structure

```text
server
├── config
├── controllers
├── middleware
├── models
├── routes
├── scripts
├── services
├── utils
├── validators
├── server.js
├── package.json
└── .env.example
```

## 🚀 Run Frontend Locally

```bash
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 🚀 Run Backend Locally

```bash
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## 🔐 Environment Variables

Create a `.env` file in the backend:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
```

For the frontend, configure:

```text
VITE_API_URL=your_backend_
```
