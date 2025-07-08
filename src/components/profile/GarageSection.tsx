import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Vehicle } from "@/types/profile";
import VehicleCard from "./VehicleCard";
import VehicleModal from "./VehicleModal";

interface GarageSectionProps {
  vehicles: Vehicle[];
  mainVehicleId: string;
  onVehicleUpdate: (vehicles: Vehicle[]) => void;
  onMainVehicleChange: (vehicleId: string) => void;
}

const GarageSection: React.FC<GarageSectionProps> = ({
  vehicles,
  mainVehicleId,
  onVehicleUpdate,
  onMainVehicleChange,
}) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const newVehicles = vehicles.filter((v) => v.id !== vehicleId);
    onVehicleUpdate(newVehicles);

    if (mainVehicleId === vehicleId) {
      onMainVehicleChange(newVehicles.length > 0 ? newVehicles[0].id : "");
    }
  };

  const handleSetMainVehicle = (vehicleId: string) => {
    onMainVehicleChange(vehicleId);
  };

  const handleSaveVehicle = (vehicleData: Partial<Vehicle>) => {
    if (editingVehicle) {
      // Редактирование существующего
      const newVehicles = vehicles.map((v) =>
        v.id === editingVehicle.id ? { ...v, ...vehicleData } : v,
      );
      onVehicleUpdate(newVehicles);
      setEditingVehicle(null);
    } else {
      // Добавление нового
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        type: vehicleData.type || "motorcycle",
        brand: vehicleData.brand || "",
        model: vehicleData.model || "",
        year: vehicleData.year || new Date().getFullYear(),
        engine: vehicleData.engine || "",
        color: vehicleData.color || "",
        mileage: vehicleData.mileage || 0,
        status: vehicleData.status || "active",
        photo: vehicleData.photo || "/api/placeholder/300/200",
        description: vehicleData.description || "",
        createdAt: new Date().toISOString().split("T")[0],
      };

      const newVehicles = [...vehicles, newVehicle];
      onVehicleUpdate(newVehicles);

      // Если это первый транспорт, делаем его основным
      if (vehicles.length === 0) {
        onMainVehicleChange(newVehicle.id);
      }

      setIsAddingVehicle(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">Мой гараж</h3>
          <p className="text-sm text-zinc-400">Управление вашим транспортом</p>
        </div>
        <Button
          onClick={() => setIsAddingVehicle(true)}
          className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
        >
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить транспорт
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Icon name="Car" className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <p className="text-zinc-400 mb-4">
            В вашем гараже пока нет транспорта
          </p>
          <Button
            onClick={() => setIsAddingVehicle(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Добавить первый транспорт
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isMain={vehicle.id === mainVehicleId}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              onSetMain={handleSetMainVehicle}
            />
          ))}
        </div>
      )}

      {/* Модальное окно для добавления/редактирования */}
      {(isAddingVehicle || editingVehicle) && (
        <VehicleModal
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onCancel={() => {
            setIsAddingVehicle(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default GarageSection;
