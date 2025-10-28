import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface BoardItemCardProps {
  item: BoardItem;
}

export default function BoardItemCard({ item }: BoardItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                type: item.type === "rideshare" ? "announcement" : item.type,
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

        <div className="flex items-center justify-between pt-4 border-t">
          {item.price && (
            <span className="text-xl font-bold text-accent">
              {item.price.toLocaleString()} ₽
            </span>
          )}
          <Button variant="default" className="ml-auto">
            <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
            Связаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
