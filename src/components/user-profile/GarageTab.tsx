import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import ImageUpload from "@/components/ui/ImageUpload";

interface Vehicle {
  id: string;
  type: "motorcycle" | "car" | "scooter" | "atv" | "other";
  brand: string;
  model: string;
  year: number;
  engine: string;
  color: string;
  image?: string;
  description?: string;
  isMain: boolean;
  mileage?: number;
  status: "active" | "sold" | "repair";
}

interface GarageTabProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  onUpdateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  onDeleteVehicle: (id: string) => void;
}

export const GarageTab: React.FC<GarageTabProps> = ({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Vehicle, "id">>({
    type: "motorcycle",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    engine: "",
    color: "",
    description: "",
    isMain: false,
    mileage: 0,
    status: "active",
  });

  const vehicleTypes = {
    motorcycle: { label: "Мотоцикл", icon: "Bike" },
    car: { label: "Автомобиль", icon: "Car" },
    scooter: { label: "Скутер", icon: "Bike" },
    atv: { label: "Квадроцикл", icon: "Truck" },
    other: { label: "Другое", icon: "Wrench" },
  };

  const statusLabels = {
    active: { label: "Активный", color: "bg-green-600" },
    sold: { label: "Продан", color: "bg-gray-600" },
    repair: { label: "В ремонте", color: "bg-yellow-600" },
  };

  const handleSubmit = () => {
    if (editingId) {
      onUpdateVehicle(editingId, formData);
      setEditingId(null);
    } else {
      onAddVehicle(formData);
      setIsAdding(false);
    }
    resetForm();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData(vehicle);
    setEditingId(vehicle.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      type: "motorcycle",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      engine: "",
      color: "",
      description: "",
      isMain: false,
      mileage: 0,
      status: "active",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSetMain = (id: string) => {
    vehicles.forEach((vehicle) => {
      onUpdateVehicle(vehicle.id, { isMain: vehicle.id === id });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Мой гараж ({vehicles.length})
          </h3>
          <p className="text-sm text-zinc-400">Управляйте своим транспортом</p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="bg-accent hover:bg-accent/80"
        >
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить транспорт
        </Button>
      </div>

      {/* Форма добавления/редактирования */}
      {isAdding && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? "Редактировать транспорт" : "Добавить транспорт"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Тип транспорта</Label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as Vehicle["type"],
                    }))
                  }
                  className="w-full bg-zinc-900 border border-zinc-600 rounded-md px-3 py-2 text-white"
                >
                  {Object.entries(vehicleTypes).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-zinc-300">Статус</Label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as Vehicle["status"],
                    }))
                  }
                  className="w-full bg-zinc-900 border border-zinc-600 rounded-md px-3 py-2 text-white"
                >
                  {Object.entries(statusLabels).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-zinc-300">Марка</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  placeholder="Honda, Yamaha, BMW..."
                  className="bg-zinc-900 border-zinc-600"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Модель</Label>
                <Input
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, model: e.target.value }))
                  }
                  placeholder="CBR600RR, R1, S1000RR..."
                  className="bg-zinc-900 border-zinc-600"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Год</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      year:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    }))
                  }
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="bg-zinc-900 border-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-zinc-300">Двигатель</Label>
                <Input
                  value={formData.engine}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, engine: e.target.value }))
                  }
                  placeholder="600cc, 1000cc, 125cc..."
                  className="bg-zinc-900 border-zinc-600"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Цвет</Label>
                <Input
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="Красный, Синий, Черный..."
                  className="bg-zinc-900 border-zinc-600"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Пробег (км)</Label>
                <Input
                  type="number"
                  value={formData.mileage || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mileage: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  className="bg-zinc-900 border-zinc-600"
                />
              </div>
            </div>

            <div>
              <Label className="text-zinc-300">Описание</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Дополнительная информация о транспорте..."
                className="bg-zinc-900 border-zinc-600"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-zinc-300 mb-2 block">Фотография</Label>
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) =>
                  setFormData((prev) => ({ ...prev, image: imageUrl }))
                }
                size="md"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isMain"
                checked={formData.isMain}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isMain: e.target.checked }))
                }
                className="rounded"
              />
              <Label htmlFor="isMain" className="text-zinc-300">
                Сделать основным транспортом
              </Label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                className="bg-accent hover:bg-accent/80"
              >
                <Icon name="Save" className="h-4 w-4 mr-2" />
                {editingId ? "Сохранить" : "Добавить"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <Icon name="X" className="h-4 w-4 mr-2" />
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список транспорта */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={`bg-zinc-800 border-zinc-700 ${
              vehicle.isMain ? "ring-2 ring-accent" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    name={vehicleTypes[vehicle.type].icon as any}
                    className="h-5 w-5 text-accent"
                  />
                  <CardTitle className="text-white text-lg">
                    {vehicle.brand} {vehicle.model}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  {vehicle.isMain && (
                    <Badge className="bg-accent text-white">Основной</Badge>
                  )}
                  <Badge
                    className={`${statusLabels[vehicle.status].color} text-white`}
                  >
                    {statusLabels[vehicle.status].label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehicle.image && (
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-zinc-400">Год:</span>
                  <span className="text-white ml-1">{vehicle.year}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Двигатель:</span>
                  <span className="text-white ml-1">{vehicle.engine}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Цвет:</span>
                  <span className="text-white ml-1">{vehicle.color}</span>
                </div>
                {vehicle.mileage && vehicle.mileage > 0 && (
                  <div>
                    <span className="text-zinc-400">Пробег:</span>
                    <span className="text-white ml-1">
                      {vehicle.mileage.toLocaleString()} км
                    </span>
                  </div>
                )}
              </div>

              {vehicle.description && (
                <p className="text-sm text-zinc-400">{vehicle.description}</p>
              )}

              <Separator className="bg-zinc-700" />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(vehicle)}
                  className="flex-1"
                >
                  <Icon name="Edit" className="h-3 w-3 mr-1" />
                  Изменить
                </Button>
                {!vehicle.isMain && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetMain(vehicle.id)}
                    className="flex-1"
                  >
                    <Icon name="Star" className="h-3 w-3 mr-1" />
                    Основной
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteVehicle(vehicle.id)}
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  <Icon name="Trash2" className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && !isAdding && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="py-12 text-center">
            <Icon name="Car" className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Ваш гараж пуст
            </h3>
            <p className="text-zinc-400 mb-4">
              Добавьте свой первый транспорт, чтобы начать вести учет
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-accent hover:bg-accent/80"
            >
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить транспорт
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
