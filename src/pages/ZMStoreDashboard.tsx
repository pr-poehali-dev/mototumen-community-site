import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Users, Plus } from "lucide-react";
import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  brand: string;
  model: string;
}

interface Seller {
  id: number;
  user_id: string;
  telegram_id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  assigned_at: string;
}

const ZMStoreDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCEO, setIsCEO] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [user, token]);

  const checkAccess = async () => {
    if (!user || !token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("https://functions.poehali.dev/81c54822-a16d-4abd-9085-a49f6c685696", {
        headers: {
          "X-Auth-Token": token
        }
      });

      if (!response.ok) {
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав для управления ZM Store",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.hasAccess) {
        setHasAccess(true);
        setIsCEO(data.role === 'ceo');
        loadProducts();
        if (data.role === 'ceo') {
          loadSellers();
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Access check error:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch("https://functions.poehali.dev/cbc3e9d9-0880-4a6c-b047-401adf04e40a", {
        headers: {
          "X-Auth-Token": token || ""
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const loadSellers = async () => {
    if (!isCEO) return;
    
    try {
      const response = await fetch("https://functions.poehali.dev/b9e68923-db5a-4903-9eb9-7ff37e2337c7", {
        headers: {
          "X-Auth-Token": token || ""
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers || []);
      }
    } catch (error) {
      console.error("Failed to load sellers:", error);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Удалить этот товар?")) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/cbc3e9d9-0880-4a6c-b047-401adf04e40a?id=${id}`, {
        method: "DELETE",
        headers: {
          "X-Auth-Token": token || ""
        }
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Товар удален"
        });
        loadProducts();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive"
      });
    }
  };

  const toggleSeller = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/b9e68923-db5a-4903-9eb9-7ff37e2337c7`, {
        method: "PUT",
        headers: {
          "X-Auth-Token": token || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, is_active: !isActive })
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: isActive ? "Продавец деактивирован" : "Продавец активирован"
        });
        loadSellers();
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить продавца",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">ZM Store - Панель управления</h1>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              <Icon name="Package" className="mr-2" size={16} />
              Товары
            </TabsTrigger>
            {isCEO && (
              <TabsTrigger value="sellers">
                <Icon name="Users" className="mr-2" size={16} />
                Продавцы
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление товарами</CardTitle>
                    <CardDescription>Добавляйте, редактируйте и удаляйте товары</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/zm-store/product/new")}>
                    <Icon name="Plus" className="mr-2" size={16} />
                    Добавить товар
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {products.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет товаров</p>
                  ) : (
                    products.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="flex items-center gap-4 p-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            <p className="text-sm font-bold mt-1">{product.price} ₽</p>
                            <div className="flex gap-2 mt-1">
                              {product.category && (
                                <span className="text-xs bg-secondary px-2 py-1 rounded">
                                  {product.category}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {product.inStock ? "В наличии" : "Нет в наличии"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/zm-store/product/${product.id}`)}
                            >
                              Редактировать
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isCEO && (
            <TabsContent value="sellers" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Управление продавцами</CardTitle>
                      <CardDescription>Назначайте продавцов для ZM Store</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/zm-store/seller/new")}>
                      <Icon name="Plus" className="mr-2" size={16} />
                      Добавить продавца
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {sellers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Нет продавцов</p>
                    ) : (
                      sellers.map((seller) => (
                        <Card key={seller.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <h3 className="font-semibold">{seller.full_name}</h3>
                              <p className="text-sm text-muted-foreground">Telegram ID: {seller.telegram_id}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Роль: {seller.role === 'ceo' ? 'CEO' : 'Продавец'} • Назначен: {new Date(seller.assigned_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`text-xs px-2 py-1 rounded ${seller.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {seller.is_active ? "Активен" : "Неактивен"}
                              </span>
                              {seller.role !== 'ceo' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleSeller(seller.id, seller.is_active)}
                                >
                                  {seller.is_active ? 'Деактивировать' : 'Активировать'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ZMStoreDashboard;