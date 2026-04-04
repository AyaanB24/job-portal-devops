# 🛠️ Tech Stack Analysis: Job Connect

A comprehensive breakdown of the technologies, frameworks, and tools used in the **Job Connect** project.

---

## 🏗️ Backend (NestJS Architecture)

The backend is built with a modular NestJS architecture, emphasizing scalability and maintainability.

- **Framework**: [NestJS](https://nestjs.com/) (v10.0.0) - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5.1.3) - Statically typed JavaScript for improved developer experience and code quality.
- **Database (ORM/ODM)**: [Mongoose](https://mongoosejs.com/) (v9.3.1) - Elegant MongoDB object modeling for Node.js.
- **Authentication & Security**:
  - **Passport.js**: Used for handling authentication strategies.
  - **JWT (JSON Web Tokens)**: Secure session management and stateful/stateless auth.
  - **Google OAuth 2.0**: Social login integration for job seekers.
  - **Bcrypt**: Used for secure password hashing.
- **Real-time Communication**: [Socket.IO](https://socket.io/) (v4.6.1) - Enables real-time, bi-directional, and event-based communication.
- **Email Services**:
  - **Nodemailer**: Core library for sending emails (Gmail/SMTP integration).
  - **Resend**: Modern email API for high-deliverability transactional emails.
- **API Documentation**: [Swagger (OpenAPI)](https://swagger.io/) - Automated API documentation and testing interface.
- **Validation**: `class-validator` and `class-transformer` for robust request payload validation.

---

## 🎨 Frontend (React & Modern UI)

The frontend leverages a modern, performance-first stack with a focus on premium UI/UX.

- **Library**: [React](https://react.dev/) (v18.3.1) - A JavaScript library for building interactive user interfaces.
- **Build Tool**: [Vite](https://vitejs.dev/) (v5.4.19) - Next-generation frontend tooling for fast builds and hot module replacement (HMR).
- **State Management & Data Fetching**:
  - **TanStack Query (React Query)** (v5.83.0): Powerful asynchronous state management for fetching, caching, and updating server state.
  - **Context API**: Used for local application state (e.g., `AuthContext`).
- **Styling & UI Components**:
  - **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
  - **shadcn/ui**: High-quality, accessible UI components built on Radix UI primitives.
  - **Framer Motion**: Production-ready animation library for React.
  - **Lucide Icons**: Beautifully simple, pixel-perfect icons.
- **Routing**: [React Router DOM](https://reactrouter.com/) (v6.30.1) - Declarative routing for React applications.
- **Form Handling**:
  - **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
  - **Zod**: TypeScript-first schema declaration and validation library.
- **Real-time**: `socket.io-client` for handling live notifications and updates.

---

## ⚙️ DevOps & Infrastructure

- **Containerization**: [Docker](https://www.docker.com/) - Used for containerizing the application for consistent development and deployment environments (via `Dockerfile` and `docker-compose.yml`).
- **Environment Management**: `dotenv` for handling secure environment variables.
- **Version Control**: Git (GitHub) - Used for source code management and collaboration.
- **Testing**:
  - **Vitest**: Vite-native unit testing framework for the frontend.
  - **Jest**: Comprehensive testing framework for the backend.

---

## 🚀 Key Features Supported by this Stack

1. **Multi-Role Dashboards**: Specific workflows for Job Seekers, Employers, and Admins.
2. **Identity Verification**: Robust email-based verification protocol for companies.
3. **Responsive Design**: Mobile-first UI that adapts to any screen size.
4. **Real-time Alerts**: Instant notifications for applications, status changes, and job postings.
5. **Secure Auth Flow**: Hybrid authentication (Local + Google OAuth) with JWT protection.

---

> [!TIP]
> The project follows a **strict TypeScript-first** approach, ensuring type safety across the entire stack from database schemas to frontend components.
