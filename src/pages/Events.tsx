import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchFilter from "@/components/ui/search-filter";
import FavoriteButton from "@/components/ui/favorite-button";
import Icon from "@/components/ui/icon";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: string;
  image: string;
  organizer: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "ended";
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "date-desc",
    status: "",
  });

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: 'Мотопробег "Весенний старт"',
      description:
        "Традиционный весенний мотопробег для всех любителей мотоциклов",
      date: "2024-04-15",
      time: "10:00",
      location: "Центральная площадь",
      price: 0,
      category: "Мотопробег",
      image: "https://picsum.photos/400/300?random=1",
      organizer: "МОТОТюмень",
      maxParticipants: 100,
      currentParticipants: 45,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Мастер-класс по техническому обслуживанию",
      description: "Изучаем основы технического обслуживания мотоциклов",
      date: "2024-04-20",
      time: "14:00",
      location: "Сервисный центр",
      price: 1500,
      category: "Обучение",
      image: "https://picsum.photos/400/300?random=2",
      organizer: 'Сервис-центр "Мото+"',
      maxParticipants: 20,
      currentParticipants: 12,
      status: "upcoming",
    },
    {
      id: "3",
      title: "Соревнования по фигурному вождению",
      description:
        "Соревнования на ловкость и мастерство управления мотоциклом",
      date: "2024-04-25",
      time: "12:00",
      location: "Автодром",
      price: 500,
      category: "Соревнования",
      image: "https://picsum.photos/400/300?random=3",
      organizer: 'Мотоклуб "Скорость"',
      maxParticipants: 50,
      currentParticipants: 23,
      status: "upcoming",
    },
  ]);

  const categories = [...new Set(events.map((event) => event.category))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      sortBy: "date-desc",
      status: "",
    });
    setSearchTerm("");
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filters.category || event.category === filters.category;
    const matchesStatus = !filters.status || event.status === filters.status;

    let matchesPrice = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
        .split("-")
        .map((p) => parseInt(p) || 0);
      if (filters.priceRange === "10000+") {
        matchesPrice = event.price >= 10000;
      } else {
        matchesPrice = event.price >= min && event.price <= (max || Infinity);
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "ended":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Предстоящее";
      case "ongoing":
        return "Идёт";
      case "ended":
        return "Завершено";
      default:
        return "Неизвестно";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              События
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Мотособытия, встречи и мероприятия
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90">
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Добавить событие
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              categories={categories}
              showPriceFilter={true}
              showStatusFilter={true}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Найдено событий: {filteredEvents.length}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge
                        className={`${getStatusColor(event.status)} text-white`}
                      >
                        {getStatusText(event.status)}
                      </Badge>
                      <FavoriteButton
                        item={{
                          id: event.id,
                          type: "event",
                          title: event.title,
                          description: event.description,
                          image: event.image,
                          price: event.price,
                        }}
                      />
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle
                          className="text-lg mb-2"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {event.title}
                        </CardTitle>
                        <Badge variant="outline" className="mb-2">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm text-muted-foreground mb-4"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Icon
                          name="Calendar"
                          className="h-4 w-4 mr-2 text-accent"
                        />
                        <span>
                          {new Date(event.date).toLocaleDateString("ru-RU")} в{" "}
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Icon
                          name="MapPin"
                          className="h-4 w-4 mr-2 text-accent"
                        />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Icon
                          name="User"
                          className="h-4 w-4 mr-2 text-accent"
                        />
                        <span>{event.organizer}</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="flex items-center text-sm">
                          <Icon
                            name="Users"
                            className="h-4 w-4 mr-2 text-accent"
                          />
                          <span>
                            {event.currentParticipants}/{event.maxParticipants}{" "}
                            участников
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-accent">
                        {event.price === 0 ? "Бесплатно" : `${event.price} ₽`}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Share" className="h-4 w-4" />
                        </Button>
                        <Button className="bg-accent hover:bg-accent/90">
                          {event.status === "upcoming"
                            ? "Участвовать"
                            : "Подробнее"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-8">
                <Icon
                  name="Calendar"
                  className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2">
                  События не найдены
                </h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
