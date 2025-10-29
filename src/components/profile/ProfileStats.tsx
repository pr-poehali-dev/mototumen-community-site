import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface ProfileStatsProps {
  profileData: any;
  pendingFriendRequests: number;
  onTabChange: (tab: string) => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  profileData,
  pendingFriendRequests,
  onTabChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#252836] rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Статистика</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onTabChange('friends')}
          className="bg-[#1e2332] rounded-lg p-4 hover:bg-[#2a2f42] transition-colors text-left relative group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" className="h-5 w-5 text-blue-500" />
            <span className="text-gray-400 text-sm">Друзья</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {profileData?.friends_count || 0}
          </p>
          {pendingFriendRequests > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              {pendingFriendRequests}
            </Badge>
          )}
        </button>

        <button
          onClick={() => onTabChange('garage')}
          className="bg-[#1e2332] rounded-lg p-4 hover:bg-[#2a2f42] transition-colors text-left group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Car" className="h-5 w-5 text-purple-500" />
            <span className="text-gray-400 text-sm">Гараж</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {profileData?.vehicles_count || 0}
          </p>
        </button>

        <div className="bg-[#1e2332] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Calendar" className="h-5 w-5 text-green-500" />
            <span className="text-gray-400 text-sm">Мероприятия</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {profileData?.events_count || 0}
          </p>
        </div>

        <div className="bg-[#1e2332] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MessageSquare" className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-400 text-sm">Сообщения</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {profileData?.messages_count || 0}
          </p>
        </div>
      </div>
    </div>
  );
};
