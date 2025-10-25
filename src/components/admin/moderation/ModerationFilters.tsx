import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface ModerationFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  getPendingCount: (type: string) => number;
}

export const ModerationFilters: React.FC<ModerationFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  getPendingCount
}) => {
  return (
    <div className="flex gap-3 flex-wrap mb-4">
      <Button
        variant={selectedFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
        className="relative"
      >
        <Icon name="Building2" className="h-4 w-4 mr-2" />
        Все
        {getPendingCount('all') > 0 && (
          <Badge className="ml-2 bg-red-500 text-white">
            {getPendingCount('all')}
          </Badge>
        )}
      </Button>
      
      <Button
        variant={selectedFilter === 'shop' ? 'default' : 'outline'}
        onClick={() => onFilterChange('shop')}
        className="relative"
      >
        <Icon name="Store" className="h-4 w-4 mr-2" />
        Магазины
        {getPendingCount('shop') > 0 && (
          <Badge className="ml-2 bg-red-500 text-white">
            {getPendingCount('shop')}
          </Badge>
        )}
      </Button>
      
      <Button
        variant={selectedFilter === 'service' ? 'default' : 'outline'}
        onClick={() => onFilterChange('service')}
        className="relative"
      >
        <Icon name="Wrench" className="h-4 w-4 mr-2" />
        Сервисы
        {getPendingCount('service') > 0 && (
          <Badge className="ml-2 bg-red-500 text-white">
            {getPendingCount('service')}
          </Badge>
        )}
      </Button>
      
      <Button
        variant={selectedFilter === 'school' ? 'default' : 'outline'}
        onClick={() => onFilterChange('school')}
        className="relative"
      >
        <Icon name="GraduationCap" className="h-4 w-4 mr-2" />
        Мотошколы
        {getPendingCount('school') > 0 && (
          <Badge className="ml-2 bg-red-500 text-white">
            {getPendingCount('school')}
          </Badge>
        )}
      </Button>
    </div>
  );
};
