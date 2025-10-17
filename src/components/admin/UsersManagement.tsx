import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import UserDetailDialog from './UserDetailDialog';
import { type Permission, type GlobalRole } from '@/types/roles';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_API = 'https://functions.poehali.dev/da5d34db-c6f1-41e1-aef6-e0c39613ad3b';

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  avatar_url?: string;
  location?: string;
  created_at?: string;
  roles?: string[];
  permissions?: Permission[];
}

const UsersManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ADMIN_API}?action=list_users`);
      
      if (response.ok) {
        const data = await response.json();
        const loadedUsers = (data.users || []).map((u: any) => ({
          id: String(u.id),
          name: u.name,
          email: u.email,
          username: u.username,
          role: u.role as GlobalRole | 'user',
          status: 'active' as const,
          avatar_url: u.avatar_url,
          location: u.location,
          created_at: u.created_at,
          roles: u.roles || [],
          permissions: u.permissions || [],
        }));
        setUsers(loadedUsers);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBlockUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  const handleChangeRole = (userId: string, newRole: 'user' | 'admin') => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const handleOpenUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateRoles = (userId: string, roles: string[]) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, roles } : u
    ));
  };

  const handleUpdatePermissions = (userId: string, permissions: Permission[]) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, permissions } : u
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm">
          <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h3 className="text-xl font-bold text-white">Управление пользователями</h3>
        <div className="w-20" />
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800 rounded-lg border border-zinc-700">
          <Icon name="Users" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-zinc-800">
                <TableHead className="text-zinc-400">Пользователь</TableHead>
                <TableHead className="text-zinc-400">Username</TableHead>
                <TableHead className="text-zinc-400">Роль</TableHead>
                <TableHead className="text-zinc-400">Статус</TableHead>
                <TableHead className="text-zinc-400">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-zinc-700 hover:bg-zinc-700/50 cursor-pointer"
                  onClick={() => handleOpenUserDetail(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        {user.location && <p className="text-xs text-zinc-500">{user.location}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {user.username ? `@${user.username}` : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.slice(0, 2).map(roleId => (
                          <Badge key={roleId} variant="secondary" className="text-xs">
                            {roleId}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-xs">user</Badge>
                      )}
                      {user.roles && user.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{user.roles.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenUserDetail(user)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                      >
                        <Icon name="Eye" className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleBlockUser(user.id)}
                        className={user.status === 'active' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' : 'text-green-400 hover:text-green-300 hover:bg-green-900/30'}
                      >
                        <Icon name={user.status === 'active' ? 'Ban' : 'CheckCircle'} className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUser && (
        <UserDetailDialog
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          user={selectedUser}
          currentUserRole={currentUserRole}
          onUpdateRoles={handleUpdateRoles}
          onUpdatePermissions={handleUpdatePermissions}
        />
      )}
    </div>
  );
};

export default UsersManagement;