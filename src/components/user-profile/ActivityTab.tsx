import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { UserActivity } from "@/types/user";

interface ActivityTabProps {
  activities: UserActivity[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ activities }) => {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">Последняя активность</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Icon
                  name={activity.icon as any}
                  className="h-5 w-5 text-accent"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {activity.title}
                </div>
                <div className="text-xs text-zinc-400">{activity.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
