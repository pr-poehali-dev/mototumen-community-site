import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { Service } from "../types";
import { ServiceForm } from "../forms/ServiceForm";

interface ServicesTabProps {
  services: Service[];
  onSave: (service: Service) => void;
  onDelete: (id: string) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onSave,
  onDelete,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (service: Service) => {
    onSave(service);
    setEditingService(null);
    setIsModalOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Управление услугами
        </h3>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAdd}
              className="bg-accent hover:bg-accent/90"
            >
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить услугу
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingService ? "Редактировать" : "Добавить"} услугу
              </DialogTitle>
            </DialogHeader>
            <ServiceForm
              service={editingService || undefined}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Icon
                      name={service.icon as any}
                      className="h-5 w-5 text-accent"
                    />
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreHorizontal" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem onClick={() => handleEdit(service)}>
                      <Icon name="Edit" className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(service.id)}
                      className="text-red-400"
                    >
                      <Icon name="Trash2" className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-zinc-400">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-accent">
                    ₽{service.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-zinc-400">
                    • {service.duration}
                  </span>
                </div>
                <Badge variant={service.available ? "default" : "destructive"}>
                  {service.available ? "Доступна" : "Недоступна"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
