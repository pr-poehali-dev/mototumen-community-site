export interface ServiceData {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  address: string;
  phone: string;
  website?: string;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  price: string;
  image: string;
}

export const categories = [
  "Все",
  "Мотосервис", 
  "Тюнинг",
  "Техобслуживание",
  "Мойка",
  "Диагностика",
  "Шиномонтаж",
];

export const serviceData: ServiceData[] = [
  {
    id: 1,
    name: "МотоТех Сервис",
    category: "Мотосервис",
    description: "Профессиональный ремонт и обслуживание мотоциклов всех марок",
    rating: 4.8,
    address: "ул. Гагарина, 15",
    phone: "+7 (495) 123-45-67",
    website: "https://mototech.ru",
    workingHours: {
      monday: "09:00-18:00",
      tuesday: "09:00-18:00", 
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-18:00",
      saturday: "10:00-16:00",
      sunday: "Закрыто"
    },
    services: ["Диагностика", "Ремонт двигателя", "Замена масла", "ТО"],
    price: "от 1500 ₽",
    image: "/api/placeholder/400/300"
  },
  {
    id: 2,
    name: "Байк Центр",
    category: "Тюнинг",
    description: "Тюнинг и кастомизация мотоциклов под ваш стиль",
    rating: 4.6,
    address: "пр. Ленина, 42",
    phone: "+7 (495) 234-56-78",
    workingHours: {
      monday: "10:00-19:00",
      tuesday: "10:00-19:00",
      wednesday: "10:00-19:00", 
      thursday: "10:00-19:00",
      friday: "10:00-19:00",
      saturday: "11:00-17:00",
      sunday: "Закрыто"
    },
    services: ["Тюнинг", "Покраска", "Установка обвесов"],
    price: "от 5000 ₽",
    image: "/api/placeholder/400/300"
  },
  {
    id: 3,
    name: "Быстрый Сервис",
    category: "Техобслуживание",
    description: "Быстрое техническое обслуживание без записи",
    rating: 4.3,
    address: "ул. Мира, 88",
    phone: "+7 (495) 345-67-89",
    workingHours: {
      monday: "08:00-20:00",
      tuesday: "08:00-20:00",
      wednesday: "08:00-20:00",
      thursday: "08:00-20:00", 
      friday: "08:00-20:00",
      saturday: "09:00-18:00",
      sunday: "10:00-16:00"
    },
    services: ["ТО", "Замена жидкостей", "Проверка тормозов"],
    price: "от 800 ₽",
    image: "/api/placeholder/400/300"
  },
  {
    id: 4,
    name: "МотоМойка Экспресс",
    category: "Мойка",
    description: "Профессиональная мойка и детейлинг мотоциклов",
    rating: 4.7,
    address: "ул. Садовая, 12",
    phone: "+7 (495) 456-78-90",
    workingHours: {
      monday: "07:00-21:00",
      tuesday: "07:00-21:00",
      wednesday: "07:00-21:00",
      thursday: "07:00-21:00",
      friday: "07:00-21:00",
      saturday: "08:00-20:00",
      sunday: "09:00-19:00"
    },
    services: ["Мойка", "Детейлинг", "Полировка"],
    price: "от 500 ₽",
    image: "/api/placeholder/400/300"
  },
  {
    id: 5,
    name: "ДиагноСТО",
    category: "Диагностика",
    description: "Компьютерная диагностика и ремонт электроники",
    rating: 4.9,
    address: "пер. Механический, 7",
    phone: "+7 (495) 567-89-01",
    workingHours: {
      monday: "09:00-18:00",
      tuesday: "09:00-18:00",
      wednesday: "09:00-18:00",
      thursday: "09:00-18:00",
      friday: "09:00-18:00",
      saturday: "10:00-15:00",
      sunday: "Закрыто"
    },
    services: ["Диагностика", "Ремонт электроники", "Прошивка"],
    price: "от 1000 ₽",
    image: "/api/placeholder/400/300"
  },
  {
    id: 6,
    name: "Колесо Профи",
    category: "Шиномонтаж",
    description: "Шиномонтаж и балансировка колес мотоциклов",
    rating: 4.4,
    address: "ул. Колесная, 33",
    phone: "+7 (495) 678-90-12",
    workingHours: {
      monday: "08:00-19:00",
      tuesday: "08:00-19:00",
      wednesday: "08:00-19:00",
      thursday: "08:00-19:00",
      friday: "08:00-19:00",
      saturday: "09:00-17:00",
      sunday: "Закрыто"
    },
    services: ["Шиномонтаж", "Балансировка", "Ремонт камер"],
    price: "от 600 ₽",
    image: "/api/placeholder/400/300"
  }
];