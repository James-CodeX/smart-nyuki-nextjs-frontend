// User and Authentication Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  beekeeper_profile?: BeekeeperProfile | null;
}

export interface BeekeeperProfile {
  id: string;
  user: User;
  latitude: string;
  longitude: string;
  coordinates: [number, number];
  address?: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  established_date: string;
  app_start_date: string;
  certification_details?: string;
  profile_picture_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// API Request/Response Types
export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  password: string;
  password_confirm: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface CreateBeekeeperProfileRequest {
  latitude: string;
  longitude: string;
  address?: string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  established_date: string;
  certification_details?: string;
  profile_picture_url?: string;
  notes?: string;
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

// Error Types
export interface ApiError {
  field_name?: string[];
  non_field_errors?: string[];
  detail?: string;
}

// Component Props Types
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
}

// Auth Store State
export interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileRequest) => Promise<void>;
  clearAuth: () => void;
  refreshUserProfile: () => Promise<void>;
}
