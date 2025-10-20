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
  address: string;
  phone: string;
  email: string;
  website?: string;
  working_hours?: string;
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
      address: '',
      phone: '',
      email: ''
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
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Building2" size={24} />
            {organization.organization_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{organization.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Карточки магазинов</CardTitle>
            <Button onClick={startNewShop}>
              <Icon name="Plus" className="mr-2" size={16} />
              Добавить карточку
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {shops.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Нет добавленных карточек магазинов
            </p>
          ) : (
            <div className="grid gap-4">
              {shops.map((shop) => (
                <Card key={shop.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{shop.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{shop.description}</p>
                        <div className="mt-3 space-y-1 text-sm">
                          <p><Icon name="MapPin" className="inline mr-2" size={14} />{shop.address}</p>
                          <p><Icon name="Phone" className="inline mr-2" size={14} />{shop.phone}</p>
                          <p><Icon name="Mail" className="inline mr-2" size={14} />{shop.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingShop(shop);
                            setShowForm(true);
                          }}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:text-red-500"
                          onClick={() => shop.id && handleDeleteShop(shop.id)}
                        >
                          <Icon name="Trash2" size={16} />
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
          <CardHeader>
            <CardTitle>{editingShop.id ? 'Редактировать' : 'Создать'} карточку магазина</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveShop} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={editingShop.name}
                  onChange={(e) => setEditingShop({ ...editingShop, name: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Телефон</label>
                  <Input
                    value={editingShop.phone}
                    onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Сайт (необязательно)</label>
                  <Input
                    value={editingShop.website || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, website: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Часы работы</label>
                  <Input
                    value={editingShop.working_hours || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, working_hours: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingShop(null);
                    setShowForm(false);
                  }}
                >
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
