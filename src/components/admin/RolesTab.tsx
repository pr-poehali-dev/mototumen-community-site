import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { ROLES, PERMISSION_LABELS, PERMISSION_CATEGORIES, type Permission, type GlobalRole } from '@/types/roles';

interface RolesTabProps {
  selectedRoles: string[];
  customPermissions: Permission[];
  currentUserRole: GlobalRole;
  isCEO: boolean;
  onToggleRole: (roleId: string) => void;
  onTogglePermission: (permission: Permission) => void;
}

const RolesTab: React.FC<RolesTabProps> = ({
  selectedRoles,
  customPermissions,
  currentUserRole,
  isCEO,
  onToggleRole,
  onTogglePermission,
}) => {
  const globalRoles = Object.values(ROLES).filter(r => r.category === 'global');
  const contentRoles = Object.values(ROLES).filter(r => r.category !== 'global');

  const groupedContentRoles = {
    shop: contentRoles.filter(r => r.category === 'shop'),
    service: contentRoles.filter(r => r.category === 'service'),
    school: contentRoles.filter(r => r.category === 'school'),
    post: contentRoles.filter(r => r.category === 'post'),
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Icon name="Shield" className="h-5 w-5 text-accent" />
            Глобальные роли
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {globalRoles.map(role => {
              const canAssign = role.canBeAssignedBy.includes(currentUserRole);
              const isSelected = selectedRoles.includes(role.id);
              
              return (
                <div
                  key={role.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    canAssign
                      ? 'border-zinc-700 hover:bg-zinc-700/50 cursor-pointer'
                      : 'border-zinc-800 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => canAssign && onToggleRole(role.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={!canAssign}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={role.icon} className="h-4 w-4 text-accent" />
                      <span className="font-semibold text-white">{role.name}</span>
                      {!canAssign && (
                        <Badge variant="outline" className="text-xs border-red-500 text-red-400">
                          Нет доступа
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">{role.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.map(perm => (
                        <Badge
                          key={perm}
                          variant="outline"
                          className="text-xs border-accent/50 text-zinc-400"
                        >
                          {PERMISSION_LABELS[perm]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Icon name="FileText" className="h-5 w-5 text-accent" />
            Контентные роли
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedContentRoles).map(([category, roles]) => {
                if (roles.length === 0) return null;
                
                const categoryInfo = PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES];
                
                return (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                      <Icon name={categoryInfo.icon} className="h-4 w-4" />
                      {categoryInfo.name}
                    </h4>
                    <div className="space-y-2">
                      {roles.map(role => {
                        const canAssign = role.canBeAssignedBy.includes(currentUserRole);
                        const isSelected = selectedRoles.includes(role.id);
                        
                        return (
                          <div
                            key={role.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              canAssign
                                ? 'border-zinc-700 hover:bg-zinc-700/50 cursor-pointer'
                                : 'border-zinc-800 opacity-50 cursor-not-allowed'
                            }`}
                            onClick={() => canAssign && onToggleRole(role.id)}
                          >
                            <Checkbox
                              checked={isSelected}
                              disabled={!canAssign}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon name={role.icon} className="h-4 w-4 text-accent" />
                                <span className="font-semibold text-white">{role.name}</span>
                                {!canAssign && (
                                  <Badge variant="outline" className="text-xs border-red-500 text-red-400">
                                    Нет доступа
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-zinc-400">{role.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {role.permissions.map(perm => (
                                  <Badge
                                    key={perm}
                                    variant="outline"
                                    className="text-xs border-accent/50 text-zinc-400"
                                  >
                                    {PERMISSION_LABELS[perm]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {isCEO && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Icon name="Settings" className="h-5 w-5 text-accent" />
              Дополнительные разрешения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {Object.entries(PERMISSION_CATEGORIES).map(([category, info]) => {
                  const categoryPermissions = Object.entries(PERMISSION_LABELS)
                    .filter(([perm]) => perm.startsWith(category))
                    .map(([perm]) => perm as Permission);
                  
                  if (categoryPermissions.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-zinc-400 mb-2 flex items-center gap-2">
                        <Icon name={info.icon} className="h-4 w-4" />
                        {info.name}
                      </h4>
                      <div className="space-y-2">
                        {categoryPermissions.map(perm => (
                          <div
                            key={perm}
                            className="flex items-center gap-3 p-2 rounded-lg border border-zinc-700 hover:bg-zinc-700/50 cursor-pointer"
                            onClick={() => onTogglePermission(perm)}
                          >
                            <Checkbox checked={customPermissions.includes(perm)} />
                            <span className="text-white text-sm">{PERMISSION_LABELS[perm]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RolesTab;
