import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import LogsTab from "@/components/admin/tabs/LogsTab";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

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

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  roles: Array<{ role: string }>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const response = await fetch('https://functions.poehali.dev/86524bce-07c8-41ba-bfd2-196753be77a5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', data.token);
      } else {
        setLoginError("Неверный пароль");
      }
    } catch (error) {
      setLoginError("Ошибка подключения к серверу");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    setPassword("");
    setLoginError("");
    localStorage.removeItem('admin_token');
    onClose();
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('https://functions.poehali.dev/cc081168-1f9b-4722-a67a-d65236d24d20');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
    setLoadingProducts(false);
  };

  const loadUsers = async () => {
    if (!authToken) return;
    setLoadingUsers(true);
    try {
      const response = await fetch('https://functions.poehali.dev/16633539-477f-4889-bcb3-2c029840174c', {
        headers: { 'X-Auth-Token': authToken }
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
    setLoadingUsers(false);
  };

  const loadStats = async () => {
    if (!authToken) return;
    setLoadingStats(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b660b528-6680-466a-8222-fc672d9003a5', {
        headers: { 'X-Admin-Token': authToken }
      });
      const data = await response.json();
      setStats(data.stats || {});
      setRecentActivity(data.recent_activity || []);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
    setLoadingStats(false);
  };

  const toggleProductStock = async (productId: number, currentStock: boolean) => {
    if (!authToken) return;
    try {
      await fetch(`https://functions.poehali.dev/cc081168-1f9b-4722-a67a-d65236d24d20?id=${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken 
        },
        body: JSON.stringify({ inStock: !currentStock })
      });
      loadProducts();
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    if (!authToken) return;
    try {
      await fetch(`https://functions.poehali.dev/16633539-477f-4889-bcb3-2c029840174c?id=${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken 
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      loadUsers();
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && authToken) {
      loadProducts();
      loadUsers();
      loadStats();
    }
  }, [isAuthenticated, authToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-dark-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-[#004488]/30">
        <div className="flex items-center justify-between p-6 border-b border-[#004488]/30">
          <h2 className="text-2xl font-bold text-white font-['Oswald']">
            {isAuthenticated ? "Админ панель" : "Вход в админ панель"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-dark-800"
          >
            <Icon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="password" className="text-white">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="mt-1 bg-dark-800 border-dark-700 text-white"
                  required
                />
              </div>

              {loginError && (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#004488] hover:bg-[#003366]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" className="h-4 w-4 mr-2" />
                    Войти
                  </>
                )}
              </Button>
            </form>
          ) : (
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-dark-800 mb-6">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#004488]">
                  <Icon name="LayoutDashboard" className="h-4 w-4 mr-2" />
                  Дашборд
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-[#004488]">
                  <Icon name="Package" className="h-4 w-4 mr-2" />
                  Товары ({products.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-[#004488]">
                  <Icon name="Users" className="h-4 w-4 mr-2" />
                  Пользователи ({users.length})
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-[#004488]">
                  <Icon name="FileText" className="h-4 w-4 mr-2" />
                  Логи
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                {loadingStats ? (
                  <div className="text-center py-10">
                    <Icon name="Loader2" className="h-8 w-8 animate-spin text-[#004488] mx-auto" />
                  </div>
                ) : (
                  <AdminDashboard stats={stats} recentActivity={recentActivity} />
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Управление товарами</h3>
                  <Button
                    onClick={loadProducts}
                    variant="outline"
                    size="sm"
                    className="border-[#004488] text-white hover:bg-[#004488]/20"
                  >
                    <Icon name="RefreshCw" className="h-4 w-4 mr-2" />
                    Обновить
                  </Button>
                </div>

                {loadingProducts ? (
                  <div className="text-center py-10">
                    <Icon name="Loader2" className="h-8 w-8 animate-spin text-[#004488] mx-auto" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-dark-800/50 border border-[#004488]/20 rounded-lg p-4 hover:border-[#004488]/40 transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-white">{product.name}</h4>
                                <p className="text-sm text-gray-400">{product.brand} · {product.model}</p>
                                <p className="text-xs text-[#004488] mt-1">{product.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-[#004488]">{product.price.toLocaleString()} ₽</p>
                                <Badge variant={product.inStock ? "default" : "destructive"} className="mt-1">
                                  {product.inStock ? "В наличии" : "Нет в наличии"}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#004488] text-white hover:bg-[#004488]/20"
                                onClick={() => toggleProductStock(product.id, product.inStock)}
                              >
                                <Icon name={product.inStock ? "XCircle" : "CheckCircle"} className="h-4 w-4 mr-1" />
                                {product.inStock ? "Снять с продажи" : "Вернуть в продажу"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Управление пользователями</h3>
                  <Button
                    onClick={loadUsers}
                    variant="outline"
                    size="sm"
                    className="border-[#004488] text-white hover:bg-[#004488]/20"
                  >
                    <Icon name="RefreshCw" className="h-4 w-4 mr-2" />
                    Обновить
                  </Button>
                </div>

                {loadingUsers ? (
                  <div className="text-center py-10">
                    <Icon name="Loader2" className="h-8 w-8 animate-spin text-[#004488] mx-auto" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-dark-800/50 border border-[#004488]/20 rounded-lg p-4 hover:border-[#004488]/40 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white">{user.username}</h4>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            {user.fullName && <p className="text-xs text-gray-500 mt-1">{user.fullName}</p>}
                            <div className="flex gap-2 mt-2">
                              {user.roles?.map((r, i) => (
                                <Badge key={i} variant="outline" className="border-[#004488] text-[#004488]">
                                  {r.role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={user.isActive ? "default" : "destructive"}>
                              {user.isActive ? "Активен" : "Заблокирован"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#004488] text-white hover:bg-[#004488]/20"
                              onClick={() => toggleUserStatus(user.id, user.isActive)}
                            >
                              <Icon name={user.isActive ? "Ban" : "CheckCircle"} className="h-4 w-4 mr-1" />
                              {user.isActive ? "Заблокировать" : "Разблокировать"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="logs">
                <LogsTab />
              </TabsContent>

              <div className="mt-6 pt-4 border-t border-[#004488]/30">
                <Button
                  variant="outline"
                  className="w-full text-red-400 border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <Icon name="LogOut" className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;