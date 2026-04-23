# LearnHub – Full Stack Learning Management System (LMS)

## Overview

**LearnHub** is a full-stack Learning Management System that allows students to explore courses, enroll, track progress, and earn certificates. It also includes an admin analytics system for monitoring users, courses, and payments.

The project is built with a **React frontend** and a **Node.js + Express backend**, using **SQLite** as the database.

# Features

### Student Features
* Browse and search courses
* Filter courses by category
* Enroll in courses
* Video lesson player
* Track learning progress
* Resume last lesson
* Dashboard showing learning stats
* Certificate completion tracking

### Admin Features
* View all users
* Monitor course enrollments
* Track payments and analytics
* Manage course catalog

### Analytics
* Total courses
* Total users
* Payment tracking
* Student progress data


# Project Architecture

```
React Frontend
      ↓
Custom Hooks
      ↓
DataService (API Layer)
      ↓
Express Backend
      ↓
SQLite Database
```

# Tech Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend

* Node.js
* Express.js
* SQLite

### Tools

* REST API
* Fetch API
* JSON storage for modules & lessons

# Project Structure

```
learnhub
│
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── pages
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── CourseList.tsx
│   │   │   │   ├── CourseDetails.tsx
│   │   │   │   ├── CoursePlayer.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── Login/Signup.tsx
│   │   │   │   ├── Checkout.tsx
│   │   │   │   └── StudentDashboard.tsx
│   │   │   │
│   │   │   ├── hooks
│   │   │   │   ├── useProgress.ts
│   │   │   │   └── useRealtimeData.ts
│   │   │   │
│   │   │   ├── services
│   │   │   │   └── DataService.ts
│   │   │   │
│   │   │   │── utils
│   │   │   |   └── generateCertificate.ts
│   │   │   │
│   │   │   └── context
│   │   │       └── AuthContext.tsx
│
├── backend
│   ├── server.js
│   ├── db.js
│   ├── lms.db
│   └── routes
│       ├── courses.js
│       ├── users.js
│       ├── enrollments.js
│       ├── payments.js
│       ├── razorpay.js
│       └── progress.js

```

# Installation

## Clone the Repository

```
git clone https://github.com/AsthaPitambarwale/OnlineTraining-LearnHub.git
cd learnhub
```


## Install Frontend Dependencies

```
cd frontend
npm install
```

Run frontend:

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Create the env file: 
VITE_API_URL= backend-route

Note: Checkout.tsx contains test key of razorpay that should be same from backend.

## Install Backend

```
cd backend
npm install
```

Run backend:

```
node server.js
```

Backend runs on:

```
${import.meta.env.VITE_API_URL}
```
Create the env file: 
RAZORPAY_KEY_ID=rzp_test_yourkey
RAZORPAY_KEY_SECRET=your-secret-key
FRONTEND_URL=you-frontend-url

Note: In frontend/src/pages/Checkout.tsx contains test key of razorpay that should be same from backend.

# API Endpoints

### Courses

```
GET /courses
POST /courses
```

### Users

```
GET /users
POST /users
```

### Enrollments

```
GET /enrollments/:userId
POST /enrollments
```
### RozarPay

```
POST /create-order
POST /verify
```

### Payments

```
GET /payments
POST /payments
```

### Progress

```
GET /progress/:userId
POST /progress/complete
```

# Database Tables

### courses

```
id
title
description
price
instructor
category
thumbnail
duration
rating
studentsEnrolled
modules
```

### users

```
id
name
email
role
```

### enrollments

```
userId
courseId
```

### payments

```
id
userId
userName
courseId
courseTitle
amount
date
status
```

### progress

```
userId
courseId
completedLessons
lastAccessedLesson
lastAccessedAt
completedAt
```

# Testing Backend

Debug API (New Feature)

A temporary debug route has been added to quickly inspect database data during development.

Debug Endpoint
GET /debug

This returns data from multiple tables in a single response.

Example:

```${import.meta.env.VITE_API_URL}/debug```

Example response:

{
  "courses": [...],
  "users": [...],
  "payments": [...],
  "enrollments": [...]
}

# Example Data Flow

```
Student opens CourseList
        ↓
React calls useRealtimeCourses()
        ↓
DataService.getCourses()
        ↓
GET /courses
        ↓
Express API
        ↓
SQLite Database
        ↓
Courses returned to UI
```

# Future Improvements

* JWT authentication
* Secure video streaming
* Stripe payment integration
* Admin course creation UI
* Real-time updates with WebSockets
* Certificate generation (PDF)

# Author

Developed as a full-stack LMS project using modern React and Node.js architecture.
