import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) => {
  return (
    <div className="group bg-dark-900/50 backdrop-blur-sm border border-[#004488]/20 rounded-2xl overflow-hidden hover:border-[#004488]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004488]/20 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2.5 bg-dark-900/80 backdrop-blur-sm rounded-full hover:bg-dark-800 transition-all duration-200 hover:scale-110"
        >
          <Icon
            name="Heart"
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
        
        {!product.inStock && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 border-0">
            Нет в наличии
          </Badge>
        )}
        
        {product.inStock && (
          <Badge className="absolute bottom-3 left-3 bg-gradient-to-r from-green-600 to-green-500 border-0">
            В наличии
          </Badge>
        )}
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <Badge className="bg-[#004488]/20 text-[#4499ff] border-[#004488]/30 hover:bg-[#004488]/30 mb-2">
            {product.category}
          </Badge>
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-[#4499ff] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 mb-1">{product.brand} • {product.model}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-[#004488]/20">
          <div>
            <span className="text-2xl font-bold text-white">{product.price.toLocaleString()}</span>
            <span className="text-gray-400 ml-1">₽</span>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="bg-gradient-to-r from-[#004488] to-blue-600 hover:from-[#003366] hover:to-blue-700 shadow-lg shadow-[#004488]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ShoppingCart" size={18} className="mr-2" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
