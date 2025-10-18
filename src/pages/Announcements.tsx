import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

interface Announcement {
  id?: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  author: string;
  contact: string;
  price?: string;
  location?: string;
  created_at?: string;
}

const API_URL = "https://functions.poehali.dev/5b8dbbf1-556a-43c8-b39c-e8096eebd5d4";

const categories = [
  "Все",
  "Продажа",
  "Покупка",
  "Попутчики",
  "Услуги",
  "Обучение",
  "Эвакуатор",
  "Общее",
];

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ type: "announcements" });
      if (selectedCategory !== "Все") {
        params.append("category", selectedCategory);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [selectedCategory]);

  const handleSearch = () => {
    loadAnnouncements();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Все");
  };

  const handleContactClick = (contact: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (contact) {
      const url = contact.startsWith("http")
        ? contact
        : `https://t.me/${contact.replace("@", "")}`;
      window.open(url, "_blank");
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-dark-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-['Oswald']">
            ОБЪЯВЛЕНИЯ
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Доска объявлений мотосообщества Тюмени
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Поиск объявлений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="bg-zinc-800 border-zinc-700 text-white w-full md:w-80"
              />
              <Button onClick={handleSearch} className="bg-accent hover:bg-accent/90">
                <Icon name="Search" className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-accent hover:bg-accent/90"
                      : "hover:bg-zinc-800"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== "Все") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-zinc-400 hover:text-white"
              >
                <Icon name="X" className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-zinc-400">
            {loading ? (
              "Загрузка..."
            ) : (
              <>
                Найдено объявлений: <span className="text-white font-medium">{announcements.length}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="py-16 px-4 min-h-screen">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">Загрузка объявлений...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Объявлений не найдено
              </h3>
              <p className="text-zinc-400 mb-4">
                {searchTerm || selectedCategory !== "Все"
                  ? "Попробуйте изменить фильтры поиска"
                  : "Пока нет объявлений в этой категории"}
              </p>
              {(searchTerm || selectedCategory !== "Все") && (
                <Button onClick={clearFilters} className="bg-accent hover:bg-accent/90">
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="bg-zinc-800 border-zinc-700 hover:border-accent transition-all hover-scale"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-purple-500 text-white">
                        {announcement.category}
                      </Badge>
                      <span className="text-xs text-zinc-400">
                        {announcement.created_at
                          ? new Date(announcement.created_at).toLocaleDateString("ru-RU")
                          : ""}
                      </span>
                    </div>
                    <CardTitle
                      className="text-white text-lg leading-tight font-['Oswald']"
                    >
                      {announcement.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {announcement.image && (
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    )}

                    <p className="text-zinc-400 text-sm line-clamp-3">
                      {announcement.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="User" className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">{announcement.author}</span>
                      </div>

                      {announcement.location && (
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-300">{announcement.location}</span>
                        </div>
                      )}

                      {announcement.price && (
                        <div className="flex items-center gap-2">
                          <Icon name="DollarSign" className="h-4 w-4 text-accent" />
                          <span className="text-accent font-bold">
                            {announcement.price}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-zinc-700"
                        onClick={() => handleContactClick(announcement.contact)}
                      >
                        <Icon name="MessageCircle" className="h-4 w-4 mr-1" />
                        Написать
                      </Button>
                      <Button
                        size="sm"
                        className="bg-accent hover:bg-accent/90"
                        onClick={() => handleContactClick(announcement.contact)}
                      >
                        <Icon name="ExternalLink" className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        message="Только авторизованные пользователи могут просматривать контакты"
      />
    </PageLayout>
  );
};

export default Announcements;