import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingFriendRequests: number;
  vehiclesCount: number;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  pendingFriendRequests,
  vehiclesCount,
}) => {
  return (
    <div className="bg-[#252836] rounded-lg p-2 mb-4">
      <TabsList className="grid w-full grid-cols-3 bg-[#1e2332]">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Icon name="User" className="h-4 w-4 mr-2" />
          Профиль
        </TabsTrigger>
        <TabsTrigger
          value="garage"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
        >
          <Icon name="Car" className="h-4 w-4 mr-2" />
          Гараж
          {vehiclesCount > 0 && (
            <Badge className="ml-2 bg-purple-500 text-white text-xs px-1.5 py-0">
              {vehiclesCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="friends"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
        >
          <Icon name="Users" className="h-4 w-4 mr-2" />
          Друзья
          {pendingFriendRequests > 0 && (
            <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0">
              {pendingFriendRequests}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </div>
  );
};