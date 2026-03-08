# Job Connect - Frontend

A modern, high-performance job portal frontend built with React, Vite, and shadcn/ui.

## Features

- **Job Listings**: Browse and search for available job opportunities.
- **Job Details**: View comprehensive information about specific roles.
- **Application Flow**: Seamless job application process for job seekers.
- **Employer Dashboards**: Tools for companies to manage listings and applicants.
- **Auth System**: Secure login and registration for different user roles (Job Seekers, Companies, Admins).
- **Responsive Design**: Fully optimized for various devices and screen sizes.

## Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-connect-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components`: Reusable UI components and layout elements.
- `src/pages`: Application views and route handlers.
- `src/contexts`: React contexts for state management (e.g., Auth).
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions and shared libraries.
- `src/services`: API service layers.
