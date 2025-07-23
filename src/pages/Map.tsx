import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Route {
  id: string;
  name: string;
  description: string;
  distance: number;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  type: "scenic" | "sport" | "adventure" | "city";
  startPoint: string;
  endPoint: string;
  waypoints: string[];
  highlights: string[];
  surface: "asphalt" | "gravel" | "mixed";
  season: "all" | "spring-autumn" | "summer";
  rating: number;
  reviewCount: number;
  createdBy: string;
  gpx?: string;
  images: string[];
}

const Map = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const routes: Route[] = [
    {
      id: "1",
      name: "Тюмень - Тобольск",
      description:
        "Живописный маршрут до исторического города Тобольска через малые города и села.",
      distance: 247,
      duration: "3.5 часа",
      difficulty: "easy",
      type: "scenic",
      startPoint: "Тюмень, Центральная площадь",
      endPoint: "Тобольск, Кремль",
      waypoints: ["Ярково", "Аромашево", "Вагай"],
      highlights: ["Тобольский кремль", "Иртыш", "Исторические места"],
      surface: "asphalt",
      season: "all",
      rating: 4.8,
      reviewCount: 34,
      createdBy: "Александр Путешественник",
      images: ["https://picsum.photos/400/300?random=50"],
    },
    {
      id: "2",
      name: "Кольцо Заречного",
      description:
        "Городской маршрут вокруг Заречного района с посещением интересных мест.",
      distance: 45,
      duration: "1.5 часа",
      difficulty: "easy",
      type: "city",
      startPoint: "Тюмень, мост Влюбленных",
      endPoint: "Тюмень, набережная",
      waypoints: ["Заречный парк", "Озеро Андреевское"],
      highlights: ["Парки", "Набережная", "Озера"],
      surface: "asphalt",
      season: "all",
      rating: 4.3,
      reviewCount: 18,
      createdBy: "Городской райдер",
      images: ["https://picsum.photos/400/300?random=51"],
    },
    {
      id: "3",
      name: "Горячие источники",
      description:
        "Маршрут к горячим источникам с возможностью отдыха и купания.",
      distance: 89,
      duration: "2 часа",
      difficulty: "medium",
      type: "adventure",
      startPoint: "Тюмень",
      endPoint: 'Источники "Сосновый бор"',
      waypoints: ["Каменка", "Богандинка"],
      highlights: ["Горячие источники", "Сосновый лес", "Отдых"],
      surface: "mixed",
      season: "all",
      rating: 4.6,
      reviewCount: 27,
      createdBy: "Любитель природы",
      images: ["https://picsum.photos/400/300?random=52"],
    },
    {
      id: "4",
      name: "Спортивный серпантин",
      description:
        "Извилистый маршрут для любителей активной езды с множеством поворотов.",
      distance: 67,
      duration: "2.5 часа",
      difficulty: "hard",
      type: "sport",
      startPoint: "Тюмень, Парковая зона",
      endPoint: "Возвращение к старту",
      waypoints: ["Винзили", "Перевалово", "Богандинка"],
      highlights: ["Серпантин", "Холмы", "Виды"],
      surface: "asphalt",
      season: "spring-autumn",
      rating: 4.9,
      reviewCount: 15,
      createdBy: "Спортивный байкер",
      images: ["https://picsum.photos/400/300?random=53"],
    },
    {
      id: "5",
      name: "Лесными тропами",
      description: "Приключенческий маршрут по лесным дорогам и тропам.",
      distance: 123,
      duration: "4 часа",
      difficulty: "hard",
      type: "adventure",
      startPoint: "Тюмень",
      endPoint: "Лесное озеро",
      waypoints: ["Рощино", "Лесная база", "Кордон"],
      highlights: ["Дикая природа", "Озеро", "Лесные тропы"],
      surface: "gravel",
      season: "summer",
      rating: 4.7,
      reviewCount: 22,
      createdBy: "Адвенчур гид",
      images: ["https://picsum.photos/400/300?random=54"],
    },
  ];

  const filteredRoutes = routes.filter((route) => {
    if (activeFilter === "all") return true;
    return route.type === activeFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легкий";
      case "medium":
        return "Средний";
      case "hard":
        return "Сложный";
      default:
        return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scenic":
        return "bg-blue-500";
      case "sport":
        return "bg-red-500";
      case "adventure":
        return "bg-green-500";
      case "city":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "scenic":
        return "Пейзажный";
      case "sport":
        return "Спортивный";
      case "adventure":
        return "Приключенческий";
      case "city":
        return "Городской";
      default:
        return "";
    }
  };

  const getSurfaceText = (surface: string) => {
    switch (surface) {
      case "asphalt":
        return "Асфальт";
      case "gravel":
        return "Гравий";
      case "mixed":
        return "Смешанное";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2 blue-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Карта маршрутов
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Популярные мотомаршруты Тюмени и области
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Upload" className="h-4 w-4 mr-2" />
              Загрузить GPX
            </Button>
            <Button className="bg-accent hover:bg-accent/90">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить маршрут
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className={
              activeFilter === "all" ? "bg-accent hover:bg-accent/90" : ""
            }
          >
            Все маршруты
          </Button>
          <Button
            variant={activeFilter === "scenic" ? "default" : "outline"}
            onClick={() => setActiveFilter("scenic")}
            className={
              activeFilter === "scenic" ? "bg-accent hover:bg-accent/90" : ""
            }
          >
            Пейзажные
          </Button>
          <Button
            variant={activeFilter === "sport" ? "default" : "outline"}
            onClick={() => setActiveFilter("sport")}
            className={
              activeFilter === "sport" ? "bg-accent hover:bg-accent/90" : ""
            }
          >
            Спортивные
          </Button>
          <Button
            variant={activeFilter === "adventure" ? "default" : "outline"}
            onClick={() => setActiveFilter("adventure")}
            className={
              activeFilter === "adventure" ? "bg-accent hover:bg-accent/90" : ""
            }
          >
            Приключенческие
          </Button>
          <Button
            variant={activeFilter === "city" ? "default" : "outline"}
            onClick={() => setActiveFilter("city")}
            className={
              activeFilter === "city" ? "bg-accent hover:bg-accent/90" : ""
            }
          >
            Городские
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Список маршрутов */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Найдено маршрутов: {filteredRoutes.length}
              </p>
            </div>

            <div className="space-y-4">
              {filteredRoutes.map((route) => (
                <Card
                  key={route.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedRoute(route)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge
                          className={`${getTypeColor(route.type)} text-white`}
                        >
                          {getTypeText(route.type)}
                        </Badge>
                        <Badge
                          className={`${getDifficultyColor(route.difficulty)} text-white`}
                        >
                          {getDifficultyText(route.difficulty)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {route.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({route.reviewCount})
                        </span>
                      </div>
                    </div>
                    <CardTitle
                      className="text-lg"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {route.name}
                    </CardTitle>
                    <p
                      className="text-sm text-muted-foreground line-clamp-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {route.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Navigation"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{route.distance} км</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Clock"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{route.duration}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Road"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{getSurfaceText(route.surface)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="User"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{route.createdBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-accent hover:bg-accent/90"
                      >
                        <Icon name="Navigation" className="h-4 w-4 mr-2" />
                        Проложить маршрут
                      </Button>
                      <Button size="sm" variant="outline">
                        <Icon name="Download" className="h-4 w-4 mr-2" />
                        GPX
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Детали маршрута */}
          <div className="lg:col-span-1">
            {selectedRoute ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle
                    className="text-lg"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {selectedRoute.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img
                      src={selectedRoute.images[0]}
                      alt={selectedRoute.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />

                    <div className="flex gap-2">
                      <Badge
                        className={`${getTypeColor(selectedRoute.type)} text-white`}
                      >
                        {getTypeText(selectedRoute.type)}
                      </Badge>
                      <Badge
                        className={`${getDifficultyColor(selectedRoute.difficulty)} text-white`}
                      >
                        {getDifficultyText(selectedRoute.difficulty)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {selectedRoute.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Расстояние:
                        </span>
                        <span className="font-medium">
                          {selectedRoute.distance} км
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Время:</span>
                        <span className="font-medium">
                          {selectedRoute.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Покрытие:</span>
                        <span className="font-medium">
                          {getSurfaceText(selectedRoute.surface)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Рейтинг:</span>
                        <div className="flex items-center gap-1">
                          <Icon
                            name="Star"
                            className="h-4 w-4 text-yellow-500"
                          />
                          <span className="font-medium">
                            {selectedRoute.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Маршрут:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Play"
                            className="h-3 w-3 text-green-500"
                          />
                          <span>{selectedRoute.startPoint}</span>
                        </div>
                        {selectedRoute.waypoints.map((waypoint, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 ml-2"
                          >
                            <Icon
                              name="MapPin"
                              className="h-3 w-3 text-blue-500"
                            />
                            <span>{waypoint}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Square"
                            className="h-3 w-3 text-red-500"
                          />
                          <span>{selectedRoute.endPoint}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Особенности:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoute.highlights.map((highlight, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-accent hover:bg-accent/90">
                        <Icon name="Navigation" className="h-4 w-4 mr-2" />
                        Открыть в навигаторе
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Icon name="Download" className="h-4 w-4 mr-2" />
                        Скачать GPX
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-4">
                <CardContent className="p-8 text-center">
                  <Icon
                    name="Map"
                    className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    Выберите маршрут
                  </h3>
                  <p className="text-muted-foreground">
                    Нажмите на маршрут слева, чтобы посмотреть подробную
                    информацию
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
