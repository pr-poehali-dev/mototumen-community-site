import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  {
    id: '5',
    name: 'Шлем интеграл',
    brand: 'AGV',
    model: 'K6',
    price: 28500,
    image: 'https://cdn.poehali.dev/files/placeholder-helmet.jpg',
    category: 'Экипировка',
    inStock: true,
    description: 'Интегральный шлем с улучшенной аэродинамикой'
  },
  {
    id: '6',
    name: 'Перчатки кожаные',
    brand: 'Alpinestars',
    model: 'GP Pro R3',
    price: 15200,
    image: 'https://cdn.poehali.dev/files/placeholder-gloves.jpg',
    category: 'Экипировка',
    inStock: true,
    description: 'Спортивные перчатки из кожи кенгуру'
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
  'Экипировка',
];

const BRANDS = ['Все бренды', 'Motul', 'Brembo', 'DID', 'K&N', 'Michelin', 'AGV', 'Alpinestars'];

const StorePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [hasStoreAccess, setHasStoreAccess] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://functions.poehali.dev/cc081168-1f9b-4722-a67a-d65236d24d20');
        const data = await response.json();
        setProducts(data.products.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          brand: p.brand,
          model: p.model,
          price: p.price,
          image: p.image,
          category: p.category,
          inStock: p.inStock,
          description: p.description
        })));
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        setProducts(MOCK_PRODUCTS);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const checkStoreAccess = async () => {
      if (!user || !token) {
        console.log('No user or token:', { user, token });
        return;
      }
      
      console.log('Checking store access with token:', token);
      
      try {
        const response = await fetch('https://functions.poehali.dev/81c54822-a16d-4abd-9085-a49f6c685696', {
          headers: { 'X-Auth-Token': token }
        });
        
        console.log('Store access response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Store access data:', data);
          setHasStoreAccess(data.hasAccess);
        } else {
          console.log('Store access denied');
          setHasStoreAccess(false);
        }
      } catch (error) {
        console.error('Store access check error:', error);
        setHasStoreAccess(false);
      }
    };
    checkStoreAccess();
  }, [user, token]);

  const filteredProducts = products.filter((product) => {
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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
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
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-600 to-pink-500 border-0 text-white">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-80 space-y-6">
              <div className="bg-dark-900/50 backdrop-blur-sm border border-[#004488]/20 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Icon name="Filter" size={20} className="mr-2 text-[#004488]" />
                  Фильтры
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">Категория</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-dark-800 border-dark-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">Бренд</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="bg-dark-800 border-dark-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-[#004488]/50 hover:bg-[#004488]/10"
                    onClick={() => {
                      setSelectedCategory('Все категории');
                      setSelectedBrand('Все бренды');
                      setSearchQuery('');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              </div>

              <div className="bg-dark-900/50 backdrop-blur-sm border border-[#004488]/20 rounded-2xl p-6 shadow-xl sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Icon name="ShoppingCart" size={20} className="mr-2 text-[#004488]" />
                  Корзина
                </h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="ShoppingBag" size={48} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400">Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-4 border-b border-dark-700/50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.brand}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 border-[#004488]/50"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="text-sm text-white font-semibold w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 border-[#004488]/50"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={14} />
                              </Button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto text-red-500 hover:text-red-400 transition-colors"
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
                      <div className="flex justify-between items-center text-lg font-bold text-white bg-[#004488]/10 p-3 rounded-lg">
                        <span>Итого:</span>
                        <span className="text-[#004488]">{cartTotal.toLocaleString()} ₽</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white">Способ получения:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                            size="sm"
                            className={deliveryMethod === 'pickup' ? 'bg-[#004488] hover:bg-[#003366]' : 'border-[#004488]/50'}
                            onClick={() => setDeliveryMethod('pickup')}
                          >
                            <Icon name="Home" size={16} className="mr-1" />
                            Самовывоз
                          </Button>
                          <Button
                            variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                            size="sm"
                            className={deliveryMethod === 'delivery' ? 'bg-[#004488] hover:bg-[#003366]' : 'border-[#004488]/50'}
                            onClick={() => setDeliveryMethod('delivery')}
                          >
                            <Icon name="Truck" size={16} className="mr-1" />
                            Доставка
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-900/50"
                        onClick={() => setShowCheckout(true)}
                      >
                        <Icon name="CreditCard" size={18} className="mr-2" />
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-6">
                <div className="relative">
                  <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Поиск запчастей и экипировки..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-dark-900/50 border-[#004488]/20 focus:border-[#004488] text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="group bg-dark-900/50 backdrop-blur-sm border border-[#004488]/20 rounded-2xl overflow-hidden hover:border-[#004488]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#004488]/20 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 p-2.5 bg-dark-900/80 backdrop-blur-sm rounded-full hover:bg-dark-800 transition-all duration-200 hover:scale-110"
                      >
                        <Icon
                          name="Heart"
                          size={20}
                          className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-white'}
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
                        <p className="text-xs font-semibold text-[#004488] uppercase tracking-wider">{product.brand}</p>
                        <h3 className="text-lg font-bold text-white mt-1 line-clamp-2 group-hover:text-[#004488] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{product.model}</p>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-dark-700/50">
                        <div>
                          <p className="text-xs text-gray-500">Цена</p>
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#004488] to-blue-400">
                            {product.price.toLocaleString()} ₽
                          </span>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-gradient-to-r from-[#004488] to-[#0055aa] hover:from-[#003366] hover:to-[#004488] shadow-lg shadow-[#004488]/30 disabled:opacity-50"
                        >
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          Купить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {loading && (
                <div className="text-center py-20">
                  <Icon name="Loader2" size={64} className="mx-auto text-[#004488] mb-4 animate-spin" />
                  <p className="text-xl text-gray-400">Загрузка товаров...</p>
                </div>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <Icon name="PackageX" size={64} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-xl text-gray-400">Ничего не найдено</p>
                  <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </main>
          </div>
        </div>

        {showCart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowCart(false)}>
            <div 
              className="absolute right-0 top-0 h-full w-full max-w-md bg-dark-900 border-l border-[#004488]/30 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-dark-900 border-b border-[#004488]/30 p-6 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white font-['Oswald'] flex items-center">
                    <Icon name="ShoppingCart" size={24} className="mr-2 text-[#004488]" />
                    Корзина
                    {cartItemsCount > 0 && (
                      <Badge className="ml-3 bg-[#004488]">{cartItemsCount}</Badge>
                    )}
                  </h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="hover:bg-dark-800 p-2 rounded-lg transition-colors"
                  >
                    <Icon name="X" size={24} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <Icon name="ShoppingBag" size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-xl text-gray-400 mb-2">Корзина пуста</p>
                    <p className="text-gray-500">Добавьте товары из каталога</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div 
                          key={item.id} 
                          className="bg-dark-800/50 border border-[#004488]/20 rounded-xl p-4 hover:border-[#004488]/40 transition-all"
                        >
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold text-white line-clamp-2">{item.name}</p>
                                  <p className="text-xs text-[#004488] mt-1">{item.brand} · {item.model}</p>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                >
                                  <Icon name="Trash2" size={18} />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-3 bg-dark-900 rounded-lg p-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-[#004488]/20"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Icon name="Minus" size={16} />
                                  </Button>
                                  <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-[#004488]/20"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={16} />
                                  </Button>
                                </div>
                                <p className="text-lg font-bold text-[#004488]">
                                  {(item.price * item.quantity).toLocaleString()} ₽
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="sticky bottom-0 bg-dark-900 border-t border-[#004488]/30 pt-6 -mx-6 px-6 pb-6">
                      <div className="space-y-4">
                        <div className="bg-[#004488]/10 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Товаров:</span>
                            <span className="text-white font-semibold">{cartItemsCount} шт</span>
                          </div>
                          <div className="flex justify-between items-center text-2xl font-bold">
                            <span className="text-white">Итого:</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004488] to-blue-400">
                              {cartTotal.toLocaleString()} ₽
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-white flex items-center">
                            <Icon name="Truck" size={16} className="mr-2 text-[#004488]" />
                            Способ получения:
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant={deliveryMethod === 'pickup' ? 'default' : 'outline'}
                              className={deliveryMethod === 'pickup' ? 'bg-[#004488] hover:bg-[#003366]' : 'border-[#004488]/50 hover:bg-[#004488]/10'}
                              onClick={() => setDeliveryMethod('pickup')}
                            >
                              <Icon name="Home" size={16} className="mr-2" />
                              Самовывоз
                            </Button>
                            <Button
                              variant={deliveryMethod === 'delivery' ? 'default' : 'outline'}
                              className={deliveryMethod === 'delivery' ? 'bg-[#004488] hover:bg-[#003366]' : 'border-[#004488]/50 hover:bg-[#004488]/10'}
                              onClick={() => setDeliveryMethod('delivery')}
                            >
                              <Icon name="Truck" size={16} className="mr-2" />
                              Доставка
                            </Button>
                          </div>
                        </div>
                        
                        <Button
                          className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-900/50"
                          onClick={() => {
                            setShowCart(false);
                            setShowCheckout(true);
                          }}
                        >
                          <Icon name="CreditCard" size={20} className="mr-2" />
                          Оформить заказ
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-900 border border-[#004488]/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white font-['Oswald']">Оформление заказа</h2>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="hover:bg-dark-800 p-2 rounded-lg transition-colors"
                >
                  <Icon name="X" size={24} className="text-gray-400 hover:text-white" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">Имя</label>
                  <Input placeholder="Ваше имя" className="bg-dark-800 border-dark-700" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">Телефон</label>
                  <Input placeholder="+7 (___) ___-__-__" className="bg-dark-800 border-dark-700" />
                </div>
                {deliveryMethod === 'delivery' && (
                  <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">Адрес доставки</label>
                    <Input placeholder="Улица, дом, квартира" className="bg-dark-800 border-dark-700" />
                  </div>
                )}
                <div className="pt-6 border-t border-dark-700">
                  <div className="flex justify-between items-center text-xl font-bold text-white mb-6 bg-[#004488]/10 p-4 rounded-lg">
                    <span>Итого к оплате:</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004488] to-blue-400">
                      {cartTotal.toLocaleString()} ₽
                    </span>
                  </div>
                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-900/50">
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оплатить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default StorePage;