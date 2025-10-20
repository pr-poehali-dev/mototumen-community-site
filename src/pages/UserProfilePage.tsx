import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GarageTab } from "@/components/profile/GarageTab";
import { FriendsTab } from "@/components/profile/FriendsTab";
import { getRoleEmoji } from "@/components/admin/RoleBadge";
import { CallsignPlate } from "@/components/profile/CallsignPlate";

const PROFILE_API = 'https://functions.poehali.dev/f4f5435f-0c34-4d48-9d8e-cf37346b28de';

interface UserProfile {
  id: number;
  name: string;
  username?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  phone?: string;
  telegram?: string;
  telegram_username?: string;
  gender?: string;
  callsign?: string;
  role?: string;
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

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
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

      const data = await response.json();
      
      if (response.ok) {
        if (data.message && data.message.includes('ожидаем')) {
          toast({ title: "Заявка уже отправлена", description: "Ожидаем принятие заявки" });
        } else {
          toast({ title: "Заявка отправлена!" });
        }
      } else {
        toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const getDefaultAvatar = (gender?: string) => {
    return gender === 'female' 
      ? '/img/323010ec-ee00-4bf5-b69e-88189dbc69e9.jpg'
      : '/img/5732fd0a-94d2-4175-8e07-8d3c8aed2373.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e2332] flex items-center justify-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-[#ff6b35]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#1e2332] flex items-center justify-center">
        <div className="text-center">
          <Icon name="UserX" className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">Профиль не найден</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === profile.id;
  const telegramUsername = profile.telegram || profile.telegram_username || profile.username;

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
                <div className="flex flex-col items-center sm:items-start mb-6">
                  <div className="relative mb-4">
                    <img
                      src={profile.avatar_url || getDefaultAvatar(profile.gender)}
                      alt={profile.name}
                      className="w-40 h-40 rounded-lg object-cover"
                    />
                  </div>

                  <div className="w-full text-center sm:text-left">
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide">
                      Участник с {new Date(profile.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-4">
                      <h1 className="text-xl sm:text-2xl font-semibold text-white">
                        {profile.name}{getRoleEmoji(profile.role || 'user')}
                      </h1>
                      {profile.callsign && (
                        <CallsignPlate callsign={profile.callsign} region="72" size="sm" />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{profile.location || 'Не указан'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{profile.phone || 'Не указан'}</span>
                      </div>
                      {telegramUsername && (
                        <Button
                          onClick={() => window.open(`https://t.me/${telegramUsername}`, '_blank')}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-[#1e2332]"
                        >
                          <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                          Написать
                        </Button>
                      )}
                    </div>

                    {/* Statistics - clickable */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <button 
                        onClick={() => setActiveTab('friends')}
                        className="bg-[#1e2332] rounded-lg p-3 text-center hover:bg-[#2a2e3f] transition-colors cursor-pointer"
                      >
                        <Icon name="Users" className="h-5 w-5 mx-auto mb-1 text-[#ff6b35]" />
                        <div className="text-xl font-bold text-white">{friendsCount}</div>
                        <div className="text-xs text-gray-500">Друзей</div>
                      </button>
                      <button 
                        onClick={() => setActiveTab('garage')}
                        className="bg-[#1e2332] rounded-lg p-3 text-center hover:bg-[#2a2e3f] transition-colors cursor-pointer"
                      >
                        <Icon name="Car" className="h-5 w-5 mx-auto mb-1 text-[#ff6b35]" />
                        <div className="text-xl font-bold text-white">{vehicles.length}</div>
                        <div className="text-xs text-gray-500">Техника</div>
                      </button>
                      <div className="bg-[#1e2332] rounded-lg p-3 text-center">
                        <Icon name="Calendar" className="h-5 w-5 mx-auto mb-1 text-[#ff6b35]" />
                        <div className="text-xl font-bold text-white">
                          {new Date(profile.created_at).getFullYear()}
                        </div>
                        <div className="text-xs text-gray-500">С нами</div>
                      </div>
                    </div>

                    {!isOwnProfile && token && (
                      <Button
                        onClick={addFriend}
                        className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white w-full"
                        size="sm"
                      >
                        <Icon name="UserPlus" className="h-4 w-4 mr-2" />
                        Добавить в друзья
                      </Button>
                    )}

                    <div className="space-y-3 mt-4">
                      <button
                        onClick={() => setActiveTab("garage")}
                        className="w-full bg-[#3d4253] hover:bg-[#4a5266] rounded-lg p-4 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon name="Car" className="h-5 w-5 text-[#ff6b35]" />
                          <span className="text-gray-300 text-sm">Гараж</span>
                        </div>
                        <span className="text-white font-bold text-2xl">{vehicles.length}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("friends")}
                        className="w-full bg-[#3d4253] hover:bg-[#4a5266] rounded-lg p-4 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon name="Users" className="h-5 w-5 text-[#ff6b35]" />
                          <span className="text-gray-300 text-sm">Друзья</span>
                        </div>
                        <span className="text-white font-bold text-2xl">{friendsCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <TabsList className="w-full justify-start bg-transparent border-t border-gray-700 rounded-none px-4 h-auto py-0">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Обо мне
                </TabsTrigger>
                <TabsTrigger 
                  value="garage" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Гараж ({vehicles.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="friends" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Друзья ({friendsCount})
                </TabsTrigger>
              </TabsList>

              <div className="p-3 sm:p-6">
                {profile.bio ? (
                  <p className="text-gray-300">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500 text-center py-8">Пользователь пока не рассказал о себе</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garage" className="mt-0">
            <div className="bg-[#252836] rounded-lg overflow-hidden">
              <TabsList className="w-full justify-start bg-transparent border-b border-gray-700 rounded-none px-4 h-auto py-0">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Обо мне
                </TabsTrigger>
                <TabsTrigger 
                  value="garage" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Гараж ({vehicles.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="friends" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Друзья ({friendsCount})
                </TabsTrigger>
              </TabsList>
              
              <div className="p-3 sm:p-6">
                <GarageTab 
                  vehicles={vehicles} 
                  onRefresh={loadProfile}
                  readonly={!isOwnProfile}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <div className="bg-[#252836] rounded-lg overflow-hidden">
              <TabsList className="w-full justify-start bg-transparent border-b border-gray-700 rounded-none px-4 h-auto py-0">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Обо мне
                </TabsTrigger>
                <TabsTrigger 
                  value="garage" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Гараж ({vehicles.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="friends" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#ff6b35] rounded-none px-4 py-3 text-gray-400 data-[state=active]:text-white"
                >
                  Друзья ({friendsCount})
                </TabsTrigger>
              </TabsList>
              
              <div className="p-3 sm:p-6">
                <FriendsTab userId={parseInt(userId!)} readonly={!isOwnProfile} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};