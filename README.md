# Blogify

A RESTful blogging platform backend built with Node.js, Express, and MongoDB. Blogify supports user authentication, blog creation, playlists, comments, and likes — all protected by JWT-based auth and Arcjet security middleware.

---

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express v5
- **Database:** MongoDB via Mongoose
- **Authentication:** JWT (access + refresh tokens), HTTP-only cookies
- **File Uploads:** Multer + Cloudinary
- **Email:** Nodemailer + Mailgen
- **Security:** Helmet, CORS, express-mongo-sanitize, Arcjet (rate limiting, bot detection, shield)
- **Validation:** express-validator

---

## Features

- User registration with optional cover image upload
- Email verification via tokenized link
- Login / Logout with JWT access & refresh tokens
- Forgot password and OTP-based password reset
- Profile management (update info, avatar, delete account)
- Create, read, and delete blogs (with optional cover image)
- Organize blogs into playlists
- Comment on blogs, update and delete comments
- Like/unlike blogs and comments
- Global error handling and consistent API response structure

---

## Project Structure

```
├── config/
│   ├── arcjet.config.js     # Arcjet rate limiting & bot detection rules
│   └── env.js               # Environment variable loader
├── connection/
│   └── db.js                # MongoDB connection
├── controllers/
│   ├── auth.controllers.js
│   ├── blogs.controllers.js
│   ├── comments.controllers.js
│   ├── like.controllers.js
│   ├── playList.controllers.js
│   └── user.controllers.js
├── middleware/
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   ├── globalError.middleware.js
│   ├── multer.middleware.js
│   └── validators.middleware.js
├── models/
│   ├── blog.models.js
│   ├── comments.models.js
│   ├── likes.models.js
│   ├── playList.models.js
│   └── user.models.js
├── routes/
│   ├── auth.routes.js
│   ├── blogs.routes.js
│   ├── comment.routes.js
│   ├── likes.routes.js
│   ├── playList.routes.js
│   └── user.routes.js
├── utils/
│   ├── ApiError.utils.js
│   ├── ApiResponse.utils.js
│   ├── asyncHandler.utils.js
│   ├── cloudinary.utils.js
│   ├── constants.utils.js
│   └── mail.js
├── validate/
│   ├── blogs.validate.js
│   ├── comment.validate.js
│   └── index.js
├── temp/images/             # Temporary upload staging directory
└── index.js                 # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)
- Cloudinary account
- Arcjet account
- SMTP credentials for email (e.g. Gmail, Resend, etc.)

### Installation

```bash
git clone https://github.com/your-username/blogify.git
cd blogify
npm install
```

### Environment Variables

Create a `.env.development.local` file in the root directory with the following:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blogify

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# Arcjet
ARCJET_KEY=your_arcjet_site_key
ARCJET_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

> For production, create `.env.production.local` with appropriate values.

### Running the App

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server will start on the port defined in your `.env` file (default: `3000`).

---

## API Reference

All routes are prefixed with `/api/v1`. Protected routes require a valid JWT access token sent via HTTP-only cookie.

### Auth — `/api/v1/auth`

| Method | Endpoint                   | Auth | Description                                         |
| ------ | -------------------------- | ---- | --------------------------------------------------- |
| POST   | `/register`                | No   | Register a new user (supports `cover_image` upload) |
| GET    | `/verify-email/:token`     | No   | Verify email with token from registration email     |
| POST   | `/login`                   | No   | Log in and receive access/refresh tokens            |
| GET    | `/logout`                  | Yes  | Log out and clear cookies                           |
| POST   | `/forgot-password`         | No   | Send a forgot-password email                        |
| POST   | `/password/change/request` | Yes  | Request an OTP to change password                   |
| POST   | `/password/change/confirm` | Yes  | Confirm OTP and update password                     |

### User — `/api/v1/user`

| Method | Endpoint     | Auth | Description                                           |
| ------ | ------------ | ---- | ----------------------------------------------------- |
| GET    | `/me`        | Yes  | Get the current user's profile                        |
| PATCH  | `/me`        | Yes  | Update profile info (name, bio, etc.)                 |
| PATCH  | `/me/avatar` | Yes  | Update profile avatar (supports `cover_image` upload) |
| DELETE | `/me/delete` | Yes  | Delete the user's account                             |

### Blogs — `/api/v1/blog`

| Method | Endpoint            | Auth | Description                      |
| ------ | ------------------- | ---- | -------------------------------- |
| POST   | `/`                 | Yes  | Create a new blog                |
| GET    | `/getAllBlogs`      | Yes  | Get all blogs                    |
| GET    | `/:id`              | Yes  | Get all blogs by a specific user |
| GET    | `/getblog/:blogId`  | No   | Get a single blog by ID          |
| DELETE | `/delete/:id`       | Yes  | Delete a blog                    |
| POST   | `/:blogId/comments` | Yes  | Add a comment to a blog          |
| GET    | `/:blogId/comments` | Yes  | Get all comments on a blog       |

### Comments — `/api/v1/comment`

| Method | Endpoint             | Auth | Description      |
| ------ | -------------------- | ---- | ---------------- |
| PATCH  | `/update/:commentId` | Yes  | Update a comment |
| DELETE | `/delete/:commentId` | Yes  | Delete a comment |

### Likes — `/api/v1/like`

| Method | Endpoint               | Auth | Description              |
| ------ | ---------------------- | ---- | ------------------------ |
| GET    | `/blogs/:blogId`       | Yes  | Toggle like on a blog    |
| GET    | `/comments/:commentId` | Yes  | Toggle like on a comment |

### Playlists — `/api/v1/playList`

| Method | Endpoint                  | Auth | Description                     |
| ------ | ------------------------- | ---- | ------------------------------- |
| POST   | `/create`                 | Yes  | Create a new playlist           |
| POST   | `/:playListId/createBlog` | Yes  | Create a blog inside a playlist |
| GET    | `/:playListId/blogs`      | No   | Get all blogs in a playlist     |

---

## Security

- **Helmet** sets secure HTTP headers
- **express-mongo-sanitize** prevents NoSQL injection
- **Arcjet** provides rate limiting (10 requests/minute per IP), bot detection, and shield protection against common attacks
- **CORS** is configured for `http://localhost:5173` by default — update this for production
- Passwords are hashed with **bcrypt** (10 rounds)
- Email verification and reset tokens are hashed with **SHA-256** before storage

---

## License

ISC
