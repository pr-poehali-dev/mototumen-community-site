import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { ROLES, PERMISSION_LABELS, PERMISSION_CATEGORIES, type Permission, type GlobalRole, type ContentRole } from '@/types/roles';

const ADMIN_API = 'https://functions.poehali.dev/a4bf4de7-33a4-406c-95cc-0529c16d6677';

interface UserActivity {
  id: string;
  action: string;
  location?: string;
  created_at: string;
  details?: string;
}

interface UserDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
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
  currentUserRole: GlobalRole;
  onUpdateRoles: (userId: string, roles: string[]) => void;
  onUpdatePermissions: (userId: string, permissions: Permission[]) => void;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  isOpen,
  onClose,
  user,
  currentUserRole,
  onUpdateRoles,
  onUpdatePermissions,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);
  const [customPermissions, setCustomPermissions] = useState<Permission[]>(user.permissions || []);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const isCEO = currentUserRole === 'ceo';

  useEffect(() => {
    if (isOpen && user.id) {
      loadActivities();
    }
  }, [isOpen, user.id]);

  const loadActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await fetch(`${ADMIN_API}?action=activity&user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки активности:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleToggleRole = (roleId: string) => {
    const role = ROLES[roleId];
    if (!role) return;

    if (!role.canBeAssignedBy.includes(currentUserRole)) {
      return;
    }

    const newRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter(r => r !== roleId)
      : [...selectedRoles, roleId];
    
    setSelectedRoles(newRoles);
  };

  const handleTogglePermission = (permission: Permission) => {
    if (!isCEO) return;

    const newPermissions = customPermissions.includes(permission)
      ? customPermissions.filter(p => p !== permission)
      : [...customPermissions, permission];
    
    setCustomPermissions(newPermissions);
  };

  const getAllPermissions = (): Permission[] => {
    const rolePermissions = selectedRoles.flatMap(roleId => ROLES[roleId]?.permissions || []);
    return Array.from(new Set([...rolePermissions, ...customPermissions]));
  };

  const handleSave = async () => {
    try {
      const existingRoles = user.roles || [];
      const rolesToAdd = selectedRoles.filter(r => !existingRoles.includes(r));
      const rolesToRemove = existingRoles.filter(r => !selectedRoles.includes(r));

      for (const roleId of rolesToAdd) {
        await fetch(`${ADMIN_API}?action=assign_role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, role_id: roleId, assigned_by: 1 }),
        });
      }

      for (const roleId of rolesToRemove) {
        await fetch(`${ADMIN_API}?action=remove_role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, role_id: roleId }),
        });
      }

      const existingPermissions = user.permissions || [];
      const permsToAdd = customPermissions.filter(p => !existingPermissions.includes(p));
      const permsToRemove = existingPermissions.filter(p => !customPermissions.includes(p));

      for (const permission of permsToAdd) {
        await fetch(`${ADMIN_API}?action=grant_permission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, permission, granted_by: 1 }),
        });
      }

      for (const permission of permsToRemove) {
        await fetch(`${ADMIN_API}?action=revoke_permission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, permission }),
        });
      }

      onUpdateRoles(user.id, selectedRoles);
      onUpdatePermissions(user.id, customPermissions);
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  const globalRoles = Object.values(ROLES).filter(r => r.category === 'global');
  const contentRoles = Object.values(ROLES).filter(r => r.category !== 'global');

  const groupedContentRoles = {
    shop: contentRoles.filter(r => r.category === 'shop'),
    service: contentRoles.filter(r => r.category === 'service'),
    school: contentRoles.filter(r => r.category === 'school'),
    post: contentRoles.filter(r => r.category === 'post'),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Информация о пользователе</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Детальная информация, роли и активность
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger value="info">Основная информация</TabsTrigger>
            <TabsTrigger value="roles">Роли и разрешения</TabsTrigger>
            <TabsTrigger value="activity">История действий</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
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
                          <p className="text-white">{new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 mb-2">Активные роли</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoles.length > 0 ? (
                          selectedRoles.map(roleId => (
                            <Badge key={roleId} className="bg-accent text-white">
                              {ROLES[roleId]?.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">Пользователь</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Shield" className="h-5 w-5 text-blue-500" />
                      Глобальные роли
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {globalRoles.map(role => {
                      const canAssign = role.canBeAssignedBy.includes(currentUserRole);
                      const isSelected = selectedRoles.includes(role.id);
                      
                      return (
                        <div key={role.id} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleRole(role.id)}
                            disabled={!canAssign}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white">{role.name}</p>
                              {!canAssign && (
                                <Badge variant="secondary" className="text-xs">Недоступно</Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400">{role.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {role.permissions.map(perm => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {PERMISSION_LABELS[perm]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Store" className="h-5 w-5 text-purple-500" />
                      Роли для магазинов
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groupedContentRoles.shop.map(role => {
                      const canAssign = role.canBeAssignedBy.includes(currentUserRole);
                      const isSelected = selectedRoles.includes(role.id);
                      
                      return (
                        <div key={role.id} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleRole(role.id)}
                            disabled={!canAssign}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">{role.name}</p>
                            <p className="text-sm text-zinc-400">{role.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Wrench" className="h-5 w-5 text-yellow-500" />
                      Роли для сервисов
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groupedContentRoles.service.map(role => {
                      const canAssign = role.canBeAssignedBy.includes(currentUserRole);
                      const isSelected = selectedRoles.includes(role.id);
                      
                      return (
                        <div key={role.id} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleRole(role.id)}
                            disabled={!canAssign}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">{role.name}</p>
                            <p className="text-sm text-zinc-400">{role.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="GraduationCap" className="h-5 w-5 text-orange-500" />
                      Роли для мотошкол
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groupedContentRoles.school.map(role => {
                      const canAssign = role.canBeAssignedBy.includes(currentUserRole);
                      const isSelected = selectedRoles.includes(role.id);
                      
                      return (
                        <div key={role.id} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleRole(role.id)}
                            disabled={!canAssign}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">{role.name}</p>
                            <p className="text-sm text-zinc-400">{role.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="FileText" className="h-5 w-5 text-green-500" />
                      Роли для байк-постов
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groupedContentRoles.post.map(role => {
                      const canAssign = role.canBeAssignedBy.includes(currentUserRole);
                      const isSelected = selectedRoles.includes(role.id);
                      
                      return (
                        <div key={role.id} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleRole(role.id)}
                            disabled={!canAssign}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">{role.name}</p>
                            <p className="text-sm text-zinc-400">{role.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {isCEO && (
                  <Card className="bg-zinc-800 border-red-700 border-2">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon name="Key" className="h-5 w-5 text-red-500" />
                        Дополнительные разрешения (только CEO)
                      </CardTitle>
                      <p className="text-sm text-zinc-400">Индивидуальные разрешения помимо ролей</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                        <div key={category} className="space-y-2">
                          <p className="font-semibold text-white capitalize">{category}</p>
                          <div className="space-y-2 ml-4">
                            {permissions.map(perm => (
                              <div key={perm} className="flex items-center gap-3">
                                <Checkbox
                                  checked={customPermissions.includes(perm as Permission)}
                                  onCheckedChange={() => handleTogglePermission(perm as Permission)}
                                />
                                <label className="text-sm text-zinc-300">
                                  {PERMISSION_LABELS[perm as Permission]}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-blue-900/20 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="CheckCircle" className="h-5 w-5 text-blue-500" />
                      Итоговые разрешения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {getAllPermissions().map(perm => (
                        <Badge key={perm} className="bg-blue-600 text-white">
                          {PERMISSION_LABELS[perm]}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-700">
              <Button variant="ghost" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Сохранить изменения
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ScrollArea className="h-[500px] pr-4">
              {loadingActivities ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader2" className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Activity" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">История действий пуста</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <Card key={activity.id} className="bg-zinc-800 border-zinc-700">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon name="Activity" className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-white">{activity.action}</p>
                                {activity.location && (
                                  <p className="text-sm text-zinc-400">{activity.location}</p>
                                )}
                                {activity.details && (
                                  <p className="text-sm text-zinc-500 mt-1">{activity.details}</p>
                                )}
                              </div>
                              <p className="text-xs text-zinc-500 whitespace-nowrap">
                                {new Date(activity.created_at).toLocaleString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;