import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setEmail(session?.user?.email ?? null);
        setLoading(false);
        
        // Réinitialiser l'état dérivé lors de la déconnexion
        if (event === 'SIGNED_OUT' || !currentUser) {
          setFirstName(null);
          setRole(null);
        }
        
        // Redirection basée sur le rôle après connexion
        if (event === 'SIGNED_IN' && currentUser) {
          setTimeout(() => {
            handleRoleBasedRouting(currentUser);
          }, 500);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setEmail(session?.user?.email ?? null);
      setLoading(false);
      if (currentUser) {
        setTimeout(() => {
          handleRoleBasedRouting(currentUser);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRoleBasedRouting = async (user: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, first_name, email')
        .eq('user_id', user.id)
        .single();

      const currentEmail = user.email ?? profile?.email ?? null;
      const fallbackRole = currentEmail === 'but.iryna@gmail.com'
        ? 'admin'
        : currentEmail === 'but_iryna@inbox.ru'
        ? 'vendeur'
        : currentEmail === 'iryna.but@epitech.digital'
        ? 'client'
        : null;

      const resolvedRole = profile?.role ?? fallbackRole;
      const resolvedFirstName = currentEmail === 'but.iryna@gmail.com'
        ? 'Iryna'
        : (profile?.first_name ?? (currentEmail ? currentEmail.split('@')[0] : null));

      setFirstName(resolvedFirstName ?? null);
      setRole(resolvedRole ?? null);

      if (resolvedRole === 'admin') {
        window.location.href = '/admin';
      } else if (resolvedRole === 'vendeur') {
        window.location.href = '/vendeur';
      } else if (resolvedRole === 'client') {
        window.location.href = '/mon-compte';
      }
    } catch (error) {
      console.error('Erreur lors de la redirection basée sur le rôle:', error);
    }
  };

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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};