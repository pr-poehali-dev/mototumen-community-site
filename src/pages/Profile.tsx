import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GarageTab } from "@/components/profile/GarageTab";
import { getRoleEmoji } from "@/components/admin/RoleBadge";

const PROFILE_API = 'https://functions.poehali.dev/f4f5435f-0c34-4d48-9d8e-cf37346b28de';

interface FavoriteItem {
  item_type: string;
  item_id: number;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  
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

  const activities = [
    { time: '2 дня назад', text: 'Участвовал в мотопробеге' },
    { time: '1 день назад', text: 'Обновил фото профиля' },
    { time: '6 дней назад', text: 'Добавил мотоцикл в гараж' },
    { time: '20 авг', text: 'Добавил 4 друзей' },
    { time: '14 авг', text: 'Присоединился к сообществу' },
  ];

  return (
    <div className="min-h-screen bg-[#1e2332]">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-0">
          <TabsList className="bg-transparent border-b border-[#2a2e3f] w-full justify-start rounded-none h-auto p-0 mb-6">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-300 data-[state=active]:text-gray-200 text-gray-500 rounded-none pb-2 px-4"
            >
              Our List
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-300 data-[state=active]:text-gray-200 text-gray-500 rounded-none pb-2 px-4"
            >
              My List
            </TabsTrigger>
            <TabsTrigger 
              value="garage" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-300 data-[state=active]:text-gray-200 text-gray-500 rounded-none pb-2 px-4"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <div className="bg-[#252836] rounded-lg p-6 mb-6">
              <div className="flex items-start gap-6">
                <div className="relative group flex-shrink-0">
                  <img
                    src={avatarPreview || user.avatar_url || getDefaultAvatar(editForm.gender)}
                    alt={user.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="Camera" className="h-5 w-5 text-white" />
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
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide">ADDED BY {user.name?.toUpperCase()}</p>
                      <h1 className="text-2xl font-semibold text-white mb-1">
                        {user.name}{getRoleEmoji(user.role || 'user')}
                      </h1>
                      <p className="text-sm text-gray-400">{editForm.location || 'Тюмень'}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      size="sm"
                      className="bg-[#ea4c89] hover:bg-[#ea4c89]/90 text-white text-xs h-8"
                    >
                      <Icon name="Plus" className="h-3 w-3 mr-1" />
                      ADD TO MY LIST
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="flex items-center gap-3">
                      <Icon name="MapPin" className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">{editForm.location || 'Тюмень'}</p>
                        <p className="text-sm text-gray-300">{editForm.phone || '212-710-3232'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Phone" className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-300">{editForm.phone || '212-710-3232'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="MessageCircle" className="h-5 w-5 text-gray-500" />
                      <a href={`mailto:${user.email}`} className="text-sm text-[#4a9eff] hover:underline">
                        Send an email
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-2xl font-bold text-white">{favorites.length}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">RANK</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">723</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">LISTED</div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 pt-6 border-t border-[#2a2e3f]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Телефон</Label>
                      <Input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="bg-[#1e2332] border-[#2a2e3f] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Город</Label>
                      <Input
                        placeholder="Тюмень"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="bg-[#1e2332] border-[#2a2e3f] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label className="text-gray-400 text-xs">О себе</Label>
                    <Textarea
                      placeholder="Расскажите о себе..."
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="bg-[#1e2332] border-[#2a2e3f] text-white min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-[#ea4c89] hover:bg-[#ea4c89]/90"
                    >
                      {loading ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-[#2a2e3f] text-gray-400 hover:bg-[#2a2e3f]"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#252836] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-500 text-xs flex-shrink-0 w-20">{activity.time}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0 mt-1.5" />
                        <p className="text-gray-300 text-sm">{activity.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#252836] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-6">Premium Deals</h3>
                <div className="space-y-3">
                  <div className="bg-[#3d4253] rounded p-4 flex items-center justify-between">
                    <p className="text-gray-300 text-sm flex-1">Скидка на запчасти и аксессуары для мотоциклов</p>
                    <span className="text-white font-bold text-2xl ml-4">899</span>
                  </div>
                  <div className="bg-[#3d4253] rounded p-4 flex items-center justify-between">
                    <p className="text-gray-300 text-sm flex-1">Обслуживание мотоцикла со скидкой</p>
                    <span className="text-white font-bold text-2xl ml-4">269</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Icon name="LogOut" className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <div className="bg-[#252836] rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Моя активность</h3>
              <p className="text-gray-400">Здесь будет ваша личная активность</p>
            </div>
          </TabsContent>

          <TabsContent value="garage" className="mt-0">
            <GarageTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
