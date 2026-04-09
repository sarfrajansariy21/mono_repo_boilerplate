# 🌐 Web Service

The customer-facing frontend for the NestJS Monorepo.

## Tech Stack
- **React** with Vite
- **Redux Toolkit** for state management
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **@monorepo/api-client** for data fetching

## Getting Started

### 1. Install Dependencies
(Best run from the monorepo root)
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

## Features
- **Strict In-Memory Auth**: Token never touches `localStorage` for enhanced security.
- **Role-Based Protection**: Dynamic routing based on `UserRole`.
- **Performance**: High OXLINT scores and optimized bundle size.
