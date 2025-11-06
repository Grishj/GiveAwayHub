export enum ItemCategory {
  Clothing = 'clothing',
  Books = 'books',
  Furniture = 'furniture',
  Electronics = 'electronics',
  Kitchen = 'kitchen',
  Toys = 'toys',
  Sports = 'sports',
  Other = 'other'
}

export enum ItemCondition {
  New = 'new',
  GentlyUsed = 'gently-used',
  WellUsed = 'well-used'
}

export enum ItemStatus {
  Available = 'available',
  Pending = 'pending',
  Donated = 'donated'
}

export interface Donor {
  name: string;
  avatar: string;
  rating: number;
}

export interface Requester {
  name: string;
  phone: string;
  avatar: string;
  address: string;
  email: string;
}

export interface ItemRequest {
  id: number;
  requester: Requester;
  date: string;
  requestAddress: string;
}

export interface Item {
  id: number;
  title: string;
  category: ItemCategory;
  condition: ItemCondition;
  description: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: string;
  donor: Donor;
  posted: string;
  views: number;
  requests: number;
  status?: ItemStatus; // Status might be specific to dashboard items
  itemRequests?: ItemRequest[];
}

export interface DashboardItem extends Item {
  status: ItemStatus;
}

export enum RequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Completed = 'completed'
}

export interface DashboardRequest {
  id: number;
  item: string;
  donor: string;
  status: RequestStatus;
  requested: string;
  image: string;
}

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar: string;
}

// FIX: Added missing GeolocationState interface to resolve compilation error.
export interface GeolocationState {
  loading: boolean;
  error: { code: number; message: string; } | null;
  position: GeolocationPosition | null;
}

export interface Notification {
  id: number;
  message: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | string; // 'me' for the current user
  timestamp: string;
}