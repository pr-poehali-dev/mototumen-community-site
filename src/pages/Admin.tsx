import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import Icon from "@/components/ui/icon";
import { AdminModeration } from "@/components/admin/AdminModeration";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminContent } from "@/components/admin/AdminContent";
import { getRoleEmoji, getRoleLabel } from "@/components/admin/RoleBadge";

const ADMIN_API = 'https://functions.poehali.dev/a4bf4de7-33a4-406c-95cc-0529c16d6677';

const Admin = () => {
  const { user, isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pendingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin || !token) return;

    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${ADMIN_API}?action=stats`, {
          headers: { 'X-Auth-Token': token }
        });
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentActivity(statsData.recent_activity || []);

        const usersRes = await fetch(`${ADMIN_API}?action=users`, {
          headers: { 'X-Auth-Token': token }
        });
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, token]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004488] mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    console.log("Approve item:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject item:", id);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ user_id: userId, role: newRole })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
      } else {
        alert(data.error || 'Ошибка при изменении роли');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Не удалось изменить роль');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Точно удалить этого пользователя?')) return;
    
    try {
      const res = await fetch(ADMIN_API, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ user_id: userId })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert(data.error || 'Ошибка при удалении');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Не удалось удалить пользователя');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-primary/10"
            >
              <Icon name="Home" className="h-5 w-5" />
            </Button>
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Панель администратора
            </h1>
          </div>
          <Badge className="bg-red-500 text-white text-base">
            {getRoleEmoji(user?.role || 'admin')} {getRoleLabel(user?.role || 'admin')}
          </Badge>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="organizations">Заявки</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="moderation">Модерация</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard stats={stats} recentActivity={recentActivity} />
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <AdminModeration 
              pendingItems={pendingItems} 
              onApprove={handleApprove} 
              onReject={handleReject} 
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsers users={users} currentUserRole={user?.role} onRoleChange={handleRoleChange} onDeleteUser={handleDeleteUser} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <AdminContent stats={stats} />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              Модерация контента в разработке
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              Настройки в разработке
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;