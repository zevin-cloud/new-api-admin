import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CopyButton, ErrorState, LoadingState, JsonCodeEditor } from "new-api-admin-ui";
import { StaticDataTable } from "new-api-admin-ui/data-table";
import { Button } from "new-api-admin-ui/ui/button";
import { Badge } from "new-api-admin-ui/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "new-api-admin-ui/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "new-api-admin-ui/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "new-api-admin-ui/ui/sheet";
import { Progress } from "new-api-admin-ui/ui/progress";
import { toIntlLocale, formatNumber } from "new-api-admin-ui/utils";
import { PageHeading, useDemo } from "../../components/demo-controls";
import { projectService } from "./service";
import { FormOverlay } from "./form-overlay";
export function ProjectDetail(props: {
  id: string;
  navigate: (href: string) => void;
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const { mode } = useDemo();
  const [editing, setEditing] = useState(false);
  const locale = toIntlLocale(i18n.language);
  const query = useQuery({
    queryKey: ["projects", "detail", props.id, mode],
    queryFn: () => projectService.get(props.id, mode),
  });
  if (query.isPending || mode === "loading") return <LoadingState />;
  if (query.isError || !query.data)
    return (
      <ErrorState
        title={t(query.error?.message ?? "Record not found")}
        onRetry={() => void query.refetch()}
      />
    );
  const project = query.data;
  return (
    <div className="space-y-6">
      {!props.compact && (
        <PageHeading
          title="Project details"
          actions={
            <Button variant="outline" onClick={() => props.navigate("/projects")}>
              {t("Back to list")}
            </Button>
          }
        />
      )}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <CardTitle role="heading" aria-level={2} className="text-xl">
                {project.name}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                {project.id}
                <CopyButton value={project.id} />
                <Badge>{t(project.status)}</Badge>
              </CardDescription>
            </div>
            <Button
              disabled={mode === "readonly" || mode === "disabled"}
              onClick={() => setEditing(true)}
            >
              {t("Edit")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Members", value: formatNumber(project.members.length, locale) },
          { label: "Capacity", value: formatNumber(project.capacity, locale) },
          { label: "Progress", value: `${project.progress}%` },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{t(item.label)}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="related">{t("Related records")}</TabsTrigger>
          <TabsTrigger value="history">{t("Activity")}</TabsTrigger>
          <TabsTrigger value="raw">{t("Raw data")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{t("Basic information")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                {[
                  { label: "Owner", value: project.owner },
                  { label: "Email", value: project.email },
                  { label: "Priority", value: t(project.priority) },
                  {
                    label: "Updated at",
                    value: new Date(project.updatedAt).toLocaleString(locale),
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-muted-foreground">{t(item.label)}</dt>
                    <dd className="mt-1 break-words text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Progress className="mt-6" value={project.progress} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="related">
          <StaticDataTable
            data={project.milestones}
            columns={[
              { id: "title", header: t("Milestone"), cell: (item) => item.title },
              {
                id: "done",
                header: t("Status"),
                cell: (item) => (
                  <Badge variant="outline">{t(item.done ? "Completed" : "Pending")}</Badge>
                ),
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t("Activity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {project.history.map((event, index) => (
                  <li
                    key={`${event.at}-${index}`}
                    className="flex justify-between gap-4 border-s-2 ps-4 text-sm"
                  >
                    <span>{t(event.action)}</span>
                    <time className="text-muted-foreground">
                      {new Date(event.at).toLocaleString(locale)}
                    </time>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle>{t("Raw data")}</CardTitle>
              <CopyButton value={JSON.stringify(project, null, 2)} />
            </CardHeader>
            <CardContent>
              <JsonCodeEditor
                value={JSON.stringify(project, null, 2)}
                onChange={() => {}}
                disabled
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {editing && (
        <FormOverlay variant="drawer" project={project} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}
export function DetailDrawer(props: {
  id: string;
  onClose: () => void;
  navigate: (href: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{t("Project details")}</SheetTitle>
          <SheetDescription>{t("Quick view")}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6 sm:px-6">
          <ProjectDetail id={props.id} navigate={props.navigate} compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
