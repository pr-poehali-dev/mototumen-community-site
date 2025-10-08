import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ContentCard {
  id: string;
  type: 'shop' | 'school' | 'service';
  title: string;
  description: string;
  image?: string;
  contact?: string;
  address?: string;
  isVisible: boolean;
}

const ContentManagement: React.FC<{ onBack: () => void; contentType: 'shop' | 'school' | 'service' }> = ({ onBack, contentType }) => {
  const [cards, setCards] = useState<ContentCard[]>([
    { id: '1', type: contentType, title: 'Пример карточки', description: 'Описание', isVisible: true, contact: '+7 999 123-45-67', address: 'г. Тюмень, ул. Примерная, 1' },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ContentCard | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact: '',
    address: '',
    image: '',
  });

  const getTypeLabel = () => {
    switch (contentType) {
      case 'shop': return 'Магазины';
      case 'school': return 'Мотошколы';
      case 'service': return 'Сервисы';
    }
  };

  const handleCreate = () => {
    const newCard: ContentCard = {
      id: Date.now().toString(),
      type: contentType,
      title: formData.title,
      description: formData.description,
      contact: formData.contact,
      address: formData.address,
      image: formData.image,
      isVisible: true,
    };
    setCards([...cards, newCard]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (card: ContentCard) => {
    setSelectedCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      contact: card.contact || '',
      address: card.address || '',
      image: card.image || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedCard) {
      setCards(cards.map(c => 
        c.id === selectedCard.id 
          ? { ...c, ...formData }
          : c
      ));
      setIsEditDialogOpen(false);
      setSelectedCard(null);
      resetForm();
    }
  };

  const handleToggleVisibility = (id: string) => {
    setCards(cards.map(c => 
      c.id === id ? { ...c, isVisible: !c.isVisible } : c
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту карточку?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', contact: '', address: '', image: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm">
          <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h3 className="text-xl font-bold text-white">{getTypeLabel()}</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="bg-green-600 hover:bg-green-700">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card key={card.id} className={`bg-zinc-800 border-zinc-700 ${!card.isVisible ? 'opacity-50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-white">{card.title}</CardTitle>
                <Badge variant={card.isVisible ? 'default' : 'secondary'}>
                  {card.isVisible ? 'Видна' : 'Скрыта'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-zinc-400 text-sm">{card.description}</p>
              {card.contact && (
                <p className="text-zinc-400 text-sm">
                  <Icon name="Phone" className="h-3 w-3 inline mr-1" />
                  {card.contact}
                </p>
              )}
              {card.address && (
                <p className="text-zinc-400 text-sm">
                  <Icon name="MapPin" className="h-3 w-3 inline mr-1" />
                  {card.address}
                </p>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(card)} className="text-blue-400 hover:bg-blue-900/30">
                  <Icon name="Edit" className="h-4 w-4 mr-1" />
                  Редактировать
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleToggleVisibility(card.id)} className="text-yellow-400 hover:bg-yellow-900/30">
                  <Icon name={card.isVisible ? 'EyeOff' : 'Eye'} className="h-4 w-4 mr-1" />
                  {card.isVisible ? 'Скрыть' : 'Показать'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(card.id)} className="text-red-400 hover:bg-red-900/30">
                  <Icon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать новую карточку</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Заполните информацию для новой карточки
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4 col-span-1">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Название *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Название"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Описание *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Краткое описание"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Контакт</label>
                <Input
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="+7 999 123-45-67"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Адрес</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="г. Тюмень, ул. ..."
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <p className="text-sm text-zinc-400 mb-2">Предпросмотр карточки:</p>
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">{formData.title || 'Название'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-zinc-400 text-sm">{formData.description || 'Описание'}</p>
                  {formData.contact && (
                    <p className="text-zinc-400 text-sm">
                      <Icon name="Phone" className="h-3 w-3 inline mr-1" />
                      {formData.contact}
                    </p>
                  )}
                  {formData.address && (
                    <p className="text-zinc-400 text-sm">
                      <Icon name="MapPin" className="h-3 w-3 inline mr-1" />
                      {formData.address}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              Отмена
            </Button>
            <Button onClick={handleCreate} disabled={!formData.title || !formData.description} className="bg-green-600 hover:bg-green-700">
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать карточку</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Измените информацию карточки
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4 col-span-1">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Название *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Описание *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Контакт</label>
                <Input
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Адрес</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <p className="text-sm text-zinc-400 mb-2">Предпросмотр:</p>
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">{formData.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-zinc-400 text-sm">{formData.description}</p>
                  {formData.contact && (
                    <p className="text-zinc-400 text-sm">
                      <Icon name="Phone" className="h-3 w-3 inline mr-1" />
                      {formData.contact}
                    </p>
                  )}
                  {formData.address && (
                    <p className="text-zinc-400 text-sm">
                      <Icon name="MapPin" className="h-3 w-3 inline mr-1" />
                      {formData.address}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setIsEditDialogOpen(false); setSelectedCard(null); resetForm(); }}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;
