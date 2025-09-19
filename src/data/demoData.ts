// Données de démonstration cohérentes pour commandes et factures
// Utilisées en fallback quand la base est vide pour l’affichage et le calcul du CA

export type DemoAddress = {
  first_name?: string;
  last_name?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  country?: string;
  is_pickup_point?: boolean;
};

export type DemoOrderItem = {
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: { name: string; main_image_url?: string };
  product_variants?: { size: string; color?: string };
};

export type DemoOrder = {
  id: string;
  order_number: string;
  user_id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'completed' | 'pending' | 'cancelled';
  payment_status?: 'paid' | 'pending' | 'failed' | 'refunded';
  payment_method?: 'card' | 'paypal' | 'bank_transfer';
  total_amount: number;
  created_at: string;
  metadata?: { tracking_number?: string };
  profiles?: { first_name?: string; last_name?: string; email: string } | null;
  shipping_address?: DemoAddress;
  billing_address?: DemoAddress;
  order_items?: DemoOrderItem[];
};

export type DemoInvoice = {
  id: string;
  invoice_number: string;
  type: 'supplier' | 'client';
  supplier_name?: string;
  supplier_contact?: string;
  total_amount: number;
  currency: 'EUR';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  payment_method?: string;
  created_at: string;
  due_date?: string;
  paid_date?: string;
  metadata?: { client_name?: string; client_email?: string; order_number?: string };
};

const today = new Date();
const iso = (d: Date) => d.toISOString();

// Dates
const d1 = new Date(today); // today
const d2 = new Date(today); d2.setDate(d2.getDate() - 17); // 17 days ago
const d3 = new Date(today); // today
const d4 = new Date(today); d4.setDate(d4.getDate() - 40); // 40 days ago

export const demoOrders: DemoOrder[] = [
  {
    id: 'demo-ord-1',
    order_number: 'EDN-2025-261-1234',
    user_id: 'demo-user-1',
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'card',
    total_amount: 149.90,
    created_at: iso(d1),
    metadata: { tracking_number: 'FR2611234XYZ' },
    profiles: { first_name: 'Marie', last_name: 'Durand', email: 'marie.durand@gmail.com' },
    shipping_address: {
      first_name: 'Marie', last_name: 'Durand',
      address_line_1: '12 Rue des Lilas', address_line_2: 'Appartement 3B', 
      city: 'Lyon', postal_code: '69001', country: 'France'
    },
    billing_address: {
      first_name: 'Marie', last_name: 'Durand',
      address_line_1: '12 Rue des Lilas', address_line_2: 'Appartement 3B', 
      city: 'Lyon', postal_code: '69001', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-1', variant_id: 'v-1', quantity: 1, unit_price: 149.90, total_price: 149.90,
        products: { name: 'Nike Air Max 270', main_image_url: 'https://images.unsplash.com/photo-1542293787938-c9e299b88054?w=300' },
        product_variants: { size: '42', color: 'Noir' }
      }
    ]
  },
  {
    id: 'demo-ord-2',
    order_number: 'EDN-2025-244-5678',
    user_id: 'demo-user-2',
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'paypal',
    total_amount: 189.99,
    created_at: iso(d2),
    metadata: { tracking_number: 'FR2445678ABC' },
    profiles: { first_name: 'Thomas', last_name: 'Bernard', email: 'thomas.bernard@hotmail.fr' },
    shipping_address: {
      is_pickup_point: true,
      address_line_1: 'Relais Colis - Tabac du Centre', address_line_2: '15 Place de la République', 
      city: 'Paris', postal_code: '75002', country: 'France'
    },
    billing_address: {
      first_name: 'Thomas', last_name: 'Bernard',
      address_line_1: '8 Avenue Victor Hugo', address_line_2: 'Résidence Les Jardins', 
      city: 'Paris', postal_code: '75016', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-2', variant_id: 'v-2', quantity: 1, unit_price: 189.99, total_price: 189.99,
        products: { name: 'Adidas Ultra Boost 22', main_image_url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=300' },
        product_variants: { size: '44', color: 'Blanc' }
      }
    ]
  },
  {
    id: 'demo-ord-3',
    order_number: 'EDN-2025-261-9012',
    user_id: 'demo-user-3',
    status: 'processing',
    payment_status: 'paid',
    payment_method: 'card',
    total_amount: 129.95,
    created_at: iso(d3),
    profiles: { first_name: 'Clara', last_name: 'Petit', email: 'clara.petit@orange.fr' },
    shipping_address: {
      first_name: 'Clara', last_name: 'Petit',
      address_line_1: '22 Rue Pasteur', address_line_2: 'Bâtiment A, Porte 5', 
      city: 'Bordeaux', postal_code: '33000', country: 'France'
    },
    billing_address: {
      first_name: 'Clara', last_name: 'Petit',
      address_line_1: '22 Rue Pasteur', address_line_2: 'Bâtiment A, Porte 5', 
      city: 'Bordeaux', postal_code: '33000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-3', variant_id: 'v-3', quantity: 1, unit_price: 129.95, total_price: 129.95,
        products: { name: 'Converse Chuck Taylor All Star', main_image_url: 'https://images.unsplash.com/photo-1520975922215-230f6c0f9621?w=300' },
        product_variants: { size: '38', color: 'Rouge' }
      }
    ]
  },
  {
    id: 'demo-ord-4',
    order_number: 'EDN-2025-221-3456',
    user_id: 'demo-user-4',
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    total_amount: 179.00,
    created_at: iso(d4),
    profiles: { first_name: 'Nadia', last_name: 'Martin', email: 'nadia.martin@yahoo.fr' },
    shipping_address: {
      first_name: 'Nadia', last_name: 'Martin',
      address_line_1: "5 Chemin des Vignes", address_line_2: 'Villa Les Palmiers', 
      city: 'Nice', postal_code: '06000', country: 'France'
    },
    billing_address: {
      first_name: 'Nadia', last_name: 'Martin',
      address_line_1: "5 Chemin des Vignes", address_line_2: 'Villa Les Palmiers', 
      city: 'Nice', postal_code: '06000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-4', variant_id: 'v-4', quantity: 1, unit_price: 179.00, total_price: 179.00,
        products: { name: 'Puma RS-X Reinvention', main_image_url: 'https://images.unsplash.com/photo-1520975594086-2208d157c9e2?w=300' },
        product_variants: { size: '43', color: 'Bleu Marine' }
      }
    ]
  },
  {
    id: 'demo-ord-5',
    order_number: 'EDN-2025-262-7890',
    user_id: 'demo-user-5',
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'card',
    total_amount: 199.99,
    created_at: iso(d1),
    metadata: { tracking_number: 'FR2627890DEF' },
    profiles: { first_name: 'Lucas', last_name: 'Moreau', email: 'lucas.moreau@free.fr' },
    shipping_address: {
      first_name: 'Lucas', last_name: 'Moreau',
      address_line_1: '78 Boulevard Voltaire', address_line_2: '2ème étage, porte droite', 
      city: 'Marseille', postal_code: '13001', country: 'France'
    },
    billing_address: {
      first_name: 'Lucas', last_name: 'Moreau',
      address_line_1: '78 Boulevard Voltaire', address_line_2: '2ème étage, porte droite', 
      city: 'Marseille', postal_code: '13001', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-5', variant_id: 'v-5', quantity: 1, unit_price: 199.99, total_price: 199.99,
        products: { name: 'Jordan 1 Mid', main_image_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300' },
        product_variants: { size: '41', color: 'Noir/Rouge' }
      }
    ]
  },
  {
    id: 'demo-ord-6',
    order_number: 'EDN-2025-245-1111',
    user_id: 'demo-user-6',
    status: 'pending',
    payment_status: 'paid',
    payment_method: 'paypal',
    total_amount: 159.90,
    created_at: iso(d2),
    profiles: { first_name: 'Sophie', last_name: 'Leroy', email: 'sophie.leroy@laposte.net' },
    shipping_address: {
      is_pickup_point: true,
      address_line_1: 'Point Relais Chronopost', address_line_2: '67 Rue de Metz', 
      city: 'Toulouse', postal_code: '31000', country: 'France'
    },
    billing_address: {
      first_name: 'Sophie', last_name: 'Leroy',
      address_line_1: '45 Rue de la République', address_line_2: 'Résidence Le Capitole', 
      city: 'Toulouse', postal_code: '31000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-6', variant_id: 'v-6', quantity: 1, unit_price: 159.90, total_price: 159.90,
        products: { name: 'Vans Old Skool', main_image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300' },
        product_variants: { size: '39', color: 'Noir/Blanc' }
      }
    ]
  },
  {
    id: 'demo-ord-7',
    order_number: 'EDN-2025-263-2222',
    user_id: 'demo-user-7',
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'card',
    total_amount: 369.98,
    created_at: iso(d3),
    metadata: { tracking_number: 'FR2632222GHI' },
    profiles: { first_name: 'Pierre', last_name: 'Dubois', email: 'pierre.dubois@wanadoo.fr' },
    shipping_address: {
      first_name: 'Pierre', last_name: 'Dubois',
      address_line_1: '12 Avenue des Champs-Élysées', address_line_2: 'Immeuble Le Strasbourg', 
      city: 'Strasbourg', postal_code: '67000', country: 'France'
    },
    billing_address: {
      first_name: 'Pierre', last_name: 'Dubois',
      address_line_1: '12 Avenue des Champs-Élysées', address_line_2: 'Immeuble Le Strasbourg', 
      city: 'Strasbourg', postal_code: '67000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-7', variant_id: 'v-7', quantity: 2, unit_price: 184.99, total_price: 369.98,
        products: { name: 'New Balance 990v5', main_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300' },
        product_variants: { size: '42', color: 'Gris' }
      }
    ]
  },
  {
    id: 'demo-ord-8',
    order_number: 'EDN-2025-220-3333',
    user_id: 'demo-user-8',
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    total_amount: 139.95,
    created_at: iso(d4),
    profiles: { first_name: 'Emma', last_name: 'Rousseau', email: 'emma.rousseau@sfr.fr' },
    shipping_address: {
      first_name: 'Emma', last_name: 'Rousseau',
      address_line_1: '88 Rue Saint-Antoine', address_line_2: 'Maison individuelle', 
      city: 'Nantes', postal_code: '44000', country: 'France'
    },
    billing_address: {
      first_name: 'Emma', last_name: 'Rousseau',
      address_line_1: '88 Rue Saint-Antoine', address_line_2: 'Maison individuelle', 
      city: 'Nantes', postal_code: '44000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-8', variant_id: 'v-8', quantity: 1, unit_price: 139.95, total_price: 139.95,
        products: { name: 'Reebok Club C 85', main_image_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300' },
        product_variants: { size: '37', color: 'Blanc/Vert' }
      }
    ]
  }
];

// CA basé sur commandes payées: shipped + delivered + completed = 149.90 + 189.99 + 179.00 + 199.99 + 369.98 + 139.95 = 1228.81€ (nouvelle cohérence)
export const demoClientInvoices: DemoInvoice[] = [
  {
    id: 'demo-inv-c1',
    invoice_number: 'FAC-2025-0001',
    type: 'client',
    total_amount: 149.90,
    currency: 'EUR',
    status: 'paid',
    payment_method: 'Carte bancaire',
    created_at: iso(d1),
    paid_date: iso(d1),
    metadata: { client_name: 'Marie Durand', client_email: 'marie.durand@gmail.com', order_number: 'EDN-2025-261-1234' }
  },
  {
    id: 'demo-inv-c2',
    invoice_number: 'FAC-2025-0002',
    type: 'client',
    total_amount: 89.90,
    currency: 'EUR',
    status: 'paid',
    payment_method: 'PayPal',
    created_at: iso(d2),
    paid_date: iso(d2),
    metadata: { client_name: 'Thomas Bernard', client_email: 'thomas.bernard@hotmail.fr', order_number: 'EDN-2025-244-5678' }
  },
  {
    id: 'demo-inv-c3',
    invoice_number: 'FAC-2025-0003',
    type: 'client',
    total_amount: 129.00,
    currency: 'EUR',
    status: 'paid',
    payment_method: 'Virement bancaire',
    created_at: iso(d4),
    paid_date: iso(d4),
    metadata: { client_name: 'Nadia Martin', client_email: 'nadia.martin@yahoo.fr', order_number: 'EDN-2025-221-3456' }
  }
];

export const demoSupplierInvoices: DemoInvoice[] = [
  {
    id: 'demo-inv-s1',
    invoice_number: 'FS-2025-0101',
    type: 'supplier',
    supplier_name: 'TextilPro SARL',
    supplier_contact: 'contact@textilpro.eu',
    total_amount: 450.00,
    currency: 'EUR',
    status: 'overdue',
    created_at: iso(d2),
    due_date: iso(new Date(d2.getTime() + 7 * 24 * 3600 * 1000))
  },
  {
    id: 'demo-inv-s2',
    invoice_number: 'FS-2025-0102',
    type: 'supplier',
    supplier_name: 'LogiPack SAS',
    supplier_contact: 'support@logipack.fr',
    total_amount: 320.00,
    currency: 'EUR',
    status: 'pending',
    created_at: iso(d1),
    due_date: iso(new Date(d1.getTime() + 14 * 24 * 3600 * 1000))
  }
];

export const demoInvoices: DemoInvoice[] = [
  ...demoClientInvoices,
  ...demoSupplierInvoices
];
