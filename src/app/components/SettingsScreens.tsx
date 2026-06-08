import { useState } from "react";
import { Bell, AlertTriangle, ChevronLeft, ChevronRight, Shield, Users, Crown, Check, Globe, Moon, Sun, Store, Receipt, Database, LogOut, ChevronRight as CRight, Smartphone, Lock } from "lucide-react";
import type { Lang, Screen, Theme } from "../data/store";

const P = "#0F766E"; const AM = "#F59E0B"; const GR = "#22C55E"; const RE = "#EF4444"; const PU = "#8B5CF6";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; onSetLang: (l: Lang) => void; onSetTheme: (t: Theme) => void; theme: Theme; }

/* ─── Notifications ─── */
export function NotificationsScreen({ lang, onNavigate }: Omit<Props, 'onSetLang' | 'onSetTheme' | 'theme'>) {
  const ar = lang === 'ar';
  const notifs = [
    { id: '1', type: 'stock', icon: '📦', title: ar ? 'تنبيه مخزون منخفض' : 'Low Stock Alert', body: ar ? 'حليب طازج: 8 وحدات متبقية (الحد الأدنى 15)' : 'Fresh Milk: 8 units left (min 15)', time: ar ? 'منذ 5 دقائق' : '5 min ago', color: RE, unread: true },
    { id: '2', type: 'stock', icon: '💊', title: ar ? 'تنبيه مخزون منخفض' : 'Low Stock Alert', body: ar ? 'باراسيتامول: 5 وحدات متبقية' : 'Paracetamol: 5 units left', time: ar ? 'منذ 12 دقيقة' : '12 min ago', color: RE, unread: true },
    { id: '3', type: 'sale', icon: '🎉', title: ar ? 'مبيعات ممتازة!' : 'Great Sales!', body: ar ? 'تجاوزت هدفك اليومي بنسبة 18%' : 'You exceeded your daily goal by 18%', time: ar ? 'منذ ساعة' : '1 hr ago', color: GR, unread: true },
    { id: '4', type: 'sub', icon: '👑', title: ar ? 'تجديد الاشتراك' : 'Subscription Renewal', body: ar ? 'ينتهي اشتراكك المميز خلال 7 أيام' : 'Your premium plan expires in 7 days', time: ar ? 'منذ 3 ساعات' : '3 hrs ago', color: AM, unread: false },
    { id: '5', type: 'sale', icon: '💳', title: ar ? 'طلب جديد' : 'New Order', body: ar ? 'فاتورة INV-2024-007 بقيمة ر.س 136.25' : 'Invoice INV-2024-007 for SAR 136.25', time: ar ? 'أمس' : 'Yesterday', color: P, unread: false },
    { id: '6', type: 'stock', icon: '🚚', title: ar ? 'وصول شحنة' : 'Shipment Arrived', body: ar ? 'تم استلام طلب الشراء #PO-034 من مورد الأمل' : 'PO-034 received from Al-Amal supplier', time: ar ? 'أمس' : 'Yesterday', color: PU, unread: false },
  ];

  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
        </button>
        <div className="flex-1">
          <h1 className="text-white font-black text-xl">{ar ? 'الإشعارات' : 'Notifications'}</h1>
          <p className="text-teal-100 text-sm">{unreadCount} {ar ? 'غير مقروء' : 'unread'}</p>
        </div>
        {unreadCount > 0 && (
          <button className="text-sm font-bold text-white/80">{ar ? 'قراءة الكل' : 'Mark all read'}</button>
        )}
      </div>

      <div className="px-4 pt-4 flex flex-col gap-2">
        {notifs.map(n => (
          <div key={n.id} className="bg-white rounded-2xl p-4 shadow-sm border flex items-start gap-3" style={{ borderColor: n.unread ? n.color + '30' : '#F1F5F9' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: n.color + '15' }}>{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1 ml-2" style={{ background: n.color }} />}
              </div>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-gray-300 text-xs mt-1.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── User Management ─── */
export function UserManagementScreen({ lang, onNavigate }: Omit<Props, 'onSetLang' | 'onSetTheme' | 'theme'>) {
  const ar = lang === 'ar';
  const users = [
    { name: 'أحمد محمد', nameEn: 'Ahmed Mohamed', role: 'owner', email: 'ahmed@store.com', active: true },
    { name: 'سارة علي', nameEn: 'Sara Ali', role: 'manager', email: 'sara@store.com', active: true },
    { name: 'محمد خالد', nameEn: 'Mohamed Khaled', role: 'cashier', email: 'cashier1@store.com', active: true },
    { name: 'نورا سالم', nameEn: 'Nora Salem', role: 'cashier', email: 'cashier2@store.com', active: false },
  ];

  const roleConfig: Record<string, { label: string; labelEn: string; color: string; icon: string }> = {
    owner: { label: 'مالك', labelEn: 'Owner', color: AM, icon: '👑' },
    manager: { label: 'مدير', labelEn: 'Manager', color: P, icon: '🛡️' },
    cashier: { label: 'كاشير', labelEn: 'Cashier', color: '#3B82F6', icon: '💳' },
  };

  const perms = [
    { key: 'sales', label: ar ? 'إجراء المبيعات' : 'Process Sales' },
    { key: 'products', label: ar ? 'إدارة المنتجات' : 'Manage Products' },
    { key: 'reports', label: ar ? 'عرض التقارير' : 'View Reports' },
    { key: 'customers', label: ar ? 'إدارة العملاء' : 'Manage Customers' },
    { key: 'users', label: ar ? 'إدارة المستخدمين' : 'Manage Users' },
    { key: 'settings', label: ar ? 'الإعدادات' : 'Settings' },
  ];

  const rolePerms: Record<string, string[]> = {
    owner: ['sales', 'products', 'reports', 'customers', 'users', 'settings'],
    manager: ['sales', 'products', 'reports', 'customers'],
    cashier: ['sales'],
  };

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, #1E293B, #334155)` }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('settings')} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
          </button>
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'إدارة المستخدمين' : 'User Management'}</h1>
            <p className="text-slate-400 text-sm">{users.length} {ar ? 'مستخدمين' : 'users'}</p>
          </div>
        </div>
        {/* Role cards */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(roleConfig).map(([key, r]) => (
            <div key={key} className="bg-white/10 rounded-2xl p-3 text-center">
              <span className="text-2xl">{r.icon}</span>
              <p className="text-white font-bold text-sm mt-1">{ar ? r.label : r.labelEn}</p>
              <p className="text-slate-400 text-xs">{users.filter(u => u.role === key).length} {ar ? 'مستخدم' : 'users'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {users.map((u, i) => {
          const r = roleConfig[u.role];
          return (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${r.color}cc, ${r.color})` }}>
                {(ar ? u.name : u.nameEn).charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{ar ? u.name : u.nameEn}</p>
                <p className="text-gray-400 text-xs">{u.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: r.color }}>
                  {r.icon} {ar ? r.label : r.labelEn}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: u.active ? GR : '#CBD5E1' }} />
                  <span className="text-xs text-gray-400">{u.active ? (ar ? 'نشط' : 'Active') : (ar ? 'معطل' : 'Inactive')}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Permissions matrix */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-3">{ar ? 'جدول الصلاحيات' : 'Permissions Matrix'}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-gray-400 font-semibold text-xs text-start py-2 w-36">{ar ? 'الصلاحية' : 'Permission'}</th>
                  {Object.values(roleConfig).map(r => (
                    <th key={r.label} className="text-center py-2" style={{ color: r.color }}>{ar ? r.label : r.labelEn}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perms.map(p => (
                  <tr key={p.key} className="border-t border-gray-50">
                    <td className="py-2.5 text-gray-700 text-xs font-medium">{p.label}</td>
                    {Object.keys(roleConfig).map(role => (
                      <td key={role} className="text-center py-2.5">
                        {rolePerms[role].includes(p.key)
                          ? <Check size={16} className="mx-auto" style={{ color: GR }} />
                          : <div className="w-4 h-4 rounded-sm bg-gray-100 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Subscription ─── */
export function SubscriptionScreen({ lang, onNavigate }: Omit<Props, 'onSetLang' | 'onSetTheme' | 'theme'>) {
  const ar = lang === 'ar';
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free', name: ar ? 'مجاني' : 'Free', price: 0, priceY: 0,
      features: [ar ? '100 منتج' : '100 products', ar ? 'كاشير واحد' : '1 cashier', ar ? 'تقارير أساسية' : 'Basic reports', ar ? 'دعم بريد إلكتروني' : 'Email support'],
      color: '#64748B', current: false,
    },
    {
      id: 'pro', name: ar ? 'احترافي' : 'Professional', price: 149, priceY: 119,
      features: [ar ? 'منتجات غير محدودة' : 'Unlimited products', ar ? '3 كاشيرات' : '3 cashiers', ar ? 'تقارير متقدمة' : 'Advanced reports', ar ? 'إدارة المخزون' : 'Inventory mgmt', ar ? 'دعم على مدار الساعة' : '24/7 support'],
      color: P, current: true,
    },
    {
      id: 'enterprise', name: ar ? 'مؤسسي' : 'Enterprise', price: 349, priceY: 279,
      features: [ar ? 'كل ميزات الاحترافي' : 'All Pro features', ar ? 'فروع متعددة' : 'Multiple branches', ar ? 'API مخصص' : 'Custom API', ar ? 'مدير حساب مخصص' : 'Dedicated manager', ar ? 'تدريب وتأهيل' : 'Onboarding training'],
      color: AM, current: false,
    },
  ];

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-6" style={{ background: `linear-gradient(135deg, #1E1B4B, #312E81)` }}>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => onNavigate('settings')} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
          </button>
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'الاشتراك' : 'Subscription'}</h1>
            <p className="text-indigo-300 text-sm">{ar ? 'اختر الخطة المناسبة لعملك' : 'Choose the right plan for your business'}</p>
          </div>
        </div>
        {/* Current plan badge */}
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${P}30` }}>
            <Crown size={24} style={{ color: AM }} />
          </div>
          <div>
            <p className="text-indigo-200 text-xs">{ar ? 'خطتك الحالية' : 'Current Plan'}</p>
            <p className="text-white font-black">{ar ? 'الخطة الاحترافية' : 'Professional Plan'}</p>
            <p className="text-indigo-300 text-xs">{ar ? 'تنتهي في 15 فبراير 2024' : 'Expires Feb 15, 2024'}</p>
          </div>
        </div>
        {/* Billing toggle */}
        <div className="mt-4 flex gap-1 bg-white/10 rounded-2xl p-1">
          {(['monthly', 'yearly'] as const).map(b => (
            <button key={b} onClick={() => setSelectedPlan(b)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: selectedPlan === b ? '#fff' : 'transparent', color: selectedPlan === b ? '#1E1B4B' : 'rgba(255,255,255,0.6)' }}>
              {b === 'monthly' ? (ar ? 'شهري' : 'Monthly') : (ar ? 'سنوي (وفر 20%)' : 'Yearly (Save 20%)')}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl p-5 shadow-sm border-2 relative overflow-hidden"
            style={{ borderColor: plan.current ? plan.color : '#E2E8F0' }}>
            {plan.current && (
              <div className="absolute top-3 left-3 text-xs font-black text-white px-3 py-1 rounded-full" style={{ background: plan.color, ...(ar ? { left: 'auto', right: '1rem' } : {}) }}>
                {ar ? '✓ خطتك الحالية' : '✓ Current Plan'}
              </div>
            )}
            <div className="flex justify-between items-start mt-4">
              <p className="font-black text-gray-900 text-lg">{plan.name}</p>
              <div className="text-right">
                <p className="font-black text-2xl" style={{ color: plan.color }}>
                  {plan.price === 0 ? (ar ? 'مجاني' : 'Free') : `ر.س ${selectedPlan === 'monthly' ? plan.price : plan.priceY}`}
                </p>
                {plan.price > 0 && <p className="text-gray-400 text-xs">{ar ? '/ شهر' : '/ month'}</p>}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${plan.color}15` }}>
                    <Check size={12} style={{ color: plan.color }} />
                  </div>
                  <span className="text-gray-600 text-sm">{f}</span>
                </div>
              ))}
            </div>
            {!plan.current && (
              <button className="mt-4 w-full py-3.5 rounded-2xl font-bold text-white transition-transform active:scale-95"
                style={{ background: `linear-gradient(135deg, ${plan.color}cc, ${plan.color})` }}>
                {plan.id === 'free' ? (ar ? 'تخفيض الخطة' : 'Downgrade') : (ar ? 'الترقية الآن' : 'Upgrade Now')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings ─── */
export function SettingsScreen({ lang, onNavigate, onSetLang, onSetTheme, theme }: Props) {
  const ar = lang === 'ar';

  const sections = [
    {
      title: ar ? 'المتجر' : 'Store', items: [
        { icon: <Store size={20} />, label: ar ? 'ملف المتجر' : 'Store Profile', color: P, action: () => {} },
        { icon: <Receipt size={20} />, label: ar ? 'إعدادات الضريبة' : 'Tax Settings', color: AM, action: () => {} },
        { icon: <Smartphone size={20} />, label: ar ? 'الكاشير والطابعة' : 'Cashier & Printer', color: '#3B82F6', action: () => {} },
      ]
    },
    {
      title: ar ? 'التفضيلات' : 'Preferences', items: [
        { icon: <Globe size={20} />, label: ar ? 'اللغة: العربية' : 'Language: Arabic', color: GR, action: () => onSetLang(ar ? 'en' : 'ar') },
        { icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, label: theme === 'dark' ? (ar ? 'الوضع الفاتح' : 'Light Mode') : (ar ? 'الوضع الداكن' : 'Dark Mode'), color: '#7C3AED', action: () => onSetTheme(theme === 'dark' ? 'light' : 'dark') },
      ]
    },
    {
      title: ar ? 'الحساب' : 'Account', items: [
        { icon: <Crown size={20} />, label: ar ? 'إدارة الاشتراك' : 'Manage Subscription', color: AM, action: () => onNavigate('subscription') },
        { icon: <Users size={20} />, label: ar ? 'إدارة المستخدمين' : 'User Management', color: P, action: () => onNavigate('user-management') },
        { icon: <Lock size={20} />, label: ar ? 'الأمان وكلمة المرور' : 'Security & Password', color: '#64748B', action: () => {} },
      ]
    },
    {
      title: ar ? 'البيانات' : 'Data', items: [
        { icon: <Database size={20} />, label: ar ? 'النسخ الاحتياطي والاستعادة' : 'Backup & Restore', color: '#06B6D4', action: () => {} },
      ]
    },
  ];

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-6" style={{ background: `linear-gradient(135deg, #1E293B, #334155)` }}>
        <h1 className="text-white font-black text-xl mb-4">{ar ? 'الإعدادات' : 'Settings'}</h1>
        {/* Profile card */}
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl" style={{ background: `${P}60` }}>أ</div>
          <div className="flex-1">
            <p className="text-white font-black text-lg">{ar ? 'أحمد محمد' : 'Ahmed Mohamed'}</p>
            <p className="text-slate-400 text-sm">{ar ? 'مالك المتجر' : 'Store Owner'}</p>
            <p className="text-slate-400 text-xs">{ar ? 'متجر الأمل' : 'Al-Amal Store'}</p>
          </div>
          <button className="text-xs font-bold px-3 py-2 rounded-xl text-white" style={{ background: `${P}50` }}>{ar ? 'تعديل' : 'Edit'}</button>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {sections.map((section, si) => (
          <div key={si}>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">{section.title}</p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, ii) => (
                <button key={ii} onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-4 border-t border-gray-50 first:border-0 hover:bg-gray-50 transition-colors text-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15', color: item.color }}>{item.icon}</div>
                  <span className="flex-1 font-semibold text-gray-900">{item.label}</span>
                  <CRight size={16} className="text-gray-300" style={ar ? { transform: 'rotate(180deg)' } : {}} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Web Dashboard link */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Globe size={20} className="text-white" /></div>
          <div className="flex-1">
            <p className="text-white font-bold">{ar ? 'لوحة التحكم الويب' : 'Web Dashboard'}</p>
            <p className="text-teal-100 text-xs">{ar ? 'إدارة متقدمة من المتصفح' : 'Advanced management via browser'}</p>
          </div>
          <button onClick={() => onNavigate('web-dashboard')} className="bg-white rounded-xl px-3 py-2 text-sm font-bold" style={{ color: P }}>
            {ar ? 'فتح' : 'Open'}
          </button>
        </div>

        {/* Logout */}
        <button onClick={() => onNavigate('login')} className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-red-100 bg-white"
          style={{ color: RE }}>
          <LogOut size={20} />
          {ar ? 'تسجيل الخروج' : 'Sign Out'}
        </button>

        <p className="text-center text-gray-300 text-xs pb-2">Nuqta POS v2.4.1 · {ar ? 'جميع الحقوق محفوظة © 2024' : '© 2024 All rights reserved'}</p>
      </div>
    </div>
  );
}
