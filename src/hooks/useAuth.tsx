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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setEmail(currentUser?.email ?? null);
        setUserId(currentUser?.id ?? null);
        
        // Réinitialiser l'état dérivé lors de la déconnexion
        if (event === 'SIGNED_OUT' || !currentUser) {
          setFirstName(null);
          setRole(null);
          setLoading(false);
          return;
        }
        
        // Charger le profil après connexion ou refresh
        if (currentUser) {
          await loadUserProfile(currentUser);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setEmail(currentUser?.email ?? null);
      setUserId(currentUser?.id ?? null);
      
      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      console.log('Loading profile for user:', user.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, first_name')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        // Fallback: utiliser l'email pour déterminer le rôle
        const currentEmail = user.email;
        const fallbackRole = currentEmail === 'but.iryna@gmail.com'
          ? 'admin'
          : currentEmail === 'but_iryna@inbox.ru'
          ? 'vendeur'
          : currentEmail === 'iryna.but@epitech.digital'
          ? 'client'
          : 'client';

        const fallbackFirstName = currentEmail === 'but.iryna@gmail.com'
          ? 'Iryna'
          : currentEmail === 'but_iryna@inbox.ru'
          ? 'Thomas'
          : currentEmail === 'iryna.but@epitech.digital'
          ? 'Iryna'
          : null;

        setRole(fallbackRole);
        setFirstName(fallbackFirstName);
        setLoading(false);
        return;
      }

      console.log('Profile loaded:', profile);
      setFirstName(profile?.first_name ?? null);
      setRole(profile?.role ?? 'client');
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // En cas d'erreur critique, utiliser des valeurs par défaut
      setRole('client');
      setFirstName(null);
    } finally {
      // TOUJOURS arrêter le chargement
      setLoading(false);
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
    userId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};