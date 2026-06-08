import { useState } from "react";
import { Search, ScanLine, Minus, Plus, Trash2, ChevronLeft, ChevronRight, CreditCard, Banknote, Smartphone, Check, Share2, Printer, QrCode, X, ShoppingCart, Tag } from "lucide-react";
import { PRODUCTS, CATEGORIES, INVOICES, type Lang, type Screen, type CartItem } from "../data/store";

const P = "#0F766E";
const AM = "#F59E0B";
const RE = "#EF4444";
const GR = "#22C55E";

interface Props { lang: Lang; onNavigate: (s: Screen) => void; }

/* ─── Cashier ─── */
export function CashierScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = PRODUCTS.filter(p => {
    const matchS = (ar ? p.name : p.nameEn).toLowerCase().includes(search.toLowerCase());
    const matchC = activeCat === 'all' || p.category === activeCat;
    return matchS && matchC;
  });

  const addToCart = (p: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === p.id);
      if (existing) return prev.map(i => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: p.id, name: p.name, nameEn: p.nameEn, price: p.price, qty: 1 }];
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-white font-black text-xl">{ar ? 'الكاشير' : 'Cashier'}</h1>
          <button onClick={() => setShowCart(true)} className="relative w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
            <ShoppingCart size={20} className="text-white" />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center text-white" style={{ background: RE }}>{cartCount}</span>}
          </button>
        </div>
        {/* Search + Scan */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ar ? 'ابحث أو أدخل الباركود...' : 'Search or enter barcode...'}
              className="w-full py-3 rounded-2xl bg-white/20 text-white placeholder:text-teal-200 outline-none border border-white/30"
              style={{ paddingRight: ar ? '3rem' : '1rem', paddingLeft: ar ? '1rem' : '3rem' }} />
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-teal-200" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }} />
          </div>
          <button className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
            <ScanLine size={22} className="text-white" />
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-3 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
        {[{ id: 'all', name: ar ? 'الكل' : 'All', nameEn: 'All', icon: '🏪', color: P }, ...CATEGORIES].map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: activeCat === cat.id ? P : '#F1F5F9', color: activeCat === cat.id ? '#fff' : '#64748B' }}>
            {cat.icon} {ar ? cat.name : ('nameEn' in cat ? cat.nameEn : cat.name)}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-3 gap-2">
          {filtered.map(p => {
            const cat = CATEGORIES.find(c => c.id === p.category);
            const inCart = cart.find(i => i.productId === p.id);
            return (
              <button key={p.id} onClick={() => addToCart(p)}
                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-sm border transition-all active:scale-95 relative"
                style={{ borderColor: inCart ? P : '#E2E8F0', borderWidth: inCart ? 2 : 1 }}>
                {inCart && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center text-white" style={{ background: P }}>{inCart.qty}</div>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${cat?.color || P}15` }}>{cat?.icon || '📦'}</div>
                <p className="text-gray-900 text-xs font-bold text-center leading-tight">{ar ? p.name : p.nameEn}</p>
                <p className="font-black text-sm" style={{ color: P }}>ر.س {p.price}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Checkout bar */}
      {cart.length > 0 && (
        <div className="px-4 py-4 bg-white border-t border-gray-100 pb-24">
          <button onClick={() => onNavigate('cart')} className="w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-between px-6 shadow-lg transition-transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)`, boxShadow: `0 8px 24px ${P}50` }}>
            <span className="bg-white/20 px-3 py-1 rounded-xl text-sm">{cartCount} {ar ? 'منتج' : 'items'}</span>
            <span>{ar ? 'متابعة الدفع' : 'Checkout'}</span>
            <span className="font-black">ر.س {total.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Cart ─── */
export function CartScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [items, setItems] = useState<CartItem[]>([
    { productId: '1', name: 'قهوة عربية', nameEn: 'Arabic Coffee', price: 15, qty: 2 },
    { productId: '2', name: 'خبز عيش', nameEn: 'Bread Loaf', price: 5, qty: 3 },
    { productId: '4', name: 'طماطم', nameEn: 'Tomatoes', price: 8, qty: 1 },
  ]);
  const [discount, setDiscount] = useState(10);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = (subtotal * discount) / 100;
  const taxAmt = (subtotal - discountAmt) * 0.15;
  const total = subtotal - discountAmt + taxAmt;

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => i.productId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const remove = (id: string) => setItems(prev => prev.filter(i => i.productId !== id));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <button onClick={() => onNavigate('cashier')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
        </button>
        <div>
          <h1 className="text-white font-black text-xl">{ar ? 'سلة المشتريات' : 'Shopping Cart'}</h1>
          <p className="text-teal-100 text-sm">{items.length} {ar ? 'منتجات' : 'products'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {items.map(item => (
          <div key={item.productId} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gray-50 flex-shrink-0">📦</div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{ar ? item.name : item.nameEn}</p>
              <p className="font-black mt-0.5" style={{ color: P }}>ر.س {item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.productId, -1)} className="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 bg-gray-50"><Minus size={14} /></button>
              <span className="font-black text-gray-900 w-6 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.productId, 1)} className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: P }}><Plus size={14} /></button>
            </div>
            <button onClick={() => remove(item.productId)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${RE}15`, color: RE }}><Trash2 size={14} /></button>
          </div>
        ))}

        {/* Discount */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={18} style={{ color: AM }} />
            <p className="font-bold text-gray-900">{ar ? 'خصم' : 'Discount'}</p>
          </div>
          <div className="flex gap-2">
            {[0, 5, 10, 15, 20].map(d => (
              <button key={d} onClick={() => setDiscount(d)}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: discount === d ? AM : '#F1F5F9', color: discount === d ? '#fff' : '#64748B' }}>
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <h3 className="font-black text-gray-900 mb-1">{ar ? 'ملخص الطلب' : 'Order Summary'}</h3>
          {[
            { label: ar ? 'المجموع الفرعي' : 'Subtotal', val: subtotal.toFixed(2), color: '#0F172A' },
            { label: ar ? `خصم (${discount}%)` : `Discount (${discount}%)`, val: `-${discountAmt.toFixed(2)}`, color: GR },
            { label: ar ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)', val: taxAmt.toFixed(2), color: '#64748B' },
          ].map((row, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-500 text-sm">{row.label}</span>
              <span className="font-bold text-sm" style={{ color: row.color }}>ر.س {row.val}</span>
            </div>
          ))}
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between items-center">
            <span className="font-black text-gray-900 text-lg">{ar ? 'الإجمالي' : 'Total'}</span>
            <span className="font-black text-2xl" style={{ color: P }}>ر.س {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-8 bg-white border-t border-gray-100">
        <button onClick={() => onNavigate('payment')} className="w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)`, boxShadow: `0 8px 24px ${P}50` }}>
          <CreditCard size={22} />
          {ar ? 'متابعة للدفع' : 'Proceed to Payment'} · ر.س {total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

/* ─── Payment ─── */
export function PaymentScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [method, setMethod] = useState<'cash'|'card'|'wallet'>('cash');
  const [cashGiven, setCashGiven] = useState('');
  const total = 136.25;
  const change = parseFloat(cashGiven || '0') - total;

  const methods = [
    { key: 'cash' as const, icon: <Banknote size={28} />, label: ar ? 'نقداً' : 'Cash', color: GR },
    { key: 'card' as const, icon: <CreditCard size={28} />, label: ar ? 'بطاقة' : 'Card', color: '#3B82F6' },
    { key: 'wallet' as const, icon: <Smartphone size={28} />, label: ar ? 'محفظة' : 'Wallet', color: '#7C3AED' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <button onClick={() => onNavigate('cart')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
        </button>
        <div>
          <h1 className="text-white font-black text-xl">{ar ? 'الدفع' : 'Payment'}</h1>
          <p className="text-teal-100 text-sm">{ar ? 'اختر طريقة الدفع' : 'Choose payment method'}</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4">
        {/* Amount */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400 text-sm">{ar ? 'المبلغ المستحق' : 'Amount Due'}</p>
          <p className="font-black mt-1" style={{ fontSize: '3rem', color: P }}>ر.س {total.toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-1">3 {ar ? 'منتجات · فاتورة رقم INV-2024-007' : 'products · Invoice INV-2024-007'}</p>
        </div>

        {/* Method selection */}
        <div>
          <p className="font-bold text-gray-700 mb-2 text-sm">{ar ? 'طريقة الدفع' : 'Payment Method'}</p>
          <div className="grid grid-cols-3 gap-3">
            {methods.map(m => (
              <button key={m.key} onClick={() => setMethod(m.key)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
                style={{ borderColor: method === m.key ? m.color : '#E2E8F0', background: method === m.key ? `${m.color}10` : '#fff' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${m.color}15`, color: m.color }}>{m.icon}</div>
                <span className="font-bold text-sm" style={{ color: method === m.key ? m.color : '#64748B' }}>{m.label}</span>
                {method === m.key && <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: m.color }}><Check size={12} /></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Cash input */}
        {method === 'cash' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="font-bold text-gray-700 mb-3 text-sm">{ar ? 'المبلغ المدفوع' : 'Cash Given'}</p>
            <input type="number" value={cashGiven} onChange={e => setCashGiven(e.target.value)} placeholder="0.00"
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-xl font-black text-center outline-none"
              style={{ borderColor: GR }} dir="ltr" />
            {/* Quick amounts */}
            <div className="flex gap-2 mt-3">
              {[50, 100, 150, 200].map(amt => (
                <button key={amt} onClick={() => setCashGiven(amt.toString())}
                  className="flex-1 py-2 rounded-xl text-sm font-bold"
                  style={{ background: `${P}10`, color: P }}>
                  {amt}
                </button>
              ))}
            </div>
            {parseFloat(cashGiven) >= total && (
              <div className="mt-3 p-3 rounded-xl flex justify-between items-center" style={{ background: `${GR}15` }}>
                <span className="font-bold" style={{ color: GR }}>{ar ? 'المبلغ المرتجع' : 'Change'}</span>
                <span className="font-black text-xl" style={{ color: GR }}>ر.س {change.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {method === 'card' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#3B82F615' }}>
              <CreditCard size={32} style={{ color: '#3B82F6' }} />
            </div>
            <p className="font-bold text-gray-700">{ar ? 'قرّب البطاقة أو أدخلها' : 'Tap or insert card'}</p>
            <p className="text-gray-400 text-sm mt-1">{ar ? 'يدعم Visa, Mastercard, Mada' : 'Supports Visa, Mastercard, Mada'}</p>
          </div>
        )}

        {method === 'wallet' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#7C3AED15' }}>
              <Smartphone size={32} style={{ color: '#7C3AED' }} />
            </div>
            <p className="font-bold text-gray-700">{ar ? 'امسح الرمز بالمحفظة الرقمية' : 'Scan QR with digital wallet'}</p>
            <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mt-3 flex items-center justify-center"><QrCode size={60} className="text-gray-400" /></div>
          </div>
        )}
      </div>

      <div className="px-4 pb-10">
        <button onClick={() => onNavigate('invoice')} className="w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          style={{ background: `linear-gradient(135deg, ${GR}dd, ${GR})`, boxShadow: `0 8px 24px ${GR}50` }}>
          <Check size={24} />
          {ar ? 'تأكيد الدفع' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
}

/* ─── Invoice ─── */
export function InvoiceScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const items = [
    { name: 'قهوة عربية', nameEn: 'Arabic Coffee', qty: 2, price: 15, total: 30 },
    { name: 'خبز عيش', nameEn: 'Bread Loaf', qty: 3, price: 5, total: 15 },
    { name: 'طماطم', nameEn: 'Tomatoes', qty: 1, price: 8, total: 8 },
  ];
  const subtotal = 53; const discount = 5.3; const tax = 7.16; const total = 54.86;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
        </button>
        <div>
          <h1 className="text-white font-black text-xl">{ar ? 'الفاتورة' : 'Invoice'}</h1>
          <p className="text-teal-100 text-sm">INV-2024-007</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Success badge */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${GR}15` }}>
            <Check size={32} style={{ color: GR }} />
          </div>
          <p className="font-black text-gray-900 text-lg">{ar ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</p>
          <p className="text-gray-400 text-sm mt-1">{ar ? 'الثلاثاء، 15 يناير 2024 · 10:34 ص' : 'Tuesday, Jan 15 2024 · 10:34 AM'}</p>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Store header */}
          <div className="p-5 text-center" style={{ background: `linear-gradient(135deg, ${P}10, #14B8A610)` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ background: P }}>
              <span className="text-white text-xl">🏪</span>
            </div>
            <p className="font-black text-gray-900">{ar ? 'متجر الأمل' : 'Al-Amal Store'}</p>
            <p className="text-gray-400 text-xs mt-0.5">{ar ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</p>
            <p className="text-gray-400 text-xs">VAT: 310000000000003</p>
          </div>

          <div className="p-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">{ar ? 'رقم الفاتورة' : 'Invoice No.'}</span>
              <span className="font-bold text-gray-900">INV-2024-007</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{ar ? 'الكاشير' : 'Cashier'}</span>
              <span className="font-bold text-gray-900">{ar ? 'محمد علي' : 'Mohamed Ali'}</span>
            </div>
          </div>

          {/* Items */}
          <div className="px-4 border-t border-dashed border-gray-200">
            <p className="font-bold text-gray-700 text-sm py-3">{ar ? 'المنتجات' : 'Items'}</p>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-t border-gray-100 first:border-0">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{ar ? item.name : item.nameEn}</p>
                  <p className="text-gray-400 text-xs">{item.qty} × ر.س {item.price}</p>
                </div>
                <p className="font-bold text-gray-900">ر.س {item.total}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="p-4 border-t border-dashed border-gray-200 flex flex-col gap-2">
            {[
              { label: ar ? 'المجموع' : 'Subtotal', val: subtotal.toFixed(2), bold: false },
              { label: ar ? 'خصم (10%)' : 'Discount (10%)', val: `-${discount.toFixed(2)}`, bold: false },
              { label: ar ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)', val: tax.toFixed(2), bold: false },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="text-gray-700">ر.س {row.val}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-1">
              <span className="font-black text-gray-900">{ar ? 'الإجمالي' : 'Total'}</span>
              <span className="font-black text-xl" style={{ color: P }}>ر.س {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{ar ? 'طريقة الدفع' : 'Payment'}</span>
              <span className="font-bold text-gray-700">{ar ? 'نقداً' : 'Cash'}</span>
            </div>
          </div>

          {/* QR */}
          <div className="p-4 border-t border-dashed border-gray-200 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-2"><QrCode size={64} className="text-gray-600" /></div>
            <p className="text-gray-400 text-xs">{ar ? 'امسح لعرض الفاتورة الإلكترونية' : 'Scan to view e-invoice'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-8 pt-4 flex gap-3 bg-white border-t border-gray-100">
        <button className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold border-2 border-gray-200 text-gray-700">
          <Share2 size={20} /> {ar ? 'مشاركة' : 'Share'}
        </button>
        <button className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold border-2 border-gray-200 text-gray-700">
          <Printer size={20} /> {ar ? 'طباعة' : 'Print'}
        </button>
        <button onClick={() => onNavigate('cashier')} className="flex-1 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
          <Plus size={20} /> {ar ? 'جديد' : 'New'}
        </button>
      </div>
    </div>
  );
}

/* ─── Invoice History ─── */
export function InvoiceHistoryScreen({ lang, onNavigate }: Props) {
  const ar = lang === 'ar';
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  return (
    <div className="pb-24 min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
          </button>
          <div>
            <h1 className="text-white font-black text-xl">{ar ? 'سجل الفواتير' : 'Invoice History'}</h1>
            <p className="text-teal-100 text-sm">{INVOICES.length} {ar ? 'فاتورة' : 'invoices'}</p>
          </div>
        </div>
        <div className="relative">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ar ? 'ابحث في الفواتير...' : 'Search invoices...'}
            className="w-full py-3 rounded-2xl bg-white/20 text-white placeholder:text-teal-200 outline-none border border-white/30"
            style={{ paddingRight: ar ? '3rem' : '1rem', paddingLeft: ar ? '1rem' : '3rem' }} />
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-teal-200" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }} />
        </div>
      </div>

      {/* Date filters */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[['today', ar ? 'اليوم' : 'Today'], ['week', ar ? 'هذا الأسبوع' : 'This Week'], ['month', ar ? 'هذا الشهر' : 'This Month'], ['all', ar ? 'الكل' : 'All']].map(([key, label]) => (
          <button key={key} onClick={() => setDateFilter(key)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: dateFilter === key ? P : '#fff', color: dateFilter === key ? '#fff' : '#64748B', border: `1px solid ${dateFilter === key ? P : '#E2E8F0'}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="px-4 mb-3 grid grid-cols-3 gap-2">
        {[
          { label: ar ? 'الإجمالي' : 'Total', val: 'ر.س 4,230', color: P },
          { label: ar ? 'الفواتير' : 'Invoices', val: '58', color: '#7C3AED' },
          { label: ar ? 'مسترجع' : 'Refunded', val: 'ر.س 320', color: RE },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
            <p className="font-black" style={{ color: s.color }}>{s.val}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-2">
        {INVOICES.map((inv: any) => (
          <div key={inv.id} onClick={() => onNavigate('invoice')} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: inv.status === 'paid' ? `${GR}15` : `${RE}15` }}>
              <CreditCard size={22} style={{ color: inv.status === 'paid' ? GR : RE }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{inv.id}</p>
              <p className="text-gray-400 text-xs">{inv.customer} · {inv.items} {ar ? 'منتجات' : 'items'}</p>
              <p className="text-gray-300 text-xs">{inv.date}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-gray-900">ر.س {inv.total}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: inv.status === 'paid' ? `${GR}15` : `${RE}15`, color: inv.status === 'paid' ? GR : RE }}>
                {inv.status === 'paid' ? (ar ? 'مدفوع' : 'Paid') : (ar ? 'مسترد' : 'Refunded')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
