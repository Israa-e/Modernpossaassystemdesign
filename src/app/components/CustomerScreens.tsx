import { useState } from "react";
import { Search, Plus, Phone, Mail, Star, ShoppingBag, ChevronLeft, ChevronRight, Truck, Package, X, Check } from "lucide-react";
import { CUSTOMERS, INVOICES, type Lang, type Screen } from "../data/store";

const P = "#0F766E"; const AM = "#F59E0B"; const GR = "#22C55E"; const PU = "#8B5CF6";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; }

/* ─── Customers ─── */
export function CustomersScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = CUSTOMERS.filter(c =>
    (ar ? c.name : c.nameEn).toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'العملاء' : 'Customers'}</h1>
            <p className="text-teal-100 text-sm">{CUSTOMERS.length} {ar ? 'عميل مسجل' : 'registered customers'}</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={22} className="text-white" />
          </button>
        </div>
        <div className="relative">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={ar ? 'ابحث بالاسم أو الهاتف...' : 'Search by name or phone...'}
            className="w-full py-3 rounded-2xl bg-white/20 text-white placeholder:text-teal-200 outline-none border border-white/30"
            style={{ paddingRight: ar ? '3rem' : '1rem', paddingLeft: ar ? '1rem' : '3rem' }} />
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-teal-200" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }} />
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        {[
          { label: ar ? 'إجمالي العملاء' : 'Total', val: CUSTOMERS.length, color: P },
          { label: ar ? 'نقاط الولاء' : 'Loyalty Pts', val: CUSTOMERS.reduce((s, c) => s + c.points, 0).toLocaleString(), color: AM },
          { label: ar ? 'إجمالي المشتريات' : 'Total Spent', val: 'ر.س ' + (CUSTOMERS.reduce((s, c) => s + c.total, 0) / 1000).toFixed(1) + 'K', color: GR },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
            <p className="font-black text-base" style={{ color: s.color }}>{s.val}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-2">
        {filtered.map(c => (
          <div key={c.id} onClick={() => onNavigate('customer-details')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
              {(ar ? c.name : c.nameEn).charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{ar ? c.name : c.nameEn}</p>
              <p className="text-gray-400 text-sm">{c.phone}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs flex items-center gap-0.5" style={{ color: AM }}>
                  <Star size={11} fill={AM} /> {c.points} {ar ? 'نقطة' : 'pts'}
                </span>
                <span className="text-xs text-gray-400">{c.visits} {ar ? 'زيارة' : 'visits'}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-gray-900 text-sm">ر.س {c.total.toLocaleString()}</p>
              <p className="text-gray-400 text-xs">{ar ? 'إجمالي الإنفاق' : 'total spent'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-lg">{ar ? 'إضافة عميل جديد' : 'Add New Customer'}</h3>
              <button onClick={() => setShowAdd(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"><X size={18} /></button>
            </div>
            {[
              { placeholder: ar ? 'الاسم الكامل' : 'Full Name', type: 'text' },
              { placeholder: ar ? 'رقم الهاتف' : 'Phone Number', type: 'tel' },
              { placeholder: ar ? 'البريد الإلكتروني' : 'Email (optional)', type: 'email' },
            ].map((f, i) => (
              <input key={i} type={f.type} placeholder={f.placeholder}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-gray-900 placeholder:text-gray-400" />
            ))}
            <button onClick={() => setShowAdd(false)} className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
              <Check size={20} /> {ar ? 'إضافة العميل' : 'Add Customer'}
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 shadow-2xl w-14 h-14 rounded-2xl flex items-center justify-center text-white"
        style={{ right: ar ? 'auto' : '1.5rem', left: ar ? '1.5rem' : 'auto', background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <Plus size={26} />
      </button>
    </div>
  );
}

/* ─── Customer Details ─── */
export function CustomerDetailsScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const c = CUSTOMERS[0];

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-8" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <button onClick={() => onNavigate('customers')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
          {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
        </button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-3xl border-4 border-white/30"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            {(ar ? c.name : c.nameEn).charAt(0)}
          </div>
          <div>
            <h2 className="text-white font-black text-xl">{ar ? c.name : c.nameEn}</h2>
            <p className="text-teal-100">{c.phone}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={14} fill={AM} style={{ color: AM }} />
              <span className="text-teal-100 text-sm font-bold">{c.points} {ar ? 'نقطة ولاء' : 'loyalty points'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 grid grid-cols-3 gap-3">
          {[
            { label: ar ? 'إجمالي الإنفاق' : 'Total Spent', val: `ر.س ${c.total.toLocaleString()}`, color: P },
            { label: ar ? 'عدد الزيارات' : 'Total Visits', val: c.visits.toString(), color: '#3B82F6' },
            { label: ar ? 'نقاط الولاء' : 'Loyalty Pts', val: c.points.toString(), color: AM },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-black" style={{ color: s.color }}>{s.val}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Contact */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-3">{ar ? 'معلومات التواصل' : 'Contact Information'}</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 py-2 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${P}15` }}><Phone size={18} style={{ color: P }} /></div>
              <div>
                <p className="text-gray-400 text-xs">{ar ? 'رقم الهاتف' : 'Phone'}</p>
                <p className="font-bold text-gray-900">{c.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${AM}15` }}><Mail size={18} style={{ color: AM }} /></div>
              <div>
                <p className="text-gray-400 text-xs">{ar ? 'البريد الإلكتروني' : 'Email'}</p>
                <p className="font-bold text-gray-900">{c.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black text-gray-900">{ar ? 'برنامج الولاء' : 'Loyalty Program'}</h3>
            <span className="text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ background: AM }}>
              {ar ? 'ذهبي' : 'Gold'}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{ar ? 'النقاط الحالية' : 'Current Points'}</span>
            <span className="font-bold" style={{ color: AM }}>{c.points} / 1000</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(c.points / 1000) * 100}%`, background: `linear-gradient(to right, ${AM}, #F97316)` }} />
          </div>
          <p className="text-gray-400 text-xs mt-2">{ar ? `${1000 - c.points} نقطة للوصول للمستوى البلاتيني` : `${1000 - c.points} pts to Platinum`}</p>
        </div>

        {/* Purchase history */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-3">{ar ? 'سجل المشتريات' : 'Purchase History'}</h3>
          {INVOICES.slice(0, 4).map((inv, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-t border-gray-100 first:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${P}10` }}>
                  <ShoppingBag size={16} style={{ color: P }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{inv.id}</p>
                  <p className="text-gray-400 text-xs">{inv.date}</p>
                </div>
              </div>
              <p className="font-black text-gray-900">ر.س {inv.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Suppliers ─── */
const SUPPLIERS = [
  { id: '1', name: 'شركة الأمل للتوزيع', nameEn: 'Al-Amal Distribution', phone: '0112345678', email: 'info@alamal.sa', categories: ['مشروبات', 'ألبان'], orders: 12, lastOrder: '2024-01-10' },
  { id: '2', name: 'مؤسسة النخبة', nameEn: 'Al-Nukhba Est.', phone: '0123456789', email: 'orders@nukhba.sa', categories: ['خضروات', 'لحوم'], orders: 8, lastOrder: '2024-01-12' },
  { id: '3', name: 'الموزع الدولي', nameEn: 'International Dist.', phone: '0134567890', email: 'sales@intdist.sa', categories: ['منظفات', 'أدوية'], orders: 5, lastOrder: '2024-01-08' },
];

export function SuppliersScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, #7C3AED, ${PU})` }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'الموردون' : 'Suppliers'}</h1>
            <p className="text-purple-200 text-sm">{SUPPLIERS.length} {ar ? 'مورد نشط' : 'active suppliers'}</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={22} className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: ar ? 'طلبات هذا الشهر' : 'Orders This Month', val: '25' },
            { label: ar ? 'إجمالي المشتريات' : 'Total Purchases', val: 'ر.س 45K' },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-white font-black text-xl">{s.val}</p>
              <p className="text-purple-200 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {SUPPLIERS.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, #7C3AED, ${PU})` }}>
                {(ar ? s.name : s.nameEn).charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900">{ar ? s.name : s.nameEn}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Phone size={12} className="text-gray-400" />
                  <p className="text-gray-400 text-sm">{s.phone}</p>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {s.categories.map((cat, ci) => (
                    <span key={ci} className="text-xs px-2 py-0.5 rounded-lg font-semibold" style={{ background: `${PU}15`, color: PU }}>{cat}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Package size={14} />
                <span>{s.orders} {ar ? 'طلبات' : 'orders'}</span>
              </div>
              <button className="text-sm font-bold px-4 py-1.5 rounded-xl text-white" style={{ background: `linear-gradient(135deg, #7C3AED, ${PU})` }}>
                {ar ? 'طلب شراء' : 'New Order'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-lg">{ar ? 'إضافة مورد' : 'Add Supplier'}</h3>
              <button onClick={() => setShowAdd(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"><X size={18} /></button>
            </div>
            {[ar ? 'اسم المورد' : 'Supplier Name', ar ? 'رقم الهاتف' : 'Phone', ar ? 'البريد الإلكتروني' : 'Email', ar ? 'العنوان' : 'Address'].map((p, i) => (
              <input key={i} placeholder={p} className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-gray-900 placeholder:text-gray-400" />
            ))}
            <button onClick={() => setShowAdd(false)} className="w-full py-4 rounded-2xl text-white font-bold" style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}>
              {ar ? 'إضافة المورد' : 'Add Supplier'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
