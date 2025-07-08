import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Vehicle } from "@/types/profile";

interface VehicleCardProps {
  vehicle: Vehicle;
  isMain: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onSetMain: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isMain,
  onEdit,
  onDelete,
  onSetMain,
}) => {
  const getVehicleTypeText = (type: Vehicle["type"]) => {
    switch (type) {
      case "motorcycle":
        return "Мотоцикл";
      case "car":
        return "Автомобиль";
      case "scooter":
        return "Скутер";
      case "atv":
        return "Квадроцикл";
      default:
        return "Транспорт";
    }
  };

  const getVehicleStatusText = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "Активный";
      case "sold":
        return "Продан";
      case "repair":
        return "В ремонте";
      default:
        return "Неизвестно";
    }
  };

  const getVehicleStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "sold":
        return "bg-red-500";
      case "repair":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-lg">
            {vehicle.brand} {vehicle.model}
          </h4>
          {isMain && (
            <Badge className="bg-orange-500 text-white text-xs">Основной</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(vehicle)}
            className="h-8 w-8 p-0"
          >
            <Icon name="Edit" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(vehicle.id)}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
          >
            <Icon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="aspect-video rounded-lg overflow-hidden">
        <img
          src={vehicle.photo}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Тип:</span>
          <span>{getVehicleTypeText(vehicle.type)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Год:</span>
          <span>{vehicle.year}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Двигатель:</span>
          <span>{vehicle.engine}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Цвет:</span>
          <span>{vehicle.color}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Пробег:</span>
          <span>{vehicle.mileage.toLocaleString()} км</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Статус:</span>
          <Badge
            className={`${getVehicleStatusColor(vehicle.status)} text-white text-xs`}
          >
            {getVehicleStatusText(vehicle.status)}
          </Badge>
        </div>
      </div>

      {vehicle.description && (
        <div className="text-sm text-zinc-400 border-t border-zinc-700 pt-2">
          <p>{vehicle.description}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!isMain && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetMain(vehicle.id)}
            className="text-xs"
          >
            <Icon name="Star" className="h-3 w-3 mr-1" />
            Сделать основным
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
