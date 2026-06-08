import { Home, ShoppingCart, Package, BarChart3, Settings } from "lucide-react";
import type { Lang, Screen } from "../data/store";

interface Props { lang: Lang; active: Screen; onNavigate: (s: Screen) => void; }

const ITEMS = [
  { screen: 'dashboard' as Screen, ar: 'الرئيسية', en: 'Home', Icon: Home },
  { screen: 'cashier' as Screen, ar: 'الكاشير', en: 'Cashier', Icon: ShoppingCart },
  { screen: 'products' as Screen, ar: 'المنتجات', en: 'Products', Icon: Package },
  { screen: 'reports' as Screen, ar: 'التقارير', en: 'Reports', Icon: BarChart3 },
  { screen: 'settings' as Screen, ar: 'الإعدادات', en: 'Settings', Icon: Settings },
];

const P = "#0F766E";

export function MobileNav({ lang, active, onNavigate }: Props) {
  const ar = lang === 'ar';
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ background: '#FFFFFF', borderTop: '1px solid #F1F5F9', fontFamily: 'Cairo, sans-serif' }} dir={ar ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map(({ screen, ar: labelAr, en: labelEn, Icon }) => {
          const isActive = active === screen;
          return (
            <button key={screen} onClick={() => onNavigate(screen)} className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all min-w-[58px]"
              style={{ color: isActive ? P : '#94A3B8' }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all" style={{ background: isActive ? `${P}15` : 'transparent' }}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-xs font-bold">{ar ? labelAr : labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
