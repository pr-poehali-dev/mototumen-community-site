import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AUTH_API = 'https://functions.poehali.dev/37848519-8d12-40c1-b0cb-f22c293fcdb5';

interface User {
  id: number;
  name: string;
  username?: string;
  avatar_url?: string;
  location?: string;
  created_at: string;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token, user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (search = "") => {
    setLoading(true);
    try {
      const url = search 
        ? `${AUTH_API}?action=public&search=${encodeURIComponent(search)}`
        : `${AUTH_API}?action=public`;
      
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (userId: number) => {
    if (!token) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите чтобы добавлять в друзья",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}?action=friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ friend_id: userId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.message && data.message.includes('ожидаем')) {
          toast({ title: "Заявка уже отправлена", description: "Ожидаем принятие заявки" });
        } else {
          toast({ title: "Заявка отправлена!" });
        }
      } else {
        toast({ title: "Ошибка", description: data.error || "Не удалось отправить заявку", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2 || value.length === 0) {
      loadUsers(value);
    }
  };

  const filteredUsers = users.filter(u => currentUser && u.id !== currentUser.id);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Сообщество</h1>
          <p className="text-zinc-400">Найди единомышленников и добавь в друзья</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Поиск по имени или username..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white h-12 text-lg"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Users" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400">Пользователи не найдены</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 hover:border-accent transition-all"
              >
                <Link to={`/user/${user.id}`}>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                    {user.username && (
                      <p className="text-sm text-zinc-400">@{user.username}</p>
                    )}
                    {user.location && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-2">
                        <Icon name="MapPin" className="h-3 w-3" />
                        {user.location}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="flex gap-2">
                  <Link to={`/user/${user.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-zinc-700">
                      Профиль
                    </Button>
                  </Link>
                  {token && (
                    <Button
                      onClick={() => addFriend(user.id)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <Icon name="UserPlus" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};