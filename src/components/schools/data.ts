import { SchoolData } from './types';

export const categories = ["Все", "Премиум", "Спортивная", "Стандарт"];

export const schoolData: SchoolData[] = [
  {
    id: 1,
    name: "MOTO ACADEMY PREMIUM",
    description: "Топовая мотошкола с собственным автодромом и современным парком мотоциклов. Индивидуальный подход к каждому ученику.",
    category: "Премиум",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    rating: 4.9,
    price: "от 35,000₽",
    experience: "15 лет",
    location: "Москва, Варшавское шоссе",
    phone: "+7 (495) 123-45-67",
    instructor: "Сергей Волков (КМС)",
    courses: ["Категория А", "Категория А1", "Экстремальное вождение", "Трек-дни"],
    features: ["Собственный автодром", "Новые мотоциклы 2024", "100% сдача экзамена", "Бесплатная экипировка"]
  },
  {
    id: 2,
    name: "SPEED RIDERS SCHOOL",
    description: "Современная школа с акцентом на спортивное вождение. Готовим настоящих байкеров!",
    category: "Спортивная",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop",
    rating: 4.7,
    price: "от 28,000₽",
    experience: "8 лет",
    location: "СПб, Московский проспект",
    phone: "+7 (812) 987-65-43",
    instructor: "Анна Быстрова (Мастер спорта)",
    courses: ["Категория А", "Спортивное вождение", "Трековые тренировки"],
    features: ["Спортивные мотоциклы", "Видеоанализ вождения", "Групповые заезды", "Сертифицированные инструкторы"]
  },
  {
    id: 3,
    name: "БАЙК-ЦЕНТР УНИВЕРСАЛ",
    description: "Доступная мотошкола для новичков. Классическое обучение по проверенной методике.",
    category: "Стандарт",
    image: "https://images.unsplash.com/photo-1544961747-d6040b90ad35?w=800&h=600&fit=crop",
    rating: 4.3,
    price: "от 18,000₽",
    experience: "12 лет",
    location: "Москва, МКАД 47км",
    phone: "+7 (495) 555-12-34",
    instructor: "Иван Петров",
    courses: ["Категория А", "Категория А1", "Восстановление навыков"],
    features: ["Недорого", "Рассрочка 0%", "Удобное расписание", "Опытные инструкторы"]
  },
  {
    id: 4,
    name: "HARLEY TRAINING CENTER",
    description: "Эксклюзивная школа на мотоциклах Harley-Davidson. Для тех, кто ценит стиль и мощь.",
    category: "Премиум",
    image: "https://images.unsplash.com/photo-1558618047-1c4c4c0c4d73?w=800&h=600&fit=crop",
    rating: 4.8,
    price: "от 45,000₽",
    experience: "6 лет",
    location: "Москва, Рублевка",
    phone: "+7 (495) 777-88-99",
    instructor: "Дмитрий Рокер (эксперт HD)",
    courses: ["Категория А", "Harley Experience", "Круизное вождение"],
    features: ["Только Harley-Davidson", "VIP обслуживание", "Кожаная экипировка", "Клуб выпускников"]
  },
  {
    id: 5,
    name: "ENDURO ADVENTURE SCHOOL",
    description: "Специализируемся на эндуро и внедорожном вождении. Подготовим к любым дорогам!",
    category: "Спортивная",
    image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop",
    rating: 4.6,
    price: "от 32,000₽",
    experience: "10 лет",
    location: "Подмосковье, Дмитровское ш.",
    phone: "+7 (499) 123-77-88",
    instructor: "Максим Грязев (Чемпион России)",
    courses: ["Категория А", "Эндуро", "Кросс-кантри", "Выживание"],
    features: ["Внедорожные трассы", "Эндуро мотоциклы", "Походы выходного дня", "Экстрим программы"]
  },
  {
    id: 6,
    name: "МОТОШКОЛА \"ДРАЙВ\"",
    description: "Районная мотошкола с домашней атмосферой. Учим не торопясь, основательно.",
    category: "Стандарт",
    image: "https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&h=600&fit=crop",
    rating: 4.2,
    price: "от 22,000₽",
    experience: "20 лет",
    location: "Москва, Бутово",
    phone: "+7 (495) 456-78-90",
    instructor: "Александр Учителев",
    courses: ["Категория А", "Категория А1", "Теория ПДД"],
    features: ["Семейная атмосфера", "Гибкий график", "Терпеливые инструкторы", "Парковка бесплатно"]
  }
];