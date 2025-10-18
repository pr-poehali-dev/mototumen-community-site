import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RoleBadge, getRoleEmoji } from "./RoleBadge";

interface AdminUsersProps {
  users: any[];
  currentUserRole?: string;
  onRoleChange: (userId: number, newRole: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, currentUserRole, onRoleChange }) => {
  const canChangeRoles = currentUserRole === 'admin' || currentUserRole === 'ceo';
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(u => u.role === roleFilter);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Пользователи системы</CardTitle>
              <p className="text-sm text-muted-foreground">
                Всего зарегистрировано: {users.length} пользователей
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={roleFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('all')}
              >
                Все
              </Button>
              <Button
                size="sm"
                variant={roleFilter === 'ceo' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('ceo')}
              >
                👑 CEO
              </Button>
              <Button
                size="sm"
                variant={roleFilter === 'admin' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('admin')}
              >
                ⚡ Админ
              </Button>
              <Button
                size="sm"
                variant={roleFilter === 'moderator' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('moderator')}
              >
                🛡️ Модератор
              </Button>
              <Button
                size="sm"
                variant={roleFilter === 'user' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('user')}
              >
                Юзеры
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Роль</TableHead>
                <TableHead>Дата регистрации</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {u.avatar_url && (
                        <img src={u.avatar_url} alt={u.name} className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <p className="font-medium flex items-center">
                          {u.name}{getRoleEmoji(u.role)}
                        </p>
                        {u.username && (
                          <p className="text-xs text-muted-foreground">@{u.username}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="text-center">
                    {u.role === 'user' && canChangeRoles ? (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => onRoleChange(u.id, 'admin')}
                          title="Назначить админом"
                        >
                          ⚡
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => onRoleChange(u.id, 'moderator')}
                          title="Назначить модератором"
                        >
                          🛡️
                        </Button>
                      </div>
                    ) : (
                      <RoleBadge
                        currentRole={u.role}
                        canChange={canChangeRoles}
                        onRoleChange={(newRole) => onRoleChange(u.id, newRole)}
                        isCeo={u.role === 'ceo'}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(u.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};