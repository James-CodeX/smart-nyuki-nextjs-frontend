# Smart Nyuki Frontend

A modern Next.js frontend application for the Smart Nyuki apiary management system, built with shadcn/ui components.

## Features

### Stage 1: Accounts (✅ Completed)
- **User Registration**: Complete registration flow with form validation
- **User Authentication**: JWT-based login/logout system
- **Profile Management**: View and update user information
- **Beekeeper Profiles**: Extended profile management for beekeepers
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: shadcn/ui components for a polished interface

### Stage 2: Apiaries & Hives (✅ Completed)
- **Apiary Management**: Full CRUD operations for apiaries
- **Location Tracking**: GPS coordinates and address management
- **Multi-Apiary Support**: Manage multiple apiaries per beekeeper
- **Hive Management**: Complete hive lifecycle management
- **Hive Types**: Support for Langstroth, Top Bar, Warre, Flow Hive, and custom types
- **Dashboard Analytics**: Real-time statistics and overview
- **Responsive Navigation**: Collapsible sidebar with stage indicators

### Stage 3: Smart Devices (✅ Completed)
- **Device Registration**: Add and manage Smart-nyuki devices
- **Device Assignment**: Assign/unassign devices to specific hives
- **Device Status Tracking**: Monitor active/inactive devices and battery levels
- **Assignment Management**: Visual distinction between assigned and unassigned devices
- **Device Operations**: Edit device details, activate/deactivate, and delete devices
- **Automated Integration**: Automatic hive-device relationship management
- **Comprehensive Dashboard**: Tabbed interface for efficient device management

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
│   ├── apiaries/          # Apiary management pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── hives/             # Hive management pages
│   ├── profile/           # User profile pages
│   ├── smart-devices/     # Smart device management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── apiaries/         # Apiary-specific components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── hives/            # Hive management components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── smart-device/     # Smart device components
│   └── ui/               # shadcn/ui base components
├── lib/                  # Utility libraries
│   ├── api.ts           # Comprehensive API client
│   └── utils.ts         # Utility functions
├── store/               # Zustand stores
│   ├── apiary.ts        # Apiary management store
│   ├── auth.ts          # Authentication store
│   ├── hive.ts          # Hive management store
│   └── smart-device.ts  # Smart device management store
├── types/              # TypeScript type definitions
│   └── index.ts       # Comprehensive type definitions
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

### Apiary & Hive Endpoints
- `GET/POST /api/apiaries/apiaries/` - Apiary management
- `GET/PATCH/DELETE /api/apiaries/apiaries/{id}/` - Individual apiary operations
- `GET /api/apiaries/apiaries/{id}/stats/` - Apiary statistics
- `GET/POST /api/apiaries/hives/` - Hive management
- `GET/PATCH/DELETE /api/apiaries/hives/{id}/` - Individual hive operations
- `POST /api/apiaries/hives/{id}/activate/` - Activate hive
- `POST /api/apiaries/hives/{id}/deactivate/` - Deactivate hive

### Smart Device Endpoints
- `GET/POST /api/devices/devices/` - Smart device management
- `GET/PATCH/DELETE /api/devices/devices/{id}/` - Individual device operations
- `GET /api/devices/devices/{id}/stats/` - Device statistics

## Authentication Flow

1. **Registration**: Users create accounts with email, name, and password
2. **Login**: JWT tokens (access + refresh) are stored in localStorage and Zustand
3. **Token Management**: Automatic token refresh on API calls
4. **Logout**: Tokens are cleared from storage and blacklisted on server

## Development Roadmap

### ✅ Stage 1: Accounts (Completed)
- User registration and authentication
- Profile management
- Beekeeper profile creation
- JWT token management
- Protected route system

### ✅ Stage 2: Apiaries & Hives (Completed)
- Apiary management with full CRUD operations
- Location tracking with GPS coordinates
- Multi-apiary support for beekeepers
- Comprehensive hive management
- Hive type categorization (Langstroth, Top Bar, Warre, Flow Hive, Other)
- Hive lifecycle management (active/inactive states)
- Real-time dashboard with statistics
- Responsive navigation with collapsible sidebar

### ✅ Stage 3: Smart Devices (Completed)
- Smart-nyuki device registration and management
- Device-to-hive assignment system
- Device status monitoring (active/inactive, battery levels)
- Automated device-hive relationship management
- Comprehensive device dashboard with filtering
- Device operations (edit, activate/deactivate, delete)
- Assignment/unassignment workflows
- Real-time device statistics

### 🚧 Stage 4: Inspections (Planned)
- Hive inspection tracking and history
- Inspection scheduling and reminders
- Health monitoring and alerts
- Inspection templates and checklists
- Photo and note management

### 🚧 Stage 5: Production (Planned)
- Honey production tracking
- Harvest management and records
- Analytics and reporting dashboard
- Yield predictions and trends
- Export capabilities

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Key Features Implemented

### 🏠 **Comprehensive Apiary Management**
- Create, edit, and delete apiaries with GPS coordinates
- Visual apiary cards with location and hive count
- Real-time statistics and analytics
- Address geocoding and mapping integration

### 🏺 **Advanced Hive Management**
- Complete hive lifecycle management
- Multiple hive type support
- Installation date tracking
- Active/inactive status management
- Automated smart device integration

### 📱 **Smart Device Integration**
- Device registration with serial numbers
- Flexible device-to-hive assignment
- Battery level monitoring
- Device status tracking
- Assignment history and management

### 📊 **Real-time Dashboard**
- Live statistics for apiaries, hives, and devices
- Quick action buttons for common tasks
- Status indicators and progress tracking
- Responsive design for all device sizes

### 🎨 **Modern User Experience**
- Intuitive navigation with collapsible sidebar
- Consistent design system using shadcn/ui
- Form validation with real-time feedback
- Toast notifications for user actions
- Mobile-first responsive design

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Follow the component structure with shadcn/ui
4. Write meaningful commit messages
5. Test all CRUD operations thoroughly
6. Ensure responsive design on all screen sizes

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
