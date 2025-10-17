import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ROLES, PERMISSION_LABELS } from '@/types/roles';
import type { Permission } from '@/types/roles';

interface UserInfoTabProps {
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
    avatar_url?: string;
    location?: string;
    created_at?: string;
    roles?: string[];
    permissions?: Permission[];
  };
  allPermissions: Permission[];
}

const UserInfoTab: React.FC<UserInfoTabProps> = ({ user, allPermissions }) => {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white font-bold text-4xl">{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-white">{user.name}</h3>
              {user.username && (
                <p className="text-zinc-400">@{user.username}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
              {user.location && (
                <div>
                  <p className="text-sm text-zinc-500">Локация</p>
                  <p className="text-white flex items-center gap-1">
                    <Icon name="MapPin" className="h-4 w-4 text-accent" />
                    {user.location}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-zinc-500">ID пользователя</p>
                <p className="text-white font-mono">{user.id}</p>
              </div>
              {user.created_at && (
                <div>
                  <p className="text-sm text-zinc-500">Дата регистрации</p>
                  <p className="text-white">
                    {new Date(user.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-2">Текущие роли</p>
              <div className="flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map(roleId => {
                    const role = ROLES[roleId];
                    if (!role) return null;
                    return (
                      <Badge
                        key={roleId}
                        className="bg-accent text-white"
                      >
                        <Icon name={role.icon} className="h-3 w-3 mr-1" />
                        {role.name}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-zinc-500">Нет ролей</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-2">Все разрешения</p>
              <div className="flex flex-wrap gap-2">
                {allPermissions.length > 0 ? (
                  allPermissions.map(perm => (
                    <Badge
                      key={perm}
                      variant="outline"
                      className="border-accent/50 text-zinc-300"
                    >
                      {PERMISSION_LABELS[perm]}
                    </Badge>
                  ))
                ) : (
                  <span className="text-zinc-500">Нет разрешений</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoTab;
