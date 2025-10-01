import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id?: number;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  hours: string;
  location: string;
  phone: string;
  website: string;
  services?: string[];
}

const API_URL = "https://functions.poehali.dev/5b8dbbf1-556a-43c8-b39c-e8096eebd5d4";

export const ServicesAdminTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?type=services`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSave = async () => {
    if (!editingService) return;

    try {
      setLoading(true);
      const method = editingService.id ? "PUT" : "POST";
      await fetch(`${API_URL}?type=services`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      
      await loadServices();
      setEditingService(null);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewService = () => {
    setEditingService({
      name: "",
      description: "",
      category: "Мотосервис",
      image: "",
      rating: 0,
      hours: "",
      location: "",
      phone: "",
      website: "",
      services: [],
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Сервисы ({services.length})</h3>
        <Button onClick={handleNewService} className="bg-accent hover:bg-accent/90">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить сервис
        </Button>
      </div>

      {editingService && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingService.id ? "Редактировать" : "Новый"} сервис
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название"
              value={editingService.name}
              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Textarea
              placeholder="Описание"
              value={editingService.description}
              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Категория"
              value={editingService.category}
              onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Время работы"
              value={editingService.hours}
              onChange={(e) => setEditingService({ ...editingService, hours: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Местоположение"
              value={editingService.location}
              onChange={(e) => setEditingService({ ...editingService, location: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Телефон"
              value={editingService.phone}
              onChange={(e) => setEditingService({ ...editingService, phone: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Icon name="Save" className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setEditingService(null)} variant="outline">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading && services.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Загрузка...</p>
        ) : services.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Нет сервисов</p>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{service.name}</h4>
                    <p className="text-sm text-zinc-400">{service.category}</p>
                    <p className="text-sm text-zinc-500 mt-1">{service.location}</p>
                  </div>
                  <Button
                    onClick={() => setEditingService(service)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-zinc-700"
                  >
                    <Icon name="Edit" className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
