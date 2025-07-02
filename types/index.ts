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

// Stage 2: Apiaries and Hives Types
export interface Apiary {
  id: string;
  beekeeper: {
    id: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    };
    experience_level: string;
  };
  name: string;
  latitude: string;
  longitude: string;
  coordinates: [number, number];
  address?: string;
  description?: string;
  hives?: Hive[];
  created_at: string;
  updated_at: string;
}

export interface Hive {
  id: string;
  apiary: {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    coordinates: [number, number];
    address?: string;
    description?: string;
  };
  name: string;
  hive_type: 'Langstroth' | 'Top Bar' | 'Warre' | 'Flow Hive' | 'Other';
  installation_date: string;
  has_smart_device: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateApiaryRequest {
  name: string;
  latitude: string;
  longitude: string;
  address?: string;
  description?: string;
}

export interface UpdateApiaryRequest {
  name?: string;
  latitude?: string;
  longitude?: string;
  address?: string;
  description?: string;
}

export interface CreateHiveRequest {
  apiary: string; // UUID of the apiary
  name: string;
  hive_type: 'Langstroth' | 'Top Bar' | 'Warre' | 'Flow Hive' | 'Other';
  installation_date: string; // YYYY-MM-DD format
  is_active?: boolean;
}

export interface UpdateHiveRequest {
  name?: string;
  hive_type?: 'Langstroth' | 'Top Bar' | 'Warre' | 'Flow Hive' | 'Other';
  installation_date?: string;
  is_active?: boolean;
}

export interface ApiaryStats {
  total_hives: number;
  active_hives: number;
  inactive_hives: number;
  smart_hives: number;
  hive_types: Record<string, number>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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
  initializeAuth: () => Promise<void>;
}

// Apiary Store State
export interface ApiaryStore {
  apiaries: Apiary[];
  currentApiary: Apiary | null;
  isLoading: boolean;
  fetchApiaries: () => Promise<void>;
  createApiary: (data: CreateApiaryRequest) => Promise<void>;
  updateApiary: (id: string, data: UpdateApiaryRequest) => Promise<void>;
  deleteApiary: (id: string) => Promise<void>;
  fetchApiary: (id: string) => Promise<void>;
  getApiaryStats: (id: string) => Promise<ApiaryStats>;
}

// Hive Store State
export interface HiveStore {
  hives: Hive[];
  currentHive: Hive | null;
  isLoading: boolean;
  fetchHives: (filters?: Record<string, any>) => Promise<void>;
  createHive: (data: CreateHiveRequest) => Promise<void>;
  updateHive: (id: string, data: UpdateHiveRequest) => Promise<void>;
  deleteHive: (id: string) => Promise<void>;
  fetchHive: (id: string) => Promise<void>;
  activateHive: (id: string) => Promise<void>;
  deactivateHive: (id: string) => Promise<void>;
}

// Stage 3: Smart Device Types
export interface SmartDevice {
  id: string;
  serial_number: string;
  beekeeper: {
    id: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    };
    experience_level: string;
  };
  hive?: {
    id: string;
    name: string;
    apiary: {
      id: string;
      name: string;
    };
  } | null;
  device_type: string;
  last_sync_at?: string;
  battery_level?: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateSmartDeviceRequest {
  serial_number: string;
  hive?: string; // UUID of the hive (optional - can be unassigned)
  device_type: string;
  battery_level?: number;
  is_active?: boolean;
  beekeeper?: string; // UUID of the beekeeper (will be added automatically by the store)
}

export interface UpdateSmartDeviceRequest {
  serial_number?: string;
  hive?: string | null; // UUID of the hive or null to unassign
  device_type?: string;
  battery_level?: number;
  is_active?: boolean;
}

// Smart Device Store State
export interface SmartDeviceStore {
  devices: SmartDevice[];
  currentDevice: SmartDevice | null;
  isLoading: boolean;
  fetchDevices: (filters?: Record<string, any>) => Promise<void>;
  createDevice: (data: CreateSmartDeviceRequest) => Promise<void>;
  updateDevice: (id: string, data: UpdateSmartDeviceRequest) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  fetchDevice: (id: string) => Promise<void>;
}
