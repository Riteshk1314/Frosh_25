import { api } from './api';
import type { 
  Event, 
  LoginCredentials, 
  LoginResponse, 
  CreateEventRequest, 
  BookTicketRequest, 
  BookTicketResponse,
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', credentials);
    
    // Set the auth token in the API client
    if (response.success && response.data.accessToken) {
      api.setAuthToken(response.data.accessToken);
    }
    
    return response;
  },

  logout(): void {
    api.clearAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): any | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  setCurrentUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};

export const eventService = {
  async getAllEvents(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    return await api.get<PaginatedResponse<Event>>(`/getEvents?page=${page}&limit=${limit}`);
  },

  async getEventById(eventId: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(`/getEventById/${eventId}`);
    return response.data;
  },

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>('/createEvent', eventData);
    return response.data;
  }
};

export const ticketService = {
  async bookTicket(bookingData: BookTicketRequest): Promise<BookTicketResponse> {
    return await api.post<BookTicketResponse>('/bookTicket', bookingData);
  }
};
