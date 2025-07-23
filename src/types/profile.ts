export interface Order {
  id: string;
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface Vehicle {
  id: string;
  type: "motorcycle" | "car" | "scooter" | "atv";
  brand: string;
  model: string;
  year: number;
  engine: string;
  color: string;
  mileage: number;
  status: "active" | "sold" | "repair";
  photo: string;
  description: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string;
  role: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newsletter: boolean;
  };
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
