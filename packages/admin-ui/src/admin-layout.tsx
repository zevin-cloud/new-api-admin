import { useState, type ReactNode, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";
import { NativeSelect, NativeSelectOption } from "./components/ui/native-select";
import { Separator } from "./components/ui/separator";
import { ConfigDrawer } from "./components/config-drawer";
import { ThemeSwitch } from "./components/theme-switch";
import { PageFooterProvider } from "./components/layout/components/page-footer";
import { useLayout } from "./context/layout-provider";
import { adminLanguages } from "./admin-provider";

export interface AdminMenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
  group?: string;
}
export interface AdminLayoutProps {
  children: ReactNode;
  menu: AdminMenuItem[];
  currentPath: string;
  onNavigate: (href: string) => void;
  renderLink?: (item: AdminMenuItem) => ReactElement;
  title?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminLayoutContent {...props} />
    </SidebarProvider>
  );
}
function AdminLayoutContent(props: AdminLayoutProps) {
  const { t, i18n } = useTranslation("admin-ui");
  const layout = useLayout();
  const sidebar = useSidebar();
  const [footer, setFooter] = useState<HTMLDivElement | null>(null);
  const groups = [...new Set(props.menu.map((item) => item.group ?? "Examples"))];
  return (
    <PageFooterProvider container={footer}>
      <Sidebar variant={layout.variant} collapsible={layout.collapsible}>
        <SidebarHeader className="px-4 py-5">
          <span className="truncate text-lg font-semibold tracking-tight">
            {props.title ?? "new-api Admin"}
          </span>
          <span className="text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
            {t("Template workspace")}
          </span>
        </SidebarHeader>
        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{t(group)}</SidebarGroupLabel>
              <SidebarMenu>
                {props.menu
                  .filter((item) => (item.group ?? "Examples") === group)
                  .map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={props.currentPath === item.href}
                        tooltip={t(item.label)}
                        render={props.renderLink?.(item)}
                        onClick={() => {
                          if (!props.renderLink) props.onNavigate(item.href);
                          if (sidebar.isMobile) sidebar.setOpenMobile(false);
                        }}
                      >
                        {item.icon}
                        <span>{t(item.label)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="p-4 text-xs text-muted-foreground">
          <span>new-api · QuantumNous</span>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="bg-background/95 sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">
            {t(props.menu.find((item) => item.href === props.currentPath)?.label ?? "Details")}
          </span>
          <div className="ms-auto flex items-center gap-2">
            {props.header}
            <NativeSelect
              aria-label={t("Language")}
              value={i18n.language}
              onChange={(e) => void i18n.changeLanguage(e.target.value)}
              className="w-28"
            >
              {adminLanguages.map((lang) => (
                <NativeSelectOption key={lang.value} value={lang.value}>
                  {lang.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <ThemeSwitch />
            <ConfigDrawer />
          </div>
        </header>
        <div
          id="content"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"
        >
          {props.children}
        </div>
        <footer className="bg-background sticky bottom-0 z-10 has-[>div:empty]:hidden border-t px-4 py-3 sm:px-6">
          <div ref={setFooter} />
          {props.footer}
        </footer>
      </SidebarInset>
    </PageFooterProvider>
  );
}
