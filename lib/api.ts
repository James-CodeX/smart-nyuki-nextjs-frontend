import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  TokenRefreshRequest,
  LogoutRequest,
  ChangePasswordRequest,
  User,
  BeekeeperProfile,
  CreateBeekeeperProfileRequest,
  UpdateUserProfileRequest,
  Apiary,
  Hive,
  CreateApiaryRequest,
  UpdateApiaryRequest,
  CreateHiveRequest,
  UpdateHiveRequest,
  ApiaryStats,
  PaginatedResponse,
  SmartDevice,
  CreateSmartDeviceRequest,
  UpdateSmartDeviceRequest,
  InspectionSchedule,
  InspectionReport,
  CreateInspectionScheduleRequest,
  UpdateInspectionScheduleRequest,
  CreateInspectionReportRequest,
  UpdateInspectionReportRequest,
  InspectionScheduleStats,
  InspectionReportStats,
  HealthTrend,
  Harvest,
  Alert,
  CreateHarvestRequest,
  UpdateHarvestRequest,
  CreateAlertRequest,
  ResolveAlertRequest,
  ProductionStats,
  AlertStats,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOnAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // If we get a 401 and this isn't a login/register request, try to refresh token
      if (response.status === 401 && retryOnAuth && 
          !endpoint.includes('/login/') && 
          !endpoint.includes('/register/') &&
          !endpoint.includes('/token/refresh/')) {
        
        try {
          const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
          if (refreshToken) {
            // Try to refresh the token
            const refreshResponse = await this.refreshToken({ refresh: refreshToken });
            
            // Update the authorization header with the new token
            const newConfig = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${refreshResponse.access}`,
              },
            };
            
            // Retry the original request with the new token
            const retryResponse = await fetch(url, newConfig);
            
            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({}));
              throw new Error(JSON.stringify(errorData));
            }
            
            return await retryResponse.json();
          }
        } catch (refreshError) {
          // If refresh fails, clear auth and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/auth/login';
          }
          throw refreshError;
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return headers;
  }

  // Authentication endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(data: TokenRefreshRequest): Promise<{ access: string }> {
    return this.request<{ access: string }>('/accounts/token/refresh/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(data: LogoutRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/accounts/logout/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  // User profile endpoints
  async getUserProfile(): Promise<User> {
    return this.request<User>('/accounts/profile/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateUserProfile(data: UpdateUserProfileRequest): Promise<User> {
    return this.request<User>('/accounts/profile/', {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/accounts/change-password/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  // Beekeeper profile endpoints
  async getBeekeeperProfiles(): Promise<BeekeeperProfile[]> {
    return this.request<BeekeeperProfile[]>('/accounts/beekeeper-profiles/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createBeekeeperProfile(data: CreateBeekeeperProfileRequest): Promise<BeekeeperProfile> {
    return this.request<BeekeeperProfile>('/accounts/beekeeper-profiles/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getBeekeeperProfile(id: string): Promise<BeekeeperProfile> {
    return this.request<BeekeeperProfile>(`/accounts/beekeeper-profiles/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateBeekeeperProfile(
    id: string, 
    data: Partial<CreateBeekeeperProfileRequest>
  ): Promise<BeekeeperProfile> {
    return this.request<BeekeeperProfile>(`/accounts/beekeeper-profiles/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteBeekeeperProfile(id: string): Promise<void> {
    return this.request<void>(`/accounts/beekeeper-profiles/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 2: Apiaries endpoints
  async getApiaries(filters?: Record<string, any>): Promise<PaginatedResponse<Apiary>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/apiaries/apiaries/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<Apiary>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createApiary(data: CreateApiaryRequest): Promise<Apiary> {
    return this.request<Apiary>('/apiaries/apiaries/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getApiary(id: string): Promise<Apiary> {
    return this.request<Apiary>(`/apiaries/apiaries/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateApiary(id: string, data: UpdateApiaryRequest): Promise<Apiary> {
    return this.request<Apiary>(`/apiaries/apiaries/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteApiary(id: string): Promise<void> {
    return this.request<void>(`/apiaries/apiaries/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getApiaryStats(id: string): Promise<ApiaryStats> {
    return this.request<ApiaryStats>(`/apiaries/apiaries/${id}/stats/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async softDeleteApiary(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/apiaries/apiaries/${id}/soft_delete/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 2: Hives endpoints
  async getHives(filters?: Record<string, any>): Promise<PaginatedResponse<Hive>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/apiaries/hives/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<Hive>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createHive(data: CreateHiveRequest): Promise<Hive> {
    return this.request<Hive>('/apiaries/hives/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getHive(id: string): Promise<Hive> {
    return this.request<Hive>(`/apiaries/hives/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateHive(id: string, data: UpdateHiveRequest): Promise<Hive> {
    return this.request<Hive>(`/apiaries/hives/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteHive(id: string): Promise<void> {
    return this.request<void>(`/apiaries/hives/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async activateHive(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/apiaries/hives/${id}/activate/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async deactivateHive(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/apiaries/hives/${id}/deactivate/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async softDeleteHive(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/apiaries/hives/${id}/soft_delete/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getHivesByType(): Promise<Record<string, Hive[]>> {
    return this.request<Record<string, Hive[]>>('/apiaries/hives/by_type/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 3: Smart Device endpoints
  async getSmartDevices(filters?: Record<string, any>): Promise<PaginatedResponse<SmartDevice>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/devices/devices/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<SmartDevice>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createSmartDevice(data: CreateSmartDeviceRequest): Promise<SmartDevice> {
    return this.request<SmartDevice>('/devices/devices/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getSmartDevice(id: string): Promise<SmartDevice> {
    return this.request<SmartDevice>(`/devices/devices/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateSmartDevice(id: string, data: UpdateSmartDeviceRequest): Promise<SmartDevice> {
    return this.request<SmartDevice>(`/devices/devices/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteSmartDevice(id: string): Promise<void> {
    return this.request<void>(`/devices/devices/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getSmartDeviceStats(id: string): Promise<any> {
    return this.request<any>(`/devices/devices/${id}/stats/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 4: Inspection Schedule endpoints
  async getInspectionSchedules(filters?: Record<string, any>): Promise<PaginatedResponse<InspectionSchedule>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/inspections/schedules/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<InspectionSchedule>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createInspectionSchedule(data: CreateInspectionScheduleRequest): Promise<InspectionSchedule> {
    return this.request<InspectionSchedule>('/inspections/schedules/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getInspectionSchedule(id: string): Promise<InspectionSchedule> {
    return this.request<InspectionSchedule>(`/inspections/schedules/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateInspectionSchedule(id: string, data: UpdateInspectionScheduleRequest): Promise<InspectionSchedule> {
    return this.request<InspectionSchedule>(`/inspections/schedules/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteInspectionSchedule(id: string): Promise<void> {
    return this.request<void>(`/inspections/schedules/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async completeInspectionSchedule(id: string, isCompleted: boolean, notes?: string): Promise<{ message: string; is_completed: boolean }> {
    return this.request<{ message: string; is_completed: boolean }>(`/inspections/schedules/${id}/complete/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ is_completed: isCompleted, notes }),
    });
  }

  async getUpcomingInspectionSchedules(): Promise<{ count: number; results: InspectionSchedule[] }> {
    return this.request<{ count: number; results: InspectionSchedule[] }>('/inspections/schedules/upcoming/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getOverdueInspectionSchedules(): Promise<{ count: number; results: InspectionSchedule[] }> {
    return this.request<{ count: number; results: InspectionSchedule[] }>('/inspections/schedules/overdue/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getInspectionScheduleStats(): Promise<InspectionScheduleStats> {
    return this.request<InspectionScheduleStats>('/inspections/schedules/statistics/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 4: Inspection Report endpoints
  async getInspectionReports(filters?: Record<string, any>): Promise<PaginatedResponse<InspectionReport>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/inspections/reports/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<InspectionReport>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createInspectionReport(data: CreateInspectionReportRequest): Promise<InspectionReport> {
    return this.request<InspectionReport>('/inspections/reports/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getInspectionReport(id: string): Promise<InspectionReport> {
    return this.request<InspectionReport>(`/inspections/reports/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateInspectionReport(id: string, data: UpdateInspectionReportRequest): Promise<InspectionReport> {
    return this.request<InspectionReport>(`/inspections/reports/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteInspectionReport(id: string): Promise<void> {
    return this.request<void>(`/inspections/reports/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getRecentInspectionReports(): Promise<{ count: number; results: InspectionReport[] }> {
    return this.request<{ count: number; results: InspectionReport[] }>('/inspections/reports/recent/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getInspectionReportsByHive(hiveId: string): Promise<PaginatedResponse<InspectionReport>> {
    return this.request<PaginatedResponse<InspectionReport>>(`/inspections/reports/by-hive/${hiveId}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getInspectionReportStats(): Promise<InspectionReportStats> {
    return this.request<InspectionReportStats>('/inspections/reports/statistics/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getHealthTrends(): Promise<HealthTrend[]> {
    return this.request<HealthTrend[]>('/inspections/reports/health-trends/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 5: Harvest endpoints
  async getHarvests(filters?: Record<string, any>): Promise<PaginatedResponse<Harvest>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/production/harvests/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<Harvest>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createHarvest(data: CreateHarvestRequest): Promise<Harvest> {
    return this.request<Harvest>('/production/harvests/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getHarvest(id: string): Promise<Harvest> {
    return this.request<Harvest>(`/production/harvests/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async updateHarvest(id: string, data: UpdateHarvestRequest): Promise<Harvest> {
    return this.request<Harvest>(`/production/harvests/${id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async deleteHarvest(id: string): Promise<void> {
    return this.request<void>(`/production/harvests/${id}/`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Stage 5: Alert endpoints
  async getAlerts(filters?: Record<string, any>): Promise<PaginatedResponse<Alert>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/production/alerts/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<Alert>>(endpoint, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async createAlert(data: CreateAlertRequest): Promise<Alert> {
    return this.request<Alert>('/production/alerts/', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getAlert(id: string): Promise<Alert> {
    return this.request<Alert>(`/production/alerts/${id}/`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async resolveAlert(id: string, data: ResolveAlertRequest): Promise<{ message: string; is_resolved: boolean }> {
    return this.request<{ message: string; is_resolved: boolean }>(`/production/alerts/${id}/resolve/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  async getProductionStats(): Promise<ProductionStats> {
    return this.request<ProductionStats>('/production/stats/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getAlertStats(): Promise<AlertStats> {
    return this.request<AlertStats>('/production/alert-stats/', {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
