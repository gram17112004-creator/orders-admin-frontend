import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultSettings = {
  appName: "Store Manager",
  language: "en",
  currency: "₪",
  theme: "blue",
};

const translations = {
  en: {
    dashboard: "Dashboard",
    orders: "Orders",
    products: "Products",
    customers: "Customers",
    reports: "Reports",
    settings: "Settings",

    appSettings: "Application Settings",
    account: "Account",
    technologies: "Technologies",
    projectFeatures: "Project Features",

    appName: "App Name",
    language: "Language",
    currency: "Currency",
    theme: "Theme",

    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    resetSettings: "Reset Settings",
    logout: "Logout",

    name: "Name",
    email: "Email",
    accountType: "Account Type",
    loginStatus: "Login Status",
    authenticated: "Authenticated",
    storeAdmin: "Store Administrator",

    english: "English",
    arabic: "Arabic",
    hebrew: "Hebrew",

    blue: "Professional Blue",
    dark: "Dark",
    green: "Green",

    appTitle: "Store Manager",
    appSubtitle: "Smart dashboard for orders, products, customers and reports",

    languageSettings: "Language Settings",
    chooseLanguage: "Choose Application Language",
    settingsSaved: "Settings saved successfully",
  },

  ar: {
    dashboard: "الرئيسية",
    orders: "الطلبات",
    products: "المنتجات",
    customers: "الزبائن",
    reports: "التقارير",
    settings: "الإعدادات",

    appSettings: "إعدادات التطبيق",
    account: "الحساب",
    technologies: "التقنيات",
    projectFeatures: "ميزات المشروع",

    appName: "اسم التطبيق",
    language: "اللغة",
    currency: "العملة",
    theme: "الثيم",

    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    resetSettings: "إرجاع الإعدادات",
    logout: "تسجيل الخروج",

    name: "الاسم",
    email: "الإيميل",
    accountType: "نوع الحساب",
    loginStatus: "حالة الدخول",
    authenticated: "مسجل دخول",
    storeAdmin: "مدير المتجر",

    english: "إنجليزي",
    arabic: "عربي",
    hebrew: "عبري",

    blue: "أزرق احترافي",
    dark: "داكن",
    green: "أخضر",

    appTitle: "مدير المتجر",
    appSubtitle: "لوحة ذكية لإدارة الطلبات والمنتجات والزبائن والتقارير",

    languageSettings: "إعدادات اللغة",
    chooseLanguage: "اختر لغة التطبيق",
    settingsSaved: "تم حفظ الإعدادات بنجاح",
  },

  he: {
    dashboard: "לוח בקרה",
    orders: "הזמנות",
    products: "מוצרים",
    customers: "לקוחות",
    reports: "דוחות",
    settings: "הגדרות",

    appSettings: "הגדרות אפליקציה",
    account: "חשבון",
    technologies: "טכנולוגיות",
    projectFeatures: "תכונות הפרויקט",

    appName: "שם האפליקציה",
    language: "שפה",
    currency: "מטבע",
    theme: "ערכת נושא",

    edit: "ערוך",
    save: "שמור",
    cancel: "ביטול",
    resetSettings: "איפוס הגדרות",
    logout: "התנתקות",

    name: "שם",
    email: "אימייל",
    accountType: "סוג חשבון",
    loginStatus: "מצב התחברות",
    authenticated: "מחובר",
    storeAdmin: "מנהל חנות",

    english: "אנגלית",
    arabic: "ערבית",
    hebrew: "עברית",

    blue: "כחול מקצועי",
    dark: "כהה",
    green: "ירוק",

    appTitle: "מנהל החנות",
    appSubtitle: "לוח חכם לניהול הזמנות, מוצרים, לקוחות ודוחות",

    languageSettings: "הגדרות שפה",
    chooseLanguage: "בחר את שפת האפליקציה",
    settingsSaved: "ההגדרות נשמרו בהצלחה",
  },
};

const themes = {
  blue: {
    primary: "#2563EB",
    header: "#111827",
    background: "#F4F7FB",
    card: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
  },

  dark: {
    primary: "#7C3AED",
    header: "#000000",
    background: "#111827",
    card: "#1F2937",
    text: "#FFFFFF",
    muted: "#CBD5E1",
  },

  green: {
    primary: "#16A34A",
    header: "#064E3B",
    background: "#ECFDF5",
    card: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
  },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem("appSettings");

      if (savedSettings) {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        });
      }
    } catch (error) {
      console.log("LOAD SETTINGS ERROR:", error?.message);
    } finally {
      setSettingsLoading(false);
    }
  }

  async function updateSettings(newSettings) {
    const updatedSettings = {
      ...settings,
      ...newSettings,
    };

    setSettings(updatedSettings);
    await AsyncStorage.setItem("appSettings", JSON.stringify(updatedSettings));
  }

  async function changeLanguage(language) {
    const updatedSettings = {
      ...settings,
      language,
    };

    setSettings(updatedSettings);
    await AsyncStorage.setItem("appSettings", JSON.stringify(updatedSettings));
  }

  async function resetSettings() {
    setSettings(defaultSettings);
    await AsyncStorage.setItem("appSettings", JSON.stringify(defaultSettings));
  }

  function t(key) {
    return translations[settings.language]?.[key] || translations.en[key] || key;
  }

  function formatMoney(value) {
    return `${Number(value || 0)} ${settings.currency}`;
  }

  const theme = themes[settings.theme] || themes.blue;

  // Arabic and Hebrew are RTL languages
  const isRTL = settings.language === "ar" || settings.language === "he";

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        changeLanguage,
        resetSettings,
        settingsLoading,
        t,
        theme,
        isRTL,
        formatMoney,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}