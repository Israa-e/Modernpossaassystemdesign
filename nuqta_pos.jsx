import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// ─── BRAND COLORS ───
const C = {
  primary: "#0F766E",
  primaryDark: "#0B5E57",
  secondary: "#14B8A6",
  accent: "#F59E0B",
  success: "#22C55E",
  danger: "#EF4444",
  purple: "#8B5CF6",
  bg: "#F0F4F8",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
};

const grad = `linear-gradient(135deg, ${C.primaryDark}, ${C.secondary})`;

// ─── MOCK DATA ───
const CATEGORIES = [
  { id: "all", name: "الكل", en: "All", icon: "🏪", color: C.primary },
  { id: "bev", name: "مشروبات", en: "Beverages", icon: "🥤", color: "#0891B2" },
  { id: "bak", name: "مخبوزات", en: "Bakery", icon: "🍞", color: C.accent },
  { id: "dai", name: "ألبان", en: "Dairy", icon: "🥛", color: "#3B82F6" },
  { id: "veg", name: "خضروات", en: "Vegetables", icon: "🥦", color: C.success },
  { id: "cln", name: "منظفات", en: "Cleaning", icon: "🧴", color: C.purple },
];

const PRODUCTS = [
  { id: "1", name: "قهوة عربية", en: "Arabic Coffee", cat: "bev", price: 15, stock: 45, min: 10, sku: "BEV-001" },
  { id: "2", name: "خبز عيش", en: "Bread Loaf", cat: "bak", price: 5, stock: 8, min: 15, sku: "BAK-001" },
  { id: "3", name: "حليب طازج", en: "Fresh Milk", cat: "dai", price: 12, stock: 6, min: 20, sku: "DAI-001" },
  { id: "4", name: "طماطم", en: "Tomatoes", cat: "veg", price: 8, stock: 30, min: 10, sku: "VEG-001" },
  { id: "5", name: "عصير برتقال", en: "Orange Juice", cat: "bev", price: 18, stock: 25, min: 8, sku: "BEV-002" },
  { id: "6", name: "كيك شوكولاتة", en: "Chocolate Cake", cat: "bak", price: 35, stock: 3, min: 5, sku: "BAK-002" },
  { id: "7", name: "جبن أبيض", en: "White Cheese", cat: "dai", price: 22, stock: 0, min: 10, sku: "DAI-002" },
  { id: "8", name: "خيار", en: "Cucumber", cat: "veg", price: 5, stock: 40, min: 10, sku: "VEG-002" },
  { id: "9", name: "شاي أحمر", en: "Black Tea", cat: "bev", price: 10, stock: 60, min: 15, sku: "BEV-003" },
  { id: "10", name: "مياه معدنية", en: "Mineral Water", cat: "bev", price: 3, stock: 120, min: 30, sku: "BEV-004" },
  { id: "11", name: "كعك بالسمسم", en: "Sesame Kaak", cat: "bak", price: 8, stock: 20, min: 10, sku: "BAK-003" },
  { id: "12", name: "زبادي", en: "Yogurt", cat: "dai", price: 7, stock: 35, min: 15, sku: "DAI-003" },
];

const INVOICES = [
  { id: "INV-007", customer: "محمد أحمد", en: "Mohamed Ahmed", items: 3, total: 136.25, status: "paid", date: "15 يناير" },
  { id: "INV-006", customer: "فاطمة علي", en: "Fatima Ali", items: 5, total: 245.00, status: "paid", date: "15 يناير" },
  { id: "INV-005", customer: "خالد عمر", en: "Khaled Omar", items: 2, total: 89.50, status: "refunded", date: "14 يناير" },
  { id: "INV-004", customer: "نورا سعيد", en: "Noura Said", items: 7, total: 412.75, status: "paid", date: "14 يناير" },
  { id: "INV-003", customer: "محمد أحمد", en: "Mohamed Ahmed", items: 4, total: 178.00, status: "paid", date: "13 يناير" },
];

const DAILY = [
  { d: "سبت", e: "Sat", v: 2100 }, { d: "أحد", e: "Sun", v: 3400 },
  { d: "اثنين", e: "Mon", v: 2800 }, { d: "ثلاثاء", e: "Tue", v: 4200 },
  { d: "أربعاء", e: "Wed", v: 3800 }, { d: "خميس", e: "Thu", v: 5100 },
  { d: "جمعة", e: "Fri", v: 4230 },
];

const MONTHLY = [
  { m: "يناير", me: "Jan", r: 45000, p: 16200 }, { m: "فبراير", me: "Feb", r: 52000, p: 19500 },
  { m: "مارس", me: "Mar", r: 48000, p: 17300 }, { m: "أبريل", me: "Apr", r: 61000, p: 23800 },
  { m: "مايو", me: "May", r: 55000, p: 20100 }, { m: "يونيو", me: "Jun", r: 67000, p: 26500 },
  { m: "يوليو", me: "Jul", r: 72000, p: 29000 }, { m: "أغسطس", me: "Aug", r: 69000, p: 27200 },
  { m: "سبتمبر", me: "Sep", r: 75000, p: 31000 }, { m: "أكتوبر", me: "Oct", r: 78000, p: 32500 },
  { m: "نوفمبر", me: "Nov", r: 82000, p: 34100 }, { m: "ديسمبر", me: "Dec", r: 91000, p: 38500 },
];

// ─── HELPERS ───
const getCatColor = (catId) => CATEGORIES.find(c => c.id === catId)?.color || C.primary;
const getCatIcon = (catId) => CATEGORIES.find(c => c.id === catId)?.icon || "📦";
const getStockStatus = (stock, min) => {
  if (stock === 0) return { label: "نفذ", en: "Out", color: C.danger };
  if (stock <= min) return { label: "منخفض", en: "Low", color: C.accent };
  return { label: "متاح", en: "In Stock", color: C.success };
};

// ─── SHARED COMPONENTS ───
const Btn = ({ children, onClick, color = C.primary, variant = "solid", style = {}, ...p }) => (
  <button
    onClick={onClick}
    style={{
      background: variant === "solid" ? `linear-gradient(135deg, ${color}cc, ${color})` : "transparent",
      color: variant === "solid" ? "#fff" : color,
      border: variant === "outline" ? `2px solid ${color}` : "none",
      borderRadius: 16, padding: "12px 20px", fontFamily: "Cairo, sans-serif",
      fontWeight: 900, cursor: "pointer", transition: "all 0.15s",
      ...style
    }}
    onMouseDown={e => { e.currentTarget.style.transform = "scale(0.96)"; }}
    onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    {...p}
  >{children}</button>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)", padding: "16px", cursor: onClick ? "pointer" : "default",
    transition: onClick ? "all 0.15s" : "none", ...style
  }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)")}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)")}
  >{children}</div>
);

const Badge = ({ children, color, bg }) => (
  <span style={{
    background: bg || `${color}18`, color, borderRadius: 8, padding: "3px 8px",
    fontSize: 11, fontWeight: 700, fontFamily: "Cairo, sans-serif"
  }}>{children}</span>
);

const SearchBar = ({ value, onChange, placeholder, ar }) => (
  <div style={{ position: "relative" }}>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", padding: ar ? "12px 44px 12px 16px" : "12px 16px 12px 44px",
        borderRadius: 14, border: `1.5px solid ${C.border}`, background: "#F8FAFC",
        fontFamily: "Cairo, sans-serif", fontSize: 14, color: C.text, outline: "none",
        boxSizing: "border-box", transition: "border-color 0.2s"
      }}
      onFocus={e => e.target.style.borderColor = C.primary}
      onBlur={e => e.target.style.borderColor = C.border}
    />
    <span style={{
      position: "absolute", top: "50%", transform: "translateY(-50%)",
      [ar ? "right" : "left"]: 14, fontSize: 16, color: C.muted
    }}>🔍</span>
  </div>
);

// ─── SCREENS ───

// SPLASH
const Splash = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ minHeight: "100vh", background: grad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
        <div style={{ width: 96, height: 96, background: "rgba(255,255,255,0.15)", borderRadius: 28, backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🏪</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontFamily: "Cairo, sans-serif", fontWeight: 900, fontSize: 36, margin: 0, letterSpacing: -1 }}>نقطة</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Cairo, sans-serif", fontSize: 15, margin: "4px 0 0" }}>نظام نقاط البيع الذكي</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
        ))}
      </motion.div>
      <p style={{ position: "absolute", bottom: 24, color: "rgba(255,255,255,0.4)", fontFamily: "Cairo, sans-serif", fontSize: 12 }}>v2.5.0 © 2024 Nuqta POS</p>
    </div>
  );
};

// ONBOARDING
const slides = [
  { icon: "📈", title: "إدارة المبيعات", en: "Sales Management", desc: "أصدر فواتير إلكترونية في ثوانٍ وتتبع مبيعاتك بدقة عالية", color: C.primary },
  { icon: "📦", title: "إدارة المخزون", en: "Inventory Control", desc: "راقب مخزونك لحظياً وتلقَ تنبيهات فورية عند النفاد", color: C.purple },
  { icon: "📊", title: "تقارير وتحليلات", en: "Reports & Analytics", desc: "رؤى ذكية وقرارات مبنية على بيانات حقيقية", color: C.accent },
];

const Onboarding = ({ lang, setLang, onDone }) => {
  const [slide, setSlide] = useState(0);
  const ar = lang === "ar";
  const s = slides[slide];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 20px 0", alignItems: "center" }}>
        <button onClick={onDone} style={{ color: C.muted, background: "none", border: "none", fontSize: 14, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>{ar ? "تخطي" : "Skip"}</button>
        <button onClick={() => setLang(ar ? "en" : "ar")} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", color: C.text }}>{ar ? "EN" : "ع"}</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 32px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, x: ar ? -40 : 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: ar ? 40 : -40 }} style={{ textAlign: "center", maxWidth: 340 }}>
            <div style={{ width: 140, height: 140, borderRadius: 36, background: `linear-gradient(135deg, ${s.color}22, ${s.color}44)`, border: `2px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, margin: "0 auto 32px" }}>{s.icon}</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: "0 0 12px" }}>{ar ? s.title : s.en}</h2>
            <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 15, margin: 0 }}>{s.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingBottom: 16 }}>
        {slides.map((_, i) => <button key={i} onClick={() => setSlide(i)} style={{ height: 8, borderRadius: 4, background: i === slide ? C.primary : C.border, width: i === slide ? 28 : 8, border: "none", cursor: "pointer", transition: "all 0.3s" }} />)}
      </div>
      <div style={{ padding: "0 20px 40px", display: "flex", gap: 12 }}>
        {slide > 0 && <Btn variant="outline" color={C.primary} onClick={() => setSlide(s => s - 1)} style={{ flex: 1 }}>{ar ? "السابق" : "Back"}</Btn>}
        <Btn onClick={() => slide < 2 ? setSlide(s => s + 1) : onDone()} style={{ flex: 2 }}>
          {slide < 2 ? (ar ? "التالي →" : "Next →") : (ar ? "ابدأ الآن 🚀" : "Get Started 🚀")}
        </Btn>
      </div>
    </div>
  );
};

// LOGIN
const Login = ({ lang, setLang, onLogin, goRegister }) => {
  const ar = lang === "ar";
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  const inp = { width: "100%", padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: "#F8FAFC", fontFamily: "Cairo, sans-serif", fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 200, background: grad, borderRadius: "0 0 48px 48px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 28 }}>
        <div style={{ width: 60, height: 60, background: "rgba(255,255,255,0.2)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 10, border: "1.5px solid rgba(255,255,255,0.3)" }}>🏪</div>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Cairo, sans-serif", fontSize: 14, margin: 0 }}>{ar ? "مرحباً بعودتك 👋" : "Welcome back 👋"}</p>
      </div>
      <div style={{ flex: 1, padding: "24px 20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: 0 }}>{ar ? "تسجيل الدخول" : "Sign In"}</h2>
          <button onClick={() => setLang(ar ? "en" : "ar")} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", color: C.text }}>{ar ? "EN" : "ع"}</button>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{ar ? "البريد الإلكتروني" : "Email"}</label>
          <input type="email" placeholder="store@example.com" style={inp} dir="ltr" onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{ar ? "كلمة المرور" : "Password"}</label>
          <div style={{ position: "relative" }}>
            <input type={showPass ? "text" : "password"} placeholder="••••••••" style={{ ...inp, paddingRight: ar ? 44 : 16, paddingLeft: ar ? 16 : 44 }} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ar ? "right" : "left"]: 14, background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>{showPass ? "🙈" : "👁️"}</button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setRemember(!remember)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13, color: C.text }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, border: `2px solid ${remember ? C.primary : C.border}`, background: remember ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              {remember && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
            </div>
            {ar ? "تذكرني" : "Remember me"}
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13, fontWeight: 700, color: C.primary }}>{ar ? "نسيت كلمة المرور؟" : "Forgot password?"}</button>
        </div>
        <Btn onClick={handleLogin} style={{ width: "100%", padding: "14px", fontSize: 16, marginTop: 4 }}>
          {loading ? (ar ? "جاري الدخول..." : "Signing in...") : (ar ? "دخول 🚀" : "Sign In 🚀")}
        </Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ color: C.muted, fontSize: 13 }}>{ar ? "أو" : "or"}</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>
        <Btn variant="outline" onClick={goRegister} style={{ width: "100%", padding: "14px", fontSize: 14 }}>
          {ar ? "إنشاء حساب جديد" : "Create New Account"}
        </Btn>
      </div>
    </div>
  );
};

// REGISTER
const Register = ({ lang, onDone, goLogin }) => {
  const ar = lang === "ar";
  const [plan, setPlan] = useState("pro");
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: "#F8FAFC", fontFamily: "Cairo, sans-serif", fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr" }}>
      <div style={{ background: grad, padding: "24px 20px 20px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={goLogin} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 14, cursor: "pointer", fontSize: 18 }}>←</button>
          <div>
            <h2 style={{ color: "#fff", fontFamily: "Cairo, sans-serif", fontWeight: 900, fontSize: 20, margin: 0 }}>{ar ? "إنشاء متجر جديد" : "Create New Store"}</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Cairo, sans-serif", fontSize: 13, margin: "2px 0 0" }}>{ar ? "ابدأ تجربتك المجانية اليوم" : "Start your free trial today"}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 20px 60px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ l: ar ? "اسم المتجر *" : "Store Name *", p: ar ? "متجر الأمل" : "My Store" }, { l: ar ? "نوع النشاط" : "Business Type", p: ar ? "سوبرماركت" : "Supermarket" }].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{f.l}</label>
              <input placeholder={f.p} style={inp} />
            </div>
          ))}
        </div>
        {[{ l: ar ? "اسم المالك *" : "Owner Name *", p: ar ? "أحمد محمد" : "Ahmed Mohamed" }, { l: ar ? "رقم الهاتف *" : "Phone *", p: "+966 5X XXX XXXX" }, { l: ar ? "البريد الإلكتروني *" : "Email *", p: "store@example.com" }, { l: ar ? "كلمة المرور *" : "Password *", p: "••••••••" }].map((f, i) => (
          <div key={i}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{f.l}</label>
            <input placeholder={f.p} type={f.p === "••••••••" ? "password" : "text"} style={inp} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 8 }}>{ar ? "اختر الخطة" : "Choose Plan"}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ k: "free", n: ar ? "مجاني" : "Free", p: "0", d: ar ? "حتى 100 منتج" : "Up to 100 products" }, { k: "pro", n: ar ? "احترافي" : "Pro", p: "149", d: ar ? "غير محدود ✨" : "Unlimited ✨", badge: ar ? "الأفضل" : "Best" }].map(pl => (
              <button key={pl.k} onClick={() => setPlan(pl.k)} style={{ padding: 14, borderRadius: 16, border: `2px solid ${plan === pl.k ? C.primary : C.border}`, background: plan === pl.k ? `${C.primary}08` : C.surface, cursor: "pointer", textAlign: "right" }}>
                {pl.badge && <div style={{ background: C.accent, color: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 900, fontFamily: "Cairo, sans-serif", display: "inline-block", marginBottom: 6 }}>{pl.badge}</div>}
                <p style={{ fontWeight: 900, fontSize: 15, color: C.text, margin: 0, fontFamily: "Cairo, sans-serif" }}>{pl.n}</p>
                <p style={{ color: C.muted, fontSize: 12, margin: "2px 0 6px", fontFamily: "Cairo, sans-serif" }}>{pl.d}</p>
                <p style={{ fontWeight: 900, color: C.primary, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{pl.p === "0" ? (ar ? "مجاني" : "Free") : `${pl.p} ${ar ? "ر.س" : "SAR"}`}</p>
              </button>
            ))}
          </div>
        </div>
        <Btn onClick={onDone} style={{ width: "100%", padding: "14px", fontSize: 16, marginTop: 4 }}>
          🏪 {ar ? "إنشاء المتجر الآن" : "Create My Store"}
        </Btn>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>
          {ar ? "لديك حساب؟ " : "Have an account? "}
          <button onClick={goLogin} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Cairo, sans-serif", color: C.primary, fontWeight: 700 }}>{ar ? "تسجيل الدخول" : "Sign In"}</button>
        </p>
      </div>
    </div>
  );
};

// MOBILE NAV
const NAV_ITEMS = [
  { k: "dashboard", ar: "الرئيسية", en: "Home", icon: "🏠" },
  { k: "cashier", ar: "الكاشير", en: "Cashier", icon: "🛒" },
  { k: "products", ar: "المنتجات", en: "Products", icon: "📦" },
  { k: "reports", ar: "التقارير", en: "Reports", icon: "📊" },
  { k: "settings", ar: "الإعدادات", en: "Settings", icon: "⚙️" },
];

const MobileNav = ({ screen, setScreen, lang }) => {
  const ar = lang === "ar";
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, padding: "8px 0 12px", zIndex: 50, display: "flex" }}>
      {NAV_ITEMS.map(n => {
        const active = screen === n.k;
        return (
          <button key={n.k} onClick={() => setScreen(n.k)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: active ? `${C.primary}15` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all 0.2s" }}>
              <span style={{ filter: active ? "none" : "grayscale(0.3)", opacity: active ? 1 : 0.5 }}>{n.icon}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "Cairo, sans-serif", color: active ? C.primary : C.muted }}>{ar ? n.ar : n.en}</span>
          </button>
        );
      })}
    </div>
  );
};

// DASHBOARD
const Dashboard = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const lowStock = PRODUCTS.filter(p => p.stock <= p.min);

  const kpis = [
    { label: ar ? "مبيعات اليوم" : "Today's Sales", val: "ر.س 4,230", sub: "+18.3%", icon: "💰", color: C.primary, up: true },
    { label: ar ? "عدد الطلبات" : "Orders", val: "58", sub: "+12%", icon: "🛒", color: C.purple, up: true },
    { label: ar ? "مخزون منخفض" : "Low Stock", val: String(lowStock.length), sub: ar ? "يحتاج تعبئة" : "need restock", icon: "⚠️", color: C.danger, up: false },
    { label: ar ? "عملاء نشطون" : "Customers", val: "234", sub: "+5%", icon: "👥", color: C.success, up: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: grad, padding: "24px 20px 28px", borderRadius: "0 0 36px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>الاثنين، 15 يناير 2024</p>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: 0, fontFamily: "Cairo, sans-serif" }}>مرحباً، أحمد 👋</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>متجر الأمل</p>
          </div>
          <button onClick={() => setScreen("notifications")} style={{ position: "relative", width: 42, height: 42, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 14, cursor: "pointer", fontSize: 18 }}>
            🔔
            <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: C.danger, borderRadius: "50%", color: "#fff", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif" }}>3</span>
          </button>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 18, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{ar ? "إجمالي إيرادات اليوم" : "Today's Revenue"}</p>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 32, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>ر.س 4,230</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#86efac", fontSize: 13, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>▲ 18.3%</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{ar ? "من أمس" : "vs yesterday"}</span>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "الأرباح" : "Profit"}</p>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>ر.س 1,680</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {kpis.map((k, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${k.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{k.icon}</div>
                  <Badge color={k.up ? C.success : C.danger}>{k.sub}</Badge>
                </div>
                <p style={{ fontWeight: 900, fontSize: 22, color: k.color, margin: "10px 0 2px", fontFamily: "Cairo, sans-serif" }}>{k.val}</p>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{k.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontWeight: 900, fontSize: 15, color: C.text, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "مبيعات الأسبوع" : "Weekly Sales"}</h3>
            <Badge color={C.primary}>{ar ? "هذا الأسبوع" : "This week"}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={DAILY} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primary} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={ar ? "d" : "e"} tick={{ fontSize: 10, fontFamily: "Cairo", fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "Cairo", fontSize: 12 }} formatter={v => [`ر.س ${v.toLocaleString()}`, ar ? "المبيعات" : "Sales"]} />
              <Area type="monotone" dataKey="v" stroke={C.primary} strokeWidth={2.5} fill="url(#sg)" dot={false} activeDot={{ r: 5, fill: C.primary }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Actions */}
        <h3 style={{ fontWeight: 900, fontSize: 15, color: C.text, margin: "0 0 10px", fontFamily: "Cairo, sans-serif" }}>⚡ {ar ? "إجراءات سريعة" : "Quick Actions"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: ar ? "بيع جديد" : "New Sale", screen: "cashier", icon: "🛒", color: C.primary },
            { label: ar ? "إضافة منتج" : "Add Product", screen: "add-product", icon: "➕", color: C.purple },
            { label: ar ? "الفواتير" : "Invoices", screen: "invoice-history", icon: "🧾", color: C.accent },
            { label: ar ? "التقارير" : "Reports", screen: "reports", icon: "📊", color: C.success },
          ].map(a => (
            <button key={a.screen} onClick={() => setScreen(a.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.15s" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${a.color}cc, ${a.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.icon}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.text, fontFamily: "Cairo, sans-serif", textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Low Stock */}
        {lowStock.length > 0 && (
          <div style={{ background: "#FEF2F2", borderRadius: 16, padding: 14, marginBottom: 16, border: "1px solid #FECACA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span style={{ fontWeight: 900, color: "#991B1B", fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{ar ? "تنبيه مخزون منخفض" : "Low Stock Alert"}</span>
              </div>
              <button onClick={() => setScreen("inventory")} style={{ background: "none", border: "none", cursor: "pointer", color: C.danger, fontWeight: 700, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{ar ? "عرض الكل" : "View All"}</button>
            </div>
            {lowStock.slice(0, 3).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: "1px solid #FEE2E2" }}>
                <span style={{ fontSize: 13, color: "#7F1D1D", fontFamily: "Cairo, sans-serif" }}>{ar ? p.name : p.en}</span>
                <Badge color={C.danger} bg="#FEE2E2">{ar ? `${p.stock} متبقي` : `${p.stock} left`}</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Recent Invoices */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontWeight: 900, fontSize: 15, color: C.text, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "آخر الفواتير" : "Recent Invoices"}</h3>
          <button onClick={() => setScreen("invoice-history")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontWeight: 700, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{ar ? "عرض الكل ←" : "View All →"}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {INVOICES.slice(0, 4).map(inv => (
            <Card key={inv.id} onClick={() => setScreen("invoice")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧾</div>
                <div>
                  <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? inv.customer : inv.en}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{inv.id} · {inv.items} {ar ? "منتجات" : "items"}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 900, color: C.text, fontSize: 14, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>ر.س {inv.total}</p>
                <Badge color={inv.status === "paid" ? C.success : C.danger}>{inv.status === "paid" ? (ar ? "مدفوع" : "Paid") : (ar ? "مسترد" : "Refunded")}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// CASHIER
const Cashier = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState([]);

  const filtered = PRODUCTS.filter(p => {
    const matchS = (ar ? p.name : p.en).toLowerCase().includes(search.toLowerCase());
    const matchC = activeCat === "all" || p.cat === activeCat;
    return matchS && matchC;
  });

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: grad, padding: "20px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "🛒 الكاشير" : "🛒 Cashier"}</h1>
          <button onClick={() => setScreen("cart")} style={{ position: "relative", width: 42, height: 42, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 14, cursor: "pointer", fontSize: 18 }}>
            🛍️
            {count > 0 && <span style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, background: C.danger, borderRadius: "50%", color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif" }}>{count}</span>}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ar ? "ابحث أو أدخل الباركود..." : "Search or scan barcode..."}
              style={{ width: "100%", padding: ar ? "11px 40px 11px 14px" : "11px 14px 11px 40px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
            <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ar ? "right" : "left"]: 12, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>🔍</span>
          </div>
          <button style={{ width: 42, height: 42, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>📷</button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", overflowX: "auto", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 10, border: "none", background: activeCat === cat.id ? C.primary : "#F1F5F9", color: activeCat === cat.id ? "#fff" : C.muted, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700, transition: "all 0.2s" }}>
            {cat.icon} {ar ? cat.name : cat.en}
          </button>
        ))}
      </div>

      {/* Products */}
      <div style={{ flex: 1, padding: "10px 12px", overflowY: "auto", paddingBottom: cart.length > 0 ? 100 : 90 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {filtered.map(p => {
            const inCart = cart.find(i => i.id === p.id);
            const color = getCatColor(p.cat);
            return (
              <button key={p.id} onClick={() => addToCart(p)} style={{ position: "relative", background: C.surface, borderRadius: 14, padding: 10, border: `${inCart ? 2 : 1}px solid ${inCart ? C.primary : C.border}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                {inCart && <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: C.primary, borderRadius: "50%", color: "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif" }}>{inCart.qty}</span>}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 6px" }}>{getCatIcon(p.cat)}</div>
                <p style={{ fontWeight: 700, color: C.text, fontSize: 10, margin: "0 0 4px", fontFamily: "Cairo, sans-serif", lineHeight: 1.3 }}>{ar ? p.name : p.en}</p>
                <p style={{ fontWeight: 900, color: C.primary, fontSize: 12, margin: 0, fontFamily: "Cairo, sans-serif" }}>ر.س {p.price}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Checkout bar */}
      {cart.length > 0 && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} style={{ position: "fixed", bottom: 70, left: 0, right: 0, padding: "12px 16px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => setScreen("cart")} style={{ width: "100%", padding: "14px 20px", borderRadius: 16, background: grad, border: "none", color: "#fff", fontFamily: "Cairo, sans-serif", fontWeight: 900, fontSize: 15, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ background: "rgba(255,255,255,0.25)", padding: "4px 10px", borderRadius: 8, fontSize: 13 }}>{count} {ar ? "منتج" : "items"}</span>
            <span>{ar ? "متابعة الدفع" : "Checkout"}</span>
            <span>ر.س {total.toFixed(2)}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

// CART
const CartScreen = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [items, setItems] = useState([
    { id: "1", name: "قهوة عربية", en: "Arabic Coffee", price: 15, qty: 2, cat: "bev" },
    { id: "2", name: "خبز عيش", en: "Bread Loaf", price: 5, qty: 3, cat: "bak" },
    { id: "4", name: "طماطم", en: "Tomatoes", price: 8, qty: 1, cat: "veg" },
  ]);
  const [discount, setDiscount] = useState(10);

  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const disc = (sub * discount) / 100;
  const tax = (sub - disc) * 0.15;
  const total = sub - disc + tax;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", display: "flex", flexDirection: "column" }}>
      <div style={{ background: grad, padding: "20px 16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("cashier")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "سلة المشتريات" : "Shopping Cart"}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{items.length} {ar ? "منتجات" : "products"}</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", paddingBottom: 120 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {items.map(item => (
            <Card key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${getCatColor(item.cat)}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{getCatIcon(item.cat)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? item.name : item.en}</p>
                <p style={{ fontWeight: 900, color: C.primary, fontSize: 13, margin: 0, fontFamily: "Cairo, sans-serif" }}>ر.س {item.price}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setItems(p => p.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                  style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: "#F8FAFC", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontWeight: 900, color: C.text, width: 22, textAlign: "center", fontFamily: "Cairo, sans-serif", fontSize: 14 }}>{item.qty}</span>
                <button onClick={() => setItems(p => p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                  style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: C.primary, cursor: "pointer", fontSize: 14, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))}
                style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: `${C.danger}15`, cursor: "pointer", fontSize: 14, color: C.danger, display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</button>
            </Card>
          ))}
        </div>

        {/* Discount */}
        <Card style={{ marginBottom: 10 }}>
          <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 10px", fontFamily: "Cairo, sans-serif" }}>🏷️ {ar ? "الخصم" : "Discount"}</p>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 5, 10, 15, 20].map(d => (
              <button key={d} onClick={() => setDiscount(d)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", background: discount === d ? C.accent : "#F1F5F9", color: discount === d ? "#fff" : C.muted, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 12 }}>{d}%</button>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <Card>
          <h3 style={{ fontWeight: 900, color: C.text, margin: "0 0 12px", fontFamily: "Cairo, sans-serif", fontSize: 14 }}>{ar ? "ملخص الطلب" : "Order Summary"}</h3>
          {[
            { label: ar ? "المجموع الفرعي" : "Subtotal", val: sub.toFixed(2), color: C.text },
            { label: ar ? `خصم (${discount}%)` : `Discount (${discount}%)`, val: `-${disc.toFixed(2)}`, color: C.success },
            { label: ar ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)", val: tax.toFixed(2), color: C.muted },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.muted, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{r.label}</span>
              <span style={{ fontWeight: 700, color: r.color, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>ر.س {r.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 0", borderTop: `2px solid ${C.border}`, marginTop: 4 }}>
            <span style={{ fontWeight: 900, color: C.text, fontSize: 16, fontFamily: "Cairo, sans-serif" }}>{ar ? "الإجمالي" : "Total"}</span>
            <span style={{ fontWeight: 900, color: C.primary, fontSize: 22, fontFamily: "Cairo, sans-serif" }}>ر.س {total.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px 24px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
        <Btn onClick={() => setScreen("payment")} style={{ width: "100%", padding: "14px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          💳 {ar ? "متابعة للدفع" : "Proceed to Payment"} · ر.س {total.toFixed(2)}
        </Btn>
      </div>
    </div>
  );
};

// PAYMENT
const Payment = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [method, setMethod] = useState("cash");
  const [cash, setCash] = useState("");
  const total = 136.25;
  const change = parseFloat(cash || 0) - total;

  const methods = [
    { k: "cash", icon: "💵", label: ar ? "نقداً" : "Cash", color: C.success },
    { k: "card", icon: "💳", label: ar ? "بطاقة" : "Card", color: "#3B82F6" },
    { k: "wallet", icon: "📱", label: ar ? "محفظة" : "Wallet", color: C.purple },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr" }}>
      <div style={{ background: grad, padding: "20px 16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("cart")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "الدفع" : "Payment"}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{ar ? "اختر طريقة الدفع" : "Choose payment method"}</p>
        </div>
      </div>

      <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ textAlign: "center", padding: 20 }}>
          <p style={{ color: C.muted, fontSize: 13, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{ar ? "المبلغ المستحق" : "Amount Due"}</p>
          <p style={{ fontWeight: 900, color: C.primary, fontSize: 40, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>ر.س {total.toFixed(2)}</p>
          <p style={{ color: C.muted, fontSize: 12, margin: 0, fontFamily: "Cairo, sans-serif" }}>3 {ar ? "منتجات · INV-2024-007" : "products · INV-2024-007"}</p>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {methods.map(m => (
            <button key={m.k} onClick={() => setMethod(m.k)} style={{ padding: "14px 8px", borderRadius: 16, border: `2px solid ${method === m.k ? m.color : C.border}`, background: method === m.k ? `${m.color}10` : C.surface, cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
              <span style={{ fontWeight: 700, color: method === m.k ? m.color : C.muted, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{m.label}</span>
              {method === m.k && <div style={{ width: 18, height: 18, borderRadius: "50%", background: m.color, color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "6px auto 0", fontWeight: 900 }}>✓</div>}
            </button>
          ))}
        </div>

        {method === "cash" && (
          <Card>
            <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 10px", fontFamily: "Cairo, sans-serif" }}>{ar ? "المبلغ المدفوع" : "Cash Given"}</p>
            <input type="number" value={cash} onChange={e => setCash(e.target.value)} placeholder="0.00"
              style={{ width: "100%", padding: "12px", borderRadius: 12, border: `2px solid ${C.success}`, background: `${C.success}05`, fontFamily: "Cairo, sans-serif", fontSize: 22, fontWeight: 900, textAlign: "center", outline: "none", color: C.text, boxSizing: "border-box" }} dir="ltr" />
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {[50, 100, 150, 200].map(a => (
                <button key={a} onClick={() => setCash(String(a))} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", background: `${C.primary}12`, color: C.primary, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13 }}>{a}</button>
              ))}
            </div>
            {parseFloat(cash) >= total && (
              <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12, background: `${C.success}12`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: C.success, fontFamily: "Cairo, sans-serif", fontSize: 13 }}>{ar ? "المبلغ المرتجع" : "Change"}</span>
                <span style={{ fontWeight: 900, color: C.success, fontSize: 20, fontFamily: "Cairo, sans-serif" }}>ر.س {change.toFixed(2)}</span>
              </div>
            )}
          </Card>
        )}

        {method === "card" && (
          <Card style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>💳</div>
            <p style={{ fontWeight: 700, color: C.text, fontFamily: "Cairo, sans-serif" }}>{ar ? "قرّب البطاقة أو أدخلها" : "Tap or insert card"}</p>
            <p style={{ color: C.muted, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{ar ? "يدعم Visa, Mastercard, Mada" : "Supports Visa, Mastercard, Mada"}</p>
          </Card>
        )}

        {method === "wallet" && (
          <Card style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>📱</div>
            <p style={{ fontWeight: 700, color: C.text, fontFamily: "Cairo, sans-serif" }}>{ar ? "امسح الرمز بالمحفظة الرقمية" : "Scan QR with digital wallet"}</p>
            <div style={{ width: 100, height: 100, background: "#F1F5F9", borderRadius: 14, margin: "12px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>◼</div>
          </Card>
        )}

        <Btn color={C.success} onClick={() => setScreen("invoice")} style={{ width: "100%", padding: "14px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          ✓ {ar ? "تأكيد الدفع" : "Confirm Payment"}
        </Btn>
      </div>
    </div>
  );
};

// INVOICE
const InvoiceScreen = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const items = [
    { name: "قهوة عربية", en: "Arabic Coffee", qty: 2, price: 15, total: 30 },
    { name: "خبز عيش", en: "Bread Loaf", qty: 3, price: 5, total: 15 },
    { name: "طماطم", en: "Tomatoes", qty: 1, price: 8, total: 8 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr" }}>
      <div style={{ background: grad, padding: "20px 16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("dashboard")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "الفاتورة" : "Invoice"}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>INV-2024-007</p>
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
          <Card style={{ textAlign: "center", padding: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${C.success}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 10px" }}>✅</div>
            <p style={{ fontWeight: 900, color: C.text, fontSize: 16, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{ar ? "تم الدفع بنجاح!" : "Payment Successful!"}</p>
            <p style={{ color: C.muted, fontSize: 12, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "الاثنين، 15 يناير 2024 · 10:34 ص" : "Monday, Jan 15 2024 · 10:34 AM"}</p>
          </Card>
        </motion.div>

        <Card style={{ overflow: "hidden", padding: 0 }}>
          <div style={{ padding: 16, textAlign: "center", background: `${C.primary}08`, borderBottom: `1px dashed ${C.border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 8px" }}>🏪</div>
            <p style={{ fontWeight: 900, color: C.text, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "متجر الأمل" : "Al-Amal Store"}</p>
            <p style={{ color: C.muted, fontSize: 12, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</p>
            <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>VAT: 310000000000003</p>
          </div>

          <div style={{ padding: 14, borderBottom: `1px dashed ${C.border}` }}>
            {[{ l: ar ? "رقم الفاتورة" : "Invoice No.", v: "INV-2024-007" }, { l: ar ? "الكاشير" : "Cashier", v: ar ? "محمد علي" : "Mohamed Ali" }].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: C.muted, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{r.l}</span>
                <span style={{ fontWeight: 700, color: C.text, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: 14, borderBottom: `1px dashed ${C.border}` }}>
            <p style={{ fontWeight: 700, color: C.muted, fontSize: 12, margin: "0 0 8px", fontFamily: "Cairo, sans-serif" }}>{ar ? "المنتجات" : "Items"}</p>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <p style={{ fontWeight: 600, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? item.name : item.en}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{item.qty} × ر.س {item.price}</p>
                </div>
                <span style={{ fontWeight: 700, color: C.text, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>ر.س {item.total}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: 14, borderBottom: `1px dashed ${C.border}` }}>
            {[{ l: ar ? "المجموع" : "Subtotal", v: "53.00" }, { l: ar ? "خصم (10%)" : "Discount (10%)", v: "-5.30" }, { l: ar ? "ضريبة (15%)" : "VAT (15%)", v: "7.16" }].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: C.muted, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{r.l}</span>
                <span style={{ color: C.text, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>ر.س {r.v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
              <span style={{ fontWeight: 900, color: C.text, fontFamily: "Cairo, sans-serif" }}>{ar ? "الإجمالي" : "Total"}</span>
              <span style={{ fontWeight: 900, color: C.primary, fontSize: 18, fontFamily: "Cairo, sans-serif" }}>ر.س 54.86</span>
            </div>
          </div>

          <div style={{ padding: 14, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "#F1F5F9", borderRadius: 12, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>◼</div>
            <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "امسح لعرض الفاتورة الإلكترونية" : "Scan to view e-invoice"}</p>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8 }}>
          {[{ icon: "📤", label: ar ? "مشاركة" : "Share" }, { icon: "🖨️", label: ar ? "طباعة" : "Print" }].map((a, i) => (
            <button key={i} style={{ flex: 1, padding: 12, borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.surface, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{a.icon} {a.label}</button>
          ))}
          <Btn onClick={() => setScreen("cashier")} style={{ flex: 1, padding: 12, fontSize: 13 }}>
            + {ar ? "جديد" : "New"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// INVOICE HISTORY
const InvoiceHistory = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      <div style={{ background: grad, padding: "20px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button onClick={() => setScreen("dashboard")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>←</button>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "سجل الفواتير" : "Invoice History"}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{INVOICES.length} {ar ? "فاتورة" : "invoices"}</p>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ar ? "ابحث في الفواتير..." : "Search invoices..."}
            style={{ width: "100%", padding: ar ? "11px 40px 11px 14px" : "11px 14px 11px 40px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ar ? "right" : "left"]: 12, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>🔍</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 14px", overflowX: "auto" }}>
        {[["today", ar ? "اليوم" : "Today"], ["week", ar ? "أسبوع" : "Week"], ["month", ar ? "شهر" : "Month"], ["all", ar ? "الكل" : "All"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 10, border: `1px solid ${filter === k ? C.primary : C.border}`, background: filter === k ? C.primary : C.surface, color: filter === k ? "#fff" : C.muted, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700 }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "0 14px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
        {[{ l: ar ? "الإجمالي" : "Total", v: "ر.س 4,230", color: C.primary }, { l: ar ? "الفواتير" : "Invoices", v: "58", color: C.purple }, { l: ar ? "مسترجع" : "Refunded", v: "ر.س 320", color: C.danger }].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "10px 8px" }}>
            <p style={{ fontWeight: 900, color: s.color, fontSize: 14, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{s.v}</p>
            <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{s.l}</p>
          </Card>
        ))}
      </div>

      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {INVOICES.filter(inv => (ar ? inv.customer : inv.en).toLowerCase().includes(search.toLowerCase())).map(inv => (
          <Card key={inv.id} onClick={() => setScreen("invoice")} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: inv.status === "paid" ? `${C.success}15` : `${C.danger}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {inv.status === "paid" ? "✅" : "↩️"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{inv.id}</p>
              <p style={{ color: C.muted, fontSize: 11, margin: "0 0 1px", fontFamily: "Cairo, sans-serif" }}>{ar ? inv.customer : inv.en} · {inv.items} {ar ? "منتجات" : "items"}</p>
              <p style={{ color: "#CBD5E1", fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{inv.date}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontWeight: 900, color: C.text, fontSize: 14, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>ر.س {inv.total}</p>
              <Badge color={inv.status === "paid" ? C.success : C.danger}>{inv.status === "paid" ? (ar ? "مدفوع" : "Paid") : (ar ? "مسترد" : "Refunded")}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// PRODUCTS
const Products = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [viewGrid, setViewGrid] = useState(true);

  const filtered = PRODUCTS.filter(p => {
    const matchS = (ar ? p.name : p.en).toLowerCase().includes(search.toLowerCase());
    const matchC = activeCat === "all" || p.cat === activeCat;
    return matchS && matchC;
  });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      <div style={{ background: grad, padding: "20px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "المنتجات" : "Products"}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{filtered.length} {ar ? "منتج" : "products"}</p>
          </div>
          <button onClick={() => setViewGrid(!viewGrid)} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16 }}>{viewGrid ? "☰" : "⊞"}</button>
        </div>
        <div style={{ position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ar ? "ابحث عن منتج..." : "Search product..."}
            style={{ width: "100%", padding: ar ? "11px 40px 11px 14px" : "11px 14px 11px 40px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ar ? "right" : "left"]: 12, color: "rgba(255,255,255,0.6)" }}>🔍</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 12px", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 10, border: `1px solid ${activeCat === cat.id ? C.primary : C.border}`, background: activeCat === cat.id ? C.primary : C.surface, color: activeCat === cat.id ? "#fff" : C.muted, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700 }}>
            {cat.icon} {ar ? cat.name : cat.en}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 12px" }}>
        {viewGrid ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {filtered.map(p => {
              const s = getStockStatus(p.stock, p.min);
              return (
                <Card key={p.id} style={{ padding: 12 }}>
                  <div style={{ height: 80, borderRadius: 12, background: `${getCatColor(p.cat)}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 10 }}>{getCatIcon(p.cat)}</div>
                  <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? p.name : p.en}</p>
                  <p style={{ color: C.muted, fontSize: 11, margin: "0 0 8px", fontFamily: "Cairo, sans-serif" }}>{p.sku}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 900, color: C.primary, fontSize: 15, fontFamily: "Cairo, sans-serif" }}>ر.س {p.price}</span>
                    <Badge color={s.color}>{ar ? s.label : s.en}</Badge>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: C.muted, fontSize: 11, fontFamily: "Cairo, sans-serif" }}>{ar ? `${p.stock} وحدة` : `${p.stock} units`}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: `${C.primary}15`, cursor: "pointer", fontSize: 12 }}>✏️</button>
                      <button style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: `${C.danger}15`, cursor: "pointer", fontSize: 12 }}>🗑</button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(p => {
              const s = getStockStatus(p.stock, p.min);
              return (
                <Card key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${getCatColor(p.cat)}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{getCatIcon(p.cat)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? p.name : p.en}</p>
                    <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{p.sku} · {ar ? `${p.stock} وحدة` : `${p.stock} units`}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 900, color: C.primary, fontSize: 14, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>ر.س {p.price}</p>
                    <Badge color={s.color}>{ar ? s.label : s.en}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <button onClick={() => setScreen("add-product")} style={{ position: "fixed", bottom: 82, [ar ? "left" : "right"]: 18, width: 52, height: 52, borderRadius: 16, background: grad, border: "none", cursor: "pointer", fontSize: 22, color: "#fff", boxShadow: `0 6px 20px ${C.primary}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
    </div>
  );
};

// ADD PRODUCT
const AddProduct = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [selCat, setSelCat] = useState("bev");
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: "#F8FAFC", fontFamily: "Cairo, sans-serif", fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr" }}>
      <div style={{ background: grad, padding: "20px 16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("products")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>←</button>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "إضافة منتج" : "Add Product"}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{ar ? "أدخل بيانات المنتج الجديد" : "Enter new product details"}</p>
        </div>
      </div>

      <div style={{ padding: "16px 16px 80px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 110, height: 110, borderRadius: 28, border: `2.5px dashed ${C.primary}`, background: `${C.primary}08`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 28 }}>📸</span>
            <span style={{ color: C.primary, fontSize: 11, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>{ar ? "صورة المنتج" : "Product Image"}</span>
          </div>
        </div>

        {[{ l: ar ? "اسم المنتج *" : "Product Name *", p: ar ? "أدخل اسم المنتج" : "Enter product name" }].map((f, i) => (
          <div key={i}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{f.l}</label>
            <input placeholder={f.p} style={inp} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
          </div>
        ))}

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 8 }}>{ar ? "الفئة *" : "Category *"}</label>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {CATEGORIES.filter(c => c.id !== "all").map(cat => (
              <button key={cat.id} onClick={() => setSelCat(cat.id)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${selCat === cat.id ? cat.color : "transparent"}`, background: selCat === cat.id ? cat.color : `${cat.color}15`, color: selCat === cat.id ? "#fff" : cat.color, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700 }}>
                {cat.icon} {ar ? cat.name : cat.en}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ l: ar ? "الباركود" : "Barcode", p: "6901234567890" }, { l: "SKU", p: "BEV-001" }].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{f.l}</label>
              <input placeholder={f.p} style={inp} dir="ltr" onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ l: ar ? "سعر الشراء (ر.س)" : "Buy Price (SAR)", p: "0.00" }, { l: ar ? "سعر البيع (ر.س)" : "Sell Price (SAR)", p: "0.00" }].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{f.l}</label>
              <input type="number" placeholder={f.p} style={inp} dir="ltr" onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ l: ar ? "الكمية الابتدائية" : "Initial Stock", p: "0" }, { l: ar ? "حد التنبيه" : "Alert Threshold", p: "10" }].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{f.l}</label>
              <input type="number" placeholder={f.p} style={inp} dir="ltr" onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
        </div>

        <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏷️</div>
            <div>
              <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "خاضع للضريبة" : "Tax Applicable"}</p>
              <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "ضريبة القيمة المضافة 15%" : "VAT 15%"}</p>
            </div>
          </div>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: C.primary, position: "relative", cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
          </div>
        </Card>

        <Btn onClick={() => setScreen("products")} style={{ width: "100%", padding: "14px", fontSize: 15 }}>
          📦 {ar ? "حفظ المنتج" : "Save Product"}
        </Btn>
      </div>
    </div>
  );
};

// REPORTS
const Reports = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [period, setPeriod] = useState("week");
  const PIE = [
    { name: "مشروبات", v: 35, color: C.primary },
    { name: "مخبوزات", v: 25, color: C.accent },
    { name: "ألبان", v: 20, color: "#3B82F6" },
    { name: "خضروات", v: 12, color: C.success },
    { name: "أخرى", v: 8, color: C.purple },
  ];

  const kpis = [
    { label: ar ? "إجمالي المبيعات" : "Total Sales", val: "ر.س 83,420", change: "+12.4%", up: true },
    { label: ar ? "صافي الربح" : "Net Profit", val: "ر.س 31,200", change: "+8.7%", up: true },
    { label: ar ? "متوسط الفاتورة" : "Avg. Invoice", val: "ر.س 72.5", change: "-2.1%", up: false },
    { label: ar ? "معدل الإرجاع" : "Return Rate", val: "1.8%", change: "-0.3%", up: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      <div style={{ background: grad, padding: "20px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "التقارير" : "Reports"}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{ar ? "يناير 2024" : "January 2024"}</p>
          </div>
          <button style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16 }}>⬇️</button>
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 4 }}>
          {[["day", ar ? "يوم" : "Day"], ["week", ar ? "أسبوع" : "Week"], ["month", ar ? "شهر" : "Month"]].map(([k, l]) => (
            <button key={k} onClick={() => setPeriod(k)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: period === k ? "#fff" : "transparent", color: period === k ? C.primary : "rgba(255,255,255,0.7)", fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13, transition: "all 0.2s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {kpis.map((k, i) => (
            <Card key={i}>
              <p style={{ color: C.muted, fontSize: 11, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{k.label}</p>
              <p style={{ fontWeight: 900, color: C.text, fontSize: 15, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{k.val}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12 }}>{k.up ? "▲" : "▼"}</span>
                <span style={{ fontWeight: 700, color: k.up ? C.success : C.danger, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{k.change}</span>
              </div>
              <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: C.primary, width: "65%" }} />
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontWeight: 900, fontSize: 14, color: C.text, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "الإيرادات والأرباح" : "Revenue & Profit"}</h3>
            <Badge color={C.muted}>{ar ? "آخر 12 شهر" : "Last 12 months"}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={MONTHLY} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.primary} stopOpacity={0.25} /><stop offset="95%" stopColor={C.primary} stopOpacity={0} /></linearGradient>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.success} stopOpacity={0.25} /><stop offset="95%" stopColor={C.success} stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey={ar ? "m" : "me"} tick={{ fontSize: 9, fontFamily: "Cairo", fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontFamily: "Cairo", fontSize: 11 }} />
              <Area type="monotone" dataKey="r" stroke={C.primary} strokeWidth={2} fill="url(#rg)" dot={false} name={ar ? "الإيرادات" : "Revenue"} />
              <Area type="monotone" dataKey="p" stroke={C.success} strokeWidth={2} fill="url(#pg)" dot={false} name={ar ? "الأرباح" : "Profit"} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ fontWeight: 900, fontSize: 14, color: C.text, margin: "0 0 12px", fontFamily: "Cairo, sans-serif" }}>{ar ? "مبيعات الأسبوع" : "Weekly Sales"}</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={DAILY} margin={{ top: 5, right: 5, bottom: 0, left: -25 }} barSize={18}>
              <XAxis dataKey={ar ? "d" : "e"} tick={{ fontSize: 9, fontFamily: "Cairo", fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontFamily: "Cairo", fontSize: 11 }} />
              <Bar dataKey="v" fill={C.primary} radius={[5, 5, 0, 0]} name={ar ? "المبيعات" : "Sales"} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ fontWeight: 900, fontSize: 14, color: C.text, margin: "0 0 12px", fontFamily: "Cairo, sans-serif" }}>{ar ? "توزيع الفئات" : "Category Distribution"}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="v">
                  {PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
              {PIE.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: C.text, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{d.name}</span>
                  <span style={{ color: C.muted, fontSize: 12, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>{d.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// SETTINGS
const Settings = ({ lang, setLang, setScreen, onLogout }) => {
  const ar = lang === "ar";
  const [dark, setDark] = useState(false);

  const sections = [
    {
      title: ar ? "المتجر" : "Store", items: [
        { icon: "🏪", label: ar ? "ملف المتجر" : "Store Profile", color: C.primary },
        { icon: "🧾", label: ar ? "إعدادات الضريبة" : "Tax Settings", color: C.accent },
        { icon: "🖨️", label: ar ? "الكاشير والطابعة" : "Cashier & Printer", color: "#3B82F6" },
      ]
    },
    {
      title: ar ? "التفضيلات" : "Preferences", items: [
        { icon: "🌐", label: ar ? "اللغة: العربية" : "Language: Arabic", color: C.success, action: () => setLang(ar ? "en" : "ar") },
        { icon: dark ? "☀️" : "🌙", label: dark ? (ar ? "الوضع الفاتح" : "Light Mode") : (ar ? "الوضع الداكن" : "Dark Mode"), color: C.purple, action: () => setDark(!dark) },
      ]
    },
    {
      title: ar ? "الحساب" : "Account", items: [
        { icon: "👑", label: ar ? "إدارة الاشتراك" : "Subscription", color: C.accent, action: () => setScreen("subscription") },
        { icon: "👥", label: ar ? "إدارة المستخدمين" : "User Management", color: C.primary, action: () => setScreen("user-management") },
        { icon: "🔒", label: ar ? "الأمان وكلمة المرور" : "Security", color: C.muted },
      ]
    },
    {
      title: ar ? "البيانات" : "Data", items: [
        { icon: "💾", label: ar ? "النسخ الاحتياطي" : "Backup & Restore", color: "#06B6D4" },
      ]
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      <div style={{ background: "linear-gradient(135deg, #1E293B, #334155)", padding: "24px 16px 20px" }}>
        <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 20, margin: "0 0 14px", fontFamily: "Cairo, sans-serif" }}>{ar ? "الإعدادات" : "Settings"}</h1>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `${C.primary}60`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color: "#fff", fontFamily: "Cairo, sans-serif" }}>أ</div>
          <div>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 16, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "أحمد محمد" : "Ahmed Mohamed"}</p>
            <p style={{ color: "#94A3B8", fontSize: 12, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "مالك المتجر" : "Store Owner"}</p>
            <p style={{ color: "#64748B", fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "متجر الأمل" : "Al-Amal Store"}</p>
          </div>
          <button style={{ background: `${C.primary}50`, border: "none", borderRadius: 10, padding: "6px 12px", color: "#fff", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{ar ? "تعديل" : "Edit"}</button>
        </div>
      </div>

      <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map((sec, si) => (
          <div key={si}>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 4px", fontFamily: "Cairo, sans-serif" }}>{sec.title}</p>
            <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              {sec.items.map((item, ii) => (
                <button key={ii} onClick={item.action} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderTop: ii > 0 ? `1px solid ${C.border}` : "none", background: "none", border: "none", cursor: "pointer", textAlign: ar ? "right" : "left", transition: "background 0.15s", fontFamily: "Cairo, sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                  <span style={{ flex: 1, fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
                  <span style={{ color: C.muted, fontSize: 14 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: grad, borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌐</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "لوحة التحكم الويب" : "Web Dashboard"}</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "إدارة متقدمة من المتصفح" : "Advanced management via browser"}</p>
          </div>
          <button onClick={() => setScreen("web-dashboard")} style={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 10, padding: "7px 12px", color: C.primary, fontFamily: "Cairo, sans-serif", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>{ar ? "فتح" : "Open"}</button>
        </div>

        <button onClick={onLogout} style={{ width: "100%", padding: 14, borderRadius: 16, border: `2px solid #FECACA`, background: "#FFF5F5", cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 14, fontWeight: 700, color: C.danger, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          🚪 {ar ? "تسجيل الخروج" : "Sign Out"}
        </button>

        <p style={{ textAlign: "center", color: "#CBD5E1", fontSize: 11, fontFamily: "Cairo, sans-serif" }}>نقطة POS v2.5.0 · © 2024 جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
};

// NOTIFICATIONS
const Notifications = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const notifs = [
    { icon: "📦", title: ar ? "تنبيه مخزون منخفض" : "Low Stock Alert", body: ar ? "حليب طازج: 8 وحدات متبقية" : "Fresh Milk: 8 units left (min 20)", time: ar ? "منذ 5 دقائق" : "5 min ago", color: C.danger, unread: true },
    { icon: "💊", title: ar ? "مخزون منخفض" : "Low Stock", body: ar ? "خبز عيش: 8 وحدات متبقية (الحد 15)" : "Bread Loaf: 8 units (min 15)", time: ar ? "منذ 12 دقيقة" : "12 min ago", color: C.danger, unread: true },
    { icon: "🎉", title: ar ? "مبيعات ممتازة!" : "Excellent Sales!", body: ar ? "تجاوزت هدفك اليومي بنسبة 18%" : "You exceeded your daily goal by 18%!", time: ar ? "منذ ساعة" : "1 hr ago", color: C.success, unread: true },
    { icon: "👑", title: ar ? "تجديد الاشتراك" : "Subscription Renewal", body: ar ? "ينتهي اشتراكك المميز خلال 7 أيام" : "Your premium plan expires in 7 days", time: ar ? "منذ 3 ساعات" : "3 hrs ago", color: C.accent, unread: false },
    { icon: "💳", title: ar ? "طلب جديد" : "New Order", body: ar ? "فاتورة INV-2024-007 بقيمة ر.س 136.25" : "Invoice INV-2024-007 · SAR 136.25", time: ar ? "أمس" : "Yesterday", color: C.primary, unread: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      <div style={{ background: grad, padding: "20px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setScreen("dashboard")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>←</button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "الإشعارات" : "Notifications"}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{notifs.filter(n => n.unread).length} {ar ? "غير مقروء" : "unread"}</p>
          </div>
          <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 12px", color: "#fff", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{ar ? "قراءة الكل" : "Mark all"}</button>
        </div>
      </div>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {notifs.map((n, i) => (
          <Card key={i} style={{ border: `1px solid ${n.unread ? n.color + "30" : C.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: `${n.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 3px", fontFamily: "Cairo, sans-serif" }}>{n.title}</p>
                {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 4 }} />}
              </div>
              <p style={{ color: C.muted, fontSize: 12, margin: "0 0 4px", lineHeight: 1.5, fontFamily: "Cairo, sans-serif" }}>{n.body}</p>
              <p style={{ color: "#CBD5E1", fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{n.time}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// USER MANAGEMENT
const UserManagement = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const users = [
    { name: "أحمد محمد", en: "Ahmed Mohamed", role: "owner", email: "ahmed@store.com", active: true },
    { name: "سارة علي", en: "Sara Ali", role: "manager", email: "sara@store.com", active: true },
    { name: "محمد خالد", en: "Mohamed Khaled", role: "cashier", email: "cashier1@store.com", active: true },
    { name: "نورا سالم", en: "Nora Salem", role: "cashier", email: "cashier2@store.com", active: false },
  ];
  const roleConf = { owner: { l: "مالك", e: "Owner", color: C.accent, icon: "👑" }, manager: { l: "مدير", e: "Manager", color: C.primary, icon: "🛡️" }, cashier: { l: "كاشير", e: "Cashier", color: "#3B82F6", icon: "💳" } };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 90 }}>
      <div style={{ background: "linear-gradient(135deg, #1E293B, #334155)", padding: "20px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button onClick={() => setScreen("settings")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>←</button>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "إدارة المستخدمين" : "User Management"}</h1>
            <p style={{ color: "#64748B", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{users.length} {ar ? "مستخدمين" : "users"}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {Object.entries(roleConf).map(([k, r]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "4px 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? r.l : r.e}</p>
              <p style={{ color: "#64748B", fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{users.filter(u => u.role === k).length} {ar ? "مستخدم" : "users"}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {users.map((u, i) => {
          const r = roleConf[u.role];
          return (
            <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${r.color}cc, ${r.color})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18, flexShrink: 0, fontFamily: "Cairo, sans-serif" }}>
                {(ar ? u.name : u.en).charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? u.name : u.en}</p>
                <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{u.email}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <Badge color={r.color}>{r.icon} {ar ? r.l : r.e}</Badge>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: u.active ? C.success : "#CBD5E1" }} />
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: "Cairo, sans-serif" }}>{u.active ? (ar ? "نشط" : "Active") : (ar ? "معطل" : "Inactive")}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// SUBSCRIPTION
const Subscription = ({ lang, setScreen }) => {
  const ar = lang === "ar";
  const [billing, setBilling] = useState("monthly");
  const plans = [
    { id: "free", name: ar ? "مجاني" : "Free", price: 0, priceY: 0, color: "#64748B", features: [ar ? "100 منتج" : "100 products", ar ? "كاشير واحد" : "1 cashier", ar ? "تقارير أساسية" : "Basic reports"] },
    { id: "pro", name: ar ? "احترافي" : "Professional", price: 149, priceY: 119, color: C.primary, current: true, features: [ar ? "منتجات غير محدودة" : "Unlimited products", ar ? "3 كاشيرات" : "3 cashiers", ar ? "تقارير متقدمة" : "Advanced reports", ar ? "إدارة مخزون" : "Inventory", ar ? "دعم 24/7" : "24/7 support"] },
    { id: "enterprise", name: ar ? "مؤسسي" : "Enterprise", price: 349, priceY: 279, color: C.accent, features: [ar ? "كل ميزات الاحترافي" : "All Pro features", ar ? "فروع متعددة" : "Multi-branch", ar ? "API مخصص" : "Custom API", ar ? "مدير حساب" : "Account manager"] },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", paddingBottom: 30 }}>
      <div style={{ background: "linear-gradient(135deg, #1E1B4B, #312E81)", padding: "20px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={() => setScreen("settings")} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>←</button>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "الاشتراك" : "Subscription"}</h1>
            <p style={{ color: "#A5B4FC", fontSize: 12, margin: "2px 0 0", fontFamily: "Cairo, sans-serif" }}>{ar ? "اختر الخطة المناسبة" : "Choose the right plan"}</p>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 12, display: "flex", alignItems: "center", gap: 10, marginBottom: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.primary}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👑</div>
          <div>
            <p style={{ color: "#A5B4FC", fontSize: 11, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "خطتك الحالية" : "Current Plan"}</p>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 14, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "الخطة الاحترافية" : "Professional Plan"}</p>
            <p style={{ color: "#6366F1", fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "تنتهي في 15 فبراير 2024" : "Expires Feb 15, 2024"}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 4 }}>
          {["monthly", "yearly"].map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: billing === b ? "#fff" : "transparent", color: billing === b ? "#1E1B4B" : "rgba(255,255,255,0.6)", fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 12 }}>
              {b === "monthly" ? (ar ? "شهري" : "Monthly") : (ar ? "سنوي (وفر 20%)" : "Yearly (20% off)")}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {plans.map(pl => (
          <div key={pl.id} style={{ background: C.surface, borderRadius: 20, border: `2px solid ${pl.current ? pl.color : C.border}`, padding: 18, position: "relative", overflow: "hidden" }}>
            {pl.current && <div style={{ position: "absolute", top: 12, [ar ? "left" : "right"]: 12, background: pl.color, color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 900, fontFamily: "Cairo, sans-serif" }}>✓ {ar ? "خطتك الحالية" : "Current Plan"}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, marginTop: pl.current ? 24 : 0 }}>
              <p style={{ fontWeight: 900, color: C.text, fontSize: 18, margin: 0, fontFamily: "Cairo, sans-serif" }}>{pl.name}</p>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 900, color: pl.color, fontSize: 22, margin: 0, fontFamily: "Cairo, sans-serif" }}>{pl.price === 0 ? (ar ? "مجاني" : "Free") : `ر.س ${billing === "monthly" ? pl.price : pl.priceY}`}</p>
                {pl.price > 0 && <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "/ شهر" : "/ month"}</p>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pl.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${pl.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: pl.color, fontSize: 10, fontWeight: 900 }}>✓</span>
                  </div>
                  <span style={{ color: C.muted, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{f}</span>
                </div>
              ))}
            </div>
            {!pl.current && (
              <Btn color={pl.color} onClick={() => {}} style={{ width: "100%", padding: "12px", marginTop: 14, fontSize: 14 }}>
                {pl.id === "free" ? (ar ? "تخفيض الخطة" : "Downgrade") : (ar ? "الترقية الآن ✨" : "Upgrade Now ✨")}
              </Btn>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── WEB DASHBOARD ───
const WEB_NAV = [
  { k: "dashboard", icon: "🏠", ar: "الرئيسية", en: "Dashboard" },
  { k: "products", icon: "📦", ar: "المنتجات", en: "Products" },
  { k: "categories", icon: "🏷️", ar: "الفئات", en: "Categories" },
  { k: "inventory", icon: "📋", ar: "المخزون", en: "Inventory" },
  { k: "sales", icon: "🛒", ar: "المبيعات", en: "Sales" },
  { k: "invoices", icon: "🧾", ar: "الفواتير", en: "Invoices" },
  { k: "customers", icon: "👥", ar: "العملاء", en: "Customers" },
  { k: "suppliers", icon: "🚚", ar: "الموردون", en: "Suppliers" },
  { k: "reports", icon: "📊", ar: "التقارير", en: "Reports" },
  { k: "analytics", icon: "📈", ar: "التحليلات", en: "Analytics" },
  { k: "users", icon: "👤", ar: "المستخدمون", en: "Users" },
  { k: "subscription", icon: "👑", ar: "الاشتراك", en: "Subscription" },
  { k: "settings", icon: "⚙️", ar: "الإعدادات", en: "Settings" },
];

const PIE_WEB = [
  { name: "مشروبات", v: 35, color: C.primary },
  { name: "مخبوزات", v: 25, color: C.secondary },
  { name: "ألبان", v: 20, color: C.accent },
  { name: "خضروات", v: 12, color: C.success },
  { name: "أخرى", v: 8, color: C.purple },
];

const WebDash = ({ lang, setLang, goMobile }) => {
  const ar = lang === "ar";
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const kpis = [
    { label: ar ? "إيرادات اليوم" : "Today's Revenue", val: "ر.س 4,230", change: "+18.3%", up: true, icon: "💰", color: C.primary },
    { label: ar ? "عدد الطلبات" : "Orders Today", val: "58", change: "+12%", up: true, icon: "🛒", color: "#3B82F6" },
    { label: ar ? "العملاء الجدد" : "New Customers", val: "14", change: "+5%", up: true, icon: "👥", color: C.success },
    { label: ar ? "المخزون المنخفض" : "Low Stock", val: "3", change: "-1", up: false, icon: "⚠️", color: C.danger },
  ];

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 18, padding: 18, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: `${k.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{k.icon}</div>
                    <span style={{ background: k.up ? `${C.success}15` : `${C.danger}15`, color: k.up ? C.success : C.danger, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, fontFamily: "Cairo, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>{k.up ? "▲" : "▼"}{k.change}</span>
                  </div>
                  <p style={{ fontWeight: 900, color: C.text, fontSize: 22, margin: "0 0 4px", fontFamily: "Cairo, sans-serif" }}>{k.val}</p>
                  <p style={{ color: C.muted, fontSize: 13, margin: 0, fontFamily: "Cairo, sans-serif" }}>{k.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div style={{ background: C.surface, borderRadius: 18, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontWeight: 900, color: C.text, margin: "0 0 2px", fontFamily: "Cairo, sans-serif" }}>{ar ? "الإيرادات والأرباح" : "Revenue & Profit"}</h3>
                    <p style={{ color: C.muted, fontSize: 12, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "آخر 12 شهر" : "Last 12 months"}</p>
                  </div>
                  <select style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "6px 12px", fontSize: 12, background: "#F8FAFC", fontFamily: "Cairo, sans-serif", outline: "none" }}>
                    <option>{ar ? "سنوي" : "Yearly"}</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={MONTHLY} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.primary} stopOpacity={0.2} /><stop offset="95%" stopColor={C.primary} stopOpacity={0} /></linearGradient>
                      <linearGradient id="wpg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.success} stopOpacity={0.2} /><stop offset="95%" stopColor={C.success} stopOpacity={0} /></linearGradient>
                    </defs>
                    <XAxis dataKey={ar ? "m" : "me"} tick={{ fontSize: 10, fontFamily: "Cairo", fill: C.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "Cairo" }} />
                    <Area type="monotone" dataKey="r" stroke={C.primary} strokeWidth={2.5} fill="url(#wg)" dot={false} name={ar ? "الإيرادات" : "Revenue"} />
                    <Area type="monotone" dataKey="p" stroke={C.success} strokeWidth={2.5} fill="url(#wpg)" dot={false} name={ar ? "الأرباح" : "Profit"} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: C.surface, borderRadius: 18, padding: 20, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontWeight: 900, color: C.text, margin: "0 0 16px", fontFamily: "Cairo, sans-serif" }}>{ar ? "توزيع الفئات" : "By Category"}</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={PIE_WEB} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="v">
                      {PIE_WEB.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {PIE_WEB.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, color: C.text, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{d.name}</span>
                      <span style={{ color: C.muted, fontSize: 12, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>{d.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "products":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input placeholder={ar ? "ابحث عن منتج..." : "Search products..."} style={{ width: "100%", padding: ar ? "10px 40px 10px 14px" : "10px 14px 10px 40px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontFamily: "Cairo, sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", background: C.surface }} />
                <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ar ? "right" : "left"]: 12, color: C.muted }}>🔍</span>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13, fontWeight: 700, color: C.muted }}>🔽 {ar ? "تصفية" : "Filter"}</button>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 12, border: "none", background: grad, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>+ {ar ? "إضافة منتج" : "Add Product"}</button>
            </div>
            <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                    {[ar ? "المنتج" : "Product", "SKU", ar ? "الفئة" : "Category", ar ? "السعر" : "Price", ar ? "المخزون" : "Stock", ar ? "الحالة" : "Status", ar ? "إجراءات" : "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: "12px 14px", textAlign: ar ? "right" : "left", fontSize: 12, color: C.muted, fontWeight: 700, fontFamily: "Cairo, sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map(p => {
                    const cat = CATEGORIES.find(c => c.id === p.cat);
                    const low = p.stock <= p.min;
                    return (
                      <tr key={p.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cat?.color || C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{cat?.icon || "📦"}</div>
                            <span style={{ fontWeight: 600, color: C.text, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{ar ? p.name : p.en}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", color: C.muted, fontSize: 12, fontFamily: "monospace" }}>{p.sku}</td>
                        <td style={{ padding: "12px 14px" }}><Badge color={cat?.color || C.primary}>{cat?.icon} {ar ? cat?.name : cat?.en}</Badge></td>
                        <td style={{ padding: "12px 14px", fontWeight: 900, color: C.primary, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>ر.س {p.price}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: C.text, fontSize: 13, fontFamily: "Cairo, sans-serif" }}>{p.stock}</td>
                        <td style={{ padding: "12px 14px" }}><Badge color={low ? C.danger : C.success}>{low ? (ar ? "منخفض" : "Low") : (ar ? "متاح" : "In Stock")}</Badge></td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ padding: "5px 10px", borderRadius: 8, border: "none", background: `${C.primary}12`, color: C.primary, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{ar ? "تعديل" : "Edit"}</button>
                            <button style={{ padding: "5px 10px", borderRadius: 8, border: "none", background: `${C.danger}12`, color: C.danger, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{ar ? "حذف" : "Delete"}</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderTop: `1px solid ${C.border}` }}>
                <span style={{ color: C.muted, fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{ar ? `عرض 1-${PRODUCTS.length} من ${PRODUCTS.length}` : `Showing 1-${PRODUCTS.length} of ${PRODUCTS.length}`}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3].map(n => (
                    <button key={n} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: n === 1 ? C.primary : "#F1F5F9", color: n === 1 ? "#fff" : C.muted, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "Cairo, sans-serif" }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{WEB_NAV.find(n => n.k === tab)?.icon}</div>
            <h3 style={{ fontWeight: 900, color: C.text, fontSize: 20, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? WEB_NAV.find(n => n.k === tab)?.ar : WEB_NAV.find(n => n.k === tab)?.en}</h3>
            <p style={{ color: C.muted, fontFamily: "Cairo, sans-serif" }}>{ar ? "هذا القسم سيكون متاحاً قريباً ✨" : "This section is coming soon ✨"}</p>
          </div>
        );
    }
  };

  const activeName = WEB_NAV.find(n => n.k === tab);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Cairo, sans-serif", direction: ar ? "rtl" : "ltr", background: C.bg, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: collapsed ? 68 : 240, background: `linear-gradient(180deg, ${C.primaryDark}, ${C.primary})`, display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.3s", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>🏪</div>
          {!collapsed && <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, whiteSpace: "nowrap" }}>Nuqta POS</span>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginInlineStart: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 16 }}>☰</button>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {WEB_NAV.map(n => {
            const active = tab === n.k;
            return (
              <button key={n.k} onClick={() => setTab(n.k)} title={collapsed ? (ar ? n.ar : n.en) : ""} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 12, border: "none", background: active ? "rgba(255,255,255,0.18)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "Cairo, sans-serif" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                {!collapsed && <span style={{ flex: 1, textAlign: ar ? "right" : "left" }}>{ar ? n.ar : n.en}</span>}
                {!collapsed && active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "8px 8px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={goMobile} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 16 }}>📱</span>
            {!collapsed && <span>{ar ? "تطبيق الجوال" : "Mobile App"}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 900, color: C.text, margin: 0, fontSize: 15, fontFamily: "Cairo, sans-serif" }}>{ar ? activeName?.ar : activeName?.en}</h2>
            <p style={{ color: C.muted, fontSize: 11, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "متجر الأمل · الرياض" : "Al-Amal Store · Riyadh"}</p>
          </div>
          <div style={{ position: "relative" }}>
            <input placeholder={ar ? "بحث سريع..." : "Quick search..."} style={{ width: 200, padding: ar ? "8px 36px 8px 12px" : "8px 12px 8px 36px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#F8FAFC", fontSize: 13, fontFamily: "Cairo, sans-serif", outline: "none" }} />
            <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ar ? "right" : "left"]: 10, fontSize: 13, color: C.muted }}>🔍</span>
          </div>
          <button onClick={() => setLang(ar ? "en" : "ar")} style={{ padding: "6px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo, sans-serif", color: C.text }}>{ar ? "EN" : "ع"}</button>
          <div style={{ position: "relative" }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🔔</button>
            <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: C.danger, borderRadius: "50%", color: "#fff", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif" }}>3</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingInlineStart: 8, borderInlineStart: `1px solid ${C.border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, fontFamily: "Cairo, sans-serif" }}>أ</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1, fontFamily: "Cairo, sans-serif" }}>{ar ? "أحمد" : "Ahmed"}</p>
              <p style={{ fontSize: 10, color: C.muted, margin: 0, fontFamily: "Cairo, sans-serif" }}>{ar ? "مالك" : "Owner"}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>{renderContent()}</main>
      </div>
    </div>
  );
};

// ─── ROOT APP ───
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [lang, setLang] = useState("ar");

  const navigate = (s) => setScreen(s);

  const MOBILE_NAV_SCREENS = ["dashboard", "cashier", "products", "reports", "settings"];

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <Splash onDone={() => setScreen("onboarding")} />;
      case "onboarding": return <Onboarding lang={lang} setLang={setLang} onDone={() => setScreen("login")} />;
      case "login": return <Login lang={lang} setLang={setLang} onLogin={() => setScreen("dashboard")} goRegister={() => setScreen("register")} />;
      case "register": return <Register lang={lang} onDone={() => setScreen("dashboard")} goLogin={() => setScreen("login")} />;
      case "dashboard": return <Dashboard lang={lang} setScreen={navigate} />;
      case "cashier": return <Cashier lang={lang} setScreen={navigate} />;
      case "cart": return <CartScreen lang={lang} setScreen={navigate} />;
      case "payment": return <Payment lang={lang} setScreen={navigate} />;
      case "invoice": return <InvoiceScreen lang={lang} setScreen={navigate} />;
      case "invoice-history": return <InvoiceHistory lang={lang} setScreen={navigate} />;
      case "products": return <Products lang={lang} setScreen={navigate} />;
      case "add-product": return <AddProduct lang={lang} setScreen={navigate} />;
      case "reports": return <Reports lang={lang} setScreen={navigate} />;
      case "settings": return <Settings lang={lang} setLang={setLang} setScreen={navigate} onLogout={() => setScreen("login")} />;
      case "notifications": return <Notifications lang={lang} setScreen={navigate} />;
      case "user-management": return <UserManagement lang={lang} setScreen={navigate} />;
      case "subscription": return <Subscription lang={lang} setScreen={navigate} />;
      case "web-dashboard": return <WebDash lang={lang} setLang={setLang} goMobile={() => setScreen("dashboard")} />;
      default: return <Dashboard lang={lang} setScreen={navigate} />;
    }
  };

  if (screen === "web-dashboard") {
    return <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>{renderScreen()}</div>;
  }

  const showNav = MOBILE_NAV_SCREENS.includes(screen);

  return (
    <div style={{ minHeight: "100vh", background: "#CBD5E1", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 0, fontFamily: "Cairo, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", position: "relative", background: "#F8FAFC", overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.25)" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
        {showNav && <MobileNav screen={screen} setScreen={navigate} lang={lang} />}
      </div>
    </div>
  );
}
