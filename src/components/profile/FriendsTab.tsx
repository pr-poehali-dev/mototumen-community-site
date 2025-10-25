import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AUTH_API = 'https://functions.poehali.dev/37848519-8d12-40c1-b0cb-f22c293fcdb5';

interface Friend {
  id: number;
  name: string;
  username?: string;
  avatar_url?: string;
  location?: string;
  status: 'pending' | 'accepted' | 'rejected';
  direction: 'sent' | 'received';
  created_at: string;
}

interface FriendsTabProps {
  userId?: number;
  readonly?: boolean;
}

export const FriendsTab: React.FC<FriendsTabProps> = ({ userId, readonly = false }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      loadFriends();
    }
  }, [token]);

  const loadFriends = async () => {
    if (!token) return;

    try {
      const url = userId && readonly 
        ? `${AUTH_API}?action=friends&user_id=${userId}`
        : `${AUTH_API}?action=friends`;
      
      const response = await fetch(url, {
        headers: { 'X-Auth-Token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить друзей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptFriend = async (friendId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${AUTH_API}?action=friends`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ friend_id: friendId, status: 'accepted' }),
      });

      if (response.ok) {
        toast({ title: "Заявка принята!" });
        loadFriends();
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const rejectFriend = async (friendId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${AUTH_API}?action=friends`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ friend_id: friendId, status: 'rejected' }),
      });

      if (response.ok) {
        toast({ title: "Заявка отклонена" });
        loadFriends();
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const removeFriend = async (friendId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${AUTH_API}?action=friends&friend_id=${friendId}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token },
      });

      if (response.ok) {
        toast({ title: "Удален из друзей" });
        loadFriends();
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredFriends.filter(f => f.status === 'pending' && f.direction === 'received');
  const acceptedFriends = filteredFriends.filter(f => f.status === 'accepted');
  const sentRequests = filteredFriends.filter(f => f.status === 'pending' && f.direction === 'sent');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Друзья</h3>
          <p className="text-zinc-400">
            {acceptedFriends.length} друзей{!readonly && ` • ${pendingRequests.length} заявок`}
          </p>
        </div>
        {!readonly && (
        <Link to="/users">
          <Button className="bg-accent hover:bg-accent/90">
            <Icon name="UserPlus" className="h-4 w-4 mr-2" />
            Найти друзей
          </Button>
        </Link>
        )}
      </div>

      <div className="relative">
        <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          type="text"
          placeholder="Поиск по имени или username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      {!readonly && pendingRequests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Входящие заявки</h4>
          {pendingRequests.map((friend) => (
            <div key={friend.id} className="bg-zinc-800 border border-accent rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    {friend.avatar_url ? (
                      <img src={friend.avatar_url} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{friend.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">{friend.name}</h5>
                    {friend.username && <p className="text-sm text-zinc-400">@{friend.username}</p>}
                    {friend.location && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <Icon name="MapPin" className="h-3 w-3" />
                        {friend.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => acceptFriend(friend.id)} className="bg-green-600 hover:bg-green-700">
                    <Icon name="Check" className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => rejectFriend(friend.id)} className="border-zinc-700">
                    <Icon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {acceptedFriends.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Мои друзья</h4>
          <div className="grid gap-3">
            {acceptedFriends.map((friend) => (
              <div key={friend.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-accent transition-colors">
                <div className="flex items-center justify-between">
                  <Link to={`/user/${friend.id}`} className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      {friend.avatar_url ? (
                        <img src={friend.avatar_url} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white font-bold">{friend.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">{friend.name}</h5>
                      {friend.username && <p className="text-sm text-zinc-400">@{friend.username}</p>}
                      {friend.location && (
                        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                          <Icon name="MapPin" className="h-3 w-3" />
                          {friend.location}
                        </p>
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFriend(friend.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Icon name="UserMinus" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sentRequests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Исходящие заявки</h4>
          {sentRequests.map((friend) => (
            <div key={friend.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                    <span className="text-zinc-400 font-bold">{friend.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">{friend.name}</h5>
                    {friend.username && <p className="text-sm text-zinc-400">@{friend.username}</p>}
                  </div>
                </div>
                <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                  Ожидает
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredFriends.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">Друзей пока нет</p>
          <p className="text-sm text-zinc-500 mt-2">Найди единомышленников в разделе пользователей</p>
        </div>
      )}
    </div>
  );
};