import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, BarChart2, Calendar, Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { DAILY_SALES, MONTHLY_REVENUE, CATEGORIES, PRODUCTS, type Lang, type Screen } from "../data/store";

const P = "#0F766E"; const AM = "#F59E0B"; const GR = "#22C55E"; const PU = "#8B5CF6"; const RE = "#EF4444";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; }

const TOP_PRODUCTS = PRODUCTS.slice(0, 5).map((p, i) => ({
  name: p.name, nameEn: p.nameEn,
  sales: [340, 280, 220, 185, 140][i],
  revenue: [p.price * [340, 280, 220, 185, 140][i] / 10 | 0][0],
}));

const PIE_DATA = CATEGORIES.slice(0, 5).map((c, i) => ({
  name: c.name, nameEn: c.nameEn,
  value: [35, 25, 20, 12, 8][i],
  color: [P, "#14B8A6", AM, GR, PU][i],
}));

/* ─── Reports Dashboard ─── */
export function ReportsScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const kpis = [
    { label: ar ? 'إجمالي المبيعات' : 'Total Sales', val: 'ر.س 83,420', change: '+12.4%', up: true, color: P },
    { label: ar ? 'صافي الربح' : 'Net Profit', val: 'ر.س 31,200', change: '+8.7%', up: true, color: GR },
    { label: ar ? 'متوسط الفاتورة' : 'Avg. Invoice', val: 'ر.س 72.5', change: '-2.1%', up: false, color: AM },
    { label: ar ? 'معدل الإرجاع' : 'Return Rate', val: '1.8%', change: '-0.3%', up: true, color: PU },
  ];

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'التقارير' : 'Reports'}</h1>
            <p className="text-teal-100 text-sm">{ar ? 'يناير 2024' : 'January 2024'}</p>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Download size={20} className="text-white" />
          </button>
        </div>
        {/* Period tabs */}
        <div className="flex gap-1 bg-white/15 rounded-2xl p-1">
          {([['day', ar ? 'يوم' : 'Day'], ['week', ar ? 'أسبوع' : 'Week'], ['month', ar ? 'شهر' : 'Month']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setPeriod(k)}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: period === k ? '#fff' : 'transparent', color: period === k ? P : 'rgba(255,255,255,0.75)' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-xs">{k.label}</p>
              <p className="font-black mt-1 text-gray-900" style={{ fontSize: '1.2rem' }}>{k.val}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {k.up ? <TrendingUp size={13} style={{ color: GR }} /> : <TrendingDown size={13} style={{ color: RE }} />}
                <span className="text-xs font-bold" style={{ color: k.up ? GR : RE }}>{k.change}</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '65%', background: k.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-900">{ar ? 'الإيرادات والأرباح' : 'Revenue & Profit'}</h3>
            <span className="text-xs text-gray-400">{ar ? 'آخر 12 شهر' : 'Last 12 months'}</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={P} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={P} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="proG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GR} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={ar ? 'month' : 'monthEn'} tick={{ fontSize: 10, fontFamily: 'Cairo', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Cairo', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke={P} strokeWidth={2} fill="url(#revG)" dot={false} name={ar ? 'الإيرادات' : 'Revenue'} />
              <Area type="monotone" dataKey="profit" stroke={GR} strokeWidth={2} fill="url(#proG)" dot={false} name={ar ? 'الأرباح' : 'Profit'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily sales bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4">{ar ? 'مبيعات الأسبوع' : 'Weekly Sales'}</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={DAILY_SALES} margin={{ top: 5, right: 5, bottom: 0, left: -25 }} barSize={22}>
              <XAxis dataKey={ar ? 'day' : 'dayEn'} tick={{ fontSize: 10, fontFamily: 'Cairo', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontFamily: 'Cairo', fontSize: 12 }} />
              <Bar dataKey="sales" fill={P} radius={[6, 6, 0, 0]} name={ar ? 'المبيعات' : 'Sales'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-3">{ar ? 'أفضل المنتجات' : 'Top Products'}</h3>
          <div className="flex flex-col gap-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-black text-gray-300 text-sm w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="text-gray-800 text-sm font-semibold">{ar ? p.name : p.nameEn}</p>
                    <p className="text-gray-500 text-sm font-bold">{p.sales} {ar ? 'وحدة' : 'units'}</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(p.sales / 340) * 100}%`, background: [P, "#14B8A6", AM, GR, PU][i] }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category pie */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-3">{ar ? 'توزيع الفئات' : 'Category Distribution'}</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 flex flex-col gap-2">
              {PIE_DATA.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <p className="text-gray-700 text-xs flex-1">{ar ? d.name : d.nameEn}</p>
                  <p className="text-gray-500 text-xs font-bold">{d.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics ─── */
export function AnalyticsScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';

  const growthData = MONTHLY_REVENUE.slice(-6).map((m, i, arr) => ({
    ...m,
    growth: i === 0 ? 0 : Math.round(((m.revenue - arr[i - 1].revenue) / arr[i - 1].revenue) * 100),
  }));

  const kpis = [
    { label: ar ? 'نمو المبيعات' : 'Sales Growth', val: '+24.3%', icon: '📈', color: GR, bg: `${GR}15` },
    { label: ar ? 'عملاء جدد' : 'New Customers', val: '128', icon: '👥', color: '#3B82F6', bg: '#3B82F615' },
    { label: ar ? 'معدل التحويل' : 'Conv. Rate', val: '68%', icon: '⚡', color: AM, bg: `${AM}15` },
    { label: ar ? 'متوسط قيمة العميل' : 'Avg. LTV', val: 'ر.س 2,340', icon: '💎', color: PU, bg: `${PU}15` },
  ];

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${PU}, #9333EA)` }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('reports')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
          </button>
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'التحليلات المتقدمة' : 'Advanced Analytics'}</h1>
            <p className="text-purple-200 text-sm">{ar ? 'رؤى مبنية على البيانات' : 'Data-driven insights'}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: k.bg }}>{k.icon}</div>
              <div>
                <p className="font-black text-gray-900">{k.val}</p>
                <p className="text-gray-400 text-xs mt-0.5">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Growth Line Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-1">{ar ? 'مسار النمو الشهري' : 'Monthly Growth Trend'}</h3>
          <p className="text-gray-400 text-xs mb-4">{ar ? 'مقارنة الإيرادات والأرباح' : 'Revenue vs Profit comparison'}</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONTHLY_REVENUE.slice(-6)} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <XAxis dataKey={ar ? 'month' : 'monthEn'} tick={{ fontSize: 10, fontFamily: 'Cairo', fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontFamily: 'Cairo', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke={P} strokeWidth={2.5} dot={{ fill: P, r: 4 }} name={ar ? 'الإيرادات' : 'Revenue'} />
              <Line type="monotone" dataKey="profit" stroke={GR} strokeWidth={2.5} dot={{ fill: GR, r: 4 }} strokeDasharray="5 4" name={ar ? 'الأرباح' : 'Profit'} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-3">{ar ? 'أداء المنتجات' : 'Product Performance'}</h3>
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-4 gap-0 bg-gray-50 px-3 py-2">
              {[ar ? 'المنتج' : 'Product', ar ? 'المبيعات' : 'Sales', ar ? 'الإيراد' : 'Revenue', ar ? 'التغيير' : 'Change'].map((h, i) => (
                <p key={i} className="text-gray-500 text-xs font-bold">{h}</p>
              ))}
            </div>
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="grid grid-cols-4 gap-0 px-3 py-3 border-t border-gray-100 items-center">
                <p className="text-gray-900 text-xs font-semibold truncate">{ar ? p.name : p.nameEn}</p>
                <p className="text-gray-700 text-xs font-bold">{p.sales}</p>
                <p className="text-gray-700 text-xs font-bold">ر.س {(p.sales * 12).toLocaleString()}</p>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-lg inline-block" style={{ color: GR, background: `${GR}15` }}>+{(5 + i * 3)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
