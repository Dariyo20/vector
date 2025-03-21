Video Interview Backend API Documentation

info:
  title: Video Interview Backend API
  description: A Node.js Express backend for a video interview platform where interviewers can pre-record questions and applicants can answer them at their convenience through video responses.
  version: 1.0.0
  contact:
    email: support@example.com

servers:
  - url: https://api.example.com/api/v1
    description: Production server
  - url: https://dev-api.example.com/api/v1
    description: Development server

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      required:
        - name
        - email
        - password
      properties:
        id:
          type: string
          description: Unique identifier for the user
          example: 60d5f8b8b8b8b8b8b8b8b8b8
        name:
          type: string
          description: User's full name
          example: John Doe
        email:
          type: string
          format: email
          description: User's email address
          example: john@example.com
        password:
          type: string
          format: password
          description: User's password (not returned in responses)
          example: password123
        role:
          type: string
          description: User's role in the system
          enum: [user, admin, interviewer, applicant]
          example: interviewer
        createdAt:
          type: string
          format: date-time
          description: The date and time when the user was created
        updatedAt:
          type: string
          format: date-time
          description: The date and time when the user was last updated

    Interview:
      type: object
      required:
        - title
        - description
        - questions
      properties:
        _id:
          type: string
          description: Unique identifier for the interview
          example: 60d5f8b8b8b8b8b8b8b8b8b8
        title:
          type: string
          description: Title of the interview
          maxLength: 100
          example: Frontend Developer Interview
        description:
          type: string
          description: Description of the interview
          example: Technical assessment for frontend developer candidates
        questions:
          type: array
          description: List of questions for the interview
          minItems: 1
          items:
            type: string
          example:
            - What is the difference between let, const, and var?
            - Explain how React's virtual DOM works
            - How would you optimize a webpage's loading time?
        creator:
          type: string
          description: ID of the user who created the interview
          example: 60d5f8b8b8b8b8b8b8b8b8b8
        createdAt:
          type: string
          format: date-time
          description: The date and time when the interview was created
        updatedAt:
          type: string
          format: date-time
          description: The date and time when the interview was last updated

    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          description: User's email address
          example: john@example.com
        password:
          type: string
          format: password
          description: User's password
          example: password123

    RegisterRequest:
      type: object
      required:
        - name
        - email
        - password
      properties:
        name:
          type: string
          description: User's full name
          example: John Doe
        email:
          type: string
          format: email
          description: User's email address
          example: john@example.com
        password:
          type: string
          format: password
          description: User's password
          minLength: 8
          example: password123

    AuthResponse:
      type: object
      properties:
        success:
          type: boolean
          description: Indicates if the operation was successful
          example: true
        token:
          type: string
          description: JWT authentication token
          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        user:
          type: object
          properties:
            id:
              type: string
              description: User's unique identifier
              example: 60d5f8b8b8b8b8b8b8b8b8b8
            name:
              type: string
              description: User's name
              example: John Doe
            email:
              type: string
              description: User's email
              example: john@example.com

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          description: Indicates if the operation was successful
          example: false
        error:
          oneOf:
            - type: string
              description: Error message
              example: Not authorized to access this route
            - type: array
              description: List of error messages
              items:
                type: string
              example:
                - Title is required
                - Interview must have at least one question

    SuccessResponse:
      type: object
      properties:
        success:
          type: boolean
          description: Indicates if the operation was successful
          example: true
        data:
          type: object
          description: The returned data

    InterviewsResponse:
      type: object
      properties:
        success:
          type: boolean
          description: Indicates if the operation was successful
          example: true
        count:
          type: integer
          description: Total number of interviews returned
          example: 2
        data:
          type: array
          items:
            $ref: '#/components/schemas/Interview'

paths:
  /auth/register:
    post:
      tags:
        - Authentication
      summary: Register a new user
      description: Creates a new user account and returns a JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: User registered successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /auth/login:
    post:
      tags:
        - Authentication
      summary: Login to the system
      description: Authenticates a user and returns a JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /auth/me:
    get:
      tags:
        - Authentication
      summary: Get current user
      description: Returns the currently authenticated user's information
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User information retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/User'
        '401':
          description: Not authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /interviews:
    post:
      tags:
        - Interviews
      summary: Create a new interview
      description: Creates a new interview session with questions
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - description
                - questions
              properties:
                title:
                  type: string
                  maxLength: 100
                  example: Frontend Developer Interview
                description:
                  type: string
                  example: Technical assessment for frontend developer candidates
                questions:
                  type: array
                  minItems: 1
                  items:
                    type: string
                  example:
                    - What is the difference between let, const, and var?
                    - Explain how React's virtual DOM works
                    - How would you optimize a webpage's loading time?
      responses:
        '201':
          description: Interview created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/Interview'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Not authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
                
    get:
      tags:
        - Interviews
      summary: Get all interviews
      description: Returns all interviews created by the currently authenticated user
      security:
        - BearerAuth: []
      parameters:
        - in: query
          name: page
          schema:
            type: integer
            default: 1
          description: Page number for pagination
        - in: query
          name: limit
          schema:
            type: integer
            default: 10
          description: Number of interviews per page
      responses:
        '200':
          description: Interviews retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InterviewsResponse'
        '401':
          description: Not authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /interviews/{id}:
    get:
      tags:
        - Interviews
      summary: Get a single interview
      description: Returns a single interview by ID
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: Interview ID
      responses:
        '200':
          description: Interview retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/Interview'
        '401':
          description: Not authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Interview not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
                
    put:
      tags:
        - Interviews
      summary: Update an interview
      description: Updates an existing interview by ID
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: Interview ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  maxLength: 100
                  example: Updated Frontend Developer Interview
                description:
                  type: string
                  example: Updated technical assessment for frontend developer candidates
                questions:
                  type: array
                  minItems: 1
                  items:
                    type: string
                  example:
                    - What is the difference between let, const, and var?
                    - Explain how React's virtual DOM works
                    - How would you optimize a webpage's loading time?
                    - Describe your experience with TypeScript
      responses:
        '200':
          description: Interview updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/Interview'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Not authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Interview not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
                
    delete:
      tags:
        - Interviews
      summary: Delete an interview
      description: Deletes an interview by ID
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
          description: Interview ID
      responses:
        '200':
          description: Interview deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: object
                    example: {}
        '401':
          description: Not authenticated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Interview not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
Additional Information
Project Overview
This is a Node.js Express backend for a video interview platform where interviewers can pre-record questions and applicants can answer them at their convenience through video responses.
Features

JWT-based authentication system
User roles (Interviewer and Applicant)
Password reset functionality with email notifications
MongoDB integration
Password complexity requirements
Role-based access control
Email service integration
Input validation
Interview route and control with pagination

Prerequisites

Node.js (v14 or higher)
MongoDB Atlas account (or local MongoDB server)
npm or yarn

Installation

Clone the repository
Copygit clone https://github.com/Dariyo20/vector.git
cd video-interview-project-backend

Install dependencies
Copynpm install

Set up environment variables
Create a .env file in the project root with your configuration

Project Structure
Copyvideo-interview-backend/
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
Configuration
Configuration files are located in the config/ directory:

default.js - General application settings
db.js - Database connection configuration

Rate Limiting
The API implements rate limiting to prevent abuse. Clients are limited to:

100 requests per hour for authenticated users
20 requests per hour for unauthenticated users

Data Security

All passwords are hashed using bcrypt
API communications should be conducted over HTTPS
JWT tokens expire after 24 hours
Sensitive data is not exposed in responses


📹 Video API Endpoints
Get Cloudinary Signature
CopyGET /api/video/signature
Returns a signature for direct frontend upload to Cloudinary.
Response
json{
  "success": true,
  "timestamp": 1647512345,
  "signature": "generated_signature_string",
  "apiKey": "cloudinary_api_key",
  "cloudName": "cloudinary_cloud_name"
}
Save Video Metadata
CopyPOST /api/video
Request Body
json{
  "interview": "interview_id",
  "question": "Interview question text",
  "questionIndex": 1,
  "videoUrl": "https://res.cloudinary.com/cloud_name/video/upload/v1234567/video_id.mp4",
  "cloudinaryId": "video_id",
  "duration": 120,
  "size": 10485760
}
Response
json{
  "success": true,
  "data": {
    "_id": "video_response_id",
    "interview": "interview_id",
    "question": "Interview question text",
    "questionIndex": 1,
    "videoUrl": "cloudinary_video_url",
    "cloudinaryId": "cloudinary_resource_id",
    "duration": 120,
    "size": 10485760,
    "user": "user_id",
    "status": "ready",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
Get Video Responses by Interview
CopyGET /api/video/interview/:interviewId
Response
json{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "video_response_id_1",
      "interview": "interview_id",
      "question": "Question 1",
      "questionIndex": 0,
      "videoUrl": "cloudinary_video_url_1",
      "cloudinaryId": "cloudinary_resource_id_1",
      "duration": 60,
      "size": 5242880,
      "user": "user_id",
      "status": "ready",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // More video responses...
  ]
}
Delete Video Response
CopyDELETE /api/video/:id
Response
json{
  "success": true,
  "data": {}
}



🔄 Frontend Integration
Video Upload Flow

Request a signature from the server (GET /api/video/signature)
Use the signature to upload directly to Cloudinary from the frontend
Once upload is complete, save the video metadata to your server (POST /api/video)
Use the returned video response ID to associate the video with the interview



Taks 5

Evaluation API Endpoints
Submit Evaluation
POST /api/evaluations
Creates a new evaluation for a video response.
Required Authentication: Bearer token (JWT)
Required Role: Evaluator or Admin
Request Body:
jsonCopy{
  "videoResponse": "video_response_id",
  "score": 8,
  "comments": "Good communication skills and technical knowledge. Could improve on problem-solving approach."
}
Response (201 Success):
jsonCopy{
  "success": true,
  "data": {
    "_id": "evaluation_id",
    "videoResponse": "video_response_id",
    "evaluator": "evaluator_user_id",
    "score": 8,
    "comments": "Good communication skills and technical knowledge. Could improve on problem-solving approach.",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
Get Evaluations for a Video Response
GET /api/evaluations/video/:videoResponseId
Returns all evaluations for a specific video response.
Required Authentication: Bearer token (JWT)
Response (200 Success):
jsonCopy{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "evaluation_id_1",
      "videoResponse": "video_response_id",
      "evaluator": {
        "_id": "user_id_1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "score": 8,
      "comments": "Good communication skills and technical knowledge.",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "_id": "evaluation_id_2",
      "videoResponse": "video_response_id",
      "evaluator": {
        "_id": "user_id_2",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "score": 7,
      "comments": "Shows potential but needs improvement in expressing technical concepts.",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  ]
}
Get Evaluations for an Interview
GET /api/evaluations/interview/:interviewId
Returns all evaluations across all video responses for a specific interview.
Required Authentication: Bearer token (JWT)
Response (200 Success):
jsonCopy{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "evaluation_id_1",
      "videoResponse": {
        "_id": "video_response_id_1",
        "question": "What is your experience with React?",
        "questionIndex": 0,
        "user": {
          "_id": "applicant_id_1",
          "name": "John Applicant",
          "email": "john@example.com"
        }
      },
      "evaluator": {
        "_id": "evaluator_id_1",
        "name": "Eva Evaluator",
        "email": "eva@example.com"
      },
      "score": 8,
      "comments": "Good understanding of React concepts.",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // More evaluation objects...
  ]
}
Get Evaluation Statistics
GET /api/evaluations/stats/interview/:interviewId
Returns aggregated statistics for all evaluations in an interview.
Required Authentication: Bearer token (JWT)
Response (200 Success):
jsonCopy{
  "success": true,
  "overallStats": {
    "totalEvaluations": 15,
    "averageScore": 7.8,
    "videoResponsesEvaluated": 6,
    "totalVideoResponses": 8
  },
  "videoResponseStats": [
    {
      "_id": "video_response_id_1",
      "question": "What is your experience with React?",
      "questionIndex": 0,
      "applicant": {
        "_id": "applicant_id_1",
        "name": "John Applicant",
        "email": "john@example.com"
      },
      "averageScore": 8.5,
      "minScore": 7,
      "maxScore": 10,
      "evaluationCount": 3
    },
    // More video response stats...
  ]
}
Update Evaluation
PUT /api/evaluations/:id
Updates an existing evaluation.
Required Authentication: Bearer token (JWT)
Request Body:
jsonCopy{
  "score": 9,
  "comments": "Updated review after second viewing. Excellent technical knowledge."
}
Response (200 Success):
jsonCopy{
  "success": true,
  "data": {
    "_id": "evaluation_id",
    "videoResponse": "video_response_id",
    "evaluator": "evaluator_user_id",
    "score": 9,
    "comments": "Updated review after second viewing. Excellent technical knowledge.",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-03T00:00:00.000Z"
  }
}
Delete Evaluation
DELETE /api/evaluations/:id
Deletes an evaluation.
Required Authentication: Bearer token (JWT)
Response (200 Success):
jsonCopy{
  "success": true,
  "data": {}
}
Authorization Rules

Only users with the role of "evaluator" or "admin" can create evaluations
Users can only update or delete their own evaluations (unless they are admins)
Only authorized users (interview creator, evaluators, and admins) can view evaluations
Each evaluator can submit only one evaluation per video response

Data Model
javascriptCopy{
  "videoResponse": "ObjectId (reference to VideoResponse model)",
  "evaluator": "ObjectId (reference to User model)",
  "score": "Number (1-10)",
  "comments": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}