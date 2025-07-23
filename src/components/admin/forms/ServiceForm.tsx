import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "../types";

interface ServiceFormProps {
  service?: Service;
  onSave: (service: Service) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
}) => {
  const [formData, setFormData] = useState<Service>(
    service || {
      id: "",
      title: "",
      description: "",
      price: 0,
      duration: "",
      icon: "Settings",
      available: true,
    },
  );

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Название услуги</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
        <div>
          <Label htmlFor="icon">Иконка</Label>
          <Select
            value={formData.icon}
            onValueChange={(value) => setFormData({ ...formData, icon: value })}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="Settings">Settings</SelectItem>
              <SelectItem value="Search">Search</SelectItem>
              <SelectItem value="Wrench">Wrench</SelectItem>
              <SelectItem value="Cog">Cog</SelectItem>
              <SelectItem value="AlertTriangle">AlertTriangle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="bg-zinc-800 border-zinc-700"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseInt(e.target.value) })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
        <div>
          <Label htmlFor="duration">Длительность</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) =>
            setFormData({ ...formData, available: e.target.checked })
          }
          className="w-4 h-4 text-accent"
        />
        <Label htmlFor="available">Доступна</Label>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-accent hover:bg-accent/90"
      >
        {service ? "Обновить" : "Создать"} услугу
      </Button>
    </div>
  );
};
