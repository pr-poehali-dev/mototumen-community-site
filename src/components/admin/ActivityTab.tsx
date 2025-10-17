import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface UserActivity {
  id: string;
  action: string;
  location?: string;
  created_at: string;
  details?: string;
}

interface ActivityTabProps {
  activities: UserActivity[];
  loadingActivities: boolean;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ activities, loadingActivities }) => {
  const getActivityIcon = (action: string) => {
    if (action.includes('login')) return 'LogIn';
    if (action.includes('logout')) return 'LogOut';
    if (action.includes('create')) return 'Plus';
    if (action.includes('edit') || action.includes('update')) return 'Edit';
    if (action.includes('delete')) return 'Trash2';
    if (action.includes('view')) return 'Eye';
    return 'Activity';
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="pt-6">
        {loadingActivities ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-zinc-700/50 border border-zinc-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon name={getActivityIcon(activity.action)} className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.action}</p>
                      {activity.details && (
                        <p className="text-sm text-zinc-400 mt-1">{activity.details}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" className="h-3 w-3" />
                          {new Date(activity.created_at).toLocaleString('ru-RU')}
                        </span>
                        {activity.location && (
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" className="h-3 w-3" />
                            {activity.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Icon name="Activity" className="h-12 w-12 mb-3" />
                <p>История действий пуста</p>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
