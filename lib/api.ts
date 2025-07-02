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
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
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
}

export const apiClient = new ApiClient(API_BASE_URL);
