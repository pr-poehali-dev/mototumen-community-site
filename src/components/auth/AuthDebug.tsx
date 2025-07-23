import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-right duration-300">
      <Card className="bg-dark-800 border-dark-600 text-white text-sm shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Bug" className="h-4 w-4 mr-2" />
              Auth Debug
            </div>
            <div className="text-xs text-green-400">🔍 DEV</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div>
            <strong>isAuthenticated:</strong> {isAuthenticated ? '✅' : '❌'}
          </div>
          <div>
            <strong>isLoading:</strong> {isLoading ? '⏳' : '✅'}
          </div>
          <div>
            <strong>user:</strong> {user ? '✅' : '❌'}
          </div>
          {user && (
            <div className="mt-2 p-2 bg-dark-900 rounded">
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>firstName:</strong> {user.firstName}</div>
              <div><strong>lastName:</strong> {user.lastName || 'null'}</div>
              <div><strong>username:</strong> {user.username || 'null'}</div>
              <div><strong>photoUrl:</strong> {user.photoUrl ? '✅' : '❌'}</div>
              <div><strong>role:</strong> {user.role}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebug;