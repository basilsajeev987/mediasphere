# MediaSphere

## Media Distribution Platform

MediaSphere is a full-stack Media Distribution Platform built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The platform enables creators to upload and distribute media content while allowing users to discover, search, rate, like, and comment on posts. The application includes role-based access control for Administrators, Creators, and Consumers, ensuring secure and scalable content management.

Media files are stored using Azure Blob Storage, while the application backend and frontend are deployed on AWS cloud infrastructure for high availability and scalability.

---

## Features

### User Features

* User Registration and Login
* JWT Authentication
* Secure Password Encryption
* Browse Media Feed
* Search Media by Title, Caption, Location, and People
* Like and Unlike Posts
* Comment on Posts
* Rate Posts
* View Creator Profiles
* Responsive User Interface

### Creator Features

* Creator Dashboard
* Upload Images to Azure Blob Storage
* Add Title and Caption
* Tag Locations
* Tag People
* Manage Published Posts
* View Engagement Statistics

### Admin Features

* User Management
* Creator Management
* Content Moderation
* Remove Inappropriate Posts
* Platform Monitoring
* Analytics Dashboard

---

## Technology Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Vite
* Context API

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt.js

### Database

* MongoDB Atlas
* Mongoose

### Cloud Storage

* Azure Blob Storage

### Cloud Deployment

* AWS EC2
* AWS Load Balancer
* AWS Route 53
* AWS Certificate Manager
* AWS CloudWatch

---

## System Architecture

```text
Users
   │
   ▼
React Frontend (AWS)
   │
   ▼
Node.js + Express API (AWS EC2)
   │
   ├── MongoDB Atlas
   │
   └── Azure Blob Storage
```

---

## Core Functionalities

### Authentication Module

* Register
* Login
* JWT Token Generation
* Protected Routes
* Role-Based Authorization

### Media Module

* Upload Media
* Store Files in Azure Blob Storage
* Publish Content
* Media Search
* Media Feed

### Engagement Module

* Likes
* Comments
* Ratings
* User Interactions

### Search Module

Users can search content based on:

* Title
* Caption
* Location
* Tagged People

### Administration Module

* Manage Users
* Manage Creators
* Moderate Content
* View Platform Statistics

---

## Project Structure

```text
MediaSphere
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## Environment Variables

### Backend

```env
PORT=8080

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

AZURE_STORAGE_ACCOUNT=your_storage_account
AZURE_STORAGE_CONTAINER=your_container_name
AZURE_STORAGE_KEY=your_storage_key

CORS_ORIGINS=http://localhost:5173
```

### Frontend

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/MediaSphere.git

cd MediaSphere
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## AWS Deployment

### Frontend

Deploy React application using:

* AWS S3 Static Hosting
* AWS CloudFront
* AWS Route 53

### Backend

Deploy Express API using:

* AWS EC2
* Nginx Reverse Proxy
* PM2 Process Manager

### Database

* MongoDB Atlas

### Storage

* Azure Blob Storage

---

## Security Features

* JWT Authentication
* Password Hashing using Bcrypt
* Protected API Routes
* Role-Based Access Control
* Secure CORS Configuration
* Environment Variable Management

---

## Future Enhancements

* Video Upload Support
* Real-Time Notifications
* Direct Messaging
* Story Feature
* AI-Based Content Recommendations
* Creator Analytics Dashboard
* Social Sharing
* Mobile Application

---

## Learning Outcomes

This project demonstrates:

* Full-Stack MERN Development
* Cloud-Based Deployment
* REST API Design
* Authentication & Authorization
* Azure Blob Storage Integration
* MongoDB Database Design
* AWS Infrastructure Deployment
* Media Distribution System Architecture

---

## License

This project is developed for educational and portfolio purposes.
