import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Search, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
}

interface UserPermissions {
  canViewOrders: boolean;
  canEditOrders: boolean;
  canViewProducts: boolean;
  canEditProducts: boolean;
  canViewStock: boolean;
  canEditStock: boolean;
  canViewInvoices: boolean;
  canEditInvoices: boolean;
  canViewAnalytics: boolean;
}

const defaultPermissions: Record<string, UserPermissions> = {
  admin: {
    canViewOrders: true,
    canEditOrders: true,
    canViewProducts: true,
    canEditProducts: true,
    canViewStock: true,
    canEditStock: true,
    canViewInvoices: true,
    canEditInvoices: true,
    canViewAnalytics: true,
  },
  vendeur: {
    canViewOrders: true,
    canEditOrders: true,
    canViewProducts: true,
    canEditProducts: false,
    canViewStock: true,
    canEditStock: true,
    canViewInvoices: true,
    canEditInvoices: true,
    canViewAnalytics: false,
  },
  client: {
    canViewOrders: false,
    canEditOrders: false,
    canViewProducts: false,
    canEditProducts: false,
    canViewStock: false,
    canEditStock: false,
    canViewInvoices: false,
    canEditInvoices: false,
    canViewAnalytics: false,
  }
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions>(defaultPermissions.client);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(usersData || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, role: newRole } : u
      ));

      toast.success(`Rôle utilisateur mis à jour vers ${newRole}`);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const handlePermissionChange = (permission: keyof UserPermissions, value: boolean) => {
    setUserPermissions(prev => ({
      ...prev,
      [permission]: value
    }));
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion des Utilisateurs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérer les rôles et permissions des utilisateurs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {user.first_name} {user.last_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.user_id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="vendeur">Vendeur</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Badge variant={
                        user.role === 'admin' ? 'default' : 
                        user.role === 'vendeur' ? 'secondary' : 'outline'
                      }>
                        {user.role}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setUserPermissions(defaultPermissions[user.role] || defaultPermissions.client);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Permissions utilisateur</CardTitle>
              {selectedUser && (
                <p className="text-sm text-muted-foreground">
                  {selectedUser.first_name} {selectedUser.last_name} - {selectedUser.role}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!selectedUser ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sélectionnez un utilisateur pour voir ses permissions
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Commandes</h4>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="viewOrders"
                          checked={userPermissions.canViewOrders}
                          onCheckedChange={(checked) => handlePermissionChange('canViewOrders', !!checked)}
                        />
                        <label htmlFor="viewOrders" className="text-sm">Voir les commandes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="editOrders"
                          checked={userPermissions.canEditOrders}
                          onCheckedChange={(checked) => handlePermissionChange('canEditOrders', !!checked)}
                        />
                        <label htmlFor="editOrders" className="text-sm">Modifier les commandes</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Produits</h4>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="viewProducts"
                          checked={userPermissions.canViewProducts}
                          onCheckedChange={(checked) => handlePermissionChange('canViewProducts', !!checked)}
                        />
                        <label htmlFor="viewProducts" className="text-sm">Voir les produits</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="editProducts"
                          checked={userPermissions.canEditProducts}
                          onCheckedChange={(checked) => handlePermissionChange('canEditProducts', !!checked)}
                        />
                        <label htmlFor="editProducts" className="text-sm">Modifier les produits</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Stock</h4>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="viewStock"
                          checked={userPermissions.canViewStock}
                          onCheckedChange={(checked) => handlePermissionChange('canViewStock', !!checked)}
                        />
                        <label htmlFor="viewStock" className="text-sm">Voir le stock</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="editStock"
                          checked={userPermissions.canEditStock}
                          onCheckedChange={(checked) => handlePermissionChange('canEditStock', !!checked)}
                        />
                        <label htmlFor="editStock" className="text-sm">Modifier le stock</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Factures</h4>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="viewInvoices"
                          checked={userPermissions.canViewInvoices}
                          onCheckedChange={(checked) => handlePermissionChange('canViewInvoices', !!checked)}
                        />
                        <label htmlFor="viewInvoices" className="text-sm">Voir les factures</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="editInvoices"
                          checked={userPermissions.canEditInvoices}
                          onCheckedChange={(checked) => handlePermissionChange('canEditInvoices', !!checked)}
                        />
                        <label htmlFor="editInvoices" className="text-sm">Modifier les factures</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Analyses</h4>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="viewAnalytics"
                          checked={userPermissions.canViewAnalytics}
                          onCheckedChange={(checked) => handlePermissionChange('canViewAnalytics', !!checked)}
                        />
                        <label htmlFor="viewAnalytics" className="text-sm">Voir les statistiques</label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4"
                    onClick={() => toast.success('Permissions mises à jour (fonctionnalité en développement)')}
                  >
                    Sauvegarder les permissions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};