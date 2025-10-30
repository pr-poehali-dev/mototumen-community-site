import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface StoreHeaderProps {
  hasStoreAccess: boolean;
  favorites: string[];
  cartItemsCount: number;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
  hasStoreAccess,
  favorites,
  cartItemsCount,
  showCart,
  setShowCart,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#004488]/20 to-purple-900/20 border-b border-[#004488]/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-5xl font-bold text-white font-['Oswald'] mb-2">
              ZM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004488] to-blue-400">STORE</span>
            </h1>
            <p className="text-gray-400">Запчасти и экипировка для мототехники</p>
          </div>
          
          <div className="flex gap-4">
            {hasStoreAccess && (
              <Button
                variant="outline"
                className="border-[#004488]/50 hover:border-[#004488] hover:bg-[#004488]/10 transition-all"
                onClick={() => navigate('/zm-store')}
              >
                <Icon name="User" size={22} />
                <span className="ml-2 hidden sm:inline">Личный кабинет</span>
              </Button>
            )}
            <Button
              variant="outline"
              className="border-[#004488]/50 hover:border-[#004488] hover:bg-[#004488]/10 transition-all"
            >
              <Icon name="Heart" size={22} />
              <span className="ml-2 hidden sm:inline">Избранное</span>
              {favorites.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-600 to-pink-500 border-0 text-white">
                  {favorites.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              className="relative border-[#004488]/50 hover:border-[#004488] hover:bg-[#004488]/10 transition-all"
              onClick={() => setShowCart(!showCart)}
            >
              <Icon name="ShoppingCart" size={22} />
              <span className="ml-2 hidden sm:inline">Корзина</span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-500 border-0 text-white">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
