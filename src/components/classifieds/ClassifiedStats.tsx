import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Classified {
  id: string;
  type: "sale" | "wanted" | "exchange" | "free";
  featured: boolean;
}

interface ClassifiedStatsProps {
  classifieds: Classified[];
}

const ClassifiedStats: React.FC<ClassifiedStatsProps> = ({ classifieds }) => {
  const stats = {
    total: classifieds.length,
    sale: classifieds.filter((c) => c.type === "sale").length,
    wanted: classifieds.filter((c) => c.type === "wanted").length,
    exchange: classifieds.filter((c) => c.type === "exchange").length,
    free: classifieds.filter((c) => c.type === "free").length,
    featured: classifieds.filter((c) => c.featured).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Icon name="Package" className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-zinc-400">Всего</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Icon name="ShoppingCart" className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.sale}</p>
              <p className="text-xs text-zinc-400">Продажа</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Icon name="Search" className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.wanted}</p>
              <p className="text-xs text-zinc-400">Куплю</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Icon name="Repeat" className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.exchange}</p>
              <p className="text-xs text-zinc-400">Обмен</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Icon name="Gift" className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.free}</p>
              <p className="text-xs text-zinc-400">Бесплатно</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Icon name="Star" className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.featured}</p>
              <p className="text-xs text-zinc-400">Топ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassifiedStats;
