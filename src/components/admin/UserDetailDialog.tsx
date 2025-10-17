import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLES, type Permission, type GlobalRole } from '@/types/roles';
import UserInfoTab from './UserInfoTab';
import RolesTab from './RolesTab';
import ActivityTab from './ActivityTab';

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

  const allPermissions = getAllPermissions();

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
            <UserInfoTab user={user} allPermissions={allPermissions} />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RolesTab
              selectedRoles={selectedRoles}
              customPermissions={customPermissions}
              currentUserRole={currentUserRole}
              isCEO={isCEO}
              onToggleRole={handleToggleRole}
              onTogglePermission={handleTogglePermission}
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ActivityTab activities={activities} loadingActivities={loadingActivities} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-600 text-white hover:bg-zinc-800"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Сохранить изменения
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
