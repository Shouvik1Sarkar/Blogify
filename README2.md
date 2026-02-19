# Blogify API

> A production-grade RESTful backend for a modern blogging platform.

Blogify is a scalable and secure backend system built with Node.js, Express, and MongoDB.  
It implements real-world backend architecture patterns including centralized error handling, middleware-driven security, JWT authentication, and cloud-based media management.

This project is designed to reflect industry-level backend engineering standards.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Access & Refresh Tokens)
- bcrypt
- Multer
- Cloudinary
- Arcjet
- dotenv

---

## Core Features

### Authentication & Authorization

- User registration & login
- JWT-based authentication (Access + Refresh tokens)
- Secure HttpOnly cookies
- Password hashing with bcrypt
- Protected route middleware

### Blog Management

- Create, update, delete blogs
- Fetch all blogs
- Fetch single blog by ID
- Author-based blog ownership control

### Comment System

- Add comment to blog
- Delete comment
- Blog-comment relationship handling

### Like System

- Like / Unlike blogs
- Prevent duplicate likes per user

### Media Handling

- Image upload with Multer
- Cloudinary cloud storage integration
- Temporary file processing

---

## Security & Stability

- Arcjet protection layer
- Centralized global error handler
- Custom ApiError & ApiResponse utilities
- Async wrapper to eliminate repetitive try/catch
- Request validation middleware
- Secure token handling strategy

---

## Architecture Overview

The project follows a modular and scalable backend architecture:

```
Blogify/
│
├── config/        # Database & external service configurations
├── controllers/   # Route handlers (business logic layer)
├── middleware/    # Auth, error handling, validation, uploads
├── models/        # Mongoose schemas & database models
├── routes/        # Express route definitions
├── utils/         # Reusable utilities (ApiError, ApiResponse, asyncHandler)
├── validate/      # Input validation logic
│
├── app.js
├── server.js
└── package.json
```

### Architectural Principles

- Separation of Concerns
- Centralized Error Handling
- Middleware-driven request lifecycle
- Modular folder structure
- Token-based authentication strategy

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blogify.git
cd blogify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ARCJET_KEY=your_arcjet_key
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server runs at:

```
http://localhost:5000
```

Base API URL:

```
http://localhost:5000/api/v1
```

---

## API Endpoints

### Authentication

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | /users/register | Register new user |
| POST   | /users/login    | Login user        |
| POST   | /users/logout   | Logout user       |

### Blogs

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| POST   | /blogs     | Create blog    |
| GET    | /blogs     | Get all blogs  |
| GET    | /blogs/:id | Get blog by ID |
| PATCH  | /blogs/:id | Update blog    |
| DELETE | /blogs/:id | Delete blog    |

### Comments

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| POST   | /comments     | Add comment    |
| DELETE | /comments/:id | Delete comment |

---

## Production Considerations

This project is structured to support future scalability:

- Role-Based Access Control (RBAC)
- Email verification system
- Password reset workflow
- Pagination and filtering
- Rate limiting and Helmet security
- Redis caching
- Docker containerization
- Swagger documentation
- CI/CD integration
- Unit and integration testing (Jest + Supertest)

---

## Why This Project Matters

Blogify demonstrates:

- Real-world REST API design
- Secure authentication architecture
- Clean backend folder structure
- Middleware-based scalability
- Cloud media integration
- Centralized error handling

This reflects production-grade backend engineering practices.

---

## Author

Shouvik Sarkar  
Backend Developer | Node.js | Express | MongoDB
