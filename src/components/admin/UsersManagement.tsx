import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const PROFILE_API = 'https://functions.poehali.dev/f4f5435f-0c34-4d48-9d8e-cf37346b28de';

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
}

const UsersManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${PROFILE_API}?action=public`);
      
      if (response.ok) {
        const data = await response.json();
        const loadedUsers = (data.users || []).map((u: any) => ({
          id: String(u.id),
          name: u.name,
          email: u.email || u.username ? `${u.username}@telegram` : 'Нет email',
          username: u.username,
          role: 'user' as const,
          status: 'active' as const,
          avatar_url: u.avatar_url,
          location: u.location,
          created_at: u.created_at,
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

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
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
                <TableRow key={user.id} className="border-zinc-700 hover:bg-zinc-700/50">
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
                    <Select 
                      value={user.role} 
                      onValueChange={(value) => handleChangeRole(user.id, value as 'user' | 'admin')}
                    >
                      <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="user">Пользователь</SelectItem>
                        <SelectItem value="admin">Админ</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditUser(user)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                      >
                        <Icon name="Edit" className="h-4 w-4" />
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Изменение данных пользователя
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Имя</label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Email</label>
                <Input
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;