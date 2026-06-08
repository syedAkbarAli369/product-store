import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../lib/axios";

type User = {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  isAccountVerified: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isVerified: boolean;
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/auth/is-authenticated");
      setIsAuthenticated(data.success);

      if (data.success && data.user) {
        setUser(data.user);
        setIsVerified(data.user.isVerified);
      } else {
        setUser(null);
        setIsVerified(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVerified,
        user,
        loading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};