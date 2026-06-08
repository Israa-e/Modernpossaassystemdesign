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
    <div className="pb-24" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-5 rounded-b-[2.5rem] shadow-lg" style={{ background: `linear-gradient(135deg, #0B5E57 0%, #14B8A6 100%)` }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-teal-200 text-sm">{ar ? 'الاثنين، 15 يناير 2024' : 'Monday, Jan 15 2024'}</p>
            <h1 className="text-white font-black text-xl mt-0.5">{ar ? 'مرحباً، أحمد 👋' : 'Hello, Ahmed 👋'}</h1>
            <p className="text-teal-200 text-sm">{ar ? 'متجر الأمل' : 'Al-Amal Store'}</p>
          </div>
          <button onClick={() => onNavigate('notifications')} className="relative w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
            <Bell size={20} className="text-white"/>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-black">3</span>
          </button>
        </div>
        <div className="bg-white/15 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-teal-200 text-sm">{ar ? 'إجمالي إيرادات اليوم' : "Today's Revenue"}</p>
            <p className="text-white font-black mt-1" style={{ fontSize: '2rem' }}>ر.س 4,230</p>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp size={14} className="text-green-300"/>
              <span className="text-green-300 text-sm font-bold">+18.3%</span>
              <span className="text-teal-300 text-xs">{ar ? 'من أمس' : 'vs yesterday'}</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-teal-200 text-xs">{ar ? 'الأرباح' : 'Profit'}</p>
            <p className="text-white font-black text-lg">ر.س 1,680</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        {kpiCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #F1F5F9' }}>
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.color + '18', color: card.color }}>{card.icon}</div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: card.trend === 'up' ? GR+'20' : RE+'20', color: card.trend === 'up' ? GR : RE }}>
                {card.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
            <p className="font-black mt-3" style={{ fontSize: '1.35rem', color: card.color }}>{card.value}</p>
            <p className="text-gray-800 text-sm font-semibold">{card.label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="mx-5 mt-5 bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #F1F5F9' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-gray-900">{ar ? 'مبيعات الأسبوع' : 'Weekly Sales'}</h3>
          <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ color: P, background: P+'12' }}>{ar ? 'عرض الكل' : 'View All'}</button>
        </div>
        <ResponsiveContainer width="100%" height={155}>
          <AreaChart data={DAILY_SALES} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={P} stopOpacity={0.28}/>
                <stop offset="95%" stopColor={P} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey={ar ? 'day' : 'dayEn'} tick={{ fontSize: 11, fontFamily: 'Cairo', fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Cairo', fontSize: 12 }} formatter={(v: number) => [`ر.س ${v.toLocaleString()}`, ar ? 'المبيعات' : 'Sales']}/>
            <Area type="monotone" dataKey="sales" stroke={P} strokeWidth={2.5} fill="url(#salesG)" dot={false} activeDot={{ r: 5, fill: P }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-5">
        <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2"><Zap size={17} style={{ color: AM }}/>{ar ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ label, screen, icon, color }) => (
            <button key={screen} onClick={() => onNavigate(screen)} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" style={{ border: '1px solid #F1F5F9' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}>{icon}</div>
              <span className="text-xs font-bold text-gray-700 text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="mx-5 mt-5 rounded-2xl p-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2"><AlertTriangle size={17} style={{ color: RE }}/><h3 className="font-black text-red-700 text-sm">{ar ? 'تنبيه مخزون منخفض' : 'Low Stock Alert'}</h3></div>
            <button onClick={() => onNavigate('inventory')} className="text-xs font-black" style={{ color: RE }}>{ar ? 'عرض الكل' : 'View All'}</button>
          </div>
          {lowStock.slice(0, 3).map(p => (
            <div key={p.id} className="flex justify-between items-center py-2 border-t border-red-100 first:border-0">
              <span className="text-red-800 text-sm font-medium">{ar ? p.name : p.nameEn}</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ background: '#FEE2E2', color: RE }}>{ar ? `${p.stock} متبقي` : `${p.stock} left`}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Invoices */}
      <div className="px-5 mt-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-black text-gray-900">{ar ? 'آخر الفواتير' : 'Recent Invoices'}</h3>
          <button onClick={() => onNavigate('invoice-history')} className="text-xs font-bold flex items-center gap-1" style={{ color: P }}>
            {ar ? 'عرض الكل' : 'View All'}<Arrow size={13}/>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {INVOICES.slice(0, 4).map(inv => (
            <div key={inv.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center" style={{ border: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: P+'15', color: P }}><CreditCard size={18}/></div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{inv.customer}</p>
                  <p className="text-gray-400 text-xs">{inv.id} · {inv.items} {ar ? 'منتجات' : 'items'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">ر.س {inv.total}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: inv.status === 'paid' ? GR+'15' : RE+'15', color: inv.status === 'paid' ? GR : RE }}>
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
