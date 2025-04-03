
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/schema";

interface AuthContextType {
  user: User | null;
  profile: Tables['profiles'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables['profiles'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change:", event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Use setTimeout to prevent potential deadlocks with Supabase client
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id).then(profileData => {
              setProfile(profileData);
              setIsLoading(false);
            });
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(profileData => {
          setProfile(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      // Profile will be created automatically via database trigger
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      
      // First explicitly clear the state to avoid any dependencies on it during signOut
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Then attempt to sign out
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only clear local storage, not server session
      });
      
      if (error) {
        // If there's an error, log it but don't throw - we still want to complete the logout
        console.error("Logout API error:", error);
      }
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });

      // Use setTimeout to ensure state updates complete before redirecting
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Even if there's an error, we still want to clear the local state and redirect
      toast({
        title: "Logout completed",
        description: "You have been logged out, but there was a server error."
      });
      
      // Redirect regardless of error
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
