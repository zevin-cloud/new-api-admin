import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Folder, Users, CircleCheck, Activity } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "new-api-admin-ui/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "new-api-admin-ui/ui/card";
import { Button } from "new-api-admin-ui/ui/button";
import { Badge } from "new-api-admin-ui/ui/badge";
import { ErrorState, LoadingState, EmptyState } from "new-api-admin-ui";
import { StaticDataTable } from "new-api-admin-ui/data-table";
import { formatNumber, toIntlLocale } from "new-api-admin-ui/utils";
import { PageHeading, useDemo } from "../components/demo-controls";
import { projectService } from "./projects/service";
const trend = [
  { day: "Mon", value: 18 },
  { day: "Tue", value: 32 },
  { day: "Wed", value: 26 },
  { day: "Thu", value: 48 },
  { day: "Fri", value: 39 },
  { day: "Sat", value: 62 },
  { day: "Sun", value: 72 },
];
export function Overview(props: { navigate: (href: string) => void }) {
  const { t, i18n } = useTranslation();
  const { mode } = useDemo();
  const query = useQuery({
    queryKey: ["projects", "list", mode],
    queryFn: () => projectService.list({}, mode),
  });
  const locale = toIntlLocale(i18n.language);
  if (query.isPending || mode === "loading") return <LoadingState />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;
  const items = query.data.items;
  const distribution = ["Active", "Draft", "Archived"].map((status, index) => ({
    name: t(status),
    value: items.filter((p) => p.status === status).length,
    fill: `var(--chart-${index + 1})`,
  }));
  return (
    <>
      <PageHeading
        title="Overview"
        description="Your workspace at a glance. All figures use demo data."
        actions={
          <Button onClick={() => props.navigate("/projects")}>
            {t("View projects")}
            <ArrowUpRight />
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Projects", value: items.length, icon: Folder },
          {
            title: "Active",
            value: items.filter((p) => p.status === "Active").length,
            icon: Activity,
          },
          { title: "Members", value: new Set(items.flatMap((p) => p.members)).size, icon: Users },
          {
            title: "Completed",
            value: items.filter((p) => p.progress === 100).length,
            icon: CircleCheck,
          },
        ].map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex-row items-center justify-between">
              <CardDescription>{t(metric.title)}</CardDescription>
              <metric.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {formatNumber(metric.value, locale)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t("Demo data")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("Activity trend")}</CardTitle>
            <CardDescription>{t("Sample weekly activity")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: t("Activity"), color: "var(--chart-1)" } }}
              className="h-64 w-full"
            >
              <AreaChart data={items.length ? trend : []}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickFormatter={(day) => t(day)} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Status distribution")}</CardTitle>
            <CardDescription>{t("Current projects")}</CardDescription>
          </CardHeader>
          <CardContent>
            {items.length ? (
              <ChartContainer config={{ value: { label: t("Projects") } }} className="h-64 w-full">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                  >
                    {distribution.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <EmptyState />
            )}
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {distribution.map((item) => (
                <span key={item.name}>
                  {item.name} · {item.value}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{t("Recent projects")}</CardTitle>
          <Button variant="ghost" onClick={() => props.navigate("/projects")}>
            {t("View all")}
            <ArrowUpRight />
          </Button>
        </CardHeader>
        <CardContent>
          <StaticDataTable
            data={items.slice(0, 5)}
            columns={[
              {
                id: "name",
                header: t("Name"),
                cell: (item) => (
                  <Button variant="link" onClick={() => props.navigate(`/projects/${item.id}`)}>
                    {item.name}
                  </Button>
                ),
              },
              { id: "owner", header: t("Owner"), cell: (item) => item.owner },
              {
                id: "status",
                header: t("Status"),
                cell: (item) => <Badge variant="secondary">{t(item.status)}</Badge>,
              },
              { id: "progress", header: t("Progress"), cell: (item) => `${item.progress}%` },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}
