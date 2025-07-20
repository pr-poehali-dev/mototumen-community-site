import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import PageLayout from "@/components/layout/PageLayout";

interface ShopData {
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
  tags: string[];
}

const shopData: ShopData[] = [
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
    color: "blue",
    tags: ["мотоциклы", "скутеры", "запчасти", "экипировка", "шлемы", "мото"]
  },
  {
    id: 2,
    name: "Байк-Центр",
    category: "Мотосалон",
    description: "Продажа мотоциклов, скутеров и электротранспорта",
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
    color: "green",
    tags: ["мотоциклы", "скутеры", "электро", "байки", "мото"]
  },
  {
    id: 3,
    name: "МотоТех",
    category: "Автосервис",
    description: "Ремонт и техническое обслуживание мототехники",
    address: "ул. Заводская, 15",
    shortAddress: "Заводская, 15",
    phone: "+79876543210",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.9,
    icon: "Wrench",
    color: "orange",
    tags: ["ремонт", "сервис", "техобслуживание", "мотосервис", "диагностика"]
  },
  {
    id: 4,
    name: "Автомир",
    category: "Автосалон",
    description: "Продажа и обслуживание автомобилей в Тюмени",
    address: "ул. Ленина, 15",
    shortAddress: "Ленина, 15",
    phone: "+79123456789",
    website: "#",
    workTime: "9:00–18:00",
    shortWorkTime: "9-18",
    openTime: 9 * 60,
    closeTime: 18 * 60,
    rating: 4.8,
    icon: "Car",
    color: "red",
    tags: ["автомобили", "авто", "машины", "продажа", "автосалон"]
  },
  {
    id: 5,
    name: "СТО-Мастер",
    category: "Автосервис",
    description: "Профессиональный ремонт автомобилей",
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
    color: "green",
    tags: ["автосервис", "ремонт", "автомобили", "диагностика", "техобслуживание"]
  },
  {
    id: 6,
    name: "АвтоДеталь",
    category: "Запчасти",
    description: "Магазин автозапчастей и аксессуаров",
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
    color: "orange",
    tags: ["запчасти", "автозапчасти", "аксессуары", "детали", "автомагазин"]
  },
  {
    id: 7,
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
    color: "purple",
    tags: ["спорт", "мотоциклы", "экипировка", "спортбайки", "гонки"]
  },
  {
    id: 8,
    name: "Колесо72",
    category: "Шины",
    description: "Продажа автомобильных и мотоциклетных шин",
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
    color: "gray",
    tags: ["шины", "колеса", "резина", "автошины", "мотошины"]
  },
  {
    id: 9,
    name: "БензоТех",
    category: "Бензотехника",
    description: "Садовая и строительная бензотехника",
    address: "ул. Широтная, 98",
    shortAddress: "Широтная, 98",
    phone: "+79333456789",
    website: "#",
    workTime: "9:00–18:00",
    shortWorkTime: "9-18",
    openTime: 9 * 60,
    closeTime: 18 * 60,
    rating: 4.4,
    icon: "Wrench",
    color: "yellow",
    tags: ["бензотехника", "садовая техника", "генераторы", "пилы", "триммеры"]
  },
  {
    id: 10,
    name: "АвтоГласс",
    category: "Автостекло",
    description: "Установка и ремонт автомобильных стекол",
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
    tags: ["автостекло", "стекла", "установка", "ремонт", "лобовое"]
  },
  {
    id: 11,
    name: "Турбо-Моторс",
    category: "Тюнинг",
    description: "Тюнинг автомобилей и мотоциклов",
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
    color: "red",
    tags: ["тюнинг", "чип-тюнинг", "доработка", "улучшение", "турбо"]
  },
  {
    id: 12,
    name: "ВелоМир",
    category: "Велосипеды",
    description: "Продажа велосипедов и аксессуаров",
    address: "ул. Геологоразведчиков, 14",
    shortAddress: "Геологоразведчиков, 14",
    phone: "+79666789012",
    website: "#",
    workTime: "9:00–19:00",
    shortWorkTime: "9-19",
    openTime: 9 * 60,
    closeTime: 19 * 60,
    rating: 4.3,
    icon: "Bike",
    color: "green",
    tags: ["велосипеды", "велики", "спорт", "активный отдых", "велоспорт"]
  },
  {
    id: 13,
    name: "Автомойка Люкс",
    category: "Автомойка",
    description: "Профессиональная мойка автомобилей",
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
    tags: ["автомойка", "мойка", "детейлинг", "химчистка", "полировка"]
  },
  {
    id: 14,
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
    color: "green",
    tags: ["электротранспорт", "самокаты", "электро", "моноколеса", "экология"]
  },
  {
    id: 15,
    name: "ПневмоСервис",
    category: "Пневматика",
    description: "Ремонт пневматических систем",
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
    color: "gray",
    tags: ["пневматика", "пневмосистемы", "компрессоры", "ремонт", "воздух"]
  },
  {
    id: 16,
    name: "Автозапчасти 72",
    category: "Запчасти",
    description: "Широкий ассортимент автозапчастей",
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
    color: "blue",
    tags: ["запчасти", "автозапчасти", "оригинал", "аналог", "автомагазин"]
  },
  {
    id: 17,
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
    color: "orange",
    tags: ["мотоциклы", "квадроциклы", "снегоходы", "внедорожники", "мото"]
  },
  {
    id: 18,
    name: "Автокредит",
    category: "Автосалон",
    description: "Продажа автомобилей в кредит",
    address: "ул. Холодильная, 138",
    shortAddress: "Холодильная, 138",
    phone: "+79323456789",
    website: "#",
    workTime: "9:00–18:00",
    shortWorkTime: "9-18",
    openTime: 9 * 60,
    closeTime: 18 * 60,
    rating: 4.1,
    icon: "Car",
    color: "purple",
    tags: ["автомобили", "кредит", "рассрочка", "финансы", "автосалон"]
  },
  {
    id: 19,
    name: "Грузовик72",
    category: "Грузовые авто",
    description: "Продажа и ремонт грузовых автомобилей",
    address: "ул. Станционная, 44",
    shortAddress: "Станционная, 44",
    phone: "+79434567890",
    website: "#",
    workTime: "8:00–17:00",
    shortWorkTime: "8-17",
    openTime: 8 * 60,
    closeTime: 17 * 60,
    rating: 4.3,
    icon: "Truck",
    color: "gray",
    tags: ["грузовики", "грузовые", "фургоны", "автобусы", "коммерческий"]
  },
  {
    id: 20,
    name: "СпецТехника",
    category: "Спецтехника",
    description: "Продажа и аренда спецтехники",
    address: "ул. Профсоюзная, 67",
    shortAddress: "Профсоюзная, 67",
    phone: "+79545678901",
    website: "#",
    workTime: "8:00–18:00",
    shortWorkTime: "8-18",
    openTime: 8 * 60,
    closeTime: 18 * 60,
    rating: 4.0,
    icon: "Truck",
    color: "yellow",
    tags: ["спецтехника", "аренда", "экскаваторы", "погрузчики", "строительная"]
  },
  {
    id: 21,
    name: "Автоэмали 72",
    category: "Краски",
    description: "Автомобильные краски и лаки",
    address: "ул. Челюскинцев, 23",
    shortAddress: "Челюскинцев, 23",
    phone: "+79656789012",
    website: "#",
    workTime: "9:00–18:00",
    shortWorkTime: "9-18",
    openTime: 9 * 60,
    closeTime: 18 * 60,
    rating: 4.2,
    icon: "Palette",
    color: "red",
    tags: ["краски", "эмали", "лаки", "покраска", "кузовной ремонт"]
  }
];

const Shop = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Обновляем время каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Получаем уникальные категории
  const categories = ["Все", ...new Set(shopData.map(shop => shop.category))];

  // Получаем все уникальные теги
  const allTags = [...new Set(shopData.flatMap(shop => shop.tags))];

  // Функция для проверки статуса работы магазина
  const getShopStatus = (shop: ShopData) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const isOpen = currentTimeInMinutes >= shop.openTime && currentTimeInMinutes < shop.closeTime;

    if (isOpen) {
      return {
        status: "Открыто",
        color: "text-green-400",
        dotColor: "bg-green-400",
      };
    } else {
      return {
        status: "Закрыто",
        color: "text-red-400",
        dotColor: "bg-red-400",
      };
    }
  };

  // Фильтрация магазинов
  const filteredShops = shopData.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "Все" || shop.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => shop.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Все");
    setSelectedTags([]);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Заголовок */}
        <section className="bg-dark-900 text-white py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-['Oswald']">
              МАГАЗИНЫ
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Автомобильные и мотоциклетные магазины Тюмени
            </p>
          </div>
        </section>

        {/* Фильтры и поиск */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            {/* Поиск */}
            <div className="mb-4">
              <div className="relative max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Поиск по названию, описанию или тегам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Категории */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Категории:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Теги */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Теги:</h3>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {allTags.slice(0, 20).map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Очистить фильтры и счетчик */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Найдено: {filteredShops.length} из {shopData.length}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <Icon name="X" className="h-3 w-3 mr-1" />
                Очистить
              </Button>
            </div>
          </div>
        </section>

        {/* Магазины */}
        <section className="py-6 sm:py-8 md:py-16 px-4">
          <div className="container mx-auto">
            {filteredShops.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
                <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {filteredShops.map((shop) => {
                  const shopStatus = getShopStatus(shop);
                  return (
                    <div key={shop.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
                      {/* Статус в правом верхнем углу */}
                      <div className="absolute top-2 right-2 z-10">
                        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                          <div className={`w-1.5 h-1.5 ${shopStatus.dotColor} rounded-full`}></div>
                          <span className={`text-xs font-medium ${shopStatus.color === "text-green-400" ? "text-green-600" : "text-red-600"}`}>
                            {shopStatus.status}
                          </span>
                        </div>
                      </div>

                      {/* Логотип/Изображение */}
                      <div className={`relative h-28 md:h-36 bg-gradient-to-br from-${shop.color}-500 to-${shop.color}-600 flex items-center justify-center`}>
                        <Icon name={shop.icon as any} className="h-8 md:h-12 w-8 md:w-12 text-white" />
                        <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                          <span className="text-white text-xs font-medium">
                            {shop.category}
                          </span>
                        </div>
                      </div>

                      {/* Основной контент */}
                      <div className="p-2.5 md:p-4">
                        {/* Заголовок и рейтинг */}
                        <div className="flex items-start justify-between mb-1.5">
                          <h3 className="text-sm md:text-lg font-bold text-gray-900 font-['Oswald'] truncate">
                            {shop.name}
                          </h3>
                          <div className="flex items-center gap-0.5 ml-1">
                            <Icon name="Star" className="h-3 md:h-4 w-3 md:w-4 text-yellow-400 fill-current" />
                            <span className="text-xs md:text-sm font-semibold text-gray-700">
                              {shop.rating}
                            </span>
                          </div>
                        </div>

                        {/* Краткое описание - только на больших экранах */}
                        <p className="hidden md:block text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {shop.description}
                        </p>

                        {/* Компактная информация */}
                        <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Icon name="MapPin" className={`h-2.5 md:h-3 w-2.5 md:w-3 text-${shop.color}-500 flex-shrink-0`} />
                            <span className="truncate text-xs">{shop.shortAddress}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Icon name="Clock" className={`h-2.5 md:h-3 w-2.5 md:w-3 text-${shop.color}-500 flex-shrink-0`} />
                            <span className="text-xs">{shop.shortWorkTime}</span>
                          </div>
                        </div>

                        {/* Кнопка сайта */}
                        <a href={shop.website} target="_blank" rel="noopener noreferrer" className="block mb-2">
                          <Button className={`w-full bg-${shop.color}-600 hover:bg-${shop.color}-700 text-white text-xs md:text-sm py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all`}>
                            <Icon name="Globe" className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
                            <span className="hidden md:inline">Перейти на сайт</span>
                            <span className="md:hidden">Сайт</span>
                          </Button>
                        </a>

                        {/* Контакты */}
                        <div className="flex justify-between items-center">
                          <a href={`tel:${shop.phone}`} className={`flex items-center gap-1 text-${shop.color}-600 hover:text-${shop.color}-700 font-medium`}>
                            <Icon name="Phone" className="h-3 w-3" />
                            <span className="text-xs">Звонок</span>
                          </a>

                          {/* Социальные сети */}
                          <div className="flex gap-1">
                            {shop.telegram && (
                              <a href={shop.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors">
                                <Icon name="Send" className="h-2.5 w-2.5 text-white" />
                              </a>
                            )}
                            {shop.vk && (
                              <a href={shop.vk} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                                <span className="text-white font-bold text-xs">VK</span>
                              </a>
                            )}
                            {shop.whatsapp && (
                              <a href={shop.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded transition-colors">
                                <Icon name="MessageCircle" className="h-2.5 w-2.5 text-white" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Shop;