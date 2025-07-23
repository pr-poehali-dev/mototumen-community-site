export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  image?: string;
  inStock: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  available: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  available: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  category: string;
  contact: string;
  active: boolean;
}

export interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
