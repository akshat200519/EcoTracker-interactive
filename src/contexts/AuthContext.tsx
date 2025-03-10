
import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
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

// API URL - using environment variable if available, otherwise default to localhost
// In production, you should use environment variables for this
const API_URL = 'https://ecotracker-api.onrender.com/api/users';
// Fallback API URL for local development
const FALLBACK_API_URL = 'http://localhost:5000/api/users';

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

  const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const loginBody = JSON.stringify({ email, password });
    console.log(`Attempting to login with ${API_URL}/login`);
    
    try {
      // Try primary API URL first
      try {
        const response = await fetchWithTimeout(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: loginBody,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
        
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("ecotracker-user", JSON.stringify(userData));
        return;
      } catch (primaryError) {
        console.warn("Primary API failed, trying fallback:", primaryError);
        // If primary fails, try fallback URL
        const response = await fetchWithTimeout(`${FALLBACK_API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: loginBody,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
        
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("ecotracker-user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Network error: Please make sure the backend server is running on localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    const signupBody = JSON.stringify({ name, email, password });
    console.log(`Attempting to signup with ${API_URL}/signup`);
    
    try {
      // Try primary API URL first
      try {
        const response = await fetchWithTimeout(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: signupBody,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
        
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("ecotracker-user", JSON.stringify(userData));
        return;
      } catch (primaryError) {
        console.warn("Primary API failed, trying fallback:", primaryError);
        // If primary fails, try fallback URL
        const response = await fetchWithTimeout(`${FALLBACK_API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: signupBody,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
        
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("ecotracker-user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Network error: Please make sure the backend server is running on localhost:5000');
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
