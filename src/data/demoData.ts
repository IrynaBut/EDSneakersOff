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
    profiles: { first_name: 'Marie', last_name: 'Durand', email: 'marie.durand@example.com' },
    shipping_address: {
      first_name: 'Marie', last_name: 'Durand',
      address_line_1: '12 Rue des Lilas', city: 'Lyon', postal_code: '69001', country: 'France'
    },
    billing_address: {
      first_name: 'Marie', last_name: 'Durand',
      address_line_1: '12 Rue des Lilas', city: 'Lyon', postal_code: '69001', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-1', variant_id: 'v-1', quantity: 1, unit_price: 149.90, total_price: 149.90,
        products: { name: 'Baskets Élite', main_image_url: 'https://images.unsplash.com/photo-1542293787938-c9e299b88054?w=300' },
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
    total_amount: 89.90,
    created_at: iso(d2),
    metadata: { tracking_number: 'FR2445678ABC' },
    profiles: { first_name: 'Thomas', last_name: 'Bernard', email: 'thomas.bernard@example.com' },
    shipping_address: {
      is_pickup_point: true,
      address_line_1: 'Relais – Tabac du Centre', city: 'Paris', postal_code: '75002', country: 'France'
    },
    billing_address: {
      first_name: 'Thomas', last_name: 'Bernard',
      address_line_1: '8 Avenue Victor Hugo', city: 'Paris', postal_code: '75016', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-2', variant_id: 'v-2', quantity: 1, unit_price: 89.90, total_price: 89.90,
        products: { name: 'Sweat Confort', main_image_url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=300' },
        product_variants: { size: 'M', color: 'Gris' }
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
    total_amount: 49.90,
    created_at: iso(d3),
    profiles: { first_name: 'Clara', last_name: 'Petit', email: 'clara.petit@example.com' },
    shipping_address: {
      first_name: 'Clara', last_name: 'Petit',
      address_line_1: '22 Rue Pasteur', city: 'Bordeaux', postal_code: '33000', country: 'France'
    },
    billing_address: {
      first_name: 'Clara', last_name: 'Petit',
      address_line_1: '22 Rue Pasteur', city: 'Bordeaux', postal_code: '33000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-3', variant_id: 'v-3', quantity: 1, unit_price: 49.90, total_price: 49.90,
        products: { name: 'T‑shirt Bio', main_image_url: 'https://images.unsplash.com/photo-1520975922215-230f6c0f9621?w=300' },
        product_variants: { size: 'S', color: 'Blanc' }
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
    total_amount: 129.00,
    created_at: iso(d4),
    profiles: { first_name: 'Nadia', last_name: 'Martin', email: 'nadia.martin@example.com' },
    shipping_address: {
      first_name: 'Nadia', last_name: 'Martin',
      address_line_1: "5 Chemin des Vignes", city: 'Nice', postal_code: '06000', country: 'France'
    },
    billing_address: {
      first_name: 'Nadia', last_name: 'Martin',
      address_line_1: "5 Chemin des Vignes", city: 'Nice', postal_code: '06000', country: 'France'
    },
    order_items: [
      {
        product_id: 'p-4', variant_id: 'v-4', quantity: 1, unit_price: 129.00, total_price: 129.00,
        products: { name: 'Veste Urbain', main_image_url: 'https://images.unsplash.com/photo-1520975594086-2208d157c9e2?w=300' },
        product_variants: { size: 'L', color: 'Kaki' }
      }
    ]
  }
];

// CA basé sur commandes payées: shipped + delivered + completed = 149.90 + 89.90 + 129.00 = 368.80€
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
    metadata: { client_name: 'Marie Durand', client_email: 'marie.durand@example.com', order_number: 'EDN-2025-261-1234' }
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
    metadata: { client_name: 'Thomas Bernard', client_email: 'thomas.bernard@example.com', order_number: 'EDN-2025-244-5678' }
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
    metadata: { client_name: 'Nadia Martin', client_email: 'nadia.martin@example.com', order_number: 'EDN-2025-221-3456' }
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
