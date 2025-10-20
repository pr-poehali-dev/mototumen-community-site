import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

export interface Route {
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

interface RouteCardProps {
  route: Route;
  onClick: () => void;
}

export const getDifficultyColor = (difficulty: string) => {
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

export const getDifficultyText = (difficulty: string) => {
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

export const getTypeColor = (type: string) => {
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

export const getTypeText = (type: string) => {
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

export const getSurfaceText = (surface: string) => {
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

export const RouteCard: React.FC<RouteCardProps> = ({ route, onClick }) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
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
          <div className="flex items-center gap-1">
            <Icon name="Star" className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{route.rating}</span>
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
              <Icon name="Navigation" className="h-4 w-4 text-muted-foreground" />
              <span>{route.distance} км</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
              <span>{route.duration}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Icon name="Road" className="h-4 w-4 text-muted-foreground" />
              <span>{getSurfaceText(route.surface)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="User" className="h-4 w-4 text-muted-foreground" />
              <span>{route.createdBy}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90">
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
  );
};
