export interface Event {
  _id: string;
  name: string;
  eventDescription: string;
  startTime: string;
  location: string;
  mode: 'online' | 'offline';
  totalSeats: number;
  registrationCount: number;
  availableSeats?: number;
  slots: number;
  isLive: boolean;
}

export interface EventScheduleItem {
  time: string;
  activity: string;
  description?: string;
}

export interface TicketRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
  eventId: string;
  qrCode: string;
  registrationDate: string;
  status: 'active' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string;
  phoneNumber: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface CreateEventRequest {
  name: string;
  mode: 'online' | 'offline';
  location: string;
  slots: number;
  startTime: string;
  totalSeats: number;
  eventDescription: string;
  isLive: boolean;
}

export interface BookTicketRequest {
  eventId: string;
}

export interface BookTicketResponse {
  success: boolean;
  data: {
    ticketId: string;
    eventId: string;
    userId: string;
    bookingDate: string;
    qrCode?: string;
  };
}

export interface Pass {
  passId: string;
  userId: string;
  eventId: string;
  passStatus: 'active' | 'inactive' | 'used';
  isScanned: boolean;
  timeScanned: string | null;
  createdAt: string;
  userEmail: string;
}

export interface PassResponse {
  success: boolean;
  message: string;
  data: {
    passes: Pass[];
    count: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    events: T[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}
