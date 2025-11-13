import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

const CATEGORIES = [
  'Магазин мототехники',
  'Сервис',
  'Школа',
  'Мотоклуб',
  'Прокат',
  'Туристический центр',
  'Другое'
];

export const OrganizationTab: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, [token]);

  const loadOrganizations = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${ORG_API}?action=my-organizations`, {
        headers: { 'X-Auth-Token': token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
        if (data.organizations && data.organizations.length > 0) {
          loadOrganizationShops(data.organizations[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizationShops = async (org: any) => {
    if (!token) return;
    
    try {
      setSelectedOrg(org);
      
      const response = await fetch(`${ORG_API}?action=organization-shops&orgId=${org.id}`, {
        headers: { 'X-Auth-Token': token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setShops(data.shops || []);
      }
    } catch (error) {
      console.error('Failed to load shops:', error);
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
        await loadOrganizationShops(selectedOrg);
        setEditingShop(null);
        setShowForm(false);
        toast({
          title: 'Успешно',
          description: editingShop.id ? 'Карточка обновлена' : 'Карточка создана'
        });
      }
    } catch (error) {
      console.error('Failed to save shop:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить карточку',
        variant: 'destructive'
      });
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
        await loadOrganizationShops(selectedOrg);
        toast({
          title: 'Успешно',
          description: 'Карточка удалена'
        });
      }
    } catch (error) {
      console.error('Failed to delete shop:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить карточку',
        variant: 'destructive'
      });
    }
  };

  const startNewShop = () => {
    if (!selectedOrg) return;
    setEditingShop({
      organization_id: selectedOrg.id,
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

  const startEditShop = (shop: Shop) => {
    setEditingShop({ ...shop });
    setShowForm(true);
  };

  if (loading) {
    return (
      <Card className="bg-[#252836] border-[#2a2f43]">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">Загрузка...</p>
        </CardContent>
      </Card>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card className="bg-[#252836] border-[#2a2f43]">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">У вас нет одобренной организации</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {organizations.length > 1 && (
        <Card className="bg-[#252836] border-[#2a2f43]">
          <CardHeader>
            <CardTitle className="text-white">Мои организации</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {organizations.map((org) => (
                <Button
                  key={org.id}
                  variant={selectedOrg?.id === org.id ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => loadOrganizationShops(org)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon name="Building2" size={16} />
                    <span className="font-semibold truncate">{org.organization_name}</span>
                  </div>
                  <span className="text-xs mt-1 opacity-70">{org.organization_type}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedOrg && (
        <>
          <Card className="bg-[#252836] border-[#2a2f43]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon name="Building2" size={20} />
                {selectedOrg.organization_name}
              </CardTitle>
              <p className="text-sm text-gray-400 mt-2">{selectedOrg.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                <div>
                  <span className="font-medium text-white">Адрес:</span> {selectedOrg.address}
                </div>
                <div>
                  <span className="font-medium text-white">Телефон:</span> {selectedOrg.phone}
                </div>
                <div>
                  <span className="font-medium text-white">Email:</span> {selectedOrg.email}
                </div>
                {selectedOrg.working_hours && (
                  <div>
                    <span className="font-medium text-white">Часы работы:</span> {selectedOrg.working_hours}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#252836] border-[#2a2f43]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Карточки магазинов</CardTitle>
                <Button onClick={startNewShop} size="sm">
                  <Icon name="Plus" className="mr-2" size={14} />
                  Добавить карточку
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {shops.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  Нет добавленных карточек магазинов
                </p>
              ) : (
                <div className="grid gap-4">
                  {shops.map((shop) => (
                    <Card key={shop.id} className="bg-[#1e2332] border-[#2a2f43]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-white truncate">{shop.name}</h3>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{shop.description}</p>
                            <div className="mt-3 space-y-1 text-sm text-gray-300">
                              <p className="flex items-start gap-2">
                                <Icon name="MapPin" className="flex-shrink-0 mt-0.5" size={14} />
                                <span>{shop.address}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Icon name="Phone" size={14} />
                                <span>{shop.phone}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Icon name="Mail" size={14} />
                                <span>{shop.email}</span>
                              </p>
                              {shop.website && (
                                <p className="flex items-center gap-2">
                                  <Icon name="Globe" size={14} />
                                  <span>{shop.website}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditShop(shop)}
                            >
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => shop.id && handleDeleteShop(shop.id)}
                              className="text-red-400 hover:text-red-300"
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
        </>
      )}

      {showForm && editingShop && (
        <Card className="bg-[#252836] border-[#2a2f43]">
          <CardHeader>
            <CardTitle className="text-white">
              {editingShop.id ? 'Редактировать карточку' : 'Новая карточка'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveShop} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Название</label>
                <Input
                  required
                  value={editingShop.name}
                  onChange={(e) => setEditingShop({ ...editingShop, name: e.target.value })}
                  placeholder="Название магазина"
                  className="bg-[#1e2332] border-[#2a2f43] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Описание</label>
                <Textarea
                  required
                  value={editingShop.description}
                  onChange={(e) => setEditingShop({ ...editingShop, description: e.target.value })}
                  placeholder="Краткое описание"
                  className="bg-[#1e2332] border-[#2a2f43] text-white min-h-[80px]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Категория</label>
                <Select
                  value={editingShop.category}
                  onValueChange={(value) => setEditingShop({ ...editingShop, category: value })}
                >
                  <SelectTrigger className="bg-[#1e2332] border-[#2a2f43] text-white">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Адрес</label>
                <Input
                  required
                  value={editingShop.address}
                  onChange={(e) => setEditingShop({ ...editingShop, address: e.target.value })}
                  placeholder="Улица, дом"
                  className="bg-[#1e2332] border-[#2a2f43] text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Телефон</label>
                  <Input
                    required
                    type="tel"
                    value={editingShop.phone}
                    onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                    className="bg-[#1e2332] border-[#2a2f43] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <Input
                    required
                    type="email"
                    value={editingShop.email}
                    onChange={(e) => setEditingShop({ ...editingShop, email: e.target.value })}
                    placeholder="info@example.com"
                    className="bg-[#1e2332] border-[#2a2f43] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Сайт (необязательно)</label>
                <Input
                  value={editingShop.website || ''}
                  onChange={(e) => setEditingShop({ ...editingShop, website: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-[#1e2332] border-[#2a2f43] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Часы работы (необязательно)</label>
                <Input
                  value={editingShop.working_hours || ''}
                  onChange={(e) => setEditingShop({ ...editingShop, working_hours: e.target.value })}
                  placeholder="Пн-Пт: 9:00-18:00"
                  className="bg-[#1e2332] border-[#2a2f43] text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  <Icon name="Check" size={16} className="mr-2" />
                  {editingShop.id ? 'Сохранить' : 'Создать'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingShop(null);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
