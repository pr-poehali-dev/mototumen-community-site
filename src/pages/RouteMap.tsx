import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface MapPoint {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  category: string;
  type: "route" | "event" | "service" | "danger";
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  images?: string[];
}

const RouteMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [mapPoints] = useState<MapPoint[]>([
    {
      id: "1",
      title: "Живописный маршрут к озеру Андреевское",
      description:
        "Отличный маршрут для выходного дня, красивые виды и хорошая дорога",
      lat: 57.1522,
      lng: 65.5272,
      category: "Природа",
      type: "route",
      author: "Алексей М.",
      date: "2024-04-10",
      status: "approved",
      images: ["https://picsum.photos/400/300?random=30"],
    },
    {
      id: "2",
      title: "Мотослет в Заводоуковске",
      description: "Ежегодный мотослет с соревнованиями и концертом",
      lat: 56.5034,
      lng: 66.5503,
      category: "Мероприятия",
      type: "event",
      author: "Организаторы",
      date: "2024-04-15",
      status: "approved",
      images: ["https://picsum.photos/400/300?random=31"],
    },
    {
      id: "3",
      title: 'Мотосервис "Техно"',
      description: "Качественный ремонт и диагностика мотоциклов",
      lat: 57.1631,
      lng: 65.5311,
      category: "Сервис",
      type: "service",
      author: "Владелец сервиса",
      date: "2024-04-08",
      status: "approved",
    },
    {
      id: "4",
      title: "Опасный участок дороги",
      description: "Много ям и плохое покрытие на трассе Р-404",
      lat: 57.0,
      lng: 65.0,
      category: "Дорожные условия",
      type: "danger",
      author: "Дмитрий К.",
      date: "2024-04-12",
      status: "pending",
    },
    {
      id: "5",
      title: 'Маршрут "Золотое кольцо Тюменской области"',
      description: "Круговой маршрут по историческим местам области",
      lat: 57.2,
      lng: 65.3,
      category: "История",
      type: "route",
      author: "Клуб путешественников",
      date: "2024-04-09",
      status: "approved",
      images: ["https://picsum.photos/400/300?random=32"],
    },
  ]);

  const categories = [...new Set(mapPoints.map((point) => point.category))];

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "route":
        return { label: "Маршрут", color: "bg-blue-500", icon: "Route" };
      case "event":
        return { label: "Событие", color: "bg-green-500", icon: "Calendar" };
      case "service":
        return { label: "Сервис", color: "bg-purple-500", icon: "Wrench" };
      case "danger":
        return {
          label: "Опасность",
          color: "bg-red-500",
          icon: "AlertTriangle",
        };
      default:
        return { label: "Точка", color: "bg-gray-500", icon: "MapPin" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Одобрено";
      case "pending":
        return "На модерации";
      case "rejected":
        return "Отклонено";
      default:
        return "Неизвестно";
    }
  };

  const filteredPoints = mapPoints.filter((point) => {
    const matchesSearch =
      point.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || point.category === selectedCategory;
    const matchesType = !selectedType || point.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Карта маршрутов
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Интерактивная карта с маршрутами, событиями и полезными местами
            </p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Добавить точку
          </Button>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Icon
                      name="Search"
                      className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      placeholder="Поиск по названию или описанию..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Тип точки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все типы</SelectItem>
                    <SelectItem value="route">Маршруты</SelectItem>
                    <SelectItem value="event">События</SelectItem>
                    <SelectItem value="service">Сервисы</SelectItem>
                    <SelectItem value="danger">Опасности</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Карта */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Карта</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon
                      name="Map"
                      className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                    />
                    <p className="text-muted-foreground">
                      Интерактивная карта будет здесь
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Показаны точки: {filteredPoints.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Список точек */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Точки на карте</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Найдено: {filteredPoints.length}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredPoints.map((point) => {
                    const typeConfig = getTypeConfig(point.type);
                    return (
                      <div
                        key={point.id}
                        className="p-4 border-b border-border last:border-b-0 hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${typeConfig.color}`}
                          >
                            <Icon
                              name={typeConfig.icon}
                              className="h-4 w-4 text-white"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {point.title}
                              </h4>
                              <Badge
                                className={`${getStatusColor(point.status)} text-white text-xs`}
                              >
                                {getStatusText(point.status)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {point.description}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {point.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {typeConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{point.author}</span>
                              <span>
                                {new Date(point.date).toLocaleDateString(
                                  "ru-RU",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Форма добавления точки */}
        {showAddForm && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Добавить точку на карту</CardTitle>
              <p className="text-sm text-muted-foreground">
                Предложите новую точку для добавления на карту. Она будет
                рассмотрена администратором.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Название
                  </label>
                  <Input placeholder="Введите название точки" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Категория
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nature">Природа</SelectItem>
                      <SelectItem value="history">История</SelectItem>
                      <SelectItem value="service">Сервис</SelectItem>
                      <SelectItem value="events">Мероприятия</SelectItem>
                      <SelectItem value="danger">Опасности</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тип точки
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="route">Маршрут</SelectItem>
                      <SelectItem value="event">Событие</SelectItem>
                      <SelectItem value="service">Сервис</SelectItem>
                      <SelectItem value="danger">Опасность</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Местоположение
                  </label>
                  <Input placeholder="Укажите адрес или координаты" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Описание
                  </label>
                  <textarea
                    className="w-full min-h-24 px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                    placeholder="Подробное описание точки"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Отмена
                  </Button>
                  <Button className="bg-accent hover:bg-accent/90">
                    Отправить на модерацию
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredPoints.length === 0 && (
          <div className="text-center py-8">
            <Icon
              name="MapPin"
              className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
            />
            <h3 className="text-lg font-semibold mb-2">Точки не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteMap;
