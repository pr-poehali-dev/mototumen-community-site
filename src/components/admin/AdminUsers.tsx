import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
                <TableHead>Роль</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
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
                        <p className="font-medium">{u.name}</p>
                        {u.username && (
                          <p className="text-xs text-muted-foreground">@{u.username}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'admin' || u.role === 'ceo' ? 'default' : u.role === 'moderator' ? 'secondary' : 'outline'}>
                      {u.role === 'ceo' ? 'CEO' : u.role === 'admin' ? 'Админ' : u.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(u.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    {u.role !== 'ceo' && canChangeRoles && (
                      <div className="flex gap-2">
                        {u.role !== 'admin' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onRoleChange(u.id, 'admin')}
                          >
                            Админ
                          </Button>
                        )}
                        {u.role !== 'moderator' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onRoleChange(u.id, 'moderator')}
                          >
                            Модератор
                          </Button>
                        )}
                        {u.role !== 'user' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onRoleChange(u.id, 'user')}
                          >
                            Пользователь
                          </Button>
                        )}
                      </div>
                    )}
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