// Типы для глобального состояния мотоклуба

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  price: number;
  participants: number;
  maxParticipants: number;
  image: string;
  type: 'ride' | 'workshop' | 'competition';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: 'emergency' | 'tow' | 'legal' | 'medical';
  available24h: boolean;
  description: string;
}

export interface BoardPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  type: 'ride' | 'sale' | 'service' | 'help';
  price?: number;
  location?: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  phone: string;
  address: string;
  website: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  description: string;
  storeId: string;
}

export interface ClubStats {
  members: number;
  events: number;
  rides: number;
  stores: number;
}

export interface AppData {
  events: Event[];
  emergencyContacts: EmergencyContact[];
  boardPosts: BoardPost[];
  stores: Store[];
  products: Product[];
  stats: ClubStats;
}

export interface AppActions {
  // Events
  updateEvent: (id: string, event: Partial<Event>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  deleteEvent: (id: string) => void;
  
  // Emergency Contacts
  updateContact: (id: string, contact: Partial<EmergencyContact>) => void;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  deleteContact: (id: string) => void;
  
  // Board Posts
  updateBoardPost: (id: string, post: Partial<BoardPost>) => void;
  addBoardPost: (post: Omit<BoardPost, 'id'>) => void;
  deleteBoardPost: (id: string) => void;
  
  // Stores
  updateStore: (id: string, store: Partial<Store>) => void;
  addStore: (store: Omit<Store, 'id'>) => void;
  deleteStore: (id: string) => void;
  
  // Products
  updateProduct: (id: string, product: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  
  // Stats
  updateStats: (stats: Partial<ClubStats>) => void;
  
  // General
  resetData: () => void;
  loadData: (data: Partial<AppData>) => void;
}