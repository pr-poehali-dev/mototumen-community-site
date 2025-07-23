// API клиент для работы с бэкендом

const API_BASE_URL = 'https://mototumen-community-site--preview.poehali.dev/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  bio?: string;
  experience?: 'новичок' | 'любитель' | 'опытный' | 'профессионал';
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FavoriteItem {
  id: number;
  item_id: string;
  category: 'products' | 'stores' | 'services' | 'events';
  name: string;
  description?: string;
  image_url?: string;
  price?: number;
  rating?: number;
  location?: string;
  external_url?: string;
  created_at: string;
}

interface UserBike {
  id: number;
  brand: string;
  model: string;
  year?: number;
  engine_volume?: number;
  color?: string;
  mileage: number;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Произошла ошибка'
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: 'Ошибка сети'
      };
    }
  }

  // Авторизация через Telegram
  async loginWithTelegram(telegramData: {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
    photo_url?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth', {
      method: 'POST',
      body: JSON.stringify(telegramData),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  // Выход из системы
  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Получение профиля пользователя
  async getUserProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/user/profile');
  }

  // Обновление профиля пользователя
  async updateUserProfile(profileData: {
    phone?: string;
    email?: string;
    bio?: string;
    experience?: string;
    location?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Получение избранного
  async getFavorites(category?: string): Promise<ApiResponse<{ favorites: FavoriteItem[] }>> {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return this.request<{ favorites: FavoriteItem[] }>(`/user/favorites${query}`);
  }

  // Добавление в избранное
  async addToFavorites(favoriteData: {
    item_id: string;
    category: 'products' | 'stores' | 'services' | 'events';
    name: string;
    description?: string;
    image_url?: string;
    price?: number;
    rating?: number;
    location?: string;
    external_url?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/user/favorites', {
      method: 'POST',
      body: JSON.stringify(favoriteData),
    });
  }

  // Удаление из избранного
  async removeFromFavorites(
    item_id: string,
    category: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/user/favorites/${item_id}/${category}`, {
      method: 'DELETE',
    });
  }

  // Получение мотоциклов пользователя
  async getUserBikes(): Promise<ApiResponse<{ bikes: UserBike[] }>> {
    return this.request<{ bikes: UserBike[] }>('/user/bikes');
  }

  // Добавление мотоцикла
  async addUserBike(bikeData: {
    brand: string;
    model: string;
    year?: number;
    engine_volume?: number;
    color?: string;
    mileage?: number;
    is_primary?: boolean;
    notes?: string;
  }): Promise<ApiResponse<{ bike: UserBike }>> {
    return this.request<{ bike: UserBike }>('/user/bikes', {
      method: 'POST',
      body: JSON.stringify(bikeData),
    });
  }

  // Удаление мотоцикла
  async deleteUserBike(bikeId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/user/bikes/${bikeId}`, {
      method: 'DELETE',
    });
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Экспорт singleton instance
export const apiClient = new ApiClient();

export type { User, FavoriteItem, UserBike, ApiResponse };