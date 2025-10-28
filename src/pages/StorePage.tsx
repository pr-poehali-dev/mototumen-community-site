import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

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

interface CartItem extends Product {
  quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Масло моторное 10W-40',
    brand: 'Motul',
    model: '7100 4T',
    price: 2500,
    image: 'https://cdn.poehali.dev/files/placeholder-oil.jpg',
    category: 'Масла и смазки',
    inStock: true,
    description: 'Синтетическое масло для 4-тактных двигателей'
  },
  {
    id: '2',
    name: 'Тормозные колодки передние',
    brand: 'Brembo',
    model: 'Carbon Ceramic',
    price: 4200,
    image: 'https://cdn.poehali.dev/files/placeholder-brake.jpg',
    category: 'Тормозная система',
    inStock: true,
    description: 'Керамические тормозные колодки для спортивных мотоциклов'
  },
  {
    id: '3',
    name: 'Цепь приводная 520',
    brand: 'DID',
    model: 'VX3-520-118',
    price: 3800,
    image: 'https://cdn.poehali.dev/files/placeholder-chain.jpg',
    category: 'Привод',
    inStock: true,
    description: 'Усиленная приводная цепь 520, 118 звеньев'
  },
  {
    id: '4',
    name: 'Воздушный фильтр',
    brand: 'K&N',
    model: 'KA-1004',
    price: 1800,
    image: 'https://cdn.poehali.dev/files/placeholder-filter.jpg',
    category: 'Система впуска',
    inStock: false,
    description: 'Моющийся воздушный фильтр увеличенной производительности'
  },
];

const CATEGORIES = [
  'Все категории',
  'Масла и смазки',
  'Тормозная система',
  'Привод',
  'Система впуска',
  'Подвеска',
  'Электрика',
];

const BRANDS = ['Все бренды', 'Motul', 'Brembo', 'DID', 'K&N', 'Michelin'];

const StorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все категории' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'Все бренды' || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white font-['Oswald']">
            ZM <span className="text-[#004488]">STORE</span>
          </h1>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setShowCart(!showCart)}
            >
              <Icon name="ShoppingCart" size={20} />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Поиск запчастей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-dark-900 border-dark-700 overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 bg-dark-800/80 rounded-full hover:bg-dark-700 transition-colors"
                    >
                      <Icon
                        name="Heart"
                        size={20}
                        className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button>
                    {!product.inStock && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Нет в наличии
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.model}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#004488]">
                        {product.price.toLocaleString()} ₽
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="bg-[#004488] hover:bg-[#003366]"
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-dark-900 border-dark-700 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Корзина
              </h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-4 border-b border-dark-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.brand}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="text-sm text-white">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-500 hover:text-red-400"
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-[#004488] mt-1">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Итого:</span>
                      <span className="text-[#004488]">{cartTotal.toLocaleString()} ₽</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Способ получения:</p>
                      <div className="flex gap-2">
                        <Button
                          variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => setDeliveryMethod('pickup')}
                        >
                          Самовывоз
                        </Button>
                        <Button
                          variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => setDeliveryMethod('delivery')}
                        >
                          Доставка
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setShowCheckout(true)}
                    >
                      Оформить заказ
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-dark-900 border-dark-700 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Оформление заказа</h2>
              <button onClick={() => setShowCheckout(false)}>
                <Icon name="X" size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Имя</label>
                <Input placeholder="Ваше имя" />
              </div>
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Телефон</label>
                <Input placeholder="+7 (___) ___-__-__" />
              </div>
              {deliveryMethod === 'delivery' && (
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Адрес доставки</label>
                  <Input placeholder="Улица, дом, квартира" />
                </div>
              )}
              <div className="pt-4 border-t border-dark-700">
                <div className="flex justify-between text-lg font-bold text-white mb-4">
                  <span>Итого к оплате:</span>
                  <span className="text-[#004488]">{cartTotal.toLocaleString()} ₽</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Оплатить
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StorePage;
