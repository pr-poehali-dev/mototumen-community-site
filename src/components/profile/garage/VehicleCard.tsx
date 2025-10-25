import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Vehicle } from "./types";

interface VehicleCardProps {
  vehicle: Vehicle;
  readonly: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: number) => void;
  getVehicleIcon: (type: string) => string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  readonly,
  onEdit,
  onDelete,
  getVehicleIcon,
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-accent transition-colors aspect-square flex flex-col">
      <div className="relative w-full h-2/3">
        {vehicle.photo_url && (() => {
          try {
            const photos = typeof vehicle.photo_url === 'string' ? JSON.parse(vehicle.photo_url) : vehicle.photo_url;
            return photos.length > 0 ? (
              <img src={photos[0]} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <Icon name={getVehicleIcon(vehicle.vehicle_type)} className="h-12 w-12 text-zinc-600" />
              </div>
            );
          } catch {
            return (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <Icon name={getVehicleIcon(vehicle.vehicle_type)} className="h-12 w-12 text-zinc-600" />
              </div>
            );
          }
        })()}
        {!readonly && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
              >
                <Icon name="MoreVertical" className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
              <DropdownMenuItem 
                onClick={() => onEdit(vehicle)}
                className="text-white cursor-pointer"
              >
                <Icon name="Edit" className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(vehicle.id)}
                className="text-red-400 cursor-pointer focus:text-red-300"
              >
                <Icon name="Trash2" className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="text-white font-semibold text-sm leading-tight">{vehicle.brand} {vehicle.model}</h4>
        {vehicle.year && <p className="text-xs text-zinc-400">{vehicle.year}</p>}
        
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {vehicle.displacement && (
            <span className="text-xs bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded">{vehicle.displacement} см³</span>
          )}
          {vehicle.power_hp && (
            <span className="text-xs bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded">{vehicle.power_hp} л.с.</span>
          )}
        </div>
      </div>
    </div>
  );
};
