import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleBadge, getRoleEmoji } from "./RoleBadge";

interface AdminUsersProps {
  users: any[];
  currentUserRole?: string;
  onRoleChange: (userId: number, newRole: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, currentUserRole, onRoleChange }) => {
  const canChangeRoles = currentUserRole === 'admin' || currentUserRole === 'ceo';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Пользователи системы</CardTitle>
          <p className="text-sm text-muted-foreground">
            Всего зарегистрировано: {users.length} пользователей
          </p>
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
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {u.avatar_url && (
                        <img src={u.avatar_url} alt={u.name} className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {u.name}
                          {getRoleEmoji(u.role) && (
                            <span className="text-lg">{getRoleEmoji(u.role)}</span>
                          )}
                        </p>
                        {u.username && (
                          <p className="text-xs text-muted-foreground">@{u.username}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="text-center">
                    <RoleBadge
                      currentRole={u.role}
                      canChange={canChangeRoles}
                      onRoleChange={(newRole) => onRoleChange(u.id, newRole)}
                      isCeo={u.role === 'ceo'}
                    />
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
