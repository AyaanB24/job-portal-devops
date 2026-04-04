# Job Connect — Full-Stack Job Portal 🚀

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A production-ready job portal featuring MongoDB persistence, Google OAuth, company identity verification, real-time notifications, and a modern TypeScript-first architecture.

---

## 🐳 Dockerized Deployment (Recommended)

The easiest way to run the entire stack (Frontend, Backend, and MongoDB) is using **Docker Compose**. 

### 1. Prerequisites
- **Docker Desktop** installed and running.
- **Google OAuth Client ID/Secret** from Google Cloud Console.
- **Gmail App Passwords** for SMTP verification.

### 2. Configuration
Create a `.env` file in the **`backend`** directory (see `.env.example` if available). 
Ensuring your `FRONTEND_URL` is set to `http://localhost`.

### 3. Quick Start
Run the following command in the project root:
```bash
docker-compose up -d --build
```

- **Frontend**: [http://localhost](http://localhost) (Port 80)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Documentation**: [http://localhost:5000/docs](http://localhost:5000/docs)
- **MongoDB Compass**: `mongodb://admin:password123@localhost:27017/jobportal?authSource=admin`

---

## 🏗 System Architecture

The project uses a **Containerized Microservices** architecture with **Nginx** acting as a high-performance Reverse Proxy and API Gateway.

```mermaid
graph TD
    User([User]) <--> Nginx[Nginx Gateway :80]
    
    subgraph docker [Docker Compose Network]
        Nginx <--> Frontend[React Frontend Container]
        Nginx <--> Backend[NestJS Backend Container :5000]
        Backend <--> MongoDB[(MongoDB Container :27017)]
    end
    
    Backend -.-> |SMTP| Mail[Gmail API]
    Backend -.-> |OAuth| Google[Google Cloud Console]
```

---

## ✨ Features

- **Dockerized Architecture**: One-command setup for the entire full-stack application.
- **Nginx API Gateway**: Unified access point for frontend and backend on Port 80.
- **Multi-Role Support**: Specialized dashboards for **Job Seekers**, **Employers**, and **Admins**.
- **Social Authentication**: Google OAuth integration for Job Seekers.
- **Company Verification**: Secure email-based registration flow with token verification via Nodemailer.
- **Real-time Notifications**: Socket.IO alerts for job postings and status updates.
- **Modern UI**: Built with `shadcn/ui`, `Tailwind CSS`, `Framer Motion`, and `Lucide` icons.

---

## 🛠 Manual Installation (Development)

If you prefer to run the services manually without Docker:

### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── auth/           # JWT & Google OAuth Logic
│   │   ├── common/         # Schemas, Guards & Mail Service
│   │   ├── companies/      # Company Verification Logic
│   │   ├── jobs/           # Job Management
│   │   ├── applications/   # Application Tracking
│   │   └── notifications/  # WebSocket Gateway
│   └── .env                # Server Credentials
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Design System (Hero, Slider, etc.)
│   │   ├── services/       # API Communications
│   │   ├── contexts/       # Auth & State Management
│   │   └── pages/          # Dashboard & Public Routes
└── README.md               # Documentation Root
```

---

## 🛡 Security Rules
- **Identity Verification Protocol**: All companies must verify their email via a secure token-based flow before posting jobs.
- **Access Control**: Roles are strictly checked at the API level (e.g., Only employers can post jobs).
- **Google OAuth**: Restricted only to Job Seekers (Employers must use business email/password).
- **Encryption**: All passwords are hashed using `bcrypt` (10 rounds).
- **Data Protection**: Sensitive fields (like passwords) are never returned in JSON responses.

