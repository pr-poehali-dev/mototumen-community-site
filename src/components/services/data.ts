import { WorkSchedule } from "@/components/schools/types";

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

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import PageLayout from "@/components/layout/PageLayout";
import { serviceData, categories, ServiceData } from "@/components/services/data";



const Service = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ServiceData[]>(serviceData);
  const [showSchedule, setShowSchedule] = useState<{ [key: number]: boolean }>(
    {},
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);



  const getServiceStatus = (service: ServiceData) => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // ДЕБАГ: покажем текущее время
    console.log(
      `Текущее время: ${currentHour}:${currentMinute.toString().padStart(2, "0")} (${currentTimeInMinutes} мин)`,
    );
    console.log(
      `Сервис ${service.name}: открыт ${service.openTime}-${service.closeTime} мин`,
    );

    const isOpen =
      currentTimeInMinutes >= service.openTime &&
      currentTimeInMinutes < service.closeTime;

    if (isOpen) {
      return {
        status: "ОТКРЫТО",
        color: "text-green-400",
        dotColor: "bg-green-400",
      };
    } else {
      return {
        status: "ЗАКРЫТО",
        color: "text-red-400",
        dotColor: "bg-red-400",
      };
    }
  };

  const filteredServices = editData.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Все" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (
    id: number,
    field: keyof ServiceData,
    value: string | number,
  ) => {
    setEditData((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
      ),
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Все");
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-dark-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              МОТОСЕРВИСЫ
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Лучшие сервисы по обслуживанию мототехники в Тюмени
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Поиск сервисов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Icon
                  name="Search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
              </div>

              {/* Category Select */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Edit Toggle */}
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                size="sm"
              >
                <Icon name="Edit" className="h-4 w-4 mr-2" />
                {isEditing ? "Сохранить" : "Редактировать"}
              </Button>
            </div>

            {/* Results and Clear */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Найдено: {filteredServices.length} из {editData.length}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Icon name="X" className="h-3 w-3 mr-1" />
                Очистить
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Icon
                  name="Search"
                  className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service) => {
                  const serviceStatus = getServiceStatus(service);
                  return (
                    <div
                      key={service.id}
                      className="bg-card rounded-xl shadow-sm hover:shadow-md border border-border transition-all duration-300 overflow-hidden group"
                    >
                      {/* Status */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-border">
                          <div
                            className={`w-2 h-2 ${serviceStatus.dotColor} rounded-full`}
                          ></div>
                          <span
                            className={`text-xs font-medium ${serviceStatus.color === "text-green-400" ? "text-green-600" : "text-red-600"}`}
                          >
                            {serviceStatus.status}
                          </span>
                        </div>
                      </div>

                      {/* Header */}
                      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Icon
                          name={service.icon as any}
                          className="h-12 w-12 text-white"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded px-2 py-1">
                          <span className="text-white text-xs font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={service.category}
                                onChange={(e) =>
                                  handleEdit(
                                    service.id,
                                    "category",
                                    e.target.value,
                                  )
                                }
                                className="bg-transparent text-white text-xs border-none outline-none"
                              />
                            ) : (
                              service.category
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-foreground truncate">
                            {isEditing ? (
                              <input
                                type="text"
                                value={service.name}
                                onChange={(e) =>
                                  handleEdit(service.id, "name", e.target.value)
                                }
                                className="bg-transparent border-b border-border outline-none text-lg font-bold"
                              />
                            ) : (
                              service.name
                            )}
                          </h3>
                          <div className="flex items-center gap-1 ml-2">
                            <Icon
                              name="Star"
                              className="h-4 w-4 text-yellow-400 fill-current"
                            />
                            <span className="text-sm font-semibold text-foreground">
                              {service.rating}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {isEditing ? (
                            <textarea
                              value={service.description}
                              onChange={(e) =>
                                handleEdit(
                                  service.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent border border-border rounded p-1 text-sm resize-none"
                              rows={2}
                            />
                          ) : (
                            service.description
                          )}
                        </p>

                        {/* Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon
                              name="MapPin"
                              className="h-3 w-3 text-blue-500 flex-shrink-0"
                            />
                            <span className="truncate">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={service.shortAddress}
                                  onChange={(e) =>
                                    handleEdit(
                                      service.id,
                                      "shortAddress",
                                      e.target.value,
                                    )
                                  }
                                  className="bg-transparent border-b border-border outline-none text-sm w-full"
                                />
                              ) : (
                                service.shortAddress
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon
                              name="Clock"
                              className="h-3 w-3 text-blue-500 flex-shrink-0"
                            />
                            <span>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={service.shortWorkTime}
                                  onChange={(e) =>
                                    handleEdit(
                                      service.id,
                                      "shortWorkTime",
                                      e.target.value,
                                    )
                                  }
                                  className="bg-transparent border-b border-border outline-none text-sm"
                                />
                              ) : (
                                service.shortWorkTime
                              )}
                            </span>
                          </div>

                          {/* График работы */}
                          {service.schedule && !isEditing && (
                            <div className="relative">
                              <div
                                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-blue-500 transition-colors"
                                onClick={() =>
                                  setShowSchedule((prev) => ({
                                    ...prev,
                                    [service.id]: !prev[service.id],
                                  }))
                                }
                              >
                                <Icon
                                  name="Calendar"
                                  className="h-3 w-3 text-blue-500 flex-shrink-0"
                                />
                                <span className="truncate">График работы</span>
                                <Icon
                                  name={
                                    showSchedule[service.id]
                                      ? "ChevronUp"
                                      : "ChevronDown"
                                  }
                                  className="h-3 w-3 text-blue-500"
                                />
                              </div>

                              {/* Выпадающий список с графиком */}
                              {showSchedule[service.id] && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                  {service.schedule.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center px-3 py-2 text-xs border-b border-border last:border-b-0 hover:bg-blue-50 transition-colors"
                                    >
                                      <span className="font-medium text-foreground">
                                        {item.day}
                                      </span>
                                      <span
                                        className={`${item.hours === "Выходной" ? "text-red-600" : "text-muted-foreground"}`}
                                      >
                                        {item.hours}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Website Button */}
                        <a
                          href={isEditing ? "#" : service.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-3"
                          onClick={
                            isEditing ? (e) => e.preventDefault() : undefined
                          }
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">
                            <Icon name="Globe" className="h-4 w-4 mr-2" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={service.website}
                                onChange={(e) =>
                                  handleEdit(
                                    service.id,
                                    "website",
                                    e.target.value,
                                  )
                                }
                                className="bg-transparent text-white outline-none text-center"
                                placeholder="URL сайта"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              "Перейти на сайт"
                            )}
                          </Button>
                        </a>

                        {/* Contacts */}
                        <div className="flex justify-between items-center">
                          <a
                            href={isEditing ? "#" : `tel:${service.phone}`}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            onClick={
                              isEditing ? (e) => e.preventDefault() : undefined
                            }
                          >
                            <Icon name="Phone" className="h-3 w-3" />
                            <span className="text-sm">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={service.phone}
                                  onChange={(e) =>
                                    handleEdit(
                                      service.id,
                                      "phone",
                                      e.target.value,
                                    )
                                  }
                                  className="bg-transparent border-b border-border outline-none text-sm text-blue-600"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                "Звонок"
                              )}
                            </span>
                          </a>

                          {/* Social Links */}
                          <div className="flex gap-1">
                            {service.telegram && (
                              <a
                                href={isEditing ? "#" : service.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                                onClick={
                                  isEditing
                                    ? (e) => e.preventDefault()
                                    : undefined
                                }
                              >
                                <Icon
                                  name="Send"
                                  className="h-3 w-3 text-white"
                                />
                              </a>
                            )}
                            {service.vk && (
                              <a
                                href={isEditing ? "#" : service.vk}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                onClick={
                                  isEditing
                                    ? (e) => e.preventDefault()
                                    : undefined
                                }
                              >
                                <span className="text-white font-bold text-xs">
                                  VK
                                </span>
                              </a>
                            )}
                            {service.whatsapp && (
                              <a
                                href={isEditing ? "#" : service.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded transition-colors"
                                onClick={
                                  isEditing
                                    ? (e) => e.preventDefault()
                                    : undefined
                                }
                              >
                                <Icon
                                  name="MessageCircle"
                                  className="h-3 w-3 text-white"
                                />
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

export default Service;