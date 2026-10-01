import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  useRouterState,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Table2,
  ListChecks,
  PanelsTopLeft,
  PanelRight,
  FileText,
  Settings,
  Blocks,
} from "lucide-react";
import { AdminProvider, AdminLayout, LoadingState, ErrorState, SkipToMain } from "new-api-admin-ui";
import { DemoProvider, DemoControls } from "./components/demo-controls";
import "./styles.css";
const Overview = lazy(() => import("./features/overview").then((m) => ({ default: m.Overview })));
const Projects = lazy(() =>
  import("./features/projects/project-list").then((m) => ({ default: m.ProjectList })),
);
const FormPage = lazy(() =>
  import("./features/projects/form-page").then((m) => ({ default: m.FormPage })),
);
const Detail = lazy(() =>
  import("./features/projects/project-detail").then((m) => ({ default: m.ProjectDetail })),
);
const SettingsPage = lazy(() =>
  import("./features/settings/settings-page").then((m) => ({ default: m.SettingsPage })),
);
const Gallery = lazy(() =>
  import("./features/gallery/gallery-page").then((m) => ({ default: m.GalleryPage })),
);
const menu = [
  { label: "Overview", href: "/", icon: <LayoutDashboard />, group: "Workspace" },
  { label: "Projects", href: "/projects", icon: <Table2 />, group: "Page examples" },
  { label: "Complete form", href: "/forms", icon: <ListChecks />, group: "Page examples" },
  { label: "Dialog form", href: "/forms/dialog", icon: <PanelsTopLeft />, group: "Page examples" },
  { label: "Drawer form", href: "/forms/drawer", icon: <PanelRight />, group: "Page examples" },
  {
    label: "Project details",
    href: "/projects/PRJ-001",
    icon: <FileText />,
    group: "Page examples",
  },
  { label: "Settings", href: "/settings", icon: <Settings />, group: "Workspace" },
  { label: "Components", href: "/components", icon: <Blocks />, group: "Library" },
];
function Shell() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  return (
    <DemoProvider>
      <SkipToMain />
      <AdminLayout
        menu={menu}
        currentPath={path}
        onNavigate={(href) => void navigate({ to: href })}
      >
        <DemoControls />
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </AdminLayout>
    </DemoProvider>
  );
}
function Page(props: {
  kind: "overview" | "projects" | "form" | "dialog" | "drawer" | "detail" | "settings" | "gallery";
}) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const go = React.useCallback(
    (href: string) => {
      void navigate({ to: href });
    },
    [navigate],
  );
  switch (props.kind) {
    case "overview":
      return <Overview navigate={go} />;
    case "projects":
      return <Projects navigate={go} />;
    case "form":
      return <FormPage navigate={go} />;
    case "dialog":
      return <FormPage navigate={go} variant="dialog" />;
    case "drawer":
      return <FormPage navigate={go} variant="drawer" />;
    case "detail":
      return <Detail id={params.id ?? "PRJ-001"} navigate={go} />;
    case "settings":
      return <SettingsPage />;
    case "gallery":
      return <Gallery navigate={go} />;
  }
}
const rootRoute = createRootRoute({
  component: Shell,
  errorComponent: ({ reset }) => <ErrorState onRetry={reset} />,
  notFoundComponent: () => <ErrorState title="404" />,
});
const paths = [
  ["/", "overview"],
  ["/projects", "projects"],
  ["/forms", "form"],
  ["/forms/dialog", "dialog"],
  ["/forms/drawer", "drawer"],
  ["/projects/$id", "detail"],
  ["/settings", "settings"],
  ["/components", "gallery"],
] as const;
const router = createRouter({
  routeTree: rootRoute.addChildren(
    paths.map(([path, kind]) =>
      createRoute({ getParentRoute: () => rootRoute, path, component: () => <Page kind={kind} /> }),
    ),
  ),
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AdminProvider>
  </React.StrictMode>,
);
