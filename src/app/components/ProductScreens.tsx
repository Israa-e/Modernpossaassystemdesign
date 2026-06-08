import { useState } from "react";
import { Search, Plus, Filter, ChevronLeft, ChevronRight, Camera, Barcode, Package, Tag, AlertTriangle, Grid3X3, List, Edit2, Trash2, X, Check } from "lucide-react";
import { PRODUCTS, CATEGORIES, type Lang, type Screen } from "../data/store";

const P = "#0F766E";
const AM = "#F59E0B";
const RE = "#EF4444";
const GR = "#22C55E";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; }

/* ─── Products List ─── */
export function ProductsScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = (ar ? p.name : p.nameEn).toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === 'all' || p.category === activeCat;
    return matchSearch && matchCat;
  });

  const getStockStatus = (stock: number, min: number) => {
    if (stock === 0) return { label: ar ? 'نفذ' : 'Out', color: RE, bg: `${RE}15` };
    if (stock <= min) return { label: ar ? 'منخفض' : 'Low', color: AM, bg: `${AM}15` };
    return { label: ar ? 'متاح' : 'In Stock', color: GR, bg: `${GR}15` };
  };

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${P} 0%, #14B8A6 100%)` }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'المنتجات' : 'Products'}</h1>
            <p className="text-teal-100 text-sm">{filtered.length} {ar ? 'منتج' : 'products'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {viewMode === 'grid' ? <List size={18} className="text-white" /> : <Grid3X3 size={18} className="text-white" />}
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ar ? 'ابحث عن منتج...' : 'Search product...'}
            className="w-full py-3 rounded-2xl bg-white/20 text-white placeholder:text-teal-200 outline-none border border-white/30 backdrop-blur-sm"
            style={{ paddingRight: ar ? '3rem' : '1.2rem', paddingLeft: ar ? '1.2rem' : '3rem' }} />
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-teal-200" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }} />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[{ id: 'all', name: ar ? 'الكل' : 'All', nameEn: 'All', icon: '🏪', color: P },...CATEGORIES].map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: activeCat === cat.id ? P : '#FFFFFF', color: activeCat === cat.id ? '#fff' : '#64748B', border: `1px solid ${activeCat === cat.id ? P : '#E2E8F0'}`, boxShadow: activeCat === cat.id ? `0 4px 12px ${P}40` : 'none' }}>
            <span>{cat.icon}</span>{ar ? cat.name : ('nameEn' in cat ? cat.nameEn : cat.name)}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="px-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => {
              const status = getStockStatus(p.stock, p.minStock);
              const cat = CATEGORIES.find(c => c.id === p.category);
              return (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="w-full h-24 rounded-xl flex items-center justify-center mb-3 text-4xl" style={{ background: `${cat?.color || P}12` }}>
                    {cat?.icon || '📦'}
                  </div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{ar ? p.name : p.nameEn}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{p.sku}</p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-black" style={{ color: P }}>ر.س {p.price}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ color: status.color, background: status.bg }}>{status.label}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{ar ? `${p.stock} وحدة` : `${p.stock} units`}</span>
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${P}15`, color: P }}><Edit2 size={13} /></button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${RE}15`, color: RE }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(p => {
              const status = getStockStatus(p.stock, p.minStock);
              const cat = CATEGORIES.find(c => c.id === p.category);
              return (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${cat?.color || P}15` }}>{cat?.icon || '📦'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{ar ? p.name : p.nameEn}</p>
                    <p className="text-gray-400 text-xs">{p.sku} · {ar ? p.stock + ' وحدة' : p.stock + ' units'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black" style={{ color: P }}>ر.س {p.price}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ color: status.color, background: status.bg }}>{status.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => onNavigate('add-product')} className="fixed bottom-24 shadow-2xl w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-transform active:scale-95"
        style={{ right: ar ? 'auto' : '1.5rem', left: ar ? '1.5rem' : 'auto', background: `linear-gradient(135deg, ${P}, #14B8A6)`, boxShadow: `0 8px 24px ${P}60` }}>
        <Plus size={26} />
      </button>
    </div>
  );
}

/* ─── Add Product ─── */
export function AddProductScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [selectedCat, setSelectedCat] = useState('1');
  const input = "w-full px-4 py-3.5 rounded-2xl border text-gray-900 placeholder:text-gray-400 outline-none transition-all bg-gray-50";
  const focusStyle = { borderColor: P, boxShadow: `0 0 0 3px ${P}20` };

  return (
    <div className="pb-28 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <button onClick={() => onNavigate('products')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
        </button>
        <div>
          <h1 className="text-white font-black text-xl">{ar ? 'إضافة منتج' : 'Add Product'}</h1>
          <p className="text-teal-100 text-sm">{ar ? 'أدخل بيانات المنتج الجديد' : 'Enter new product details'}</p>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Image Upload */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors" style={{ borderColor: P, background: `${P}08` }}>
            <Camera size={28} style={{ color: P }} />
            <span className="text-sm font-semibold" style={{ color: P }}>{ar ? 'صورة المنتج' : 'Product Image'}</span>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'اسم المنتج *' : 'Product Name *'}</label>
          <input type="text" placeholder={ar ? 'أدخل اسم المنتج' : 'Enter product name'} className={input} style={{ borderColor: '#E2E8F0' }} onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }} />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'الفئة *' : 'Category *'}</label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: selectedCat === cat.id ? cat.color : `${cat.color}15`, color: selectedCat === cat.id ? '#fff' : cat.color, border: `1.5px solid ${selectedCat === cat.id ? cat.color : 'transparent'}` }}>
                {cat.icon} {ar ? cat.name : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Barcode & SKU */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'الباركود' : 'Barcode'}</label>
            <div className="relative">
              <input type="text" placeholder="6901020..." className={input} style={{ borderColor: '#E2E8F0', paddingRight: ar ? '3rem' : '1rem', paddingLeft: ar ? '1rem' : '3rem' }} />
              <Barcode size={18} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">SKU</label>
            <input type="text" placeholder="BEV-001" className={input} style={{ borderColor: '#E2E8F0' }} dir="ltr" />
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'سعر الشراء (ر.س)' : 'Buy Price (SAR)'}</label>
            <input type="number" placeholder="0.00" className={input} style={{ borderColor: '#E2E8F0' }} dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'سعر البيع (ر.س)' : 'Sell Price (SAR)'}</label>
            <input type="number" placeholder="0.00" className={input} style={{ borderColor: '#E2E8F0' }} dir="ltr" />
          </div>
        </div>

        {/* Stock */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'الكمية الابتدائية' : 'Initial Stock'}</label>
            <input type="number" placeholder="0" className={input} style={{ borderColor: '#E2E8F0' }} dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'حد التنبيه' : 'Alert Threshold'}</label>
            <input type="number" placeholder="10" className={input} style={{ borderColor: '#E2E8F0' }} dir="ltr" />
          </div>
        </div>

        {/* Unit */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{ar ? 'وحدة القياس' : 'Unit of Measure'}</label>
          <select className={input} style={{ borderColor: '#E2E8F0' }}>
            <option value="piece">{ar ? 'قطعة' : 'Piece'}</option>
            <option value="kg">{ar ? 'كيلوغرام' : 'Kilogram'}</option>
            <option value="liter">{ar ? 'لتر' : 'Liter'}</option>
            <option value="box">{ar ? 'علبة' : 'Box'}</option>
            <option value="pack">{ar ? 'حزمة' : 'Pack'}</option>
          </select>
        </div>

        {/* Tax toggle */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${AM}15` }}>
              <Tag size={20} style={{ color: AM }} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{ar ? 'خاضع للضريبة' : 'Tax Applicable'}</p>
              <p className="text-gray-400 text-xs">{ar ? 'ضريبة القيمة المضافة 15%' : 'VAT 15%'}</p>
            </div>
          </div>
          <div className="w-12 h-6 rounded-full relative cursor-pointer" style={{ background: P }}>
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
          </div>
        </div>

        {/* Save button */}
        <button onClick={() => onNavigate('products')} className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg mt-2 flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)`, boxShadow: `0 8px 24px ${P}50` }}>
          <Package size={22} />
          {ar ? 'حفظ المنتج' : 'Save Product'}
        </button>
      </div>
    </div>
  );
}

/* ─── Categories ─── */
export function CategoriesScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('products')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
          </button>
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'الفئات' : 'Categories'}</h1>
            <p className="text-teal-100 text-sm">{CATEGORIES.length} {ar ? 'فئة' : 'categories'}</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Plus size={22} className="text-white" />
        </button>
      </div>

      <div className="px-4 pt-5 grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-4 translate-x-4" style={{ background: cat.color }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3" style={{ background: `${cat.color}15` }}>{cat.icon}</div>
            <p className="font-black text-gray-900">{ar ? cat.name : cat.nameEn}</p>
            <p className="text-gray-400 text-sm mt-0.5">{cat.count} {ar ? 'منتج' : 'products'}</p>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 py-1.5 rounded-xl text-xs font-bold" style={{ background: `${cat.color}15`, color: cat.color }}>{ar ? 'تعديل' : 'Edit'}</button>
              <button className="flex-1 py-1.5 rounded-xl text-xs font-bold" style={{ background: `${RE}15`, color: RE }}>{ar ? 'حذف' : 'Delete'}</button>
            </div>
          </div>
        ))}
        {/* Add New */}
        <button onClick={() => setShowModal(true)} className="bg-white rounded-2xl p-5 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 min-h-[160px]">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${P}10` }}>
            <Plus size={28} style={{ color: P }} />
          </div>
          <p className="font-bold text-gray-500 text-sm">{ar ? 'فئة جديدة' : 'New Category'}</p>
        </button>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-lg">{ar ? 'إضافة فئة جديدة' : 'Add New Category'}</h3>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"><X size={18} /></button>
            </div>
            <input type="text" placeholder={ar ? 'اسم الفئة' : 'Category name'} className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-gray-900 placeholder:text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">{ar ? 'اختر أيقونة' : 'Choose Icon'}</p>
              <div className="flex gap-3 flex-wrap">
                {['🛒','🍕','💊','👔','🎮','📱','🏠','🌿','🍰','🥤'].map(icon => (
                  <button key={icon} className="w-12 h-12 rounded-xl bg-gray-100 text-2xl flex items-center justify-center">{icon}</button>
                ))}
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
              <Check size={20} /> {ar ? 'إضافة الفئة' : 'Add Category'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inventory ─── */
export function InventoryScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [filter, setFilter] = useState<'all'|'low'|'out'>('all');

  const filtered = PRODUCTS.filter(p => {
    if (filter === 'low') return p.stock > 0 && p.stock <= p.minStock;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  const getStatus = (stock: number, min: number) => {
    if (stock === 0) return { label: ar ? 'نفذ' : 'Out', color: RE, bg: `${RE}15`, pct: 0 };
    if (stock <= min) return { label: ar ? 'منخفض' : 'Low', color: AM, bg: `${AM}15`, pct: Math.min((stock / min) * 60, 60) };
    return { label: ar ? 'جيد' : 'Good', color: GR, bg: `${GR}15`, pct: Math.min((stock / (min * 3)) * 100, 100) };
  };

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
          </button>
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'المخزون' : 'Inventory'}</h1>
            <p className="text-teal-100 text-sm">{PRODUCTS.length} {ar ? 'منتج في المخزون' : 'products in stock'}</p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: ar ? 'إجمالي الأصناف' : 'Total SKUs', val: PRODUCTS.length, color: '#fff' },
            { label: ar ? 'مخزون منخفض' : 'Low Stock', val: PRODUCTS.filter(p => p.stock > 0 && p.stock <= p.minStock).length, color: AM },
            { label: ar ? 'نفذ من المخزون' : 'Out of Stock', val: PRODUCTS.filter(p => p.stock === 0).length, color: RE },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="font-black text-2xl" style={{ color: s.color }}>{s.val}</p>
              <p className="text-teal-100 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-3 flex gap-2">
        {[['all', ar ? 'الكل' : 'All'], ['low', ar ? 'منخفض' : 'Low Stock'], ['out', ar ? 'نفذ' : 'Out of Stock']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key as any)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: filter === key ? P : '#fff', color: filter === key ? '#fff' : '#64748B', border: `1px solid ${filter === key ? P : '#E2E8F0'}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="px-4 flex flex-col gap-2">
        {filtered.map(p => {
          const status = getStatus(p.stock, p.minStock);
          const cat = CATEGORIES.find(c => c.id === p.category);
          return (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${cat?.color || P}15` }}>{cat?.icon || '📦'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900 text-sm">{ar ? p.name : p.nameEn}</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ml-2" style={{ color: status.color, background: status.bg }}>{status.label}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{p.sku}</p>
                  {/* Progress bar */}
                  <div className="mt-2.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${status.pct}%`, background: status.color }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{ar ? `الحد الأدنى: ${p.minStock}` : `Min: ${p.minStock}`}</span>
                    <span className="text-xs font-bold" style={{ color: status.color }}>{ar ? `المتاح: ${p.stock}` : `Available: ${p.stock}`}</span>
                  </div>
                </div>
              </div>
              {p.stock <= p.minStock && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: RE }} />
                  <span className="text-xs text-red-500">{ar ? 'يحتاج إعادة تعبئة' : 'Needs restocking'}</span>
                  <button className="ml-auto text-xs font-bold px-3 py-1 rounded-lg text-white" style={{ background: P }}>{ar ? 'طلب شراء' : 'Order'}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
