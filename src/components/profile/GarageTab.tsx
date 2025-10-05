import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PROFILE_API = 'https://functions.poehali.dev/f4f5435f-0c34-4d48-9d8e-cf37346b28de';

interface Vehicle {
  id: number;
  vehicle_type: string;
  brand: string;
  model: string;
  year?: number;
  photo_url?: string;
  description?: string;
  is_primary: boolean;
}

const vehicleTypes = [
  { value: 'moto', label: '🏍️ Мотоцикл', icon: 'Bike' },
  { value: 'atv', label: '🚜 Квадроцикл', icon: 'Truck' },
  { value: 'snowmobile', label: '❄️ Снегоход', icon: 'Snowflake' },
  { value: 'jetski', label: '🌊 Гидроцикл', icon: 'Waves' },
  { value: 'other', label: '🔧 Другое', icon: 'Wrench' },
];

export const GarageTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: 'moto',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    photo_url: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadVehicles();
    }
  }, [token]);

  const loadVehicles = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${PROFILE_API}?action=garage`, {
        headers: { 'X-Auth-Token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить гараж",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVehicle = async () => {
    if (!token || !newVehicle.brand || !newVehicle.model) {
      toast({
        title: "Ошибка",
        description: "Заполните марку и модель",
        variant: "destructive",
      });
      return;
    }

    try {
      const vehicleData = { ...newVehicle };
      if (photoPreview) {
        vehicleData.photo_url = photoPreview;
      }
      
      const response = await fetch(`${PROFILE_API}?action=garage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        toast({ title: "Техника добавлена!" });
        setIsAddDialogOpen(false);
        setNewVehicle({ vehicle_type: 'moto', brand: '', model: '', year: new Date().getFullYear(), description: '', photo_url: '' });
        setPhotoFile(null);
        setPhotoPreview(null);
        loadVehicles();
      } else {
        toast({ title: "Ошибка", description: "Не удалось добавить", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Проблема с сервером", variant: "destructive" });
    }
  };

  const deleteVehicle = async (vehicleId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${PROFILE_API}?action=garage&vehicle_id=${vehicleId}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token },
      });

      if (response.ok) {
        toast({ title: "Техника удалена" });
        loadVehicles();
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const getVehicleIcon = (type: string) => {
    return vehicleTypes.find(v => v.value === type)?.icon || 'Car';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Мой гараж</h3>
          <p className="text-zinc-400">Техника: {vehicles.length}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить технику
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
            <DialogHeader>
              <DialogTitle>Добавить технику</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Тип</label>
                <Select value={newVehicle.vehicle_type} onValueChange={(v) => setNewVehicle({ ...newVehicle, vehicle_type: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {vehicleTypes.map(vt => (
                      <SelectItem key={vt.value} value={vt.value}>{vt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Марка</label>
                <Input
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  placeholder="Yamaha, Honda..."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Модель</label>
                <Input
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  placeholder="MT-07, CBR600..."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Год</label>
                <Input
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Фото техники</label>
                <div className="mt-2">
                  {photoPreview ? (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                      >
                        <Icon name="X" className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-accent transition-colors">
                      <Icon name="Upload" className="h-8 w-8 text-zinc-500 mb-2" />
                      <span className="text-sm text-zinc-400">Загрузить фото</span>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Описание</label>
                <Textarea
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  placeholder="Расскажи о своей технике..."
                  className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                />
              </div>
              <Button onClick={addVehicle} className="w-full bg-accent hover:bg-accent/90">
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Car" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">Гараж пуст</p>
          <p className="text-sm text-zinc-500 mt-2">Добавь свою первую технику</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-accent transition-colors">
              {vehicle.photo_url && (
                <img src={vehicle.photo_url} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={getVehicleIcon(vehicle.vehicle_type)} className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{vehicle.brand} {vehicle.model}</h4>
                      {vehicle.year && <p className="text-sm text-zinc-400">{vehicle.year} год</p>}
                      {vehicle.description && (
                        <p className="text-sm text-zinc-500 mt-2">{vehicle.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};