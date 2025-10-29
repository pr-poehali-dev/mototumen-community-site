import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  brand: string;
  model: string;
}

const CATEGORIES = [
  'Масла и смазки',
  'Тормозная система',
  'Привод',
  'Система впуска',
  'Подвеска',
  'Электрика',
  'Экипировка',
];

const ZMStoreProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: CATEGORIES[0],
    inStock: true,
    brand: '',
    model: ''
  });

  const isEditMode = productId && productId !== 'new';

  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/cbc3e9d9-0880-4a6c-b047-401adf04e40a?id=${productId}`, {
        headers: { 'X-Auth-Token': token }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.product) {
          setForm({
            name: data.product.name || '',
            description: data.product.description || '',
            price: data.product.price || 0,
            image: data.product.image || '',
            category: data.product.category || CATEGORIES[0],
            inStock: data.product.inStock ?? true,
            brand: data.product.brand || '',
            model: data.product.model || ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товар",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.brand || !form.model || form.price <= 0) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `https://functions.poehali.dev/cbc3e9d9-0880-4a6c-b047-401adf04e40a?id=${productId}`
        : 'https://functions.poehali.dev/cbc3e9d9-0880-4a6c-b047-401adf04e40a';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: isEditMode ? "Товар обновлен" : "Товар добавлен"
        });
        navigate('/zm-store');
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить товар",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/zm-store')}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Редактировать товар' : 'Добавить товар'}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Информация о товаре</CardTitle>
              <CardDescription>Заполните все обязательные поля</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Название товара *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Масло моторное 10W-40"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Бренд *</Label>
                    <Input
                      id="brand"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="Motul"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Модель *</Label>
                    <Input
                      id="model"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      placeholder="7100 4T"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Подробное описание товара"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                      placeholder="2500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) => setForm({ ...form, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL изображения</Label>
                  <Input
                    id="image"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="inStock">В наличии</Label>
                    <p className="text-sm text-muted-foreground">
                      Товар доступен для заказа
                    </p>
                  </div>
                  <Switch
                    id="inStock"
                    checked={form.inStock}
                    onCheckedChange={(checked) => setForm({ ...form, inStock: checked })}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Сохранение..." : isEditMode ? "Сохранить изменения" : "Добавить товар"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/zm-store')}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Предпросмотр</CardTitle>
                <CardDescription>Так будет выглядеть товар в магазине</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-dark-900/50 border border-[#004488]/20 rounded-xl overflow-hidden">
                  {form.image ? (
                    <div className="relative h-48 bg-dark-800/50">
                      <img
                        src={form.image}
                        alt={form.name || 'Предпросмотр'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x300/1a1a1a/666?text=Изображение';
                        }}
                      />
                      {!form.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Нет в наличии</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-dark-800/50 flex items-center justify-center">
                      <Icon name="Image" size={48} className="text-muted-foreground" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white">
                          {form.name || 'Название товара'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {form.brand || 'Бренд'} • {form.model || 'Модель'}
                        </p>
                      </div>
                    </div>

                    {form.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {form.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-white">
                        {form.price > 0 ? `${form.price.toLocaleString()} ₽` : '0 ₽'}
                      </span>
                      {form.category && (
                        <span className="text-xs bg-[#004488]/20 text-[#004488] px-3 py-1 rounded-full">
                          {form.category}
                        </span>
                      )}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-[#004488] to-blue-600" disabled>
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Советы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Используйте качественные изображения товаров</p>
                <p>• Указывайте точную модель и бренд</p>
                <p>• Пишите подробное описание товара</p>
                <p>• Проверяйте цену перед публикацией</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZMStoreProductEdit;
