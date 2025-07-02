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
}

export const apiClient = new ApiClient(API_BASE_URL);
