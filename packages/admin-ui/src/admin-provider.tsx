import { createInstance, type i18n } from "i18next";
import { useEffect, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "./context/theme-provider";
import { ThemeCustomizationProvider } from "./context/theme-customization-provider";
import { LayoutProvider } from "./context/layout-provider";
import { DirectionProvider } from "./context/direction-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import en from "./i18n/locales/en.json";
import zh from "./i18n/locales/zh.json";
import zhTW from "./i18n/locales/zh-TW.json";
import fr from "./i18n/locales/fr.json";
import ja from "./i18n/locales/ja.json";
import ru from "./i18n/locales/ru.json";
import vi from "./i18n/locales/vi.json";

export const adminLanguages = [
  { value: "zhCN", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "zhTW", label: "繁體中文" },
  { value: "fr", label: "Français" },
  { value: "ja", label: "日本語" },
  { value: "ru", label: "Русский" },
  { value: "vi", label: "Tiếng Việt" },
] as const;

export function createAdminI18n(language = "zhCN"): i18n {
  const instance = createInstance();
  void instance.init({
    lng: language,
    fallbackLng: "en",
    defaultNS: "admin-ui",
    ns: ["admin-ui"],
    initAsync: false,
    interpolation: { escapeValue: false },
    resources: Object.fromEntries(
      Object.entries({ en, zhCN: zh, zhTW, fr, ja, ru, vi }).map(([key, value]) => [
        key,
        { "admin-ui": value.translation },
      ]),
    ),
  });
  return instance;
}

export interface AdminProviderProps {
  children: ReactNode;
  language?: string;
  i18n?: i18n;
  defaultTheme?: "light" | "dark" | "system";
}

export function AdminProvider(props: AdminProviderProps) {
  const [instance] = useState(
    () =>
      props.i18n ??
      createAdminI18n(
        props.language ??
          (() => {
            try {
              return localStorage.getItem("new-api-admin:language") ?? "zhCN";
            } catch {
              return "zhCN";
            }
          })(),
      ),
  );
  useEffect(() => {
    if (props.language) void instance.changeLanguage(props.language);
  }, [instance, props.language]);
  useEffect(() => {
    const persist = (language: string) => {
      document.documentElement.lang =
        language === "zhCN" ? "zh-CN" : language === "zhTW" ? "zh-TW" : language;
      try {
        localStorage.setItem("new-api-admin:language", language);
      } catch {
        /* Storage may be unavailable. */
      }
    };
    persist(instance.language);
    instance.on("languageChanged", persist);
    return () => {
      instance.off("languageChanged", persist);
    };
  }, [instance]);
  return (
    <I18nextProvider i18n={instance} defaultNS="admin-ui">
      <ThemeProvider defaultTheme={props.defaultTheme}>
        <ThemeCustomizationProvider>
          <DirectionProvider>
            <LayoutProvider>
              <TooltipProvider>
                {props.children}
                <Toaster />
              </TooltipProvider>
            </LayoutProvider>
          </DirectionProvider>
        </ThemeCustomizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
