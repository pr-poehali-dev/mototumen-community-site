import React from "react";
import { Button } from "@/components/ui/button";

interface RouteFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
        className={activeFilter === "all" ? "bg-accent hover:bg-accent/90" : ""}
      >
        Все маршруты
      </Button>
      <Button
        variant={activeFilter === "scenic" ? "default" : "outline"}
        onClick={() => onFilterChange("scenic")}
        className={
          activeFilter === "scenic" ? "bg-accent hover:bg-accent/90" : ""
        }
      >
        Пейзажные
      </Button>
      <Button
        variant={activeFilter === "sport" ? "default" : "outline"}
        onClick={() => onFilterChange("sport")}
        className={
          activeFilter === "sport" ? "bg-accent hover:bg-accent/90" : ""
        }
      >
        Спортивные
      </Button>
      <Button
        variant={activeFilter === "adventure" ? "default" : "outline"}
        onClick={() => onFilterChange("adventure")}
        className={
          activeFilter === "adventure" ? "bg-accent hover:bg-accent/90" : ""
        }
      >
        Приключенческие
      </Button>
      <Button
        variant={activeFilter === "city" ? "default" : "outline"}
        onClick={() => onFilterChange("city")}
        className={
          activeFilter === "city" ? "bg-accent hover:bg-accent/90" : ""
        }
      >
        Городские
      </Button>
    </div>
  );
};
