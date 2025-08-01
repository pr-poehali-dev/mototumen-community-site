import { SchoolData, WorkSchedule } from "@/components/schools/types";

export interface ServiceData {
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
  schedule?: WorkSchedule[];
}

export const serviceData: ServiceData[] = [
  {
    id: 1,
    name: "УЧЕБНЫЙ КОМБИНАТ",
    description:
      "Наша Авто/Мотошкола является структурным подразделением сети автошкол «Учебный Комбинат». За это время мы выпустили тысячи учеников разных категории транспортных средств. Самый большой автодром, который включает в себя 4 площадки. Только у нас закрытая обогреваемая площадка для прохождения обучения на категорию «А».",
    category: "Премиум",
    image:
      "https://cdn.poehali.dev/files/7dd02c03-750c-4832-a073-963864020539.png",
    rating: 4.9,
    price: "12,500₽",
    experience: "Много лет",
    location: "Тюмень, 7 филиалов",
    phone: "89044972862",
    courses: ["Категория А", "Категория А1"],
    features: [
      "24 филиала в Тюмени",
      "Самый большой автодром",
      "Закрытая обогреваемая площадка",
      "Приём звонков Пн-Пт: 10:00-19:00",
    ],
    website: "https://мотоправа.рф/",
    schedule: [
      { day: "Понедельник", hours: "10:00–19:00, 14:30–19:00" },
      { day: "Вторник", hours: "10:00–19:00, 14:30–19:00" },
      { day: "Среда", hours: "10:00–19:00, 14:30–19:00" },
      { day: "Четверг", hours: "10:00–19:00, 14:30–19:00" },
      { day: "Пятница", hours: "10:00–19:00, 14:30–19:00" },
      { day: "Суббота", hours: "Выходной" },
      { day: "Воскресенье", hours: "Выходной" },
    ],
    addresses: [
      {
        name: "ул. Западносибирская, 18 (Лесобаза)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+улица+Западносибирская%2C+18",
      },
      {
        name: "ул. Шишкова, 16 (около 9 школы)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+улица+Шишкова%2C+16",
      },
      {
        name: "ул. Беловежская, 7, к.1 (Антипино)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+улица+Беловежская%2C+7к1",
      },
      {
        name: "ул. Ямская, 75 (Дом Обороны)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+улица+Ямская%2C+75",
      },
      {
        name: "ул. Н.Гондатти, 2 (Широтная — Пермякова)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+улица+Николая+Гондатти%2C+2",
      },
      {
        name: "бульвар Б.Щербины, 16, к.1 (Войновка)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+бульвар+Бориса+Щербины%2C+16к1",
      },
      {
        name: "ул. Мельникайте, 85А (напротив ТНГУ)",
        yandexUrl:
          "https://yandex.ru/maps/?mode=routes&rtext=~Тюмень%2C+улица+Мельникайте%2C+85А",
      },
    ],
  },
  {
    id: 2,
    name: "СТО-Мастер",
    category: "Мотосервис",
    description: "Профессиональный ремонт мотоциклов",
    address: "ул. 50 лет ВЛКСМ, 7",
    shortAddress: "50 лет ВЛКСМ, 7",
    phone: "+79876543210",
    website: "#",
    workTime: "8:00–20:00",
    shortWorkTime: "8-20",
    openTime: 8 * 60,
    closeTime: 20 * 60,
    rating: 4.9,
    icon: "Wrench",
    color: "blue",
  },
  {
    id: 3,
    name: "МотоДоктор",
    category: "Мотосервис",
    description: "Диагностика и ремонт мотодвигателей",
    address: "ул. Червишевский тракт, 15",
    shortAddress: "Червишевский тр., 15",
    phone: "+79123456789",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.8,
    icon: "Wrench",
    color: "blue",
    schedule: [
      { day: "Понедельник", hours: "09:00–19:00" },
      { day: "Вторник", hours: "09:00–19:00" },
      { day: "Среда", hours: "09:00–19:00" },
      { day: "Четверг", hours: "09:00–19:00" },
      { day: "Пятница", hours: "09:00–19:00" },
      { day: "Суббота", hours: "10:00–16:00" },
      { day: "Воскресенье", hours: "Выходной" },
    ],
  },
  {
    id: 4,
    name: "БайкСервис",
    category: "Мотосервис",
    description: "Полный цикл обслуживания мотоциклов",
    address: "ул. Широтная, 44",
    shortAddress: "Широтная, 44",
    phone: "+79111234567",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.7,
    icon: "Wrench",
    color: "blue",
    schedule: [
      { day: "Понедельник", hours: "08:00–18:00" },
      { day: "Вторник", hours: "08:00–18:00" },
      { day: "Среда", hours: "08:00–18:00" },
      { day: "Четверг", hours: "08:00–18:00" },
      { day: "Пятница", hours: "08:00–18:00" },
      { day: "Суббота", hours: "09:00–15:00" },
      { day: "Воскресенье", hours: "Выходной" },
    ],
  },
  {
    id: 5,
    name: "Турбо-Моторс",
    category: "Тюнинг",
    description: "Тюнинг и доработка мотоциклов",
    address: "ул. Салтыкова-Щедрина, 45",
    shortAddress: "Салтыкова-Щедрина, 45",
    phone: "+79555678901",
    website: "#",
    workTime: "10:00–20:00",
    shortWorkTime: "10-20",
    openTime: 10 * 60,
    closeTime: 20 * 60,
    rating: 4.8,
    icon: "Zap",
    color: "blue",
    schedule: [
      { day: "Понедельник", hours: "10:00–20:00" },
      { day: "Вторник", hours: "10:00–20:00" },
      { day: "Среда", hours: "10:00–20:00" },
      { day: "Четверг", hours: "10:00–20:00" },
      { day: "Пятница", hours: "10:00–20:00" },
      { day: "Суббота", hours: "10:00–20:00" },
      { day: "Воскресенье", hours: "Выходной" },
    ],
  },
  {
    id: 6,
    name: "МотоТюнинг72",
    category: "Тюнинг",
    description: "Чип-тюнинг и улучшение характеристик",
    address: "ул. Энергетиков, 88",
    shortAddress: "Энергетиков, 88",
    phone: "+79666789012",
    website: "#",
    workTime: "9:00–18:00",
    shortWorkTime: "9-18",
    openTime: 9 * 60,
    closeTime: 18 * 60,
    rating: 4.6,
    icon: "Zap",
    color: "blue",
  },
  {
    id: 7,
    name: "ПневмоСервис",
    category: "Техобслуживание",
    description: "Ремонт пневматических систем мотоциклов",
    address: "ул. Федюнинского, 8",
    shortAddress: "Федюнинского, 8",
    phone: "+79999012345",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.2,
    icon: "Wind",
    color: "blue",
  },
  {
    id: 8,
    name: "АвтоГласс-Мото",
    category: "Техобслуживание",
    description: "Замена стекол и обтекателей",
    address: "ул. Харьковская, 77",
    shortAddress: "Харьковская, 77",
    phone: "+79444567890",
    website: "#",
    workTime: "8:00–17:00",
    shortWorkTime: "8-17",
    openTime: 8 * 60,
    closeTime: 17 * 60,
    rating: 4.7,
    icon: "Shield",
    color: "blue",
  },
  {
    id: 9,
    name: "Автомойка Люкс-Мото",
    category: "Мойка",
    description: "Профессиональная мойка мотоциклов",
    address: "ул. Энергетиков, 33",
    shortAddress: "Энергетиков, 33",
    phone: "+79777890123",
    website: "#",
    workTime: "7:00–22:00",
    shortWorkTime: "7-22",
    openTime: 7 * 60,
    closeTime: 22 * 60,
    rating: 4.6,
    icon: "Droplets",
    color: "blue",
  },
  {
    id: 10,
    name: "МотоМойка Экспресс",
    category: "Мойка",
    description: "Быстрая мойка и детейлинг мотоциклов",
    address: "ул. Малыгина, 56",
    shortAddress: "Малыгина, 56",
    phone: "+79333456789",
    website: "#",
    workTime: "8:00–20:00",
    shortWorkTime: "8-20",
    openTime: 8 * 60,
    closeTime: 20 * 60,
    rating: 4.4,
    icon: "Droplets",
    color: "blue",
  },
  {
    id: 11,
    name: "МотоДиагностика",
    category: "Диагностика",
    description: "Компьютерная диагностика мотоциклов",
    address: "ул. Геологоразведчиков, 22",
    shortAddress: "Геологоразведчиков, 22",
    phone: "+79888901234",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.5,
    icon: "Laptop",
    color: "blue",
  },
  {
    id: 12,
    name: "ЭлектроМото",
    category: "Диагностика",
    description: "Ремонт электрики и проводки мотоциклов",
    address: "ул. Дамбовская, 67",
    shortAddress: "Дамбовская, 67",
    phone: "+79545678901",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.3,
    icon: "Zap",
    color: "blue",
  },
];

export const categories = [
  "Все",
  "Мотосервис",
  "Тюнинг",
  "Техобслуживание",
  "Мойка",
  "Диагностика",
  "Шиномонтаж",
];
