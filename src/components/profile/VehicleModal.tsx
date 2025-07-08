import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import ImageUpload from "@/components/ui/ImageUpload";
import { Vehicle } from "@/types/profile";

interface VehicleModalProps {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Partial<Vehicle>) => void;
  onCancel: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  vehicle,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    type: vehicle?.type || "motorcycle",
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    engine: vehicle?.engine || "",
    color: vehicle?.color || "",
    mileage: vehicle?.mileage || 0,
    status: vehicle?.status || "active",
    photo: vehicle?.photo || "/api/placeholder/300/200",
    description: vehicle?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {vehicle ? "Редактировать транспорт" : "Добавить транспорт"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Тип транспорта</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Vehicle["type"],
                  })
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-sm"
              >
                <option value="motorcycle">Мотоцикл</option>
                <option value="car">Автомобиль</option>
                <option value="scooter">Скутер</option>
                <option value="atv">Квадроцикл</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Vehicle["status"],
                  })
                }
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-sm"
              >
                <option value="active">Активный</option>
                <option value="sold">Продан</option>
                <option value="repair">В ремонте</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Марка</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="Honda, Toyota, BMW..."
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>

            <div>
              <Label htmlFor="model">Модель</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="CBR600RR, Camry, X5..."
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year">Год</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                min="1900"
                max={new Date().getFullYear() + 1}
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>

            <div>
              <Label htmlFor="engine">Двигатель</Label>
              <Input
                id="engine"
                value={formData.engine}
                onChange={(e) =>
                  setFormData({ ...formData, engine: e.target.value })
                }
                placeholder="599cc, 2.0L, 3.0L..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="color">Цвет</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="Красный, Синий, Черный..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mileage">Пробег (км)</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage}
              onChange={(e) =>
                setFormData({ ...formData, mileage: parseInt(e.target.value) })
              }
              min="0"
              placeholder="15000"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="photo">Фотография</Label>
            <ImageUpload
              currentImage={formData.photo}
              onImageChange={(url) => setFormData({ ...formData, photo: url })}
              variant="compact"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Дополнительная информация о транспорте..."
              className="bg-zinc-800 border-zinc-700 min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {vehicle ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
