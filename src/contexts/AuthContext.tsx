import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient, type User } from "@/services/api";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface UserProfile {
  id: number;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  role: "user" | "admin" | "moderator";
  joinDate: string;
  isActive: boolean;
  bio?: string;
  phone?: string;
  email?: string;
  experience?: 'новичок' | 'любитель' | 'опытный' | 'профессионал';
  location?: string;
  motorcycle?: {
    brand: string;
    model: string;
    year: number;
    photo?: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (telegramUser: TelegramUser) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненные данные авторизации
    const savedUser = localStorage.getItem("moto-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("moto-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (telegramUser: TelegramUser) => {
    setIsLoading(true);

    try {
      // Авторизация через API
      const response = await apiClient.loginWithTelegram({
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        avatar_url: telegramUser.photo_url,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Ошибка авторизации');
      }

      const apiUser = response.data.user;
      const userProfile: UserProfile = {
        id: apiUser.id,
        telegramId: apiUser.telegram_id,
        firstName: apiUser.first_name,
        lastName: apiUser.last_name || undefined,
        username: apiUser.username || undefined,
        photoUrl: apiUser.avatar_url || undefined,
        role: apiUser.username === "admin" ? "admin" : "user",
        joinDate: apiUser.created_at,
        isActive: apiUser.is_active,
        bio: apiUser.bio || undefined,
        phone: apiUser.phone || undefined,
        email: apiUser.email || undefined,
        experience: apiUser.experience || undefined,
        location: apiUser.location || undefined,
      };

      setUser(userProfile);
      localStorage.setItem("moto-user", JSON.stringify(userProfile));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moto-user");
    apiClient.logout();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Подготавливаем данные для API
      const apiUpdates: any = {};
      if (updates.phone !== undefined) apiUpdates.phone = updates.phone;
      if (updates.email !== undefined) apiUpdates.email = updates.email;
      if (updates.bio !== undefined) apiUpdates.bio = updates.bio;
      if (updates.experience !== undefined) apiUpdates.experience = updates.experience;
      if (updates.location !== undefined) apiUpdates.location = updates.location;

      // Обновляем через API
      const response = await apiClient.updateUserProfile(apiUpdates);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Ошибка обновления профиля');
      }

      const apiUser = response.data.user;
      const updatedUser: UserProfile = {
        ...user,
        bio: apiUser.bio || undefined,
        phone: apiUser.phone || undefined,
        email: apiUser.email || undefined,
        experience: apiUser.experience || undefined,
        location: apiUser.location || undefined,
        ...updates, // Локальные обновления (роль, фото и т.д.)
      };

      setUser(updatedUser);
      localStorage.setItem("moto-user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const response = await apiClient.getUserProfile();
      
      if (response.success && response.data) {
        const apiUser = response.data.user;
        const updatedUser: UserProfile = {
          ...user,
          bio: apiUser.bio || undefined,
          phone: apiUser.phone || undefined,
          email: apiUser.email || undefined,
          experience: apiUser.experience || undefined,
          location: apiUser.location || undefined,
        };

        setUser(updatedUser);
        localStorage.setItem("moto-user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};