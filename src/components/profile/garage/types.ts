export interface Vehicle {
  id: number;
  vehicle_type: string;
  brand: string;
  model: string;
  year?: number;
  photo_url?: string;
  description?: string;
  is_primary: boolean;
  mileage?: number;
  modifications?: string;
  power_hp?: number;
  displacement?: number;
}

export const vehicleTypes = [
  { value: 'moto', label: '🏍️ Мотоцикл', icon: 'Bike' },
  { value: 'atv', label: '🚜 Квадроцикл', icon: 'Truck' },
  { value: 'snowmobile', label: '❄️ Снегоход', icon: 'Snowflake' },
  { value: 'jetski', label: '🌊 Гидроцикл', icon: 'Waves' },
  { value: 'other', label: '🔧 Другое', icon: 'Wrench' },
];

export const AUTH_API = 'https://functions.poehali.dev/37848519-8d12-40c1-b0cb-f22c293fcdb5';
export const PROFILE_API = 'https://functions.poehali.dev/37848519-8d12-40c1-b0cb-f22c293fcdb5';