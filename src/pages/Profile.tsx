import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { GarageTab } from "@/components/profile/GarageTab";
import { FriendsTab } from "@/components/profile/FriendsTab";

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
  });

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
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({
        phone: editForm.phone,
        bio: editForm.bio,
        location: editForm.location,
      });
      
      toast({
        title: "Профиль обновлен",
        description: "Изменения успешно сохранены",
      });
      
      setIsEditing(false);
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
    <PageLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-4 border-primary">
                      <span className="text-4xl font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {user.email}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "secondary" : "default"}
                    >
                      <Icon name={isEditing ? "X" : "Edit"} className="h-4 w-4 mr-2" />
                      {isEditing ? "Отмена" : "Редактировать"}
                    </Button>
                    
                    <Button onClick={logout} variant="outline">
                      <Icon name="LogOut" className="h-4 w-4 mr-2" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <Icon name="User" className="h-4 w-4 mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="garage">
                <Icon name="Car" className="h-4 w-4 mr-2" />
                Гараж
              </TabsTrigger>
              <TabsTrigger value="friends">
                <Icon name="Users" className="h-4 w-4 mr-2" />
                Друзья
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Icon name="Heart" className="h-4 w-4 mr-2" />
                Избранное ({favorites.length})
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Город</Label>
                    <Input
                      id="location"
                      placeholder="Тюмень"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">О себе</Label>
                    <Textarea
                      id="bio"
                      placeholder="Расскажите о себе..."
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveProfile} disabled={loading}>
                        <Icon name="Check" className="h-4 w-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        onClick={() => {
                          setEditForm({
                            name: user.name,
                            phone: user.phone || "",
                            bio: user.bio || "",
                            location: user.location || "",
                          });
                          setIsEditing(false);
                        }}
                        variant="outline"
                      >
                        Отмена
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Garage Tab */}
            <TabsContent value="garage">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <GarageTab />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Friends Tab */}
            <TabsContent value="friends">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <FriendsTab />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Избранное</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Icon name="Loader2" className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Heart" className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Пока нет избранных элементов</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Добавляйте в избранное магазины, мотошколы и сервисы
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {favorites.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              name={
                                item.item_type === 'shops' ? 'Store' :
                                item.item_type === 'schools' ? 'GraduationCap' :
                                item.item_type === 'services' ? 'Wrench' : 'Heart'
                              }
                              className="h-5 w-5 text-primary"
                            />
                            <div>
                              <p className="font-medium">
                                {item.item_type === 'shops' ? 'Магазин' :
                                 item.item_type === 'schools' ? 'Мотошкола' :
                                 item.item_type === 'services' ? 'Сервис' : 'Элемент'} #{item.item_id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Добавлено: {new Date(item.created_at).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const routes = {
                                shops: '/shop',
                                schools: '/schools',
                                services: '/service',
                              };
                              navigate(routes[item.item_type as keyof typeof routes] || '/');
                            }}
                          >
                            <Icon name="ExternalLink" className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;