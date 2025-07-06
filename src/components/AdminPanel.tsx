import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: string;
  image?: string;
  inStock: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  available: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  available: boolean;
}

interface Advertisement {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  category: string;
  contact: string;
  active: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Мотоэкипировка",
      description: "Шлемы, куртки, перчатки и другая защитная экипировка",
      price: 5999,
      discount: 15,
      category: "equipment",
      inStock: true,
    },
    {
      id: "2",
      name: "Мотошлем AGV",
      description: "Профессиональный шлем для спорта и города",
      price: 25000,
      category: "helmets",
      inStock: true,
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "Техническое обслуживание",
      description: "Профессиональный сервис с гарантией качества",
      price: 2500,
      duration: "2-3 часа",
      icon: "Settings",
      available: true,
    },
    {
      id: "2",
      title: "Диагностика двигателя",
      description: "Компьютерная диагностика всех систем",
      price: 1200,
      duration: "1 час",
      icon: "Search",
      available: true,
    },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Курс для начинающих",
      description: "Обучение с опытными инструкторами",
      price: 25000,
      duration: "40 часов",
      category: "basic",
      available: true,
    },
    {
      id: "2",
      title: "Повышение категории",
      description: "Подготовка к получению категории A",
      price: 15000,
      duration: "20 часов",
      category: "advanced",
      available: true,
    },
  ]);

  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: "1",
      title: "Honda CBR600RR 2019",
      description: "Отличное состояние, один владелец",
      price: "₽450,000",
      type: "Продажа",
      category: "motorcycles",
      contact: "+7 (999) 123-45-67",
      active: true,
    },
    {
      id: "2",
      title: "Yamaha MT-07 2021",
      description: "Практически новый, пробег 2000 км",
      price: "₽520,000",
      type: "Продажа",
      category: "motorcycles",
      contact: "+7 (999) 765-43-21",
      active: true,
    },
  ]);

  const handleSaveProduct = (product: Product) => {
    if (editingItem) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
    }
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  const handleSaveService = (service: Service) => {
    if (editingItem) {
      setServices(services.map((s) => (s.id === service.id ? service : s)));
    } else {
      setServices([...services, { ...service, id: Date.now().toString() }]);
    }
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  const handleSaveCourse = (course: Course) => {
    if (editingItem) {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
    } else {
      setCourses([...courses, { ...course, id: Date.now().toString() }]);
    }
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  const handleSaveAdvertisement = (ad: Advertisement) => {
    if (editingItem) {
      setAdvertisements(advertisements.map((a) => (a.id === ad.id ? ad : a)));
    } else {
      setAdvertisements([
        ...advertisements,
        { ...ad, id: Date.now().toString() },
      ]);
    }
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string, type: string) => {
    switch (type) {
      case "product":
        setProducts(products.filter((p) => p.id !== id));
        break;
      case "service":
        setServices(services.filter((s) => s.id !== id));
        break;
      case "course":
        setCourses(courses.filter((c) => c.id !== id));
        break;
      case "advertisement":
        setAdvertisements(advertisements.filter((a) => a.id !== id));
        break;
    }
  };

  const ProductForm = ({
    product,
    onSave,
  }: {
    product?: Product;
    onSave: (product: Product) => void;
  }) => {
    const [formData, setFormData] = useState<Product>(
      product || {
        id: "",
        name: "",
        description: "",
        price: 0,
        discount: 0,
        category: "",
        inStock: true,
      },
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="category">Категория</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="equipment">Экипировка</SelectItem>
                <SelectItem value="helmets">Шлемы</SelectItem>
                <SelectItem value="parts">Запчасти</SelectItem>
                <SelectItem value="accessories">Аксессуары</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="discount">Скидка (%)</Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount || 0}
              onChange={(e) =>
                setFormData({ ...formData, discount: parseInt(e.target.value) })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.inStock}
            onChange={(e) =>
              setFormData({ ...formData, inStock: e.target.checked })
            }
            className="w-4 h-4 text-accent"
          />
          <Label htmlFor="inStock">В наличии</Label>
        </div>
        <Button
          onClick={() => onSave(formData)}
          className="w-full bg-accent hover:bg-accent/90"
        >
          {product ? "Обновить" : "Создать"} товар
        </Button>
      </div>
    );
  };

  const ServiceForm = ({
    service,
    onSave,
  }: {
    service?: Service;
    onSave: (service: Service) => void;
  }) => {
    const [formData, setFormData] = useState<Service>(
      service || {
        id: "",
        title: "",
        description: "",
        price: 0,
        duration: "",
        icon: "Settings",
        available: true,
      },
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Название услуги</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="icon">Иконка</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) =>
                setFormData({ ...formData, icon: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="Settings">Settings</SelectItem>
                <SelectItem value="Search">Search</SelectItem>
                <SelectItem value="Wrench">Wrench</SelectItem>
                <SelectItem value="Cog">Cog</SelectItem>
                <SelectItem value="AlertTriangle">AlertTriangle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="duration">Длительность</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="available"
            checked={formData.available}
            onChange={(e) =>
              setFormData({ ...formData, available: e.target.checked })
            }
            className="w-4 h-4 text-accent"
          />
          <Label htmlFor="available">Доступна</Label>
        </div>
        <Button
          onClick={() => onSave(formData)}
          className="w-full bg-accent hover:bg-accent/90"
        >
          {service ? "Обновить" : "Создать"} услугу
        </Button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-2xl font-bold text-white flex items-center"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  <Icon name="Shield" className="h-6 w-6 mr-2 text-accent" />
                  Панель администратора
                </h2>
                <p className="text-zinc-400">Управление содержимым сайта</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-zinc-800"
              >
                <Icon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-zinc-800 border-zinc-700">
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="ShoppingBag" className="h-4 w-4 mr-2" />
                  Товары
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Wrench" className="h-4 w-4 mr-2" />
                  Услуги
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="GraduationCap" className="h-4 w-4 mr-2" />
                  Курсы
                </TabsTrigger>
                <TabsTrigger
                  value="ads"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Megaphone" className="h-4 w-4 mr-2" />
                  Объявления
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Управление товарами
                  </h3>
                  <Dialog
                    open={isAddModalOpen}
                    onOpenChange={setIsAddModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-accent hover:bg-accent/90">
                        <Icon name="Plus" className="h-4 w-4 mr-2" />
                        Добавить товар
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {editingItem ? "Редактировать" : "Добавить"} товар
                        </DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        product={editingItem}
                        onSave={handleSaveProduct}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-zinc-800 border-zinc-700"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">
                            {product.name}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Icon
                                  name="MoreHorizontal"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingItem(product);
                                  setIsAddModalOpen(true);
                                }}
                              >
                                <Icon name="Edit" className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteItem(product.id, "product")
                                }
                                className="text-red-400"
                              >
                                <Icon name="Trash2" className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="text-zinc-400">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {product.discount && (
                              <Badge
                                variant="secondary"
                                className="bg-accent/20 text-accent"
                              >
                                -{product.discount}%
                              </Badge>
                            )}
                            <span className="text-xl font-bold text-accent">
                              ₽{product.price.toLocaleString()}
                            </span>
                          </div>
                          <Badge
                            variant={
                              product.inStock ? "default" : "destructive"
                            }
                          >
                            {product.inStock ? "В наличии" : "Нет в наличии"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Управление услугами
                  </h3>
                  <Dialog
                    open={isAddModalOpen}
                    onOpenChange={setIsAddModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-accent hover:bg-accent/90">
                        <Icon name="Plus" className="h-4 w-4 mr-2" />
                        Добавить услугу
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {editingItem ? "Редактировать" : "Добавить"} услугу
                        </DialogTitle>
                      </DialogHeader>
                      <ServiceForm
                        service={editingItem}
                        onSave={handleSaveService}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className="bg-zinc-800 border-zinc-700"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                              <Icon
                                name={service.icon as any}
                                className="h-5 w-5 text-accent"
                              />
                            </div>
                            <CardTitle className="text-white">
                              {service.title}
                            </CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Icon
                                  name="MoreHorizontal"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingItem(service);
                                  setIsAddModalOpen(true);
                                }}
                              >
                                <Icon name="Edit" className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteItem(service.id, "service")
                                }
                                className="text-red-400"
                              >
                                <Icon name="Trash2" className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="text-zinc-400">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-accent">
                              ₽{service.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-zinc-400">
                              • {service.duration}
                            </span>
                          </div>
                          <Badge
                            variant={
                              service.available ? "default" : "destructive"
                            }
                          >
                            {service.available ? "Доступна" : "Недоступна"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Управление курсами
                  </h3>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Icon name="Plus" className="h-4 w-4 mr-2" />
                    Добавить курс
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className="bg-zinc-800 border-zinc-700"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">
                            {course.title}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Icon
                                  name="MoreHorizontal"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem>
                                <Icon name="Edit" className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteItem(course.id, "course")
                                }
                                className="text-red-400"
                              >
                                <Icon name="Trash2" className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="text-zinc-400">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-accent">
                              ₽{course.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-zinc-400">
                              • {course.duration}
                            </span>
                          </div>
                          <Badge
                            variant={
                              course.available ? "default" : "destructive"
                            }
                          >
                            {course.available ? "Доступен" : "Недоступен"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ads" className="mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Управление объявлениями
                  </h3>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Icon name="Plus" className="h-4 w-4 mr-2" />
                    Добавить объявление
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advertisements.map((ad) => (
                    <Card key={ad.id} className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">
                            {ad.title}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Icon
                                  name="MoreHorizontal"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem>
                                <Icon name="Edit" className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteItem(ad.id, "advertisement")
                                }
                                className="text-red-400"
                              >
                                <Icon name="Trash2" className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="text-zinc-400">
                          <Badge
                            variant="outline"
                            className="mr-2 border-accent text-accent"
                          >
                            {ad.type}
                          </Badge>
                          {ad.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-accent">
                            {ad.price}
                          </span>
                          <Badge
                            variant={ad.active ? "default" : "destructive"}
                          >
                            {ad.active ? "Активно" : "Неактивно"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-zinc-400">
                          Контакт: {ad.contact}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
