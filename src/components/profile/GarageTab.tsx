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
import { useMediaUpload } from "@/hooks/useMediaUpload";

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
  mileage?: number;
  modifications?: string;
  power_hp?: number;
  displacement?: number;
}

const vehicleTypes = [
  { value: 'moto', label: '🏍️ Мотоцикл', icon: 'Bike' },
  { value: 'atv', label: '🚜 Квадроцикл', icon: 'Truck' },
  { value: 'snowmobile', label: '❄️ Снегоход', icon: 'Snowflake' },
  { value: 'jetski', label: '🌊 Гидроцикл', icon: 'Waves' },
  { value: 'other', label: '🔧 Другое', icon: 'Wrench' },
];

interface GarageTabProps {
  vehicles?: Vehicle[];
  onRefresh?: () => void;
  readonly?: boolean;
}

export const GarageTab: React.FC<GarageTabProps> = ({ vehicles: propVehicles, onRefresh, readonly = false }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(propVehicles || []);
  const [loading, setLoading] = useState(!propVehicles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const { uploadFile, uploading } = useMediaUpload();

  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: 'moto',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    photo_url: '',
    mileage: 0,
    modifications: '',
    power_hp: 0,
    displacement: 0,
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [showAdditional, setShowAdditional] = useState(false);

  useEffect(() => {
    if (propVehicles) {
      setVehicles(propVehicles);
      setLoading(false);
    } else if (token) {
      loadVehicles();
    }
  }, [token, propVehicles]);

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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const totalPhotos = photoFiles.length + files.length;
      const availableSlots = 5 - photoFiles.length;
      
      if (totalPhotos > 5) {
        toast({
          title: "Превышен лимит фото",
          description: `Можно загрузить максимум 5 фото. Добавлено ${availableSlots} из ${files.length} выбранных.`,
          variant: "destructive",
        });
      }
      
      const filesToAdd = files.slice(0, availableSlots);
      const newFiles = [...photoFiles, ...filesToAdd];
      setPhotoFiles(newFiles);
      
      const readers = filesToAdd.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        setPhotoPreviews([...photoPreviews, ...results]);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
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
      
      if (photoFiles.length > 0) {
        const uploadPromises = photoFiles.map(file => 
          uploadFile(file, { folder: 'garage' })
        );
        
        const uploadResults = await Promise.all(uploadPromises);
        const uploadedUrls = uploadResults
          .filter(result => result !== null)
          .map(result => result!.url);
        
        if (uploadedUrls.length > 0) {
          vehicleData.photo_url = uploadedUrls;
        }
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
        setNewVehicle({ vehicle_type: 'moto', brand: '', model: '', year: new Date().getFullYear(), description: '', photo_url: '', mileage: 0, modifications: '', power_hp: 0, displacement: 0 });
        setPhotoFiles([]);
        setPhotoPreviews([]);
        onRefresh ? onRefresh() : loadVehicles();
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
        onRefresh ? onRefresh() : loadVehicles();
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
          <h3 className="text-xl font-bold text-white">{readonly ? 'Гараж' : 'Мой гараж'}</h3>
          <p className="text-zinc-400">Техника: {vehicles.length}</p>
        </div>
        {!readonly && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить технику
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-h-[85vh] overflow-y-auto">
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
                <label className="text-sm text-zinc-400">
                  Фото техники 
                  <span className="text-xs text-zinc-500 ml-2">(максимум 5 фото за раз)</span>
                </label>
                <div className="mt-2 space-y-2">
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removePhoto(index)}
                          >
                            <Icon name="X" className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {photoPreviews.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-accent transition-colors">
                      <Icon name="Upload" className="h-8 w-8 text-zinc-500 mb-2" />
                      <span className="text-sm text-zinc-400">Загрузить фото ({photoPreviews.length}/5)</span>
                      <span className="text-xs text-zinc-600 mt-1">Можно выбрать несколько файлов</span>
                      <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                    </label>
                  )}
                  {photoPreviews.length === 5 && (
                    <div className="text-center py-2 text-xs text-zinc-500 bg-zinc-800 rounded-lg">
                      Достигнут лимит (5/5). Удалите фото, чтобы добавить новое.
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400">Объем (куб.см)</label>
                  <Input
                    type="number"
                    value={newVehicle.displacement || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, displacement: parseInt(e.target.value) || 0 })}
                    placeholder="600"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Мощность (л.с.)</label>
                  <Input
                    type="number"
                    value={newVehicle.power_hp || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, power_hp: parseInt(e.target.value) || 0 })}
                    placeholder="75"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdditional(!showAdditional)}
                className="w-full justify-between text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <span>Дополнительно</span>
                <Icon name={showAdditional ? "ChevronUp" : "ChevronDown"} className="h-4 w-4" />
              </Button>
              
              {showAdditional && (
                <div className="space-y-4 pt-2 border-t border-zinc-800">
                  <div>
                    <label className="text-sm text-zinc-400">Пробег (км)</label>
                    <Input
                      type="number"
                      value={newVehicle.mileage || ''}
                      onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) || 0 })}
                      placeholder="15000"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">Модификации / Тюнинг</label>
                    <Textarea
                      value={newVehicle.modifications}
                      onChange={(e) => setNewVehicle({ ...newVehicle, modifications: e.target.value })}
                      placeholder="Выхлоп Akrapovic, фильтр K&N..."
                      className="bg-zinc-800 border-zinc-700 min-h-[60px]"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm text-zinc-400">Описание</label>
                <Textarea
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  placeholder="Расскажи о своей технике..."
                  className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                />
              </div>
              <Button 
                onClick={addVehicle} 
                disabled={uploading}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {uploading ? (
                  <>
                    <Icon name="Loader" className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : "Добавить"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Car" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">Гараж пуст</p>
          <p className="text-sm text-zinc-500 mt-2">Добавь свою первую технику</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-accent transition-colors aspect-square flex flex-col">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </Button>
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
          ))}
        </div>
      )}
    </div>
  );
};