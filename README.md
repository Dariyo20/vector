# Video Interview Backend

A Node.js Express backend for a video interview platform where interviewers can pre-record questions and applicants can answer them at their convenience through video responses.

 Features

- JWT-based authentication system
- User roles (Interviewer and Applicant)
- Password reset functionality with email notifications
- MongoDB integration
- Password complexity requirements

 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB server)
- npm or yarn

 Installation

1. **Clone the repository**

git clone <repository-url>
cd video-interview-backend


2. **Install dependencies**

npm install

3. **Set up environment variables**

Create a `.env` file in the project root and add your configuration:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

and so on

The project structure 

video-interview-backend/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middlewares/        # Custom middleware functions
├── models/             # Database models
├── routes/             # API route definitions
├── utils/              # Utility functions
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore configuration
├── app.js              # Application entry point
└── package.json        # Project dependencies
Features

User authentication and authorization
Role-based access control
Email service integration
Input validation

Getting Started
Prerequisites

Node.js (v14 or higher)
MongoDB

Installation

Clone the repository:
Copygit clone https://github.com/your-username/video-interview-backend.git
cd video-interview-backend

Install dependencies:
npm install


API Endpoints
Authentication

POST /api/auth/register - Register a new user
POST /api/auth/login - Login and receive authentication token
GET /api/auth/me - Get current user information

Configuration
Configuration files are located in the config/ directory:

default.js - General application settings
db.js - Database connection configuration


TASK 2

# Video Interview Backend API Documentation

## Overview

This API provides endpoints for managing video interview sessions. It allows users to create, retrieve, update, and delete interview sessions with titles, descriptions, and questions.

## Base URL

```
https://your-api-domain.com/api
```

## Authentication

All interview-related endpoints require authentication. To authenticate, include the JWT token in the request header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

You can obtain a JWT token by logging in through the `/api/auth/login` endpoint.

## Endpoints

### Authentication

#### Register a New User

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5f8b8b8b8b8b8b8b8b8b8",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5f8b8b8b8b8b8b8b8b8b8",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User

```
GET /auth/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "60d5f8b8b8b8b8b8b8b8b8b8",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Interview Sessions

#### Create Interview Session

```
POST /interviews
```

**Request Body:**

```json
{
  "title": "Frontend Developer Interview",
  "description": "Technical assessment for frontend developer candidates",
  "questions": [
    "What is the difference between let, const, and var?",
    "Explain how React's virtual DOM works",
    "How would you optimize a webpage's loading time?"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d5f8b8b8b8b8b8b8b8b8b8",
    "title": "Frontend Developer Interview",
    "description": "Technical assessment for frontend developer candidates",
    "questions": [
      "What is the difference between let, const, and var?",
      "Explain how React's virtual DOM works",
      "How would you optimize a webpage's loading time?"
    ],
    "creator": "60d5f8b8b8b8b8b8b8b8b8b8",
    "createdAt": "2023-04-01T12:00:00.000Z",
    "updatedAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Get All Interviews

Returns all interviews created by the currently authenticated user.

```
GET /interviews
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5f8b8b8b8b8b8b8b8b8b8",
      "title": "Frontend Developer Interview",
      "description": "Technical assessment for frontend developer candidates",
      "questions": [
        "What is the difference between let, const, and var?",
        "Explain how React's virtual DOM works",
        "How would you optimize a webpage's loading time?"
      ],
      "creator": "60d5f8b8b8b8b8b8b8b8b8b8",
      "createdAt": "2023-04-01T12:00:00.000Z",
      "updatedAt": "2023-04-01T12:00:00.000Z"
    },
    {
      "_id": "60d5f8b8b8b8b8b8b8b8b8b9",
      "title": "Backend Developer Interview",
      "description": "Technical assessment for backend developer candidates",
      "questions": [
        "Explain RESTful API design principles",
        "How would you handle database migrations?",
        "Describe your experience with Node.js and Express"
      ],
      "creator": "60d5f8b8b8b8b8b8b8b8b8b8",
      "createdAt": "2023-04-02T12:00:00.000Z",
      "updatedAt": "2023-04-02T12:00:00.000Z"
    }
  ]
}
```

#### Get Single Interview

```
GET /interviews/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d5f8b8b8b8b8b8b8b8b8b8",
    "title": "Frontend Developer Interview",
    "description": "Technical assessment for frontend developer candidates",
    "questions": [
      "What is the difference between let, const, and var?",
      "Explain how React's virtual DOM works",
      "How would you optimize a webpage's loading time?"
    ],
    "creator": "60d5f8b8b8b8b8b8b8b8b8b8",
    "createdAt": "2023-04-01T12:00:00.000Z",
    "updatedAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Update Interview

```
PUT /interviews/:id
```

**Request Body:**

```json
{
  "title": "Updated Frontend Developer Interview",
  "description": "Updated technical assessment for frontend developer candidates",
  "questions": [
    "What is the difference between let, const, and var?",
    "Explain how React's virtual DOM works",
    "How would you optimize a webpage's loading time?",
    "Describe your experience with TypeScript"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60d5f8b8b8b8b8b8b8b8b8b8",
    "title": "Updated Frontend Developer Interview",
    "description": "Updated technical assessment for frontend developer candidates",
    "questions": [
      "What is the difference between let, const, and var?",
      "Explain how React's virtual DOM works",
      "How would you optimize a webpage's loading time?",
      "Describe your experience with TypeScript"
    ],
    "creator": "60d5f8b8b8b8b8b8b8b8b8b8",
    "createdAt": "2023-04-01T12:00:00.000Z",
    "updatedAt": "2023-04-03T12:00:00.000Z"
  }
}
```

#### Delete Interview

```
DELETE /interviews/:id
```

**Response:**

```json
{
  "success": true,
  "data": {}
}
```

## Error Responses

### Validation Error

```json
{
  "success": false,
  "error": [
    "Title is required",
    "Interview must have at least one question"
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### Resource Not Found

```json
{
  "success": false,
  "error": "Interview not found"
}
```

### Server Error

```json
{
  "success": false,
  "error": "Server Error"
}
```

## Response Codes

- `200` - Success
- `201` - Resource created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Resource not found
- `500` - Server error

## Model Validation Rules

### Interview Model

- **title**: Required, String, Maximum 100 characters
- **description**: Required, String
- **questions**: Required, Array of Strings, Minimum 1 question
- **creator**: Required, Reference to User model

## Authentication Flow

1. Register as a new user or login with existing credentials
2. Receive a JWT token
3. Include the JWT token in the Authorization header for subsequent requests
4. The token will be verified for all protected routes

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients are limited to:

- 100 requests per hour for authenticated users
- 20 requests per hour for unauthenticated users

## Data Security

- All passwords are hashed using bcrypt
- API communications should be conducted over HTTPS
- JWT tokens expire after 24 hours
- Sensitive data is not exposed in responses

