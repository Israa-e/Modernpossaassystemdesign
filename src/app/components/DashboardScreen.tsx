import { TrendingUp, TrendingDown, ShoppingBag, Package, AlertTriangle, Bell, ArrowLeft, ArrowRight, Zap, Users, CreditCard, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DAILY_SALES, PRODUCTS, INVOICES, type Lang, type Screen } from "../data/store";

const P = "#0F766E"; const AM = "#F59E0B"; const GR = "#22C55E"; const RE = "#EF4444";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; }

export function DashboardScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const lowStock = PRODUCTS.filter(p => p.stock <= p.minStock);
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const kpiCards = [
    { label: ar ? 'مبيعات اليوم' : "Today's Sales", value: 'ر.س 4,230', sub: ar ? '+18% من أمس' : '+18% vs yesterday', icon: <TrendingUp size={22}/>, color: P, trend: 'up' },
    { label: ar ? 'عدد الطلبات' : 'Orders', value: '58', sub: ar ? 'طلب اليوم' : 'orders today', icon: <ShoppingBag size={22}/>, color: '#7C3AED', trend: 'up' },
    { label: ar ? 'مخزون منخفض' : 'Low Stock', value: String(lowStock.length), sub: ar ? 'منتج يحتاج تعبئة' : 'need restock', icon: <AlertTriangle size={22}/>, color: RE, trend: 'down' },
    { label: ar ? 'عملاء نشطون' : 'Active Customers', value: '234', sub: ar ? 'هذا الشهر' : 'this month', icon: <Users size={22}/>, color: GR, trend: 'up' },
  ];

  const quickActions = [
    { label: ar ? 'بيع جديد' : 'New Sale', screen: 'cashier' as Screen, icon: <ShoppingBag size={24}/>, color: P },
    { label: ar ? 'إضافة منتج' : 'Add Product', screen: 'add-product' as Screen, icon: <Package size={24}/>, color: '#7C3AED' },
    { label: ar ? 'الفواتير' : 'Invoices', screen: 'invoice-history' as Screen, icon: <CreditCard size={24}/>, color: AM },
    { label: ar ? 'التقارير' : 'Reports', screen: 'reports' as Screen, icon: <BarChart2 size={24}/>, color: GR },
  ];

  return (
    <div className="pb-24" style={{ background: '#E7EDF2', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 rounded-b-[2.5rem] shadow-2xl" style={{ background: `linear-gradient(135deg, #0B5E57 0%, #14B8A6 100%)` }}>
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-teal-100 text-xs opacity-80">{ar ? 'الاثنين، 15 يناير 2024' : 'Monday, Jan 15 2024'}</p>
            <h1 className="text-white font-black text-2xl mt-2">{ar ? 'مرحباً، أحمد' : 'Hello, Ahmed'} <span className="text-3xl">👋</span></h1>
            <p className="text-teal-200 text-sm mt-1">{ar ? 'متجر الأمل' : 'Al-Amal Store'}</p>
          </div>
          <button onClick={() => onNavigate('notifications')} className="relative w-12 h-12 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-xl backdrop-blur-xl">
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">3</span>
          </button>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white/10 p-5 backdrop-blur-xl border border-white/20 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-teal-100 text-sm">{ar ? 'إجمالي إيرادات اليوم' : "Today's Revenue"}</p>
              <p className="font-black text-white text-[2.5rem] md:text-[3rem] mt-2">ر.س 4,230</p>
            </div>
            <div className="rounded-3xl bg-white/15 p-4 text-center min-w-[120px]">
              <p className="text-teal-100 text-xs">{ar ? 'الأرباح' : 'Profit'}</p>
              <p className="font-black text-white text-xl mt-2">ر.س 1,680</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-teal-100 opacity-90">
            <TrendingUp size={16} />
            <span className="font-black">+18.3%</span>
            <span>{ar ? 'من أمس' : 'vs yesterday'}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {kpiCards.map((card, i) => (
          <div key={i} className="rounded-[2rem] bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="w-11 h-11 rounded-3xl flex items-center justify-center" style={{ background: card.color + '15', color: card.color }}>
                {card.icon}
              </div>
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: card.trend === 'up' ? GR+'15' : RE+'15', color: card.trend === 'up' ? GR : RE }}>
                {card.trend === 'up' ? (ar ? '↑ ارتفاع' : '↑ Up') : (ar ? '↓ انخفاض' : '↓ Down')}
              </span>
            </div>
            <p className="font-black text-2xl mt-4" style={{ color: card.color }}>{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
            <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-5 rounded-[2rem] bg-white p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-900">{ar ? 'مبيعات الأسبوع' : 'Weekly Sales'}</h3>
            <p className="text-gray-400 text-xs">{ar ? 'لمحة سريعة على أداء المبيعات' : 'A quick look at sales performance'}</p>
          </div>
          <button className="rounded-2xl border border-gray-200 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 transition-colors">
            {ar ? 'عرض الكل' : 'View All'}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={DAILY_SALES} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={P} stopOpacity={0.24}/>
                <stop offset="95%" stopColor={P} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey={ar ? 'day' : 'dayEn'} tick={{ fontSize: 11, fontFamily: 'Cairo', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid rgba(15,118,110,0.12)', boxShadow: '0 12px 30px rgba(15,118,110,0.08)', fontFamily: 'Cairo', fontSize: 12 }} formatter={(v: number) => [`ر.س ${v.toLocaleString()}`, ar ? 'المبيعات' : 'Sales']} />
            <Area type="monotone" dataKey="sales" stroke={P} strokeWidth={3} fill="url(#salesG)" dot={false} activeDot={{ r: 5, fill: P }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {lowStock.length > 0 && (
        <div className="mx-5 mt-5 rounded-[2rem] bg-[#FEF6F5] p-4 shadow-sm border border-[#FBCACA]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              <h3 className="font-black text-red-700 text-sm">{ar ? 'تنبيه مخزون منخفض' : 'Low Stock Alert'}</h3>
            </div>
            <button onClick={() => onNavigate('inventory')} className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
              {ar ? 'عرض الكل' : 'View All'}
            </button>
          </div>
          <div className="space-y-3">
            {lowStock.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-red-800 text-sm">{ar ? p.name : p.nameEn}</p>
                  <p className="text-gray-500 text-xs">{ar ? 'أعد التعبئة بسرعة' : 'Restock quickly'}</p>
                </div>
                <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: '#FEE2E2', color: RE }}>
                  {ar ? `${p.stock} متبقي` : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-gray-900">{ar ? 'آخر الفواتير' : 'Recent Invoices'}</h3>
          <button onClick={() => onNavigate('invoice-history')} className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors flex items-center gap-1">
            {ar ? 'عرض الكل' : 'View All'}<Arrow size={13} />
          </button>
        </div>
        <div className="space-y-3">
          {INVOICES.slice(0, 4).map(inv => (
            <div key={inv.id} className="rounded-[2rem] bg-white p-4 shadow-sm border border-gray-100 flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-3xl flex items-center justify-center" style={{ background: P+'15', color: P }}><CreditCard size={18} /></div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{inv.customer}</p>
                  <p className="text-gray-400 text-xs">{inv.id} · {inv.items} {ar ? 'منتجات' : 'items'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">ر.س {inv.total}</p>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: inv.status === 'paid' ? GR+'15' : RE+'15', color: inv.status === 'paid' ? GR : RE }}>
                  {inv.status === 'paid' ? (ar ? 'مدفوع' : 'Paid') : (ar ? 'مسترد' : 'Refunded')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
