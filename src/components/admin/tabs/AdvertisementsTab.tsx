import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { Advertisement } from "../types";

interface AdvertisementsTabProps {
  advertisements: Advertisement[];
  onDelete: (id: string) => void;
}

export const AdvertisementsTab: React.FC<AdvertisementsTabProps> = ({
  advertisements,
  onDelete,
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Управление объявлениями
        </h3>
        <Button className="bg-accent hover:bg-accent/90">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить объявление
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <Card key={ad.id} className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{ad.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreHorizontal" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem>
                      <Icon name="Edit" className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(ad.id)}
                      className="text-red-400"
                    >
                      <Icon name="Trash2" className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-zinc-400">
                <Badge
                  variant="outline"
                  className="mr-2 border-accent text-accent"
                >
                  {ad.type}
                </Badge>
                {ad.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-accent">
                  {ad.price}
                </span>
                <Badge variant={ad.active ? "default" : "destructive"}>
                  {ad.active ? "Активно" : "Неактивно"}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                Контакт: {ad.contact}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
