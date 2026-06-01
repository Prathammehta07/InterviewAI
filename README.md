# 🎥 InterviewAI

> An intelligent, interactive interview platform powered by AI video interviews with real-time feedback and analytics.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-Fast-brightgreen?logo=vite) ![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

InterviewAI is a modern platform designed to revolutionize the interview experience. It leverages AI-powered video interviews to provide candidates with a realistic interview environment while offering recruiters detailed analytics and insights about candidate performance in real-time.

Whether you're preparing for a job interview or looking to streamline your hiring process, InterviewAI delivers an intuitive, engaging, and intelligent solution.

## ✨ Features

- **🤖 AI-Powered Interviews**: Interactive video interviews with AI-driven question generation and evaluation
- **📹 Video Recording & Playback**: High-quality video interview recording with playback capabilities
- **📊 Real-time Analytics**: Instant feedback and performance metrics for each interview session
- **🎯 Smart Question Generation**: Kimi AI integration for dynamic and contextual question creation
- **👤 User Authentication**: Secure authentication system with session management
- **📱 Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **⚡ Real-time Updates**: Live interview sessions with instant data synchronization
- **🔐 Secure Data Storage**: PostgreSQL database with Drizzle ORM for robust data management
- **🎨 Beautiful UI Components**: Pre-built component library with shadcn/ui

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **tRPC** - End-to-end type-safe APIs

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend code
- **Drizzle ORM** - SQL database ORM
- **PostgreSQL** - Relational database

### External Services
- **Kimi AI** - AI-powered interview questions and analysis

### Development Tools
- **Vitest** - Unit testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS transformation

## 📁 Project Structure

```
InterviewAI/
├── src/                          # Frontend application
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── AuthLayout.tsx        # Authentication wrapper
│   │   └── Navbar.tsx            # Navigation bar
│   ├── pages/                    # Page components
│   │   ├── Login.tsx             # Login page
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── SetupInterview.tsx    # Interview setup
│   │   ├── LiveInterview.tsx     # Live interview session
│   │   ├── VideoInterview.tsx    # Video interview view
│   │   ├── Results.tsx           # Interview results & analytics
│   │   └── Home.tsx              # Home page
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   └── use-mobile.ts         # Mobile detection hook
│   ├── providers/                # Context providers
│   │   └── trpc.tsx              # tRPC provider setup
│   ├── lib/                      # Utility functions
│   │   └── utils.ts              # Helper functions
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
│
├── api/                          # Backend API
│   ├── routers/
│   │   ├── auth-router.ts        # Authentication endpoints
│   │   └── interview-router.ts   # Interview endpoints
│   ├── kimi/                     # Kimi AI integration
│   │   ├── auth.ts               # Kimi authentication
│   │   ├── platform.ts           # Kimi platform API
│   │   ├── session.ts            # Kimi session management
│   │   └── types.ts              # Kimi types
│   ├── lib/                      # Backend utilities
│   │   ├── env.ts                # Environment variables
│   │   ├── http.ts               # HTTP client
│   │   ├── cookies.ts            # Cookie management
│   │   └── interview-ai.ts       # Interview AI logic
│   ├── queries/                  # Database queries
│   │   ├── users.ts              # User queries
│   │   └── connection.ts         # DB connection
│   ├── middleware.ts             # Express middleware
│   ├── context.ts                # API context
│   ├── router.ts                 # Main router
│   └── boot.ts                   # Server bootstrap
│
├── db/                           # Database
│   ├── schema.ts                 # Database schema
│   ├── relations.ts              # Table relations
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Database migrations
│
├── contracts/                    # Shared types & constants
│   ├── types.ts                  # Shared TypeScript types
│   ├── constants.ts              # Application constants
│   └── errors.ts                 # Error definitions
│
├── public/                       # Static assets
├── config files                  # Various configuration files
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind config
│   ├── tsconfig.json             # TypeScript config
│   └── drizzle.config.ts         # Drizzle ORM config
└── package.json                  # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- Kimi AI API credentials

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Prathammehta07/InterviewAI.git
cd InterviewAI
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/interviewai

# Kimi AI
KIMI_API_KEY=your_kimi_api_key
KIMI_API_URL=https://api.kimi.ai

# Server
PORT=3000
NODE_ENV=development

# Session
SESSION_SECRET=your_session_secret
```

4. **Set up the database:**
```bash
npm run db:push
npm run db:seed
```

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with hot module replacement
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with initial data
- `npm run db:migrate` - Run database migrations

### Production
- `npm run build` - Build for production (frontend + backend)
- `npm run preview` - Preview production build
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `KIMI_API_KEY` | Kimi AI API key | `sk-...` |
| `KIMI_API_URL` | Kimi AI API endpoint | `https://api.kimi.ai` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `SESSION_SECRET` | Session encryption secret | `random_string` |

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login user and create session
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/logout`
Logout and destroy session

#### GET `/api/auth/me`
Get current authenticated user

### Interview Endpoints

#### POST `/api/interviews/create`
Create a new interview session

#### GET `/api/interviews/:id`
Get interview details and current state

#### POST `/api/interviews/:id/submit`
Submit interview responses and get AI evaluation

#### GET `/api/interviews/:id/results`
Get interview results and analytics

## 🗄 Database

The application uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations.

### Key Tables
- `users` - User accounts
- `interviews` - Interview sessions
- `results` - Interview results and scores
- `sessions` - User sessions

### Database Migrations
```bash
npm run db:migrate
```

## 🎨 Component Library

Built with **shadcn/ui**, the project includes pre-styled components:
- Buttons, Forms, Dialogs
- Cards, Tables, Tabs
- Modals, Toasts, Tooltips
- And many more...

## ⚡ Performance

- **Vite** for blazing-fast builds
- **React Fast Refresh** for instant HMR
- **Code splitting** for optimized bundle sizes
- **Type safety** with TypeScript

## 🔒 Security

- Secure authentication and session management
- Environment variable protection
- CSRF protection middleware
- SQL injection prevention with Drizzle ORM

## 📞 Support & Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Pratham Mehta**

- GitHub: [@Prathammehta07](https://github.com/Prathammehta07)
- Repository: [InterviewAI](https://github.com/Prathammehta07/InterviewAI)

---

<div align="center">

**[⬆ Back to Top](#-interviewai)**

Made with ❤️ by Pratham Mehta

</div>
