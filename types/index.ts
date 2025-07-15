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
  hives?: Hive[];  // Optional array when fetching detailed apiary data
  hives_count?: number;  // Count field from list endpoint (as per API spec)
  // Smart status fields (optional, available when fetching with smart overview)
  smart_status?: 'no_hives' | 'not_smart' | 'partially_smart' | 'fully_smart';
  smart_status_display?: string;
  created_at: string;
  updated_at: string;
}

export interface Hive {
  id: string;
  apiary: string | Apiary; // UUID or nested Apiary object (depends on serializer)
  apiary_name: string;
  name: string;
  hive_type: 'Langstroth' | 'Top Bar' | 'Warre' | 'Flow Hive' | 'Other';
  installation_date: string;
  has_smart_device: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Smart device and sensor data (added when fetching with sensor data)
  smart_devices?: SmartDevice[];
  latest_sensor_reading?: SensorReading | null;
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

// Stage 3: Smart Metrics Types
export interface SmartMetrics {
  average_temperature: number;
  average_humidity: number;
  total_weight: number;
  average_weight: number;
  average_sound_level: number;
  temperature_range?: {
    min: number;
    max: number;
  };
  humidity_range?: {
    min: number;
    max: number;
  };
  readings_count?: number;
}

export interface ApiarySmartMetrics {
  apiary_id: string;
  apiary_name: string;
  smart_status: 'no_hives' | 'not_smart' | 'partially_smart' | 'fully_smart';
  smart_status_display: string;
  hive_counts: {
    total_hives: number;
    smart_hives: number;
    non_smart_hives: number;
    smart_percentage: number;
  };
  current_metrics: SmartMetrics | null;
  last_24h_metrics: SmartMetrics | null;
  last_week_metrics: SmartMetrics | null;
  hive_latest_readings: Array<{
    hive_id: string;
    hive_name: string;
    latest_reading: SensorReading;
  }>;
  total_readings: number;
  last_updated: string | null;
}

export interface ApiarySmartOverview {
  apiary_id: string;
  apiary_name: string;
  smart_status: 'no_hives' | 'not_smart' | 'partially_smart' | 'fully_smart';
  smart_status_display: string;
  hive_counts: {
    total_hives: number;
    smart_hives: number;
    non_smart_hives: number;
    smart_percentage: number;
  };
  total_readings: number;
  has_metrics: boolean;
}

export interface ApiariesSmartOverview {
  apiaries: ApiarySmartOverview[];
  summary: {
    total_apiaries: number;
    fully_smart_apiaries: number;
    partially_smart_apiaries: number;
    not_smart_apiaries: number;
    no_hives_apiaries: number;
    total_hives: number;
    total_smart_hives: number;
    total_readings: number;
    smart_apiaries_percentage: number;
  };
}

export interface SensorReading {
  id: string;
  device: string;
  device_serial: string;
  hive_name: string;
  temperature: string;
  humidity: string;
  weight: string;
  sound_level?: number;
  battery_level?: number;
  status_code?: number;
  timestamp: string;
  created_at: string;
}

export interface CreateSensorReadingRequest {
  device_serial: string;
  temperature: number;
  humidity: number;
  weight: number;
  sound_level?: number;
  battery_level?: number;
  status_code?: number;
  timestamp?: string;
}

export interface HiveSensorData {
  hive_id: string;
  hive_name: string;
  device_count: number;
  total_readings: number;
  readings: SensorReading[];
}

export interface HiveLatestSensorData {
  hive_id: string;
  hive_name: string;
  has_smart_device: boolean;
  latest_reading: SensorReading | null;
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
  // According to stage3.md, hive can be either a UUID string or nested object
  hive?: string | {
    id: string;
    name: string;
    apiary: {
      id: string;
      name: string;
    };
  } | null;
  // New fields from backend API
  hive_name?: string;
  apiary_name?: string;
  beekeeper_name?: string;
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

// Stage 4: Inspection Types
export interface InspectionSchedule {
  id: string;
  hive: {
    id: string;
    name: string;
    apiary: {
      id: string;
      name: string;
      latitude: string;
      longitude: string;
    };
    type: string;
    type_display: string;
    installation_date: string;
    has_smart_device: boolean;
    is_active: boolean;
  };
  scheduled_date: string;
  notes?: string;
  is_completed: boolean;
  weather_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface InspectionReport {
  id: string;
  schedule?: {
    id: string;
    scheduled_date: string;
    is_completed: boolean;
  } | null;
  hive: {
    id: string;
    name: string;
    apiary: {
      id: string;
      name: string;
    };
  };
  inspector: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  inspection_date: string;
  queen_present?: boolean;
  honey_level: 'Low' | 'Medium' | 'High';
  honey_level_display: string;
  colony_health: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  colony_health_display: string;
  varroa_mite_count?: number;
  brood_pattern: 'Solid' | 'Spotty' | 'None';
  brood_pattern_display: string;
  pest_observations?: string;
  actions_taken?: string;
  notes?: string;
  created_at: string;
}

export interface CreateInspectionScheduleRequest {
  hive: string; // UUID
  scheduled_date: string; // YYYY-MM-DD
  notes?: string;
  weather_conditions?: string;
}

export interface UpdateInspectionScheduleRequest {
  scheduled_date?: string;
  notes?: string;
  weather_conditions?: string;
}

export interface UpdateInspectionReportRequest {
  schedule?: string; // UUID - optional link to schedule
  hive: string; // UUID
  inspection_date: string; // YYYY-MM-DD
  queen_present?: boolean;
  honey_level: 'Low' | 'Medium' | 'High';
  colony_health: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  varroa_mite_count?: number;
  brood_pattern: 'Solid' | 'Spotty' | 'None';
  pest_observations?: string;
  actions_taken?: string;
  notes?: string;
}

// Settings Types
export interface UserSettings {
  id: string;
  timezone: string;
  language: string;
  temperature_unit: 'Celsius' | 'Fahrenheit';
  weight_unit: 'Kilograms' | 'Pounds';
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  created_at: string;
  updated_at: string;
}

export interface AlertThresholds {
  id: string;
  hive: string | null;
  hive_name?: string;
  is_global: boolean;
  temperature_min: number;
  temperature_max: number;
  humidity_min: number;
  humidity_max: number;
  weight_change_threshold: number;
  sound_level_threshold: number;
  battery_warning_level: number;
  inspection_reminder_days: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  push_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  alert_sound: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  critical_alerts_override_quiet: boolean;
  daily_summary_enabled: boolean;
  daily_summary_time: string;
  created_at: string;
  updated_at: string;
}

export interface DataSyncSettings {
  id: string;
  auto_sync_enabled: boolean;
  sync_frequency: 'Real-time' | 'Hourly' | 'Daily';
  wifi_only_sync: boolean;
  backup_enabled: boolean;
  backup_frequency: 'Daily' | 'Weekly' | 'Monthly';
  data_retention_days: number;
  created_at: string;
  updated_at: string;
}

export interface PrivacySettings {
  id: string;
  location_sharing: boolean;
  analytics_enabled: boolean;
  crash_reporting: boolean;
  data_sharing_research: boolean;
  profile_visibility: 'Private' | 'Public' | 'Community';
  created_at: string;
  updated_at: string;
}

export interface AvailableHive {
  id: string;
  name: string;
  apiary_name: string;
  is_active: boolean;
}

// Settings Request Types
export interface UpdateUserSettingsRequest {
  timezone?: string;
  language?: string;
  temperature_unit?: 'Celsius' | 'Fahrenheit';
  weight_unit?: 'Kilograms' | 'Pounds';
  date_format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
}

export interface UpdateAlertThresholdsRequest {
  hive?: string | null;
  temperature_min?: number;
  temperature_max?: number;
  humidity_min?: number;
  humidity_max?: number;
  weight_change_threshold?: number;
  sound_level_threshold?: number;
  battery_warning_level?: number;
  inspection_reminder_days?: number;
}

export interface UpdateNotificationSettingsRequest {
  push_notifications?: boolean;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  alert_sound?: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  critical_alerts_override_quiet?: boolean;
  daily_summary_enabled?: boolean;
  daily_summary_time?: string;
}

export interface UpdateDataSyncSettingsRequest {
  auto_sync_enabled?: boolean;
  sync_frequency?: 'Real-time' | 'Hourly' | 'Daily';
  wifi_only_sync?: boolean;
  backup_enabled?: boolean;
  backup_frequency?: 'Daily' | 'Weekly' | 'Monthly';
  data_retention_days?: number;
}

export interface UpdatePrivacySettingsRequest {
  location_sharing?: boolean;
  analytics_enabled?: boolean;
  crash_reporting?: boolean;
  data_sharing_research?: boolean;
  profile_visibility?: 'Private' | 'Public' | 'Community';
}

// Settings Store State
export interface SettingsStore {
  userSettings: UserSettings | null;
  alertThresholds: AlertThresholds[];
  globalThresholds: AlertThresholds | null;
  notificationSettings: NotificationSettings | null;
  dataSyncSettings: DataSyncSettings | null;
  privacySettings: PrivacySettings | null;
  availableHives: AvailableHive[];
  isLoading: boolean;
  
  // User Settings
  fetchUserSettings: () => Promise<void>;
  updateUserSettings: (data: UpdateUserSettingsRequest) => Promise<void>;
  
  // Alert Thresholds
  fetchAlertThresholds: () => Promise<void>;
  createAlertThreshold: (data: UpdateAlertThresholdsRequest) => Promise<void>;
  updateAlertThreshold: (id: string, data: UpdateAlertThresholdsRequest) => Promise<void>;
  deleteAlertThreshold: (id: string) => Promise<void>;
  fetchGlobalThresholds: () => Promise<void>;
  setGlobalThresholds: (data: UpdateAlertThresholdsRequest) => Promise<void>;
  fetchAvailableHives: () => Promise<void>;
  
  // Notification Settings
  fetchNotificationSettings: () => Promise<void>;
  updateNotificationSettings: (data: UpdateNotificationSettingsRequest) => Promise<void>;
  
  // Data Sync Settings
  fetchDataSyncSettings: () => Promise<void>;
  updateDataSyncSettings: (data: UpdateDataSyncSettingsRequest) => Promise<void>;
  
  // Privacy Settings
  fetchPrivacySettings: () => Promise<void>;
  updatePrivacySettings: (data: UpdatePrivacySettingsRequest) => Promise<void>;
}

export interface CreateInspectionReportRequest {
  schedule?: string; // UUID - optional link to schedule
  hive: string; // UUID
  inspection_date: string; // YYYY-MM-DD
  queen_present?: boolean;
  honey_level: 'Low' | 'Medium' | 'High';
  colony_health: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  varroa_mite_count?: number;
  brood_pattern: 'Solid' | 'Spotty' | 'None';
  pest_observations?: string;
  actions_taken?: string;
  notes?: string;
}

export interface InspectionScheduleStats {
  total_schedules: number;
  completed_schedules: number;
  pending_schedules: number;
  overdue_schedules: number;
  completion_rate: number;
}

export interface InspectionReportStats {
  total_reports: number;
  reports_this_month: number;
  average_colony_health: string;
  queen_presence_rate: number;
  health_distribution: {
    excellent_count: number;
    good_count: number;
    fair_count: number;
    poor_count: number;
  };
}

export interface HealthTrend {
  month: string;
  total_reports: number;
  excellent_count: number;
  good_count: number;
  fair_count: number;
  poor_count: number;
}

// Inspection Store State
export interface InspectionStore {
  schedules: InspectionSchedule[];
  reports: InspectionReport[];
  currentSchedule: InspectionSchedule | null;
  currentReport: InspectionReport | null;
  isLoading: boolean;
  
  // Schedule methods
  fetchSchedules: (filters?: Record<string, any>) => Promise<void>;
  createSchedule: (data: CreateInspectionScheduleRequest) => Promise<void>;
  updateSchedule: (id: string, data: UpdateInspectionScheduleRequest) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  fetchSchedule: (id: string) => Promise<void>;
  completeSchedule: (id: string, isCompleted: boolean, notes?: string) => Promise<void>;
  fetchUpcomingSchedules: () => Promise<InspectionSchedule[]>;
  fetchOverdueSchedules: () => Promise<InspectionSchedule[]>;
  fetchScheduleStats: () => Promise<InspectionScheduleStats>;
  
  // Report methods
  fetchReports: (filters?: Record<string, any>) => Promise<void>;
  createReport: (data: CreateInspectionReportRequest) => Promise<void>;
  updateReport: (id: string, data: UpdateInspectionReportRequest) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  fetchReport: (id: string) => Promise<void>;
  fetchRecentReports: () => Promise<InspectionReport[]>;
  fetchReportsByHive: (hiveId: string) => Promise<InspectionReport[]>;
  fetchReportStats: () => Promise<InspectionReportStats>;
  fetchHealthTrends: () => Promise<HealthTrend[]>;
}

// Stage 5: Production Types
export interface Harvest {
  id: string;
  hive: string; // UUID
  hive_name: string;
  apiary_name: string;
  harvest_date: string;
  honey_kg: number;
  wax_kg?: number;
  pollen_kg?: number;
  processing_method?: string;
  harvested_by: string; // UUID
  harvested_by_name: string;
  quality_notes?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  hive: string; // UUID
  hive_name: string;
  apiary_name: string;
  alert_type: string;
  alert_type_display: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  severity_display: string;
  trigger_values?: Record<string, any>;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  resolution_notes?: string;
  created_at: string;
}

export interface CreateHarvestRequest {
  hive: string; // UUID
  harvest_date: string; // YYYY-MM-DD
  honey_kg: number;
  wax_kg?: number;
  pollen_kg?: number;
  processing_method?: string;
  quality_notes?: string;
}

export interface UpdateHarvestRequest {
  harvest_date?: string;
  honey_kg?: number;
  wax_kg?: number;
  pollen_kg?: number;
  processing_method?: string;
  quality_notes?: string;
}

export interface CreateAlertRequest {
  hive: string; // UUID
  alert_type: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  trigger_values?: Record<string, any> | string; // Can be string in form, converted to object before API call
}

export interface ResolveAlertRequest {
  resolution_notes?: string;
}

export interface ProductionStats {
  total_harvests: number;
  total_honey_kg: number;
  total_wax_kg: number;
  total_pollen_kg: number;
  harvests_this_month: number;
  honey_this_month: number;
  average_harvest_per_hive: number;
  top_producing_hives: Array<{
    hive_id: string;
    hive_name: string;
    total_honey: number;
  }>;
}

export interface AlertStats {
  overview: {
    total_alerts: number;
    active_alerts: number;
    resolved_alerts: number;
    resolution_rate: number;
  };
  by_severity: Record<string, {
    total: number;
    active: number;
    display_name: string;
  }>;
  by_type: Record<string, {
    total: number;
    active: number;
    display_name: string;
  }>;
}

// Production Store State

export interface ProductionStore {
  harvests: Harvest[];
  alerts: Alert[];
  currentHarvest: Harvest | null;
  currentAlert: Alert | null;
  isLoading: boolean;
  
  // Harvest methods
  fetchHarvests: (filters?: Record<string, any>) => Promise<void>;
  createHarvest: (data: CreateHarvestRequest) => Promise<void>;
  updateHarvest: (id: string, data: UpdateHarvestRequest) => Promise<void>;
  deleteHarvest: (id: string) => Promise<void>;
  fetchHarvest: (id: string) => Promise<void>;
  
  // Alert methods
  fetchAlerts: (filters?: Record<string, any>) => Promise<void>;
  createAlert: (data: CreateAlertRequest) => Promise<void>;
  resolveAlert: (id: string, data: ResolveAlertRequest) => Promise<void>;
  resolveAllAlerts: (notes?: string) => Promise<any>;
  fetchAlert: (id: string) => Promise<void>;
  
  // New alert system methods
  checkAllAlerts: () => Promise<{ message: string; alerts_created: number; hives_checked: number; timestamp: string }>;
  checkHiveAlerts: (hiveId: string) => Promise<{ message: string; alerts_created: number; hive_id: string; hive_name: string; timestamp: string }>;
  fetchActiveAlerts: () => Promise<void>;
  fetchAlertsBySeverity: () => Promise<Record<string, Alert[]>>;
  scheduleAlertCheck: (hiveId?: string) => Promise<{ message: string; task_id: string; hive_id?: string; hive_name?: string; timestamp: string }>;
  
  // Stats methods
  fetchProductionStats: () => Promise<ProductionStats>;
  fetchAlertStats: () => Promise<AlertStats>;
}
