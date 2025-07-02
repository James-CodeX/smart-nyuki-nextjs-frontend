# Smart Nyuki Frontend

A modern Next.js frontend application for the Smart Nyuki apiary management system, built with shadcn/ui components.

## Features

### Stage 1: Accounts (✅ Implemented)
- **User Registration**: Complete registration flow with form validation
- **User Authentication**: JWT-based login/logout system
- **Profile Management**: View and update user information
- **Beekeeper Profiles**: Extended profile management for beekeepers
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: shadcn/ui components for a polished interface

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API with custom wrapper
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Smart Nyuki Django backend running on `http://localhost:8000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-nyuki-nextjs-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` to match your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── store/               # Zustand stores
│   └── auth.ts         # Authentication store
├── types/              # TypeScript type definitions
│   └── index.ts       # Main types
└── utils/             # Additional utilities
```

## API Integration

The frontend integrates with the Smart Nyuki Django REST API:

### Authentication Endpoints
- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/logout/` - User logout
- `POST /api/accounts/token/refresh/` - Token refresh

### Profile Endpoints
- `GET/PATCH /api/accounts/profile/` - User profile management
- `POST /api/accounts/change-password/` - Change password
- `GET/POST /api/accounts/beekeeper-profiles/` - Beekeeper profiles
- `GET/PATCH/DELETE /api/accounts/beekeeper-profiles/{id}/` - Individual profile management

## Authentication Flow

1. **Registration**: Users create accounts with email, name, and password
2. **Login**: JWT tokens (access + refresh) are stored in localStorage and Zustand
3. **Token Management**: Automatic token refresh on API calls
4. **Logout**: Tokens are cleared from storage and blacklisted on server

## Development Roadmap

### ✅ Stage 1: Accounts (Current)
- User registration and authentication
- Profile management
- Beekeeper profile creation

### 🚧 Stage 2: Apiaries (Planned)
- Apiary management
- Location tracking
- Multi-apiary support

### 🚧 Stage 3: Devices (Planned)
- Smart device integration
- Sensor data monitoring
- Device management

### 🚧 Stage 4: Inspections (Planned)
- Hive inspection tracking
- Inspection scheduling
- Health monitoring

### 🚧 Stage 5: Production (Planned)
- Honey production tracking
- Harvest management
- Analytics and reporting

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Follow the component structure with shadcn/ui
4. Write meaningful commit messages
5. Test authentication flows thoroughly

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:8000/api)

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes with authentication checks
- Form validation with Zod schemas
- HTTPS-ready configuration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

Built with ❤️ for the beekeeping community
