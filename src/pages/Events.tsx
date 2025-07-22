import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchFilter from "@/components/ui/search-filter";
import FavoriteButton from "@/components/ui/favorite-button";
import Icon from "@/components/ui/icon";
import { useAppStore } from "@/store/useAppStore";
import InlineEdit from "@/components/ui/inline-edit";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "date-desc",
    status: "",
  });

  const events = useAppStore((state) => state.events);
  const updateEvent = useAppStore((state) => state.updateEvent);

  // Преобразуем типы событий в категории для фильтров
  const typeToCategory = { ride: 'Поездки', workshop: 'Мастер-классы', competition: 'Соревнования' };
  const categories = [...new Set(events.map((event) => typeToCategory[event.type] || event.type))];

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
    
    const eventCategory = typeToCategory[event.type] || event.type;
    const matchesCategory = !filters.category || eventCategory === filters.category;
    
    // Преобразуем статусы для сооветствия с новой структурой
    const eventDate = new Date(event.date);
    const now = new Date();
    const eventStatus = eventDate > now ? "upcoming" : "ended";
    const matchesStatus = !filters.status || eventStatus === filters.status;

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
                        className={`${getStatusColor(new Date(event.date) > new Date() ? "upcoming" : "ended")} text-white`}
                      >
                        {getStatusText(new Date(event.date) > new Date() ? "upcoming" : "ended")}
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
                        <CardTitle className="text-lg mb-2">
                          <InlineEdit
                            value={event.title}
                            onSave={(newTitle) => updateEvent(event.id, { title: newTitle })}
                            className="font-bold"
                            placeholder="Название события"
                          />
                        </CardTitle>
                        <Badge variant="outline" className="mb-2">
                          {typeToCategory[event.type] || event.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <InlineEdit
                        value={event.description}
                        onSave={(newDescription) => updateEvent(event.id, { description: newDescription })}
                        multiline
                        placeholder="Описание события"
                        className="text-sm text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Icon
                          name="Calendar"
                          className="h-4 w-4 mr-2 text-accent"
                        />
                        <InlineEdit
                          value={event.date}
                          onSave={(newDate) => updateEvent(event.id, { date: newDate })}
                          type="date"
                          placeholder="Дата события"
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center text-sm">
                        <Icon
                          name="MapPin"
                          className="h-4 w-4 mr-2 text-accent"
                        />
                        <InlineEdit
                          value={event.location}
                          onSave={(newLocation) => updateEvent(event.id, { location: newLocation })}
                          placeholder="Место проведения"
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center text-sm">
                        <Icon
                          name="Users"
                          className="h-4 w-4 mr-2 text-accent"
                        />
                        <span>
                          {event.participants}/{event.maxParticipants}{" "}
                          участников
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-accent">
                        <InlineEdit
                          value={event.price.toString()}
                          onSave={(newPrice) => updateEvent(event.id, { price: parseInt(newPrice) || 0 })}
                          type="number"
                          placeholder="0"
                          className="font-bold text-accent"
                        />
                        <span className="ml-1">₽</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Share" className="h-4 w-4" />
                        </Button>
                        <Button 
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => {
                            // Пример обновления данных в реальном времени
                            if (new Date(event.date) > new Date()) {
                              updateEvent(event.id, { 
                                participants: event.participants + 1 
                              });
                            }
                          }}
                        >
                          {new Date(event.date) > new Date()
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