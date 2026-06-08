export type Lang = 'ar' | 'en';
export type Theme = 'light' | 'dark';
export type Screen =
  | 'splash' | 'onboarding' | 'login' | 'register'
  | 'dashboard' | 'products' | 'add-product' | 'categories'
  | 'inventory' | 'stock-movement' | 'cashier' | 'cart'
  | 'payment' | 'invoice' | 'invoice-history' | 'customers'
  | 'customer-details' | 'suppliers' | 'reports' | 'analytics'
  | 'notifications' | 'user-management' | 'subscription' | 'settings'
  | 'web-dashboard';

export interface CartItem {
  productId: string;
  name: string;
  nameEn: string;
  price: number;
  qty: number;
}

export const CATEGORIES = [
  { id: '1', name: 'مشروبات', nameEn: 'Beverages', icon: '🥤', color: '#0F766E', count: 12 },
  { id: '2', name: 'مخبوزات', nameEn: 'Bakery', icon: '🍞', color: '#F59E0B', count: 8 },
  { id: '3', name: 'ألبان', nameEn: 'Dairy', icon: '🥛', color: '#3B82F6', count: 10 },
  { id: '4', name: 'خضروات', nameEn: 'Vegetables', icon: '🥦', color: '#22C55E', count: 15 },
  { id: '5', name: 'منظفات', nameEn: 'Cleaning', icon: '🧴', color: '#8B5CF6', count: 6 },
];

export const PRODUCTS = [
  { id: '1', name: 'قهوة عربية', nameEn: 'Arabic Coffee', category: '1', price: 15, stock: 45, minStock: 10, sku: 'BEV-001', cost: 8 },
  { id: '2', name: 'خبز عيش', nameEn: 'Bread Loaf', category: '2', price: 5, stock: 8, minStock: 15, sku: 'BAK-001', cost: 2 },
  { id: '3', name: 'حليب طازج', nameEn: 'Fresh Milk', category: '3', price: 12, stock: 6, minStock: 20, sku: 'DAI-001', cost: 7 },
  { id: '4', name: 'طماطم', nameEn: 'Tomatoes', category: '4', price: 8, stock: 30, minStock: 10, sku: 'VEG-001', cost: 4 },
  { id: '5', name: 'عصير برتقال', nameEn: 'Orange Juice', category: '1', price: 18, stock: 25, minStock: 8, sku: 'BEV-002', cost: 10 },
  { id: '6', name: 'كيك شوكولاتة', nameEn: 'Chocolate Cake', category: '2', price: 35, stock: 3, minStock: 5, sku: 'BAK-002', cost: 20 },
  { id: '7', name: 'جبن أبيض', nameEn: 'White Cheese', category: '3', price: 22, stock: 0, minStock: 10, sku: 'DAI-002', cost: 14 },
  { id: '8', name: 'خيار', nameEn: 'Cucumber', category: '4', price: 5, stock: 40, minStock: 10, sku: 'VEG-002', cost: 2 },
];

export const CUSTOMERS = [
  { id: '1', name: 'محمد أحمد', nameEn: 'Mohamed Ahmed', phone: '+966501234567', email: 'mohamed@example.com', points: 750, visits: 24, total: 3200 },
  { id: '2', name: 'فاطمة علي', nameEn: 'Fatima Ali', phone: '+966509876543', email: 'fatima@example.com', points: 420, visits: 15, total: 1850 },
  { id: '3', name: 'خالد عمر', nameEn: 'Khaled Omar', phone: '+966512345678', email: 'khaled@example.com', points: 180, visits: 8, total: 950 },
  { id: '4', name: 'نورا سعيد', nameEn: 'Noura Said', phone: '+966523456789', email: 'noura@example.com', points: 920, visits: 31, total: 5100 },
];

export const INVOICES = [
  { id: 'INV-2024-007', customer: 'محمد أحمد', items: 3, total: 136.25, status: 'paid', date: '2024-01-15' },
  { id: 'INV-2024-006', customer: 'فاطمة علي', items: 5, total: 245.00, status: 'paid', date: '2024-01-15' },
  { id: 'INV-2024-005', customer: 'خالد عمر', items: 2, total: 89.50, status: 'refunded', date: '2024-01-14' },
  { id: 'INV-2024-004', customer: 'نورا سعيد', items: 7, total: 412.75, status: 'paid', date: '2024-01-14' },
  { id: 'INV-2024-003', customer: 'محمد أحمد', items: 4, total: 178.00, status: 'paid', date: '2024-01-13' },
];

export const DAILY_SALES = [
  { day: 'سبت', dayEn: 'Sat', sales: 2100 },
  { day: 'أحد', dayEn: 'Sun', sales: 3400 },
  { day: 'اثنين', dayEn: 'Mon', sales: 2800 },
  { day: 'ثلاثاء', dayEn: 'Tue', sales: 4200 },
  { day: 'أربعاء', dayEn: 'Wed', sales: 3800 },
  { day: 'خميس', dayEn: 'Thu', sales: 5100 },
  { day: 'جمعة', dayEn: 'Fri', sales: 4230 },
];

export const MONTHLY_REVENUE = [
  { month: 'يناير', monthEn: 'Jan', revenue: 45000, profit: 16200 },
  { month: 'فبراير', monthEn: 'Feb', revenue: 52000, profit: 19500 },
  { month: 'مارس', monthEn: 'Mar', revenue: 48000, profit: 17300 },
  { month: 'أبريل', monthEn: 'Apr', revenue: 61000, profit: 23800 },
  { month: 'مايو', monthEn: 'May', revenue: 55000, profit: 20100 },
  { month: 'يونيو', monthEn: 'Jun', revenue: 67000, profit: 26500 },
  { month: 'يوليو', monthEn: 'Jul', revenue: 72000, profit: 29000 },
  { month: 'أغسطس', monthEn: 'Aug', revenue: 69000, profit: 27200 },
  { month: 'سبتمبر', monthEn: 'Sep', revenue: 75000, profit: 31000 },
  { month: 'أكتوبر', monthEn: 'Oct', revenue: 78000, profit: 32500 },
  { month: 'نوفمبر', monthEn: 'Nov', revenue: 82000, profit: 34100 },
  { month: 'ديسمبر', monthEn: 'Dec', revenue: 91000, profit: 38500 },
];
