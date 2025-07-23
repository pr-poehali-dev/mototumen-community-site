export interface ShopData {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  shortAddress: string;
  phone: string;
  website: string;
  telegram?: string;
  vk?: string;
  whatsapp?: string;
  workTime: string;
  shortWorkTime: string;
  openTime: number;
  closeTime: number;
  rating: number;
  icon: string;
  color: string;
}

export const shopData: ShopData[] = [
  {
    id: 1,
    name: "Motomax",
    category: "Мотосалон",
    description: "Интернет-магазин и сеть мотосалонов в Тюмени, Челябинске и Кургане",
    address: "ул. Одесская, 1, стр. 66",
    shortAddress: "Одесская, 1/66",
    phone: "+79199402311",
    website: "https://motomax.su/",
    telegram: "https://t.me/79199402311",
    vk: "https://vk.com/1motomax",
    whatsapp: "https://wa.me/79199402311?text=Обращение+из+Яндекс+Карт%0AЗдравствуйте!+Меня+заинтересовало+ваше+предложение",
    workTime: "10:00–20:00",
    shortWorkTime: "10-20",
    openTime: 10 * 60,
    closeTime: 20 * 60,
    rating: 5.0,
    icon: "Bike",
    color: "orange"
  },
  {
    id: 2,
    name: "Байк-Центр",
    category: "Мотосалон",
    description: "Продажа мотоциклов, скутеров и экипировки",
    address: "ул. Московский тракт, 144",
    shortAddress: "Моск. тракт, 144",
    phone: "+79123456789",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.8,
    icon: "Bike",
    color: "orange"
  },
  {
    id: 3,
    name: "МотоСпорт",
    category: "Мотосалон", 
    description: "Спортивные мотоциклы и экипировка",
    address: "ул. Республики, 88",
    shortAddress: "Республики, 88",
    phone: "+79111234567",
    website: "#",
    workTime: "10:00–19:00",
    shortWorkTime: "10-19",
    openTime: 10 * 60,
    closeTime: 19 * 60,
    rating: 4.6,
    icon: "Bike",
    color: "orange"
  },
  {
    id: 4,
    name: "Мото-Драйв",
    category: "Мотосалон",
    description: "Мотоциклы, квадроциклы и снегоходы",
    address: "ул. Дамбовская, 22",
    shortAddress: "Дамбовская, 22",
    phone: "+79212345678",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.7,
    icon: "Bike",
    color: "orange"
  },
  {
    id: 5,
    name: "АвтоДеталь",
    category: "Запчасти",
    description: "Мотозапчасти и аксессуары для мотоциклов",
    address: "ул. Московский тр., 2",
    shortAddress: "Моск. тр., 2",
    phone: "+79555123456",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.7,
    icon: "ShoppingBag",
    color: "orange"
  },
  {
    id: 6,
    name: "Колесо72",
    category: "Шины",
    description: "Продажа мотоциклетных шин и колес",
    address: "ул. Мельникайте, 129",
    shortAddress: "Мельникайте, 129",
    phone: "+79222345678",
    website: "#",
    workTime: "8:00–19:00",
    shortWorkTime: "8-19",
    openTime: 8 * 60,
    closeTime: 19 * 60,
    rating: 4.5,
    icon: "Truck",
    color: "orange"
  },
  {
    id: 7,
    name: "ВелоМир",
    category: "Электротранспорт",
    description: "Электросамокаты и электровелосипеды",
    address: "ул. Геологоразведчиков, 14",
    shortAddress: "Геологоразведчиков, 14",
    phone: "+79666789012",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.3,
    icon: "Zap",
    color: "orange"
  },
  {
    id: 8,
    name: "Электро-Авто",
    category: "Электротранспорт",
    description: "Электросамокаты, велосипеды и моноколеса",
    address: "ул. Червишевский тракт, 56",
    shortAddress: "Червишевский тр., 56",
    phone: "+79888901234",
    website: "#",
    workTime: "10:00–20:00",
    shortWorkTime: "10-20",
    openTime: 10 * 60,
    closeTime: 20 * 60,
    rating: 4.5,
    icon: "Zap",
    color: "orange"
  },
  {
    id: 9,
    name: "Мото-Запчасти 72",
    category: "Запчасти",
    description: "Оригинальные и аналоговые запчасти для мотоциклов",
    address: "ул. Малыгина, 12",
    shortAddress: "Малыгина, 12",
    phone: "+79101234567",
    website: "#",
    workTime: "8:00–19:00",
    shortWorkTime: "8-19",
    openTime: 8 * 60,
    closeTime: 19 * 60,
    rating: 4.4,
    icon: "ShoppingBag",
    color: "orange"
  },
  {
    id: 10,
    name: "МотоШины",
    category: "Шины",
    description: "Специализированный магазин мотоциклетной резины",
    address: "ул. Широтная, 98",
    shortAddress: "Широтная, 98",
    phone: "+79333456789",
    website: "#",
    workTime: "9:00–18:00",
    shortWorkTime: "9-18",
    openTime: 9 * 60,
    closeTime: 18 * 60,
    rating: 4.4,
    icon: "Truck",
    color: "orange"
  },
  {
    id: 11,
    name: "ЭлектроБайк",
    category: "Электротранспорт",
    description: "Электромотоциклы и зарядные станции",
    address: "ул. Федюнинского, 8",
    shortAddress: "Федюнинского, 8",
    phone: "+79999012345",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.2,
    icon: "Zap",
    color: "orange"
  },
  {
    id: 12,
    name: "МотоЭкипировка",
    category: "Мотосалон",
    description: "Шлемы, куртки и защитная экипировка",
    address: "ул. Дамбовская, 67",
    shortAddress: "Дамбовская, 67",
    phone: "+79545678901",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.0,
    icon: "Shield",
    color: "orange"
  }
];

export const categories = ["Все", "Мотосалон", "Запчасти", "Шины", "Электротранспорт"];