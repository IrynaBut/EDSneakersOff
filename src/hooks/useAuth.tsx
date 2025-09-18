import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData?: { first_name?: string; last_name?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
  firstName: string | null;
  role: string | null;
  email: string | null;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Timeout de sécurité pour empêcher le chargement infini
    const timeoutId = setTimeout(() => {
      console.log('Loading timeout - forcing loading to false');
      setLoading(false);
    }, 5000);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        clearTimeout(timeoutId);
        
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setEmail(currentUser?.email ?? null);
        setUserId(currentUser?.id ?? null);
        
        if (event === 'SIGNED_OUT' || !currentUser) {
          setFirstName(null);
          setRole(null);
          setLoading(false);
          return;
        }
        
        // Déterminer le rôle et prénom directement par email (plus simple)
        const currentEmail = currentUser.email;
        let userRole = 'client';
        let userFirstName = null;
        
        if (currentEmail === 'but.iryna@gmail.com') {
          userRole = 'admin';
          userFirstName = 'Iryna';
        } else if (currentEmail === 'but_iryna@inbox.ru') {
          userRole = 'vendeur';
          userFirstName = 'Thomas';
        } else if (currentEmail === 'iryna.but@epitech.digital') {
          userRole = 'client';
          userFirstName = 'Iryna';
        }
        
        setRole(userRole);
        setFirstName(userFirstName);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      clearTimeout(timeoutId);
      
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setEmail(currentUser?.email ?? null);
      setUserId(currentUser?.id ?? null);
      
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      // Déterminer le rôle et prénom directement par email
      const currentEmail = currentUser.email;
      let userRole = 'client';
      let userFirstName = null;
      
      if (currentEmail === 'but.iryna@gmail.com') {
        userRole = 'admin';
        userFirstName = 'Iryna';
      } else if (currentEmail === 'but_iryna@inbox.ru') {
        userRole = 'vendeur';
        userFirstName = 'Thomas';
      } else if (currentEmail === 'iryna.but@epitech.digital') {
        userRole = 'client';
        userFirstName = 'Iryna';
      }
      
      setRole(userRole);
      setFirstName(userFirstName);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: { first_name?: string; last_name?: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData || {}
        }
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    firstName,
    role,
    email,
    userId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};