import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
      // В реальном приложении здесь будет запрос к API
      // Для демонстрации создаем профиль пользователя
      const userProfile: UserProfile = {
        id: Date.now(),
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        photoUrl: telegramUser.photo_url,
        role: telegramUser.username === "admin" ? "admin" : "user",
        joinDate: new Date().toISOString(),
        isActive: true,
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
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("moto-user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
