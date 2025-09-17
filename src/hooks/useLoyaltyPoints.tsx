import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface LoyaltyPoints {
  id: string;
  user_id: string;
  points: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export const useLoyaltyPoints = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const getUserPoints = async (): Promise<{ points?: LoyaltyPoints; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté' };
    }

    try {
      const { data: points, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      // Si aucun enregistrement trouvé, créer un nouveau
      if (!points) {
        const { data: newPoints, error: createError } = await supabase
          .from('loyalty_points')
          .insert({
            user_id: user.id,
            points: 0,
            total_earned: 0,
            total_spent: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        return { points: newPoints };
      }

      return { points };
    } catch (error: any) {
      console.error('Error fetching loyalty points:', error);
      return { error: error.message || 'Erreur lors du chargement des points' };
    }
  };

  const spendPoints = async (pointsToSpend: number): Promise<{ success?: boolean; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté' };
    }

    setLoading(true);
    try {
      // Récupérer les points actuels
      const { points, error: fetchError } = await getUserPoints();
      if (fetchError) throw new Error(fetchError);
      if (!points) throw new Error('Points de fidélité introuvables');

      if (points.points < pointsToSpend) {
        return { error: 'Points insuffisants' };
      }

      // Déduire les points
      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({
          points: points.points - pointsToSpend,
          total_spent: points.total_spent + pointsToSpend
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success(`${pointsToSpend} points utilisés avec succès !`);
      return { success: true };
    } catch (error: any) {
      console.error('Error spending points:', error);
      const errorMessage = error.message || 'Erreur lors de l\'utilisation des points';
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getAllUsersPoints = async (): Promise<{ allPoints?: LoyaltyPoints[]; error?: string }> => {
    if (!user) {
      return { error: 'Vous devez être connecté' };
    }

    try {
      const { data: allPoints, error } = await supabase
        .from('loyalty_points')
        .select(`
          *,
          profiles!loyalty_points_user_id_fkey (first_name, last_name, email)
        `)
        .order('points', { ascending: false });

      if (error) throw error;

      return { allPoints: allPoints || [] };
    } catch (error: any) {
      console.error('Error fetching all loyalty points:', error);
      return { error: error.message || 'Erreur lors du chargement de tous les points' };
    }
  };

  return {
    loading,
    getUserPoints,
    spendPoints,
    getAllUsersPoints
  };
};