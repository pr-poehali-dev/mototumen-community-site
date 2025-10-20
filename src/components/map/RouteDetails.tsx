import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import {
  Route,
  getTypeColor,
  getTypeText,
  getDifficultyColor,
  getDifficultyText,
  getSurfaceText,
} from "./RouteCard";

interface RouteDetailsProps {
  route: Route | null;
}

export const RouteDetails: React.FC<RouteDetailsProps> = ({ route }) => {
  if (!route) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-8 text-center">
          <Icon
            name="Map"
            className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
          />
          <h3 className="text-lg font-semibold mb-2">Выберите маршрут</h3>
          <p className="text-muted-foreground">
            Нажмите на маршрут слева, чтобы посмотреть подробную информацию
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>
          {route.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <img
            src={route.images[0]}
            alt={route.name}
            className="w-full h-40 object-cover rounded-lg"
          />

          <div className="flex gap-2">
            <Badge className={`${getTypeColor(route.type)} text-white`}>
              {getTypeText(route.type)}
            </Badge>
            <Badge
              className={`${getDifficultyColor(route.difficulty)} text-white`}
            >
              {getDifficultyText(route.difficulty)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{route.description}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Расстояние:</span>
              <span className="font-medium">{route.distance} км</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Время:</span>
              <span className="font-medium">{route.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Покрытие:</span>
              <span className="font-medium">
                {getSurfaceText(route.surface)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Рейтинг:</span>
              <div className="flex items-center gap-1">
                <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{route.rating}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Маршрут:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Play" className="h-3 w-3 text-green-500" />
                <span>{route.startPoint}</span>
              </div>
              {route.waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center gap-2 ml-2">
                  <Icon name="MapPin" className="h-3 w-3 text-blue-500" />
                  <span>{waypoint}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Icon name="Square" className="h-3 w-3 text-red-500" />
                <span>{route.endPoint}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Особенности:</h4>
            <div className="flex flex-wrap gap-1">
              {route.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
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
  );
};
