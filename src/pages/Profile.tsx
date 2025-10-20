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
import { CallsignPlate } from "@/components/profile/CallsignPlate";

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
  const [activeTab, setActiveTab] = useState("profile");
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    avatar_url: user?.avatar_url || "",
    gender: user?.gender || "male",
    callsign: user?.callsign || "",
    telegram: user?.telegram || "",
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
        setPendingFriendRequests(data.pending_friend_requests || 0);
        
        setEditForm({
          name: data.profile.name || user?.name || "",
          phone: data.profile.phone || "",
          bio: data.profile.bio || "",
          location: data.profile.location || "",
          avatar_url: data.profile.avatar_url || "",
          gender: data.profile.gender || "male",
          callsign: data.profile.callsign || "",
          telegram: data.profile.telegram || data.profile.telegram_username || "",
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
        callsign: editForm.callsign,
        telegram: editForm.telegram,
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
            onClick={() => {
              if (activeTab !== "profile") {
                setActiveTab("profile");
              } else {
                window.history.length > 1 ? navigate(-1) : navigate('/');
              }
            }}
            className="text-gray-400 hover:text-white"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">

          <TabsContent value="profile" className="mt-0">
            <div className="bg-[#252836] rounded-lg overflow-hidden">
              <div className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                  <div className="relative group flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={avatarPreview || user.avatar_url || getDefaultAvatar(editForm.gender)}
                      alt={user.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover"
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

                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-3 gap-3">
                      <div className="w-full">
                        <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide">
                          Участник с {profileData?.profile?.created_at ? new Date(profileData.profile.created_at).toLocaleDateString('ru-RU') : ''}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                          <h1 className="text-xl sm:text-2xl font-semibold text-white">
                            {user.name}{getRoleEmoji(user.role || 'user')}
                          </h1>
                          {editForm.callsign && (
                            <CallsignPlate callsign={editForm.callsign} region="72" size="sm" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{editForm.location || 'Не указан'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{editForm.phone || 'Не указан'}</span>
                      </div>
                      {editForm.telegram && (
                        <Button
                          onClick={() => window.open(`https://t.me/${editForm.telegram}`, '_blank')}
                          size="sm"
                          className="bg-[#4a9eff] hover:bg-[#4a9eff]/90 text-white h-8 gap-1"
                        >
                          <Icon name="MessageCircle" className="h-3 w-3" />
                          Написать
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {!isEditing ? (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setIsEditing(true)}
                      size="sm"
                      className="bg-[#ea4c89] hover:bg-[#ea4c89]/90 text-white text-xs h-8 w-full sm:w-auto"
                    >
                      <Icon name="Edit" className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Редактировать профиль</span>
                      <span className="sm:hidden">Редактировать</span>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-[#2a2e3f]">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Позывной</Label>
                        <Input
                          placeholder="RIDER"
                          value={editForm.callsign}
                          onChange={(e) => setEditForm({ ...editForm, callsign: e.target.value.toUpperCase() })}
                          maxLength={10}
                          className="bg-[#1e2332] border-[#2a2e3f] text-white uppercase"
                        />
                        {editForm.callsign && (
                          <div className="pt-2">
                            <p className="text-gray-500 text-xs mb-2">Предпросмотр:</p>
                            <CallsignPlate callsign={editForm.callsign} region="72" size="md" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Telegram (без @)</Label>
                        <Input
                          placeholder="username"
                          value={editForm.telegram}
                          onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value.replace('@', '') })}
                          className="bg-[#1e2332] border-[#2a2e3f] text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <Label className="text-gray-400 text-xs">Пол</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={editForm.gender === 'male'}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
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
                          />
                          <span className="text-gray-300 text-sm">Женский</span>
                        </label>
                      </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-[#2a2e3f]">
                <div className="p-3 sm:p-6 border-r-0 lg:border-r border-[#2a2e3f]">
                  <h3 className="text-white font-semibold mb-4">Последняя активность</h3>
                  <div className="space-y-3">
                    {profileData?.recent_activity && profileData.recent_activity.length > 0 ? (
                      profileData.recent_activity.map((activity: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                          <span className="text-gray-500 text-xs flex-shrink-0 w-20">
                            {new Date(activity.created_at).toLocaleDateString('ru-RU')}
                          </span>
                          <div className="flex items-start gap-2 flex-1">
                            <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5" />
                            <p className="text-gray-300 text-sm">{activity.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Нет активности</p>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-6 border-t lg:border-t-0 border-[#2a2e3f]">
                  <div className="space-y-4">
                    <button
                      onClick={() => setActiveTab("favorites")}
                      className="w-full bg-[#3d4253] hover:bg-[#4a5266] rounded p-4 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <p className="text-gray-300 text-sm">Избранное</p>
                      <span className="text-white font-bold text-2xl">{profileData?.favorites_count || 0}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("garage")}
                      className="w-full bg-[#3d4253] hover:bg-[#4a5266] rounded p-4 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <p className="text-gray-300 text-sm">Гараж</p>
                      <span className="text-white font-bold text-2xl">{profileData?.vehicles_count || 0}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("friends")}
                      className="w-full bg-[#3d4253] hover:bg-[#4a5266] rounded p-4 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <p className="text-gray-300 text-sm">Друзья</p>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-2xl">{profileData?.friends_count || 0}</span>
                        {pendingFriendRequests > 0 && (
                          <span className="text-red-500 font-bold text-xl">+{pendingFriendRequests}</span>
                        )}
                      </div>
                    </button>
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