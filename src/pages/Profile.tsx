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
import { FriendsTab } from "@/components/profile/FriendsTab";
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
  const [profileData, setProfileData] = useState<any>(null);
  
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
        setProfileData(data);
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
              Профиль
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-300 data-[state=active]:text-gray-200 text-gray-500 rounded-none pb-2 px-4"
            >
              Избранное
            </TabsTrigger>
            <TabsTrigger 
              value="garage" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-300 data-[state=active]:text-gray-200 text-gray-500 rounded-none pb-2 px-4"
            >
              Гараж
            </TabsTrigger>
            <TabsTrigger 
              value="friends" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-gray-300 data-[state=active]:text-gray-200 text-gray-500 rounded-none pb-2 px-4"
            >
              Друзья
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
                      <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide">
                        Участник с {profileData?.profile?.created_at ? new Date(profileData.profile.created_at).toLocaleDateString('ru-RU') : ''}
                      </p>
                      <h1 className="text-2xl font-semibold text-white mb-1">
                        {user.name}{getRoleEmoji(user.role || 'user')}
                      </h1>
                      <p className="text-sm text-gray-400">{editForm.location || 'Город не указан'}</p>
                    </div>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        className="bg-[#ea4c89] hover:bg-[#ea4c89]/90 text-white text-xs h-8"
                      >
                        <Icon name="Edit" className="h-3 w-3 mr-1" />
                        Редактировать
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarPreview(null);
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 text-xs h-8"
                      >
                        <Icon name="X" className="h-3 w-3 mr-1" />
                        Отмена
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="flex items-center gap-3">
                      <Icon name="MapPin" className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Город</p>
                        <p className="text-sm text-gray-300">{editForm.location || 'Не указан'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Phone" className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Телефон</p>
                        <p className="text-sm text-gray-300">{editForm.phone || 'Не указан'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Mail" className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-300 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {editForm.bio && !isEditing && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-300">{editForm.bio}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-2xl font-bold text-white">{favorites.length}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">Избранное</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{profileData?.vehicles?.length || 0}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">В гараже</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{profileData?.friends?.length || 0}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">Друзей</div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 pt-6 border-t border-[#2a2e3f]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Имя</Label>
                      <Input
                        placeholder="Ваше имя"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        disabled
                        className="bg-[#1e2332] border-[#2a2e3f] text-gray-500"
                      />
                    </div>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Город</Label>
                      <Input
                        placeholder="Тюмень"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="bg-[#1e2332] border-[#2a2e3f] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Пол</Label>
                      <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={editForm.gender === 'male'}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                            className="text-accent"
                          />
                          <span className="text-gray-300 text-sm">Мужской</span>
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
                          <span className="text-gray-300 text-sm">Женский</span>
                        </label>
                      </div>
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
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarPreview(null);
                      }}
                      variant="outline"
                      className="border-[#2a2e3f] text-gray-400 hover:bg-[#2a2e3f]"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
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

          <TabsContent value="favorites" className="mt-0">
            <div className="bg-[#252836] rounded-lg p-6">
              <h3 className="text-white font-semibold mb-6">Избранное</h3>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Heart" className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">У вас пока нет избранного</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1e2332] rounded">
                      <div>
                        <p className="text-white text-sm">{item.item_type}</p>
                        <p className="text-gray-500 text-xs">ID: {item.item_id}</p>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="garage" className="mt-0">
            <GarageTab />
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <FriendsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
