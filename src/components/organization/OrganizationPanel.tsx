import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";

interface Shop {
  id?: number;
  organization_id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  phones?: string[];
  email: string;
  website?: string;
  working_hours?: string;
  is_open?: boolean;
  latitude?: number;
  longitude?: number;
  image_url?: string;
}

const ORG_API = 'https://functions.poehali.dev/a4bf4de7-33a4-406c-95cc-0529c16d6677';

export const OrganizationPanel: React.FC = () => {
  const { token, user } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, [token, user]);

  const loadOrganization = async () => {
    if (!token || !user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${ORG_API}?action=my-organization`, {
        headers: { 'X-Auth-Token': token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrganization(data.organization);
        setShops(data.shops || []);
      }
    } catch (error) {
      console.error('Failed to load organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop || !token) return;

    try {
      const method = editingShop.id ? 'PUT' : 'POST';
      const response = await fetch(`${ORG_API}?action=shop`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(editingShop)
      });

      if (response.ok) {
        await loadOrganization();
        setEditingShop(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save shop:', error);
    }
  };

  const handleDeleteShop = async (shopId: number) => {
    if (!token || !confirm('Удалить карточку магазина?')) return;

    try {
      const response = await fetch(`${ORG_API}?action=shop`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ shop_id: shopId })
      });

      if (response.ok) {
        await loadOrganization();
      }
    } catch (error) {
      console.error('Failed to delete shop:', error);
    }
  };

  const startNewShop = () => {
    if (!organization) return;
    setEditingShop({
      organization_id: organization.id,
      name: '',
      description: '',
      category: '',
      address: '',
      phone: '',
      email: '',
      is_open: true
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Загрузка...</div>;
  }

  if (!organization) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">У вас нет одобренной организации</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Icon name="Building2" size={20} />
            {organization.organization_name}
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">{organization.description}</p>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
            <div>
              <span className="font-medium">Адрес:</span> {organization.address}
            </div>
            <div>
              <span className="font-medium">Телефон:</span> {organization.phone}
            </div>
            <div>
              <span className="font-medium">Email:</span> {organization.email}
            </div>
            {organization.working_hours && (
              <div>
                <span className="font-medium">Часы работы:</span> {organization.working_hours}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg md:text-xl">Карточки магазинов</CardTitle>
            <Button onClick={startNewShop} size="sm" className="text-xs md:text-sm">
              <Icon name="Plus" className="mr-1 md:mr-2" size={14} />
              <span className="hidden md:inline">Добавить карточку</span>
              <span className="md:hidden">Добавить</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {shops.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 md:py-8 text-sm">
              Нет добавленных карточек магазинов
            </p>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {shops.map((shop) => (
                <Card key={shop.id}>
                  <CardContent className="p-4 md:pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base md:text-lg truncate">{shop.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{shop.description}</p>
                        <div className="mt-2 md:mt-3 space-y-1 text-xs md:text-sm">
                          <p className="flex items-start gap-2 break-all"><Icon name="MapPin" className="flex-shrink-0 mt-0.5" size={12} /><span>{shop.address}</span></p>
                          <p className="flex items-center gap-2"><Icon name="Phone" className="flex-shrink-0" size={12} />{shop.phone}</p>
                          <p className="flex items-center gap-2 break-all"><Icon name="Mail" className="flex-shrink-0" size={12} />{shop.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setEditingShop(shop);
                            setShowForm(true);
                          }}
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:text-red-500 h-8 w-8 p-0"
                          onClick={() => shop.id && handleDeleteShop(shop.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && editingShop && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">{editingShop.id ? 'Редактировать' : 'Создать'} карточку магазина</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSaveShop} className="space-y-3 md:space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={editingShop.name}
                  onChange={(e) => setEditingShop({ ...editingShop, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Категория</label>
                <Input
                  value={editingShop.category}
                  onChange={(e) => setEditingShop({ ...editingShop, category: e.target.value })}
                  placeholder="Мотомагазин, Сервис, Мотошкола"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  value={editingShop.description}
                  onChange={(e) => setEditingShop({ ...editingShop, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Адрес</label>
                <Input
                  value={editingShop.address}
                  onChange={(e) => setEditingShop({ ...editingShop, address: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-sm font-medium">Телефон</label>
                  <Input
                    value={editingShop.phone}
                    onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
                    placeholder="+79991234567"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editingShop.email}
                    onChange={(e) => setEditingShop({ ...editingShop, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-sm font-medium">Сайт (необязательно)</label>
                  <Input
                    value={editingShop.website || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, website: e.target.value })}
                    placeholder="example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Часы работы</label>
                  <Input
                    value={editingShop.working_hours || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, working_hours: e.target.value })}
                    placeholder="Пн-Пт: 9:00-18:00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-sm font-medium">Широта (необязательно)</label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={editingShop.latitude || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, latitude: parseFloat(e.target.value) })}
                    placeholder="57.153033"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Долгота (необязательно)</label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={editingShop.longitude || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, longitude: parseFloat(e.target.value) })}
                    placeholder="65.534328"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingShop.is_open ?? true}
                    onChange={(e) => setEditingShop({ ...editingShop, is_open: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Открыто сейчас</span>
                </label>
              </div>
              <div className="flex flex-col md:flex-row gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingShop(null);
                    setShowForm(false);
                  }}
                  className="w-full md:w-auto"
                >
                  Отмена
                </Button>
                <Button type="submit" className="w-full md:w-auto">Сохранить</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};