import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavoriteButton from "@/components/ui/favorite-button";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";

interface MotoSchool {
  id: string;
  name: string;
  description: string;
  courses: Course[];
  images: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  location: string;
  address: string;
  phone: string;
  website?: string;
  workingHours: string;
  founded: string;
  instructors: number;
  studentsCount: number;
  successRate: number;
  features: string[];
  featured: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  requirements: string[];
  includes: string[];
  schedule: string;
  maxStudents: number;
  currentStudents: number;
  nextStartDate: string;
  image?: string;
}

const MotoSchools = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({
    priceRange: "",
    level: "",
    duration: "",
    sortBy: "rating",
    location: "",
  });

  const [schools] = useState<MotoSchool[]>([
    {
      id: "1",
      name: 'Автошкола "Мотор+"',
      description:
        "Профессиональная подготовка мотоциклистов с 2010 года. Опытные инструкторы и современные мотоциклы.",
      courses: [
        {
          id: "1-1",
          title: "Курс категории А",
          description:
            "Полный курс обучения на мотоцикл категории А с нуля до получения прав.",
          price: 25000,
          duration: "2 месяца",
          category: "Права",
          level: "beginner",
          requirements: ["Возраст от 16 лет", "Медицинская справка"],
          includes: ["Теория ПДД", "Практика вождения", "Экзамен в ГИБДД"],
          schedule: "Вт, Чт, Сб: 18:00-20:00",
          maxStudents: 12,
          currentStudents: 8,
          nextStartDate: "2024-02-01",
          image: "https://picsum.photos/300/200?random=30",
        },
        {
          id: "1-2",
          title: "Курс экстремального вождения",
          description: "Продвинутый курс для опытных мотоциклистов.",
          price: 15000,
          duration: "1 месяц",
          category: "Экстрим",
          level: "advanced",
          requirements: ["Права категории А", "Опыт вождения от 2 лет"],
          includes: [
            "Техника экстремального вождения",
            "Безопасность",
            "Сертификат",
          ],
          schedule: "Сб, Вс: 10:00-16:00",
          maxStudents: 6,
          currentStudents: 4,
          nextStartDate: "2024-02-15",
          image: "https://picsum.photos/300/200?random=31",
        },
      ],
      images: ["https://picsum.photos/400/300?random=25"],
      rating: 4.8,
      reviewCount: 156,
      isVerified: true,
      location: "Тюмень",
      address: "ул. Ленина, 45",
      phone: "+7 (3452) 555-100",
      website: "motor-plus.ru",
      workingHours: "Пн-Сб: 9:00-19:00",
      founded: "2010",
      instructors: 8,
      studentsCount: 1247,
      successRate: 95,
      features: ["Собственный автодром", "Современные мотоциклы", "Рассрочка"],
      featured: true,
    },
    {
      id: "2",
      name: 'Мотошкола "Драйв"',
      description:
        "Быстрое и качественное обучение вождению мотоцикла в центре города.",
      courses: [
        {
          id: "2-1",
          title: "Базовый курс А1",
          description: "Обучение на легкие мотоциклы категории А1.",
          price: 18000,
          duration: "1.5 месяца",
          category: "Права",
          level: "beginner",
          requirements: ["Возраст от 16 лет"],
          includes: ["Теория", "Практика", "Экзамен"],
          schedule: "Пн, Ср, Пт: 17:00-19:00",
          maxStudents: 10,
          currentStudents: 6,
          nextStartDate: "2024-01-25",
          image: "https://picsum.photos/300/200?random=32",
        },
        {
          id: "2-2",
          title: "Контраварийная подготовка",
          description: "Курс безопасного вождения и избежания аварий.",
          price: 12000,
          duration: "3 недели",
          category: "Безопасность",
          level: "intermediate",
          requirements: ["Права категории А или А1"],
          includes: ["Теория безопасности", "Практические упражнения"],
          schedule: "Сб: 10:00-14:00",
          maxStudents: 8,
          currentStudents: 3,
          nextStartDate: "2024-02-10",
          image: "https://picsum.photos/300/200?random=33",
        },
      ],
      images: ["https://picsum.photos/400/300?random=26"],
      rating: 4.6,
      reviewCount: 89,
      isVerified: true,
      location: "Тюмень",
      address: "пр. Республики, 12",
      phone: "+7 (3452) 555-200",
      workingHours: "Пн-Пт: 10:00-20:00",
      founded: "2015",
      instructors: 5,
      studentsCount: 678,
      successRate: 92,
      features: ["Центр города", "Гибкий график", "Онлайн теория"],
      featured: false,
    },
    {
      id: "3",
      name: "Академия мотоспорта",
      description: "Профессиональная подготовка гонщиков и спортсменов.",
      courses: [
        {
          id: "3-1",
          title: "Курс спортивного вождения",
          description: "Подготовка к участию в соревнованиях.",
          price: 35000,
          duration: "3 месяца",
          category: "Спорт",
          level: "advanced",
          requirements: ["Права категории А", "Опыт от 3 лет"],
          includes: ["Спортивная техника", "Тактика гонок", "Физподготовка"],
          schedule: "Индивидуально",
          maxStudents: 4,
          currentStudents: 2,
          nextStartDate: "2024-02-20",
          image: "https://picsum.photos/300/200?random=34",
        },
      ],
      images: ["https://picsum.photos/400/300?random=27"],
      rating: 4.9,
      reviewCount: 45,
      isVerified: true,
      location: "Тюмень",
      address: "Московский тракт, 125",
      phone: "+7 (3452) 555-300",
      website: "motosport-academy.ru",
      workingHours: "Пн-Вс: 8:00-22:00",
      founded: "2018",
      instructors: 12,
      studentsCount: 234,
      successRate: 98,
      features: [
        "Профессиональный трек",
        "Спортивные мотоциклы",
        "Тренер-чемпион",
      ],
      featured: true,
    },
  ]);

  const allCourses = schools.flatMap((school) =>
    school.courses.map((course) => ({ ...course, school })),
  );

  const categories = [...new Set(allCourses.map((c) => c.category))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      level: "",
      duration: "",
      sortBy: "rating",
      location: "",
    });
    setSearchTerm("");
    setSelectedCategory("");
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.description.toLowerCase().includes(searchTerm.toLowerCase());

    const hasCourseMatch = school.courses.some((course) => {
      const matchesCategory =
        !selectedCategory || course.category === selectedCategory;
      const matchesLevel = !filters.level || course.level === filters.level;

      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange
          .split("-")
          .map((p) => parseInt(p) || 0);
        if (filters.priceRange === "30000+") {
          matchesPrice = course.price >= 30000;
        } else {
          matchesPrice =
            course.price >= min && course.price <= (max || Infinity);
        }
      }

      return matchesCategory && matchesLevel && matchesPrice;
    });

    return matchesSearch && hasCourseMatch;
  });

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (filters.sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "students":
        return b.studentsCount - a.studentsCount;
      case "success":
        return b.successRate - a.successRate;
      case "founded":
        return parseInt(a.founded) - parseInt(b.founded);
      default:
        return 0;
    }
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-blue-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Начинающий";
      case "intermediate":
        return "Средний";
      case "advanced":
        return "Продвинутый";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2 blue-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Мотошколы
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Выбери мотошколу для обучения и получения прав
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button className="bg-accent hover:bg-accent/90">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить школу
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Фильтры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Icon
                    name="Search"
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Поиск школ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Категория курса
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Цена курса
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) =>
                      handleFilterChange("priceRange", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Любая цена</option>
                    <option value="0-15000">До 15 000 ₽</option>
                    <option value="15000-25000">15 000 - 25 000 ₽</option>
                    <option value="25000-30000">25 000 - 30 000 ₽</option>
                    <option value="30000+">От 30 000 ₽</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Уровень
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) =>
                      handleFilterChange("level", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Любой уровень</option>
                    <option value="beginner">Начинающий</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Сортировка
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="rating">По рейтингу</option>
                    <option value="students">По количеству учеников</option>
                    <option value="success">По проценту успешности</option>
                    <option value="founded">По году основания</option>
                  </select>
                </div>

                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                >
                  <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Школы */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Найдено школ: {sortedSchools.length}
              </p>
            </div>

            <div className="space-y-6">
              {sortedSchools.map((school) => (
                <Card
                  key={school.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <img
                        src={school.images[0]}
                        alt={school.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {school.featured && (
                          <Badge className="bg-accent text-white">Топ</Badge>
                        )}
                        {school.isVerified && (
                          <Badge className="bg-green-500 text-white">
                            Проверено
                          </Badge>
                        )}
                        <FavoriteButton
                          item={{
                            id: school.id,
                            type: "school",
                            title: school.name,
                            description: school.description,
                            image: school.images[0],
                          }}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3
                            className="text-xl font-bold mb-2"
                            style={{ fontFamily: "Oswald, sans-serif" }}
                          >
                            {school.name}
                          </h3>
                          <p
                            className="text-muted-foreground mb-3"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {school.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Icon
                            name="Star"
                            className="h-4 w-4 text-yellow-500"
                          />
                          <span>{school.rating}</span>
                          <span className="text-muted-foreground">
                            ({school.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon
                            name="Users"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{school.studentsCount} учеников</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon
                            name="Award"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{school.successRate}% успешности</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon
                            name="Calendar"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>с {school.founded} года</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Доступные курсы:</h4>
                        <div className="space-y-2">
                          {school.courses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">
                                    {course.title}
                                  </span>
                                  <Badge
                                    className={`${getLevelColor(course.level)} text-white text-xs`}
                                  >
                                    {getLevelText(course.level)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {course.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {course.description}
                                </p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <span>{course.duration}</span>
                                  <span>
                                    {course.currentStudents}/
                                    {course.maxStudents} мест
                                  </span>
                                  <span>
                                    Старт:{" "}
                                    {new Date(
                                      course.nextStartDate,
                                    ).toLocaleDateString("ru-RU")}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-accent">
                                  {course.price.toLocaleString()} ₽
                                </div>
                                <Button
                                  size="sm"
                                  className="mt-2 bg-accent hover:bg-accent/90"
                                >
                                  Записаться
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="MapPin" className="h-4 w-4" />
                            <span>{school.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" className="h-4 w-4" />
                            <span>{school.workingHours}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Icon name="Phone" className="h-4 w-4 mr-1" />
                            Позвонить
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon
                              name="MessageCircle"
                              className="h-4 w-4 mr-1"
                            />
                            Написать
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {sortedSchools.length === 0 && (
              <div className="text-center py-12">
                <Icon
                  name="GraduationCap"
                  className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2">Школы не найдены</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotoSchools;
