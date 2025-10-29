import React from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface FavoriteItem {
  item_type: string;
  item_id: number;
  created_at: string;
}

interface FavoritesSectionProps {
  favorites: FavoriteItem[];
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ favorites }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Мероприятие';
      case 'announcement': return 'Объявление';
      case 'service': return 'Услуга';
      case 'product': return 'Товар';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'announcement': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'service': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'product': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-[#252836] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Heart" className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold text-white">Избранное</h2>
        </div>
        <div className="text-center py-8">
          <Icon name="Heart" className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Список избранного пуст</p>
          <p className="text-sm text-gray-500 mt-1">
            Добавляйте интересные материалы в избранное
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#252836] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Heart" className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-bold text-white">Избранное</h2>
        <Badge variant="secondary" className="ml-auto">
          {favorites.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {favorites.map((fav, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-[#1e2332] rounded-lg hover:bg-[#252836] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon name="Bookmark" className="h-4 w-4 text-yellow-500" />
              <div>
                <Badge className={getTypeColor(fav.item_type)}>
                  {getTypeLabel(fav.item_type)}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  ID: {fav.item_id}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(fav.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
