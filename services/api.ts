import { Listing, User, CreateListingData } from '@/types';

const API_BASE_URL = 'https://your-api-server.com/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Listings
  async getListings(filters?: any): Promise<Listing[]> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request<Listing[]>(`/listings${queryParams}`);
  }

  async getListingById(id: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`);
  }

  async createListing(data: CreateListingData): Promise<Listing> {
    return this.request<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string, data: Partial<CreateListingData>): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string): Promise<void> {
    return this.request<void>(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Favorites
  async getFavorites(userId: string): Promise<Listing[]> {
    return this.request<Listing[]>(`/users/${userId}/favorites`);
  }

  async addToFavorites(userId: string, listingId: string): Promise<void> {
    return this.request<void>(`/users/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeFromFavorites(userId: string, listingId: string): Promise<void> {
    return this.request<void>(`/users/${userId}/favorites/${listingId}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessages(userId: string): Promise<any[]> {
    return this.request<any[]>(`/users/${userId}/messages`);
  }

  async sendMessage(fromUserId: string, toUserId: string, message: string): Promise<any> {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify({ fromUserId, toUserId, message }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;