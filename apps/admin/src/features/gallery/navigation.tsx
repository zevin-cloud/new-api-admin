import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { TitledCard } from "new-api-admin-ui/ui/titled-card";
import { Button } from "new-api-admin-ui/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "new-api-admin-ui/ui/breadcrumb";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "new-api-admin-ui/ui/command";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
} from "new-api-admin-ui/ui/context-menu";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarSeparator,
} from "new-api-admin-ui/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "new-api-admin-ui/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "new-api-admin-ui/ui/pagination";
export function NavigationGallery(props: { navigate: (href: string) => void }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TitledCard title={t("Breadcrumbs and menus")}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Button variant="link" onClick={() => props.navigate("/")} />}
              >
                {t("Home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Components")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Menubar className="mt-6">
          <MenubarMenu>
            <MenubarTrigger>{t("File")}</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem onClick={() => props.navigate("/forms")}>{t("New")}</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => toast(t("Saved successfully"))}>
                  {t("Save")}
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>{t("View")}</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem onClick={() => props.navigate("/projects")}>
                  {t("Projects")}
                </MenubarItem>
                <MenubarItem onClick={() => props.navigate("/settings")}>
                  {t("Settings")}
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </TitledCard>
      <TitledCard title={t("Navigation menu")}>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>{t("Examples")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink onClick={() => props.navigate("/projects")}>
                  {t("Projects")}
                </NavigationMenuLink>
                <NavigationMenuLink onClick={() => props.navigate("/forms")}>
                  {t("Complete form")}
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </TitledCard>
      <TitledCard title={t("Command search")}>
        <Command className="rounded-lg border">
          <CommandInput placeholder={t("Search...")} />
          <CommandList>
            <CommandEmpty>{t("No results found.")}</CommandEmpty>
            <CommandGroup heading={t("Examples")}>
              {[
                { label: "Overview", path: "/" },
                { label: "Projects", path: "/projects" },
                { label: "Complete form", path: "/forms" },
              ].map((item) => (
                <CommandItem key={item.path} onSelect={() => props.navigate(item.path)}>
                  {t(item.label)}
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </TitledCard>
      <TitledCard title={t("Context menu")}>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            {t("Right-click here")}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuItem onClick={() => toast(t("Action completed"))}>
                {t("Copy")}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => props.navigate("/forms")}>
                {t("Edit")}
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </TitledCard>
      <TitledCard title={t("Pagination")}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
            </PaginationItem>
            {[1, 2, 3].map((value) => (
              <PaginationItem key={value}>
                <PaginationLink isActive={page === value} onClick={() => setPage(value)}>
                  {value}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => setPage(Math.min(3, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("Page")} {page}
        </p>
      </TitledCard>
    </div>
  );
}
