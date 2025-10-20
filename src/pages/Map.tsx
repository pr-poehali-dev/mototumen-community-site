import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { RouteCard, Route } from "@/components/map/RouteCard";
import { RouteDetails } from "@/components/map/RouteDetails";
import { RouteFilters } from "@/components/map/RouteFilters";
import { routes } from "@/components/map/routesData";

const Map = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const filteredRoutes = routes.filter((route) => {
    if (activeFilter === "all") return true;
    return route.type === activeFilter;
  });

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

        <div className="mb-8">
          <RouteFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Найдено маршрутов: {filteredRoutes.length}
              </p>
            </div>

            <div className="space-y-4">
              {filteredRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onClick={() => setSelectedRoute(route)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <RouteDetails route={selectedRoute} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
