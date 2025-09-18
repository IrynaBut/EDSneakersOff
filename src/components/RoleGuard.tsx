import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ children, allowedRoles, redirectTo = '/' }: RoleGuardProps) => {
  const { loading, role, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ne pas rediriger pendant le chargement
    if (loading) return;

    // Si pas connecté, rediriger vers auth
    if (!user) {
      navigate('/auth');
      return;
    }

    // Si rôle non autorisé, rediriger
    if (role && !allowedRoles.includes(role)) {
      const defaultRoute = role === 'admin' ? '/admin' : 
                          role === 'vendeur' ? '/vendeur' : 
                          '/mon-compte';
      navigate(defaultRoute);
      return;
    }
  }, [loading, role, user, navigate, allowedRoles]);

  // Afficher le spinner pendant le chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  // Si pas connecté ou rôle non autorisé, ne rien afficher (redirection en cours)
  if (!user || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;