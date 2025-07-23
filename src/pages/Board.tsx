import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilter from "@/components/ui/search-filter";
import FavoriteButton from "@/components/ui/favorite-button";
import Icon from "@/components/ui/icon";

interface BoardItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  price?: number;
  location?: string;
  contact: string;
  type: "rideshare" | "service" | "announcement";
  status: "active" | "closed";
}

const Board = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "date-desc",
    status: "active",
  });

  const [boardItems] = useState<BoardItem[]>([
    {
      id: "1",
      title: "Ищу попутчиков на Алтай",
      description:
        "Планирую поездку на Алтай в июле. Ищу компанию для совместного путешествия.",
      author: "Алексей М.",
      date: "2024-04-10",
      category: "Путешествия",
      image: "https://picsum.photos/400/300?random=10",
      location: "Тюмень → Алтай",
      contact: "@alexey_moto",
      type: "rideshare",
      status: "active",
    },
    {
      id: "2",
      title: "Техническое обслуживание мотоциклов",
      description:
        "Качественное ТО вашего мотоцикла. Диагностика, замена масла, настройка.",
      author: 'Сервис "Мото+"',
      date: "2024-04-09",
      category: "ТО и ремонт",
      price: 2000,
      location: "ул. Механическая, 15",
      contact: "+7 (3452) 123-456",
      type: "service",
      status: "active",
    },
    {
      id: "3",
      title: "Продаю мотоцикл Honda CBR600",
      description:
        "Продается Honda CBR600RR 2018 года. Состояние отличное, не бита.",
      author: "Дмитрий К.",
      date: "2024-04-08",
      category: "Продажа",
      price: 450000,
      image: "https://picsum.photos/400/300?random=11",
      location: "Тюмень",
      contact: "@dmitry_cbr",
      type: "announcement",
      status: "active",
    },
    {
      id: "4",
      title: "Ищу инструктора по вождению",
      description:
        "Начинающий мотоциклист ищет опытного инструктора для дополнительных занятий.",
      author: "Анна С.",
      date: "2024-04-07",
      category: "Обучение",
      price: 1500,
      location: "Тюмень",
      contact: "@anna_beginner",
      type: "service",
      status: "active",
    },
  ]);

  const categories = [...new Set(boardItems.map((item) => item.category))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      sortBy: "date-desc",
      status: "active",
    });
    setSearchTerm("");
  };

  const getFilteredItems = (type?: string) => {
    let items = boardItems;

    if (type && type !== "all") {
      items = items.filter((item) => item.type === type);
    }

    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filters.category || item.category === filters.category;
      const matchesStatus = !filters.status || item.status === filters.status;

      let matchesPrice = true;
      if (filters.priceRange && item.price) {
        const [min, max] = filters.priceRange
          .split("-")
          .map((p) => parseInt(p) || 0);
        if (filters.priceRange === "10000+") {
          matchesPrice = item.price >= 10000;
        } else {
          matchesPrice = item.price >= min && item.price <= (max || Infinity);
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  };

  const renderItems = (items: BoardItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          {item.image && (
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <FavoriteButton
                  item={{
                    id: item.id,
                    type:
                      item.type === "rideshare" ? "announcement" : item.type,
                    title: item.title,
                    description: item.description,
                    image: item.image,
                    price: item.price,
                  }}
                />
              </div>
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle
                  className="text-lg mb-2"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {item.title}
                </CardTitle>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge
                    className={
                      item.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {item.status === "active" ? "Активно" : "Закрыто"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p
              className="text-sm text-muted-foreground mb-4"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {item.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <Icon name="User" className="h-4 w-4 mr-2 text-accent" />
                <span>{item.author}</span>
              </div>
              <div className="flex items-center text-sm">
                <Icon name="Calendar" className="h-4 w-4 mr-2 text-accent" />
                <span>{new Date(item.date).toLocaleDateString("ru-RU")}</span>
              </div>
              {item.location && (
                <div className="flex items-center text-sm">
                  <Icon name="MapPin" className="h-4 w-4 mr-2 text-accent" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-accent">
                {item.price ? `${item.price} ₽` : "Договорная"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="MessageCircle" className="h-4 w-4 mr-1" />
                  {item.contact}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Доска объявлений
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Попутчики, услуги и объявления от мотосообщества
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90">
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Добавить объявление
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="rideshare">Попутчики</TabsTrigger>
                <TabsTrigger value="service">Услуги</TabsTrigger>
                <TabsTrigger value="announcement">Объявления</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Найдено объявлений: {getFilteredItems().length}
                  </p>
                </div>
                {renderItems(getFilteredItems())}
              </TabsContent>

              <TabsContent value="rideshare" className="mt-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Найдено попутчиков: {getFilteredItems("rideshare").length}
                  </p>
                </div>
                {renderItems(getFilteredItems("rideshare"))}
              </TabsContent>

              <TabsContent value="service" className="mt-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Найдено услуг: {getFilteredItems("service").length}
                  </p>
                </div>
                {renderItems(getFilteredItems("service"))}
              </TabsContent>

              <TabsContent value="announcement" className="mt-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Найдено объявлений:{" "}
                    {getFilteredItems("announcement").length}
                  </p>
                </div>
                {renderItems(getFilteredItems("announcement"))}
              </TabsContent>
            </Tabs>

            {getFilteredItems(activeTab === "all" ? undefined : activeTab)
              .length === 0 && (
              <div className="text-center py-8">
                <Icon
                  name="MessageSquare"
                  className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2">
                  Объявления не найдены
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

export default Board;
