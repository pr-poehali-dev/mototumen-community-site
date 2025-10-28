import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilter from "@/components/ui/search-filter";
import BoardItemCard from "@/components/board/BoardItemCard";
import CreateBoardItemDialog from "@/components/board/CreateBoardItemDialog";
import BoardFilters from "@/components/board/BoardFilters";

interface BoardItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  price?: number;
  location?: string;
  contact: string;
  type: "rideshare" | "service" | "announcement";
  status: "active" | "closed";
}

const Board = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "date-desc",
    status: "active",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BoardItem>>({
    title: "",
    description: "",
    category: "",
    price: undefined,
    location: "",
    contact: "",
    type: "announcement",
  });

  const [boardItems] = useState<BoardItem[]>([
    {
      id: "1",
      title: "Ищу попутчиков на Алтай",
      description:
        "Планирую поездку на Алтай в июле. Ищу компанию для совместного путешествия.",
      author: "Алексей М.",
      date: "2024-04-10",
      category: "Путешествия",
      image: "https://picsum.photos/400/300?random=10",
      location: "Тюмень → Алтай",
      contact: "@alexey_moto",
      type: "rideshare",
      status: "active",
    },
    {
      id: "2",
      title: "Техническое обслуживание мотоциклов",
      description:
        "Качественное ТО вашего мотоцикла. Диагностика, замена масла, настройка.",
      author: 'Сервис "Мото+"',
      date: "2024-04-09",
      category: "ТО и ремонт",
      price: 2000,
      location: "ул. Механическая, 15",
      contact: "+7 (3452) 123-456",
      type: "service",
      status: "active",
    },
    {
      id: "3",
      title: "Продаю мотоцикл Honda CBR600",
      description:
        "Продается Honda CBR600RR 2018 года. Состояние отличное, не бита.",
      author: "Дмитрий К.",
      date: "2024-04-08",
      category: "Продажа",
      price: 450000,
      image: "https://picsum.photos/400/300?random=11",
      location: "Тюмень",
      contact: "@dmitry_cbr",
      type: "announcement",
      status: "active",
    },
    {
      id: "4",
      title: "Ищу инструктора по вождению",
      description:
        "Начинающий мотоциклист ищет опытного инструктора для дополнительных занятий.",
      author: "Анна С.",
      date: "2024-04-07",
      category: "Обучение",
      price: 1500,
      location: "Тюмень",
      contact: "@anna_beginner",
      type: "service",
      status: "active",
    },
  ]);

  const categories = [...new Set(boardItems.map((item) => item.category))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      sortBy: "date-desc",
      status: "active",
    });
    setSearchTerm("");
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      price: undefined,
      location: "",
      contact: "",
      type: "announcement",
    });
  };

  const handleSubmit = () => {
    console.log("Создание карточки:", formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const getFilteredItems = (type?: string) => {
    let items = boardItems;

    if (type && type !== "all") {
      items = items.filter((item) => item.type === type);
    }

    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filters.category || item.category === filters.category;
      const matchesStatus = !filters.status || item.status === filters.status;

      let matchesPrice = true;
      if (filters.priceRange && item.price) {
        const [min, max] = filters.priceRange
          .split("-")
          .map((p) => parseInt(p) || 0);
        if (filters.priceRange === "10000+") {
          matchesPrice = item.price >= 10000;
        } else {
          matchesPrice = item.price >= min && item.price <= (max || Infinity);
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  };

  const renderItems = (items: BoardItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <BoardItemCard key={item.id} item={item} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Доска объявлений
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Найди попутчика, услугу или нужную вещь
            </p>
          </div>
          <CreateBoardItemDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            categories={categories}
          />
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Поиск по объявлениям..."
        />

        <BoardFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          categories={categories}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Все ({boardItems.length})</TabsTrigger>
            <TabsTrigger value="rideshare">
              Попутчики ({boardItems.filter((i) => i.type === "rideshare").length})
            </TabsTrigger>
            <TabsTrigger value="service">
              Услуги ({boardItems.filter((i) => i.type === "service").length})
            </TabsTrigger>
            <TabsTrigger value="announcement">
              Объявления ({boardItems.filter((i) => i.type === "announcement").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderItems(getFilteredItems("all"))}
          </TabsContent>

          <TabsContent value="rideshare" className="mt-6">
            {renderItems(getFilteredItems("rideshare"))}
          </TabsContent>

          <TabsContent value="service" className="mt-6">
            {renderItems(getFilteredItems("service"))}
          </TabsContent>

          <TabsContent value="announcement" className="mt-6">
            {renderItems(getFilteredItems("announcement"))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Board;
