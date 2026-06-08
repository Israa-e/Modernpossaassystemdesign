import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ChevronRight, ChevronLeft, BarChart3, Package, TrendingUp, Store } from "lucide-react";
import type { Lang, Screen } from "../data/store";

const P = "#0F766E"; const AM = "#F59E0B";

interface AuthProps { lang: Lang; onNavigate: (s: Screen) => void; onSetLang: (l: Lang) => void; }

/* ── Splash ── */
export function SplashScreen({ onNavigate }: AuthProps) {
  useEffect(() => { const t = setTimeout(() => onNavigate('onboarding'), 2800); return () => clearTimeout(t); }, [onNavigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: `linear-gradient(135deg, #0B5E57 0%, #0F766E 50%, #14B8A6 100%)` }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }} className="flex flex-col items-center gap-6">
        <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <span style={{ fontSize: 56 }}>🏪</span>
        </div>
        <div className="text-center">
          <h1 className="text-white font-black" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Nuqta</h1>
          <p className="text-teal-100 text-lg mt-1">نقطة — نظام نقاط البيع</p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} className="w-2.5 h-2.5 bg-white rounded-full" />
          ))}
        </motion.div>
      </motion.div>
      <p className="text-teal-300 text-xs absolute bottom-10">v2.4.1 © 2024 Nuqta POS</p>
    </div>
  );
}

const slides = [
  { icon: <TrendingUp size={60} strokeWidth={1.5} />, titleAr: 'إدارة المبيعات', titleEn: 'Sales Management', descAr: 'تتبع مبيعاتك اليومية بدقة وأصدر الفواتير الإلكترونية في ثوانٍ', descEn: 'Track your daily sales with precision and issue e-invoices in seconds', color: P },
  { icon: <Package size={60} strokeWidth={1.5} />, titleAr: 'إدارة المخزون', titleEn: 'Inventory Control', descAr: 'راقب مخزونك لحظياً وتلقَ تنبيهات عند انخفاض الكميات', descEn: 'Monitor your inventory in real-time and receive low-stock alerts', color: '#7C3AED' },
  { icon: <BarChart3 size={60} strokeWidth={1.5} />, titleAr: 'تقارير وتحليلات', titleEn: 'Reports & Analytics', descAr: 'احصل على رؤى شاملة لأداء متجرك وقرارات مبنية على البيانات', descEn: 'Get comprehensive insights into your store performance', color: AM },
];

/* ── Onboarding ── */
export function OnboardingScreen({ lang, onNavigate, onSetLang }: AuthProps) {
  const [slide, setSlide] = useState(0);
  const ar = lang === 'ar';
  const cur = slides[slide];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="flex justify-between items-center p-5">
        <button onClick={() => onNavigate('login')} className="text-gray-400 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">{ar ? 'تخطي' : 'Skip'}</button>
        <button onClick={() => onSetLang(ar ? 'en' : 'ar')} className="text-sm font-bold px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600">{ar ? 'EN' : 'ع'}</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, x: ar ? -40 : 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: ar ? 40 : -40 }} transition={{ duration: 0.35 }} className="flex flex-col items-center text-center gap-8 max-w-sm">
            <div className="w-40 h-40 rounded-3xl flex items-center justify-center text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${cur.color}bb, ${cur.color})` }}>
              {cur.icon}
            </div>
            <div>
              <h2 className="text-gray-900 mb-3 font-black" style={{ fontSize: '1.75rem' }}>{ar ? cur.titleAr : cur.titleEn}</h2>
              <p className="text-gray-500 leading-relaxed">{ar ? cur.descAr : cur.descEn}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 pb-4">
        {slides.map((_, i) => <button key={i} onClick={() => setSlide(i)} className="h-2 rounded-full transition-all duration-300" style={{ width: i === slide ? 32 : 8, background: i === slide ? P : '#CBD5E1' }} />)}
      </div>
      <div className="px-6 pb-12 flex gap-3">
        {slide > 0 && <button onClick={() => setSlide(s => s - 1)} className="flex-1 py-4 rounded-2xl border border-gray-200 text-gray-700 font-bold flex items-center justify-center gap-2">{ar ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}{ar ? 'السابق' : 'Back'}</button>}
        <button onClick={() => slide < 2 ? setSlide(s => s + 1) : onNavigate('login')} className="flex-1 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
          {slide < 2 ? (ar ? 'التالي' : 'Next') : (ar ? 'ابدأ الآن' : 'Get Started')}
          {ar ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
        </button>
      </div>
    </div>
  );
}

/* ── Login ── */
export function LoginScreen({ lang, onNavigate, onSetLang }: AuthProps) {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const ar = lang === 'ar';
  const inp = "w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:border-teal-500 transition-all text-sm";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="h-52 rounded-b-[3rem] flex flex-col items-center justify-end pb-8" style={{ background: `linear-gradient(135deg, #0B5E57, #14B8A6)` }}>
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-3"><span style={{ fontSize: 30 }}>🏪</span></div>
        <p className="text-teal-100 text-sm">{ar ? 'مرحباً بعودتك!' : 'Welcome back!'}</p>
      </div>
      <div className="flex-1 px-6 pt-7 pb-10 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-900 font-black" style={{ fontSize: '1.6rem' }}>{ar ? 'تسجيل الدخول' : 'Sign In'}</h2>
          <button onClick={() => onSetLang(ar ? 'en' : 'ar')} className="text-sm font-bold px-4 py-1.5 rounded-full border border-gray-200 text-gray-600">{ar ? 'EN' : 'ع'}</button>
        </div>
        <div className="flex flex-col gap-4">
          <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">{ar ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" placeholder="example@store.com" className={inp} dir="ltr" /></div>
          <div><label className="text-xs font-semibold text-gray-500 mb-1.5 block">{ar ? 'كلمة المرور' : 'Password'}</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className={inp} style={{ paddingRight: ar ? '3rem' : undefined, paddingLeft: ar ? undefined : '3rem' }} />
              <button onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => setRemember(!remember)} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors" style={{ borderColor: remember ? P : '#CBD5E1', background: remember ? P : 'transparent' }}>
              {remember && <svg viewBox="0 0 10 10" width="12" height="12"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className="text-sm text-gray-700">{ar ? 'تذكرني' : 'Remember me'}</span>
          </button>
          <button className="text-sm font-bold" style={{ color: P }}>{ar ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</button>
        </div>
        <button onClick={() => onNavigate('dashboard')} className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
          {ar ? 'دخول' : 'Sign In'}
        </button>
        <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200"/><span className="text-gray-400 text-sm">{ar ? 'أو' : 'or'}</span><div className="flex-1 h-px bg-gray-200"/></div>
        <button onClick={() => onNavigate('register')} className="w-full py-4 rounded-2xl font-bold border-2 text-sm" style={{ color: P, borderColor: P }}>
          {ar ? 'إنشاء حساب جديد' : 'Create New Account'}
        </button>
        <p className="text-center text-gray-400 text-sm mt-auto">
          {ar ? 'تجربة لوحة التحكم؟ ' : 'Try the web dashboard? '}
          <button onClick={() => onNavigate('web-dashboard')} className="font-bold" style={{ color: AM }}>{ar ? 'اضغط هنا' : 'Click here'}</button>
        </p>
      </div>
    </div>
  );
}

/* ── Register ── */
export function RegisterScreen({ lang, onNavigate, onSetLang }: AuthProps) {
  const ar = lang === 'ar';
  const [showPass, setShowPass] = useState(false);
  const [plan, setPlan] = useState<'free'|'pro'>('pro');
  const inp = "w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none text-sm";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', fontFamily: 'Cairo, sans-serif', direction: ar ? 'rtl' : 'ltr' }}>
      <div className="h-40 rounded-b-[2.5rem] flex items-end pb-5 px-5" style={{ background: `linear-gradient(135deg, #0B5E57, #14B8A6)` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('login')} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {ar ? <ChevronRight size={20} className="text-white"/> : <ChevronLeft size={20} className="text-white"/>}
          </button>
          <div><h2 className="text-white font-black text-xl">{ar ? 'إنشاء متجر جديد' : 'Create New Store'}</h2>
            <p className="text-teal-100 text-sm">{ar ? 'ابدأ تجربتك المجانية' : 'Start your free trial'}</p></div>
        </div>
      </div>
      <div className="flex-1 px-5 pt-5 pb-10 flex flex-col gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-semibold text-gray-500 mb-1 block">{ar ? 'اسم المتجر *' : 'Store Name *'}</label><input placeholder={ar ? 'متجر الأمل' : 'My Store'} className={inp}/></div>
          <div><label className="text-xs font-semibold text-gray-500 mb-1 block">{ar ? 'نوع النشاط' : 'Business Type'}</label>
            <select className={inp}><option>{ar ? 'سوبرماركت' : 'Supermarket'}</option><option>{ar ? 'مطعم' : 'Restaurant'}</option><option>{ar ? 'صيدلية' : 'Pharmacy'}</option><option>{ar ? 'مقهى' : 'Cafe'}</option></select></div>
        </div>
        {[{ l: ar ? 'اسم المالك *' : 'Owner Name *', p: ar ? 'أحمد محمد' : 'Ahmed Mohamed', t: 'text' },
          { l: ar ? 'رقم الهاتف *' : 'Phone Number *', p: '+966 5X XXX XXXX', t: 'tel' },
          { l: ar ? 'البريد الإلكتروني *' : 'Email *', p: 'store@example.com', t: 'email' }].map((f, i) => (
          <div key={i}><label className="text-xs font-semibold text-gray-500 mb-1 block">{f.l}</label><input type={f.t} placeholder={f.p} className={inp} dir={f.t !== 'text' ? 'ltr' : undefined}/></div>
        ))}
        <div><label className="text-xs font-semibold text-gray-500 mb-1 block">{ar ? 'كلمة المرور *' : 'Password *'}</label>
          <div className="relative"><input type={showPass ? 'text' : 'password'} placeholder="••••••••" className={inp} style={{ paddingRight: ar ? '3rem' : undefined, paddingLeft: ar ? undefined : '3rem' }}/>
            <button onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: ar ? '1rem' : 'auto', left: ar ? 'auto' : '1rem' }}>{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
          </div></div>

        <div><label className="text-xs font-semibold text-gray-500 mb-2 block">{ar ? 'اختر الخطة' : 'Choose Plan'}</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ k: 'free', name: ar ? 'مجاني' : 'Free', price: '0', detail: ar ? 'حتى 100 منتج' : 'Up to 100 products' },
              { k: 'pro', name: ar ? 'احترافي' : 'Pro', price: '149', detail: ar ? 'غير محدود' : 'Unlimited', badge: ar ? 'الأفضل' : 'Best' }].map(pl => (
              <button key={pl.k} onClick={() => setPlan(pl.k as 'free'|'pro')} className="p-4 rounded-2xl border-2 text-start transition-all" style={{ borderColor: plan === pl.k ? P : '#E2E8F0', background: plan === pl.k ? `${P}08` : '#fff' }}>
                {pl.badge && <span className="text-xs font-black text-white px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: AM }}>{pl.badge}</span>}
                <p className="font-black text-gray-900">{pl.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{pl.detail}</p>
                <p className="font-black mt-2" style={{ color: P, fontSize: '1.3rem' }}>{pl.price === '0' ? (ar ? 'مجاني' : 'Free') : `${pl.price} ${ar ? 'ر.س/شهر' : 'SAR/mo'}`}</p>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onNavigate('dashboard')} className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${P}, #14B8A6)` }}>
          <Store size={20}/> {ar ? 'إنشاء المتجر' : 'Create Store'}
        </button>
        <p className="text-center text-gray-400 text-sm">{ar ? 'لديك حساب؟ ' : 'Already have an account? '}
          <button onClick={() => onNavigate('login')} className="font-bold" style={{ color: P }}>{ar ? 'تسجيل الدخول' : 'Sign In'}</button>
        </p>
      </div>
    </div>
  );
}
