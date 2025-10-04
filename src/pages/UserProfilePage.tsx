import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PROFILE_API = 'https://functions.poehali.dev/f4f5435f-0c34-4d48-9d8e-cf37346b28de';

interface UserProfile {
  id: number;
  name: string;
  username?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  phone?: string;
  created_at: string;
}

interface Vehicle {
  id: number;
  vehicle_type: string;
  brand: string;
  model: string;
  year?: number;
  description?: string;
  is_primary: boolean;
}

const vehicleIcons: Record<string, string> = {
  moto: 'Bike',
  atv: 'Truck',
  snowmobile: 'Snowflake',
  jetski: 'Waves',
  other: 'Wrench',
};

const vehicleLabels: Record<string, string> = {
  moto: '🏍️ Мотоцикл',
  atv: '🚜 Квадроцикл',
  snowmobile: '❄️ Снегоход',
  jetski: '🌊 Гидроцикл',
  other: '🔧 Другое',
};

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token, user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${PROFILE_API}?action=public&user_id=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setVehicles(data.vehicles || []);
        setFriendsCount(data.friends_count || 0);
      } else {
        toast({
          title: "Ошибка",
          description: "Профиль недоступен",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить профиль",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async () => {
    if (!token) {
      toast({
        title: "Требуется авторизация",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${PROFILE_API}?action=friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ friend_id: parseInt(userId!) }),
      });

      if (response.ok) {
        toast({ title: "Заявка отправлена!" });
      } else {
        const data = await response.json();
        toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Icon name="UserX" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">Профиль не найден</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === profile.id;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/users">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Назад к пользователям
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">{profile.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
                  {profile.username && (
                    <p className="text-zinc-400">@{profile.username}</p>
                  )}
                </div>
                {!isOwnProfile && token && (
                  <Button onClick={addFriend} className="bg-accent hover:bg-accent/90">
                    <Icon name="UserPlus" className="h-4 w-4 mr-2" />
                    Добавить в друзья
                  </Button>
                )}
                {isOwnProfile && (
                  <Link to="/profile">
                    <Button variant="outline" className="border-zinc-700">
                      <Icon name="Settings" className="h-4 w-4 mr-2" />
                      Редактировать
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" className="h-4 w-4" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Icon name="Users" className="h-4 w-4" />
                  {friendsCount} друзей
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" className="h-4 w-4" />
                  С {new Date(profile.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {profile.bio && (
                <p className="text-zinc-300 text-sm">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Garage */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Car" className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-white">Гараж</h2>
            <Badge variant="outline" className="border-zinc-600 text-zinc-400">
              {vehicles.length}
            </Badge>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Car" className="h-12 w-12 mx-auto text-zinc-600 mb-3" />
              <p className="text-zinc-500">Гараж пуст</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 relative"
                >
                  {vehicle.is_primary && (
                    <Badge className="absolute top-2 right-2 bg-accent/20 text-accent border-accent/50">
                      Основная
                    </Badge>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={vehicleIcons[vehicle.vehicle_type] || 'Car'} className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-zinc-500 mb-1">
                        {vehicleLabels[vehicle.vehicle_type] || 'Транспорт'}
                      </div>
                      <h3 className="text-white font-semibold">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      {vehicle.year && (
                        <p className="text-sm text-zinc-400">{vehicle.year} год</p>
                      )}
                      {vehicle.description && (
                        <p className="text-sm text-zinc-500 mt-2">{vehicle.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
