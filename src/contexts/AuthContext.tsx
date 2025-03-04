
import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("ecotracker-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you would validate credentials with your backend
    // For demo purposes, we'll simulate a successful login
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // For demo, accept any email/password with simple validation
      if (!email.includes("@") || password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        name: email.split("@")[0],
      };
      
      setUser(newUser);
      localStorage.setItem("ecotracker-user", JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    // In a real app, you would create a new user in your backend
    // For demo purposes, we'll simulate a successful signup
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Validate email and password
      if (!email.includes("@") || password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        name: name || email.split("@")[0],
      };
      
      setUser(newUser);
      localStorage.setItem("ecotracker-user", JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecotracker-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
