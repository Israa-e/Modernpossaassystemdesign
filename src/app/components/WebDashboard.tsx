import { useState } from "react";
import {
  LayoutDashboard, Package, Tag, Boxes, ShoppingCart, FileText,
  Users, Truck, BarChart3, TrendingUp, UserCog, Crown, Settings,
  Bell, Search, ChevronDown, LogOut, Menu, X, Plus, Filter,
  TrendingDown, AlertTriangle, CreditCard, ArrowUpRight, Globe,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { MONTHLY_REVENUE, DAILY_SALES, PRODUCTS, CUSTOMERS, INVOICES, CATEGORIES, type Lang, type Screen } from "../data/store";

const P = "#0F766E"; const AM = "#F59E0B"; const GR = "#22C55E"; const PU = "#8B5CF6"; const RE = "#EF4444";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; onSetLang: (l: Lang) => void; }

type WebTab = 'dashboard' | 'products' | 'categories' | 'inventory' | 'sales' | 'invoices' | 'customers' | 'suppliers' | 'reports' | 'analytics' | 'users' | 'subscription' | 'settings';

const NAV_ITEMS: { key: WebTab; icon: React.ReactNode; label: string; labelEn: string }[] = [
  { key: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'الرئيسية', labelEn: 'Dashboard' },
  { key: 'products', icon: <Package size={20} />, label: 'المنتجات', labelEn: 'Products' },
  { key: 'categories', icon: <Tag size={20} />, label: 'الفئات', labelEn: 'Categories' },
  { key: 'inventory', icon: <Boxes size={20} />, label: 'المخزون', labelEn: 'Inventory' },
  { key: 'sales', icon: <ShoppingCart size={20} />, label: 'المبيعات', labelEn: 'Sales' },
  { key: 'invoices', icon: <FileText size={20} />, label: 'الفواتير', labelEn: 'Invoices' },
  { key: 'customers', icon: <Users size={20} />, label: 'العملاء', labelEn: 'Customers' },
  { key: 'suppliers', icon: <Truck size={20} />, label: 'الموردون', labelEn: 'Suppliers' },
  { key: 'reports', icon: <BarChart3 size={20} />, label: 'التقارير', labelEn: 'Reports' },
  { key: 'analytics', icon: <TrendingUp size={20} />, label: 'التحليلات', labelEn: 'Analytics' },
  { key: 'users', icon: <UserCog size={20} />, label: 'المستخدمون', labelEn: 'Users' },
  { key: 'subscription', icon: <Crown size={20} />, label: 'الاشتراك', labelEn: 'Subscription' },
  { key: 'settings', icon: <Settings size={20} />, label: 'الإعدادات', labelEn: 'Settings' },
];

const PIE = [
  { name: 'مشروبات', value: 35, color: P },
  { name: 'مخبوزات', value: 25, color: '#14B8A6' },
  { name: 'ألبان', value: 20, color: AM },
  { name: 'خضروات', value: 12, color: GR },
  { name: 'أخرى', value: 8, color: PU },
];

/* ── Sidebar ── */
function Sidebar({ ar, active, setActive, collapsed, setCollapsed, onNavigate }: { ar: boolean; active: WebTab; setActive: (t: WebTab) => void; collapsed: boolean; setCollapsed: (b: boolean) => void; onNavigate: (s: Screen) => void }) {
  return (
    <aside className="h-screen flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300"
      style={{ width: collapsed ? 72 : 240, background: `linear-gradient(180deg, #0B5E57 0%, #0F766E 100%)` }}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-lg">🏪</div>
        {!collapsed && <span className="text-white font-black text-lg">Nuqta POS</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
          <Menu size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.key;
          return (
            <button key={item.key} onClick={() => setActive(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold"
              style={{ background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,0.65)' }}
              title={collapsed ? (ar ? item.label : item.labelEn) : undefined}>
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{ar ? item.label : item.labelEn}</span>}
              {!collapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <button onClick={() => onNavigate('dashboard')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          <Globe size={20} className="flex-shrink-0" />
          {!collapsed && <span>{ar ? 'تطبيق الجوال' : 'Mobile App'}</span>}
        </button>
        <button onClick={() => onNavigate('login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>{ar ? 'تسجيل الخروج' : 'Sign Out'}</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── Topbar ── */
function Topbar({ ar, tab, onSetLang, lang }: { ar: boolean; tab: WebTab; onSetLang: (l: Lang) => void; lang: Lang }) {
  const title = NAV_ITEMS.find(n => n.key === tab);
  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex-1">
        <h2 className="font-black text-gray-900">{ar ? title?.label : title?.labelEn}</h2>
        <p className="text-gray-400 text-xs">{ar ? 'متجر الأمل · الرياض' : 'Al-Amal Store · Riyadh'}</p>
      </div>
      <div className="relative hidden md:block">
        <input placeholder={ar ? 'بحث سريع...' : 'Quick search...'}
          className="w-56 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none px-4"
          style={{ paddingRight: ar ? '2.5rem' : '1rem', paddingLeft: ar ? '1rem' : '2.5rem' }} />
        <Search size={15} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: ar ? '0.75rem' : 'auto', left: ar ? 'auto' : '0.75rem' }} />
      </div>
      <button onClick={() => onSetLang(lang === 'ar' ? 'en' : 'ar')} className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">{ar ? 'EN' : 'ع'}</button>
      <button className="relative w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: RE, fontSize: 10 }}>3</span>
      </button>
      <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
        <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-sm" style={{ background: P }}>أ</div>
        <div className="hidden md:block">
          <p className="text-sm font-bold text-gray-900 leading-none">{ar ? 'أحمد' : 'Ahmed'}</p>
          <p className="text-xs text-gray-400">{ar ? 'مالك' : 'Owner'}</p>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </header>
  );
}

/* ── Dashboard Content ── */
function DashboardContent({ ar }: { ar: boolean }) {
  const kpis = [
    { label: ar ? 'إيرادات اليوم' : "Today's Revenue", val: 'ر.س 4,230', change: '+18.3%', up: true, icon: '💰', color: P },
    { label: ar ? 'عدد الطلبات' : 'Orders Today', val: '58', change: '+12%', up: true, icon: '🛒', color: '#3B82F6' },
    { label: ar ? 'العملاء الجدد' : 'New Customers', val: '14', change: '+5%', up: true, icon: '👥', color: GR },
    { label: ar ? 'المخزون المنخفض' : 'Low Stock', val: '3', change: '-1', up: false, icon: '📦', color: RE },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: k.color + '15' }}>{k.icon}</div>
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg" style={{ color: k.up ? GR : RE, background: k.up ? GR + '15' : RE + '15' }}>
                {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{k.change}
              </span>
            </div>
            <p className="font-black mt-3 text-gray-900" style={{ fontSize: '1.4rem' }}>{k.val}</p>
            <p className="text-gray-400 text-sm mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-black text-gray-900">{ar ? 'الإيرادات والأرباح' : 'Revenue & Profit'}</h3>
              <p className="text-gray-400 text-xs">{ar ? 'آخر 12 شهر' : 'Last 12 months'}</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 outline-none bg-gray-50">
              <option>{ar ? 'سنوي' : 'Yearly'}</option>
              <option>{ar ? 'شهري' : 'Monthly'}</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="wRevG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={P} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={P} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="wProG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GR} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={GR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={ar ? 'month' : 'monthEn'} tick={{ fontSize: 11, fontFamily: 'Cairo', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Cairo' }} />
              <Area type="monotone" dataKey="revenue" stroke={P} strokeWidth={2.5} fill="url(#wRevG)" dot={false} name={ar ? 'الإيرادات' : 'Revenue'} />
              <Area type="monotone" dataKey="profit" stroke={GR} strokeWidth={2.5} fill="url(#wProG)" dot={false} name={ar ? 'الأرباح' : 'Profit'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4">{ar ? 'توزيع الفئات' : 'Sales by Category'}</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-3">
            {PIE.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <p className="text-gray-600 text-xs flex-1">{d.name}</p>
                <p className="text-gray-900 text-xs font-bold">{d.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent invoices */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-900">{ar ? 'آخر الفواتير' : 'Recent Invoices'}</h3>
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: P, background: P + '15' }}>{ar ? 'عرض الكل' : 'View All'}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 rounded-xl">
                  {[ar ? 'رقم الفاتورة' : 'Invoice', ar ? 'العميل' : 'Customer', ar ? 'المبلغ' : 'Amount', ar ? 'الحالة' : 'Status'].map((h, i) => (
                    <th key={i} className="text-gray-400 font-semibold text-xs text-start px-3 py-2 first:rounded-r-xl last:rounded-l-xl">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.slice(0, 5).map((inv, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-3 py-3 font-bold text-gray-900 text-xs">{inv.id}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{inv.customer}</td>
                    <td className="px-3 py-3 font-black text-xs" style={{ color: P }}>ر.س {inv.total}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: inv.status === 'paid' ? GR : RE, background: (inv.status === 'paid' ? GR : RE) + '15' }}>
                        {inv.status === 'paid' ? (ar ? 'مدفوع' : 'Paid') : (ar ? 'مسترد' : 'Refunded')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: RE }} />
              {ar ? 'تنبيهات المخزون' : 'Stock Alerts'}
            </h3>
            <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: RE }}>{PRODUCTS.filter(p => p.stock <= p.minStock).length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {PRODUCTS.filter(p => p.stock <= p.minStock).map(p => {
              const pct = Math.min((p.stock / p.minStock) * 100, 100);
              return (
                <div key={p.id}>
                  <div className="flex justify-between mb-1">
                    <p className="text-gray-800 text-sm font-semibold">{ar ? p.name : p.nameEn}</p>
                    <p className="text-xs font-bold" style={{ color: RE }}>{p.stock} / {p.minStock}</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: RE }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Products Table Content ── */
function ProductsContent({ ar }: { ar: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <input placeholder={ar ? 'ابحث عن منتج...' : 'Search products...'} className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none" style={{ paddingRight: ar ? '2.5rem' : '1rem', paddingLeft: ar ? '1rem' : '2.5rem' }} />
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: ar ? '0.75rem' : 'auto', left: ar ? 'auto' : '0.75rem' }} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white"><Filter size={15} />{ar ? 'تصفية' : 'Filter'}</button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: P }}><Plus size={15} />{ar ? 'إضافة منتج' : 'Add Product'}</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {[ar ? 'المنتج' : 'Product', ar ? 'SKU' : 'SKU', ar ? 'الفئة' : 'Category', ar ? 'السعر' : 'Price', ar ? 'المخزون' : 'Stock', ar ? 'الحالة' : 'Status', ar ? 'إجراءات' : 'Actions'].map((h, i) => (
                <th key={i} className="text-gray-500 font-semibold text-xs text-start px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map(p => {
              const cat = CATEGORIES.find(c => c.id === p.category);
              const isLow = p.stock <= p.minStock;
              return (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: (cat?.color || P) + '15' }}>{cat?.icon || '📦'}</div>
                      <p className="font-semibold text-gray-900">{ar ? p.name : p.nameEn}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs font-mono">{p.sku}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: cat?.color || P, background: (cat?.color || P) + '15' }}>{cat?.icon} {ar ? cat?.name : cat?.nameEn}</span>
                  </td>
                  <td className="px-4 py-3.5 font-black" style={{ color: P }}>ر.س {p.price}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-700">{p.stock}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: isLow ? RE : GR, background: (isLow ? RE : GR) + '15' }}>
                      {isLow ? (ar ? 'منخفض' : 'Low') : (ar ? 'متاح' : 'In Stock')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: P, background: P + '10' }}>{ar ? 'تعديل' : 'Edit'}</button>
                      <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: RE, background: RE + '10' }}>{ar ? 'حذف' : 'Delete'}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-gray-400 text-xs">{ar ? `عرض 1-${PRODUCTS.length} من ${PRODUCTS.length}` : `Showing 1-${PRODUCTS.length} of ${PRODUCTS.length}`}</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg text-sm font-bold transition-colors" style={{ background: p === 1 ? P : '#F1F5F9', color: p === 1 ? '#fff' : '#64748B' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Customers Table Content ── */
function CustomersContent({ ar }: { ar: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <input placeholder={ar ? 'ابحث عن عميل...' : 'Search customers...'} className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none" style={{ paddingRight: ar ? '2.5rem' : '1rem', paddingLeft: ar ? '1rem' : '2.5rem' }} />
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: ar ? '0.75rem' : 'auto', left: ar ? 'auto' : '0.75rem' }} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: P }}><Plus size={15} />{ar ? 'إضافة عميل' : 'Add Customer'}</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {[ar ? 'العميل' : 'Customer', ar ? 'الهاتف' : 'Phone', ar ? 'نقاط الولاء' : 'Loyalty Points', ar ? 'إجمالي الإنفاق' : 'Total Spent', ar ? 'الزيارات' : 'Visits', ar ? 'إجراءات' : 'Actions'].map((h, i) => (
                <th key={i} className="text-gray-500 font-semibold text-xs text-start px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map(c => (
              <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ background: P }}>{(ar ? c.name : c.nameEn).charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{ar ? c.name : c.nameEn}</p>
                      <p className="text-gray-400 text-xs">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-600">{c.phone}</td>
                <td className="px-4 py-3.5 font-bold" style={{ color: AM }}>{c.points}</td>
                <td className="px-4 py-3.5 font-black text-gray-900">ر.س {c.total.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-gray-600">{c.visits}</td>
                <td className="px-4 py-3.5">
                  <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: P, background: P + '10' }}>{ar ? 'عرض' : 'View'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Settings Content ── */
function SettingsContent({ ar }: { ar: boolean }) {
  const input = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none text-sm";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">
      {/* Shop Profile */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-black text-gray-900 mb-4">{ar ? 'ملف المتجر' : 'Store Profile'}</h3>
        <div className="flex flex-col gap-3">
          {[[ar ? 'اسم المتجر' : 'Store Name', ar ? 'متجر الأمل' : 'Al-Amal Store'],
            [ar ? 'نوع النشاط' : 'Business Type', ar ? 'سوبرماركت' : 'Supermarket'],
            [ar ? 'رقم الهاتف' : 'Phone', '+966 50 123 4567'],
            [ar ? 'البريد الإلكتروني' : 'Email', 'store@alamal.sa'],
            [ar ? 'العنوان' : 'Address', ar ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia']].map(([l, v], i) => (
            <div key={i}>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">{l}</label>
              <input defaultValue={v} className={input} />
            </div>
          ))}
          <button className="mt-2 py-3 rounded-xl text-white font-bold" style={{ background: P }}>{ar ? 'حفظ التغييرات' : 'Save Changes'}</button>
        </div>
      </div>
      {/* Tax Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-black text-gray-900 mb-4">{ar ? 'إعدادات الضريبة' : 'Tax Settings'}</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">{ar ? 'تفعيل ضريبة القيمة المضافة' : 'Enable VAT'}</span>
            <div className="w-12 h-6 rounded-full relative cursor-pointer" style={{ background: P }}>
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{ar ? 'نسبة الضريبة %' : 'Tax Rate %'}</label>
            <input defaultValue="15" type="number" className={input} dir="ltr" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{ar ? 'رقم السجل الضريبي' : 'Tax Registration No.'}</label>
            <input defaultValue="310000000000003" className={input} dir="ltr" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{ar ? 'اسم الضريبة' : 'Tax Name'}</label>
            <input defaultValue={ar ? 'ضريبة القيمة المضافة' : 'VAT'} className={input} />
          </div>
          <button className="py-3 rounded-xl text-white font-bold" style={{ background: AM }}>{ar ? 'حفظ الإعدادات' : 'Save Settings'}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Generic placeholder ── */
function ComingSoon({ ar, tab }: { ar: boolean; tab: WebTab }) {
  const item = NAV_ITEMS.find(n => n.key === tab);
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>{item?.icon}</div>
      <h3 className="font-black text-gray-900 text-xl">{ar ? item?.label : item?.labelEn}</h3>
      <p className="text-gray-400">{ar ? 'هذا القسم سيكون متاحاً قريباً' : 'This section is coming soon'}</p>
    </div>
  );
}

/* ── Main Web Dashboard ── */
export function WebDashboard({ lang, onNavigate, onSetLang }: Props) {
  const ar = lang === 'ar';
  const [tab, setTab] = useState<WebTab>('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <DashboardContent ar={ar} />;
      case 'products': return <ProductsContent ar={ar} />;
      case 'customers': return <CustomersContent ar={ar} />;
      case 'settings': return <SettingsContent ar={ar} />;
      default: return <ComingSoon ar={ar} tab={tab} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr', background: '#F8FAFC' }}>
      <Sidebar ar={ar} active={tab} setActive={setTab} collapsed={collapsed} setCollapsed={setCollapsed} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar ar={ar} tab={tab} onSetLang={onSetLang} lang={lang} />
        <main className="flex-1 overflow-y-auto p-5">{renderContent()}</main>
      </div>
    </div>
  );
}
