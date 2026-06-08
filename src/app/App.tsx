import { useEffect, useState } from "react";
import type { Lang, Screen, Theme } from "./data/store";

// Auth
import { SplashScreen, OnboardingScreen, LoginScreen, RegisterScreen } from "./components/AuthScreens";

// Mobile nav
import { MobileNav } from "./components/MobileNav";

// Dashboard
import { DashboardScreen } from "./components/DashboardScreen";

// Products / Inventory
import { ProductsScreen, AddProductScreen, CategoriesScreen, InventoryScreen, StockMovementScreen } from "./components/ProductScreens";

// Cashier / POS
import { CashierScreen, CartScreen, PaymentScreen, InvoiceScreen, InvoiceHistoryScreen } from "./components/CashierScreens";

// Reports
import { ReportsScreen, AnalyticsScreen } from "./components/ReportsScreens";

// Customers / Suppliers
import { CustomersScreen, CustomerDetailsScreen, SuppliersScreen } from "./components/CustomerScreens";

// Settings / Notifications / Users / Subscription
import { NotificationsScreen, UserManagementScreen, SubscriptionScreen, SettingsScreen } from "./components/SettingsScreens";

// Web Dashboard
import { WebDashboard } from "./components/WebDashboard";

const MOBILE_SCREENS: Screen[] = [
  'dashboard', 'products', 'add-product', 'categories',
  'inventory', 'stock-movement', 'cashier', 'cart',
  'payment', 'invoice', 'invoice-history', 'customers',
  'customer-details', 'suppliers', 'reports', 'analytics',
  'notifications', 'user-management', 'subscription', 'settings',
];

const NAV_SCREENS: Screen[] = ['dashboard', 'cashier', 'products', 'reports', 'settings'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [lang, setLang] = useState<Lang>('ar');
  const [theme, setTheme] = useState<Theme>('light');

  const navigate = (s: Screen) => setScreen(s);
  const isMobile = MOBILE_SCREENS.includes(screen);
  const showNav = NAV_SCREENS.includes(screen) && isMobile;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedLang = window.localStorage.getItem('nuqta-lang');
    const storedTheme = window.localStorage.getItem('nuqta-theme');
    if (storedLang === 'ar' || storedLang === 'en') setLang(storedLang);
    if (storedTheme === 'light' || storedTheme === 'dark') setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('nuqta-lang', lang);
    window.localStorage.setItem('nuqta-theme', theme);
  }, [lang, theme]);

  const commonProps = { lang, onNavigate: navigate };
  const authProps = { ...commonProps, onSetLang: setLang };
  const settingsProps = { ...commonProps, onSetLang: setLang, onSetTheme: setTheme, theme };

  const renderScreen = () => {
    switch (screen) {
      // Auth
      case 'splash':          return <SplashScreen {...authProps} />;
      case 'onboarding':      return <OnboardingScreen {...authProps} />;
      case 'login':           return <LoginScreen {...authProps} />;
      case 'register':        return <RegisterScreen {...authProps} />;
      // Mobile
      case 'dashboard':       return <DashboardScreen {...commonProps} />;
      case 'products':        return <ProductsScreen {...commonProps} />;
      case 'add-product':     return <AddProductScreen {...commonProps} />;
      case 'categories':      return <CategoriesScreen {...commonProps} />;
      case 'inventory':       return <InventoryScreen {...commonProps} />;
      case 'cashier':         return <CashierScreen {...commonProps} />;
      case 'cart':            return <CartScreen {...commonProps} />;
      case 'payment':         return <PaymentScreen {...commonProps} />;
      case 'invoice':         return <InvoiceScreen {...commonProps} />;
      case 'invoice-history': return <InvoiceHistoryScreen {...commonProps} />;
      case 'customers':       return <CustomersScreen {...commonProps} />;
      case 'customer-details': return <CustomerDetailsScreen {...commonProps} />;
      case 'suppliers':       return <SuppliersScreen {...commonProps} />;
      case 'reports':         return <ReportsScreen {...commonProps} />;
      case 'analytics':       return <AnalyticsScreen {...commonProps} />;
      case 'notifications':   return <NotificationsScreen {...commonProps} />;
      case 'user-management': return <UserManagementScreen {...commonProps} />;
      case 'subscription':    return <SubscriptionScreen {...commonProps} />;
      case 'settings':        return <SettingsScreen {...settingsProps} />;
      // Web
      case 'web-dashboard':   return <WebDashboard lang={lang} onNavigate={navigate} onSetLang={setLang} theme={theme} />;
      // Fallbacks
      case 'stock-movement':  return <StockMovementScreen {...commonProps} />;
      default:                return <DashboardScreen {...commonProps} />;
    }
  };

  const themeClass = theme === 'dark' ? 'dark' : '';
  const shellBackground = theme === 'dark' ? '#020617' : '#E2E8F0';
  const phoneBackground = theme === 'dark' ? '#0F172A' : '#F8FAFC';
  const webBackground = theme === 'dark' ? '#020617' : '#F8FAFC';

  // Web dashboard gets full viewport
  if (screen === 'web-dashboard') {
    return <div className={themeClass} style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: webBackground }}>{renderScreen()}</div>;
  }

  // Mobile shell — centered phone frame on desktop, full width on mobile
  return (
    <div className={themeClass} style={{ minHeight: '100vh', background: shellBackground, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0', fontFamily: 'Cairo, sans-serif' }}>
      {/* Phone frame */}
      <div style={{ width: '100%', maxWidth: 430, minHeight: '100vh', position: 'relative', background: phoneBackground, overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.3)' }}>
        {/* Screen content */}
        <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {renderScreen()}
        </div>
        {/* Bottom nav */}
        {showNav && <MobileNav lang={lang} active={screen} onNavigate={navigate} />}
      </div>
    </div>
  );
}
