import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GarageTab } from "@/components/profile/GarageTab";
import { FriendsTab } from "@/components/profile/FriendsTab";
import { getRoleEmoji } from "@/components/admin/RoleBadge";

const PROFILE_API = 'https://functions.poehali.dev/f4f5435f-0c34-4d48-9d8e-cf37346b28de';

interface FavoriteItem {
  item_type: string;
  item_id: number;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activities] = useState<ActivityItem[]>([
    { id: '1', type: 'event', description: 'Участвовал в мотопробеге "Весенний старт"', timestamp: '2 дня назад' },
    { id: '2', type: 'profile', description: 'Обновил фото профиля', timestamp: '5 дней назад' },
    { id: '3', type: 'garage', description: 'Добавил мотоцикл в гараж', timestamp: '1 неделя назад' },
  ]);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    avatar_url: user?.avatar_url || "",
    gender: user?.gender || "male",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(PROFILE_API, {
        headers: {
          'X-Auth-Token': token,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        
        setEditForm({
          name: data.profile.name || user?.name || "",
          phone: data.profile.phone || "",
          bio: data.profile.bio || "",
          location: data.profile.location || "",
          avatar_url: data.profile.avatar_url || "",
          gender: data.profile.gender || "male",
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDefaultAvatar = (gender: string) => {
    return gender === 'female' 
      ? '/img/323010ec-ee00-4bf5-b69e-88189dbc69e9.jpg'
      : '/img/5732fd0a-94d2-4175-8e07-8d3c8aed2373.jpg';
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updates: any = {
        phone: editForm.phone,
        bio: editForm.bio,
        location: editForm.location,
        gender: editForm.gender,
      };
      
      if (avatarPreview) {
        updates.avatar_url = avatarPreview;
      }
      
      await updateProfile(updates);
      
      toast({
        title: "Профиль обновлен",
        description: "Изменения успешно сохранены",
      });
      
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      await loadProfile();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <Icon name="ArrowLeft" className="mr-2 md:mr-2" size={24} />
            <span className="hidden md:inline">Назад</span>
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-dark-800 border-dark-700 w-full justify-start gap-2">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-dark-700 data-[state=active]:text-white text-gray-400"
              >
                Профиль
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-dark-700 data-[state=active]:text-white text-gray-400"
              >
                Активность
              </TabsTrigger>
              <TabsTrigger 
                value="garage" 
                className="data-[state=active]:bg-dark-700 data-[state=active]:text-white text-gray-400"
              >
                Гараж
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-0">
              <Card className="bg-dark-800 border-dark-700">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative group flex-shrink-0">
                      <img
                        src={avatarPreview || user.avatar_url || getDefaultAvatar(editForm.gender)}
                        alt={user.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      {isEditing && (
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon name="Camera" className="h-6 w-6 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-1 font-['Oswald']">
                            {user.name}{getRoleEmoji(user.role || 'user')}
                          </h1>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent/80"
                        >
                          <Icon name={isEditing ? "X" : "Edit"} className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-6 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{favorites.length}</div>
                          <div className="text-xs text-gray-400">Избранное</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">12</div>
                          <div className="text-xs text-gray-400">Событий</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">42</div>
                          <div className="text-xs text-gray-400">Друзей</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Icon name="MapPin" className="h-5 w-5 text-accent" />
                      <span>{editForm.location || "Укажите город"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Icon name="Phone" className="h-5 w-5 text-accent" />
                      <span>{editForm.phone || "Добавить телефон"}</span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-4 border-t border-dark-700 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Телефон</Label>
                          <Input
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="bg-dark-900 border-dark-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Город</Label>
                          <Input
                            placeholder="Тюмень"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="bg-dark-900 border-dark-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">О себе</Label>
                        <Textarea
                          placeholder="Расскажите о себе..."
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          className="bg-dark-900 border-dark-700 text-white min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Пол</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={editForm.gender === 'male'}
                              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                              className="text-accent"
                            />
                            <span className="text-gray-300">Мужской</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={editForm.gender === 'female'}
                              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                              className="text-accent"
                            />
                            <span className="text-gray-300">Женский</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="bg-accent hover:bg-accent/90"
                        >
                          {loading ? "Сохранение..." : "Сохранить"}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setAvatarPreview(null);
                          }}
                          variant="outline"
                          className="border-dark-700 text-gray-300 hover:bg-dark-700"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Icon name="LogOut" className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-dark-800 border-dark-700">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 font-['Oswald']">
                      Последняя активность
                    </h3>
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-dark-700 last:border-0">
                          <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">{activity.description}</p>
                            <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dark-800 border-dark-700">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 font-['Oswald']">
                      Статистика
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Мероприятий посещено</span>
                        <span className="text-2xl font-bold text-accent">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Маршрутов пройдено</span>
                        <span className="text-2xl font-bold text-accent">8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Друзей добавлено</span>
                        <span className="text-2xl font-bold text-accent">42</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="garage">
              <GarageTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
