import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "new-api-admin-ui/ui/tabs";
import { LoadingState } from "new-api-admin-ui";
import { PageHeading } from "../../components/demo-controls";
const Basic = lazy(() => import("./basic").then((m) => ({ default: m.BasicGallery })));
const Feedback = lazy(() => import("./feedback").then((m) => ({ default: m.FeedbackGallery })));
const Navigation = lazy(() =>
  import("./navigation").then((m) => ({ default: m.NavigationGallery })),
);
const Content = lazy(() => import("./content").then((m) => ({ default: m.ContentGallery })));
export function GalleryPage(props: { navigate: (href: string) => void }) {
  const { t } = useTranslation();
  return (
    <>
      <PageHeading
        title="Components"
        description="Interactive examples of the shared component library."
      />
      <Tabs defaultValue="basic">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="basic">{t("Basic components")}</TabsTrigger>
          <TabsTrigger value="feedback">{t("Feedback and overlays")}</TabsTrigger>
          <TabsTrigger value="navigation">{t("Navigation")}</TabsTrigger>
          <TabsTrigger value="content">{t("Content and layout")}</TabsTrigger>
        </TabsList>
        <Suspense fallback={<LoadingState />}>
          <TabsContent value="basic">
            <Basic />
          </TabsContent>
          <TabsContent value="feedback">
            <Feedback />
          </TabsContent>
          <TabsContent value="navigation">
            <Navigation navigate={props.navigate} />
          </TabsContent>
          <TabsContent value="content">
            <Content navigate={props.navigate} />
          </TabsContent>
        </Suspense>
      </Tabs>
    </>
  );
}
