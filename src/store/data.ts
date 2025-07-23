// Данные мотоклуба для глобального состояния
import type { AppData } from './types';

export const initialData: AppData = {
  events: [
    {
      id: '1',
      title: 'Покатушки по Тобольскому тракту',
      date: '2024-07-28',
      location: 'Тобольский тракт, 15 км от города',
      description: 'Живописный маршрут через леса и поля. Подходит для всех уровней подготовки.',
      price: 0,
      participants: 12,
      maxParticipants: 25,
      image: '/api/placeholder/400/250',
      type: 'ride'
    },
    {
      id: '2',
      title: 'Мастер-класс: Базовое обслуживание мотоцикла',
      date: '2024-08-05',
      location: 'Мотосервис "Железный конь", ул. Заводская 15',
      description: 'Изучаем основы технического обслуживания: замена масла, цепи, тормозных колодок.',
      price: 1500,
      participants: 8,
      maxParticipants: 15,
      image: '/api/placeholder/400/250',
      type: 'workshop'
    },
    {
      id: '3',
      title: 'Гонки на треке "Сибирь Ринг"',
      date: '2024-08-12',
      location: 'Автодром "Сибирь Ринг"',
      description: 'Соревнования в классах Стандарт и Спорт-Турист. Призы для победителей!',
      price: 2500,
      participants: 24,
      maxParticipants: 40,
      image: '/api/placeholder/400/250',
      type: 'competition'
    }
  ],

  emergencyContacts: [
    { id: '1', name: 'Единая служба спасения', phone: '112', category: 'emergency', available24h: true, description: 'Экстренные ситуации' },
    { id: '2', name: 'Скорая помощь', phone: '103', category: 'medical', available24h: true, description: 'Медицинская помощь' },
    { id: '3', name: 'Полиция', phone: '102', category: 'emergency', available24h: true, description: 'Правопорядок' },
    { id: '4', name: 'Пожарная служба', phone: '101', category: 'emergency', available24h: true, description: 'Пожарная безопасность' },
    { id: '5', name: 'Эвакуатор "МотоСпас"', phone: '+7 (3452) 555-123', category: 'tow', available24h: true, description: 'Эвакуация мототехники' },
    { id: '6', name: 'Техпомощь на дороге "РайдТЭК"', phone: '+7 (3452) 555-456', category: 'tow', available24h: false, description: 'Ремонт на месте 8:00-22:00' },
    { id: '7', name: 'Автоюрист Михайлов А.В.', phone: '+7 (3452) 555-789', category: 'legal', available24h: false, description: 'ДТП, страховые споры' },
    { id: '8', name: 'Юридическая фирма "Движение"', phone: '+7 (3452) 555-012', category: 'legal', available24h: false, description: 'ГИБДД, лишение прав' },
    { id: '9', name: 'Травмпункт ОКБ №1', phone: '+7 (3452) 287-111', category: 'medical', available24h: true, description: 'Хирургия, травматология' },
    { id: '10', name: 'Частная клиника "МедБайк"', phone: '+7 (3452) 555-345', category: 'medical', available24h: false, description: 'Специализация на травмах мотоциклистов' }
  ],

  boardPosts: [
    {
      id: '1',
      title: 'Поездка в горы Алтая',
      description: 'Организую группу для поездки в Горный Алтай на 10 дней. Маршрут: Тюмень-Новосибирск-Барнаул-Чемал. Нужны опытные райдеры.',
      author: 'Александр М.',
      date: '2024-07-20',
      type: 'ride',
      location: 'Горный Алтай'
    },
    {
      id: '2',
      title: 'Продаю Honda CBR600RR',
      description: 'Продается Honda CBR600RR 2019 года. Пробег 15 000 км, отличное состояние, все ТО пройдены в срок.',
      author: 'Дмитрий К.',
      date: '2024-07-19',
      type: 'sale',
      price: 650000
    },
    {
      id: '3',
      title: 'Ищу попутчиков в Екатеринбург',
      description: 'Еду в Екатеринбург 25 июля на байк-фест. Есть места в компании, делим расходы на бензин.',
      author: 'Олег В.',
      date: '2024-07-18',
      type: 'ride',
      location: 'Екатеринбург'
    },
    {
      id: '4',
      title: 'Услуги мотокурьера',
      description: 'Доставка документов и мелких грузов по городу и области. Быстро, надежно, недорого.',
      author: 'Сергей Т.',
      date: '2024-07-17',
      type: 'service',
      price: 300
    },
    {
      id: '5',
      title: 'Помощь в ремонте после ДТП',
      description: 'Нужна помощь в восстановлении Yamaha после небольшого ДТП. Готов оплатить работу и материалы.',
      author: 'Андрей П.',
      date: '2024-07-16',
      type: 'help'
    },
    {
      id: '6',
      title: 'Продаю мото экипировку',
      description: 'Шлем Shoei, куртка Dainese, перчатки Alpinestars. Все размер L, состояние отличное.',
      author: 'Николай Р.',
      date: '2024-07-15',
      type: 'sale',
      price: 45000
    }
  ],

  stores: [
    {
      id: '1',
      name: 'МотоМир',
      category: 'Магазин',
      rating: 4.8,
      phone: '+7 (3452) 555-001',
      address: 'ул. Ленина, 15',
      website: 'motomir-tyumen.ru',
      description: 'Крупнейший мотосалон в Тюмени. Продажа новых и б/у мотоциклов, запчасти, экипировка.',
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'Байкерская мастерская',
      category: 'Сервис',
      rating: 4.9,
      phone: '+7 (3452) 555-002',
      address: 'ул. Механическая, 28',
      website: 'biker-master.ru',
      description: 'Профессиональный ремонт и тюнинг мотоциклов любой сложности.',
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      name: 'Скорость+',
      category: 'Тюнинг',
      rating: 4.7,
      phone: '+7 (3452) 555-003',
      address: 'пр. Геологоразведчиков, 5А',
      website: 'speed-plus.ru',
      description: 'Тюнинг центр. Установка выхлопных систем, чип-тюнинг, аэродинамика.',
      image: '/api/placeholder/300/200'
    },
    {
      id: '4',
      name: 'МотоДоктор',
      category: 'Сервис',
      rating: 4.6,
      phone: '+7 (3452) 555-004',
      address: 'ул. Профсоюзная, 82',
      website: 'motodoctor.ru',
      description: 'Диагностика и ремонт электронных систем мотоциклов.',
      image: '/api/placeholder/300/200'
    },
    {
      id: '5',
      name: 'Железная Лошадь',
      category: 'Магазин',
      rating: 4.5,
      phone: '+7 (3452) 555-005',
      address: 'ул. 50 лет Октября, 57',
      website: 'iron-horse.ru',
      description: 'Запчасти и аксессуары для мотоциклов. Широкий выбор масел и химии.',
      image: '/api/placeholder/300/200'
    }
  ],

  products: [
    {
      id: '1',
      name: 'Шлем Shoei NXR',
      price: 35000,
      category: 'Экипировка',
      brand: 'Shoei',
      image: '/api/placeholder/200/200',
      description: 'Спортивный шлем с отличной аэродинамикой',
      storeId: '1'
    },
    {
      id: '2',
      name: 'Куртка Dainese Racing',
      price: 28000,
      category: 'Экипировка',
      brand: 'Dainese',
      image: '/api/placeholder/200/200',
      description: 'Защитная куртка из натуральной кожи',
      storeId: '1'
    },
    {
      id: '3',
      name: 'Цепь DID 520',
      price: 4500,
      category: 'Запчасти',
      brand: 'DID',
      image: '/api/placeholder/200/200',
      description: 'Приводная цепь повышенной прочности',
      storeId: '5'
    },
    {
      id: '4',
      name: 'Масло Motul 7100',
      price: 2800,
      category: 'Расходники',
      brand: 'Motul',
      image: '/api/placeholder/200/200',
      description: 'Синтетическое масло 10W-40, 4л',
      storeId: '5'
    },
    {
      id: '5',
      name: 'Выхлоп Akrapovic',
      price: 45000,
      category: 'Тюнинг',
      brand: 'Akrapovic',
      image: '/api/placeholder/200/200',
      description: 'Титановая выхлопная система',
      storeId: '3'
    }
  ],

  stats: {
    members: 0, // Будет обновляться из Telegram API
    events: 3,
    rides: 127,
    stores: 5
  }
};