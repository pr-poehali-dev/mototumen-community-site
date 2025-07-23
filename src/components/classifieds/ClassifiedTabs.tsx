import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassifiedCard from "./ClassifiedCard";
import Icon from "@/components/ui/icon";

interface Classified {
  id: string;
  title: string;
  description: string;
  price?: number;
  priceType: "fixed" | "negotiable" | "free" | "exchange";
  images: string[];
  category: string;
  subcategory?: string;
  type: "sale" | "wanted" | "exchange" | "free";
  condition?: "new" | "used" | "broken";
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    responseTime: string;
    memberSince: string;
  };
  location: string;
  createdAt: string;
  featured: boolean;
  urgent: boolean;
  tags: string[];
  contactPreference: "phone" | "message" | "both";
  viewCount: number;
  favoriteCount: number;
}

interface ClassifiedTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getFilteredClassifieds: (type?: string) => Classified[];
  sortedClassifieds: (items: Classified[]) => Classified[];
  getTypeConfig: (type: string) => {
    label: string;
    color: string;
    icon: string;
  };
  getConditionColor: (condition?: string) => string;
  getConditionText: (condition?: string) => string;
  getPriceText: (classified: Classified) => string;
}

const ClassifiedTabs: React.FC<ClassifiedTabsProps> = ({
  activeTab,
  setActiveTab,
  getFilteredClassifieds,
  sortedClassifieds,
  getTypeConfig,
  getConditionColor,
  getConditionText,
  getPriceText,
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">Все</TabsTrigger>
        <TabsTrigger value="sale">Продажа</TabsTrigger>
        <TabsTrigger value="wanted">Куплю</TabsTrigger>
        <TabsTrigger value="exchange">Обмен</TabsTrigger>
        <TabsTrigger value="free">Даром</TabsTrigger>
      </TabsList>

      {["all", "sale", "wanted", "exchange", "free"].map((tabValue) => (
        <TabsContent key={tabValue} value={tabValue} className="mt-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Объявлений:{" "}
              {
                getFilteredClassifieds(
                  tabValue === "all" ? undefined : tabValue,
                ).length
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedClassifieds(
              getFilteredClassifieds(
                tabValue === "all" ? undefined : tabValue,
              ),
            ).map((classified) => (
              <ClassifiedCard
                key={classified.id}
                classified={classified}
                getTypeConfig={getTypeConfig}
                getConditionColor={getConditionColor}
                getConditionText={getConditionText}
                getPriceText={getPriceText}
              />
            ))}
          </div>

          {getFilteredClassifieds(
            tabValue === "all" ? undefined : tabValue,
          ).length === 0 && (
            <div className="text-center py-12">
              <Icon
                name="FileText"
                className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
              />
              <h3 className="text-lg font-semibold mb-2">
                Объявления не найдены
              </h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ClassifiedTabs;