import { ListChecks, Tags, SortAsc } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  DataTablePage,
  DataTablePrimaryActions,
  DataTableRowActionMenu,
  DataTableColumnHeader,
  DataTableRow,
  useDataTable,
} from "new-api-admin-ui/data-table";
import { ConfirmDialog, CopyButton, ErrorState } from "new-api-admin-ui";
import { Button } from "new-api-admin-ui/ui/button";
import { Checkbox } from "new-api-admin-ui/ui/checkbox";
import { Badge } from "new-api-admin-ui/ui/badge";
import { Progress } from "new-api-admin-ui/ui/progress";
import { TableRow, TableCell } from "new-api-admin-ui/ui/table";
import { DropdownMenuGroup, DropdownMenuItem } from "new-api-admin-ui/ui/dropdown-menu";
import { PageHeading, useDemo } from "../../components/demo-controls";
import { projectService } from "./service";
import type { Project } from "./schema";
import { ProjectBulkActions } from "./project-bulk-actions";
import { FormOverlay } from "./form-overlay";
import { DetailDrawer } from "./project-detail";
export function ProjectList(props: { navigate: (href: string) => void }) {
  const { t } = useTranslation();
  const { mode } = useDemo();
  const client = useQueryClient();
  const [overlay, setOverlay] = useState<{
    variant: "dialog" | "drawer";
    project?: Project;
  } | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [tagMode, setTagMode] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [collapsedTags, setCollapsedTags] = useState<string[]>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string[]>([]);
  const query = useQuery({
    queryKey: ["projects", "list", mode],
    queryFn: () => projectService.list({}, mode),
  });
  const disabled = mode === "readonly" || mode === "disabled";
  const remove = useMutation({
    mutationFn: () => projectService.remove(deleting, mode),
    onSuccess: async () => {
      setDeleting([]);
      table.resetRowSelection();
      await client.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("Deleted successfully"));
    },
    onError: (error) => toast.error(t(error.message)),
  });
  const columns = useMemo<ColumnDef<Project, unknown>[]>(
    () => [
      { accessorKey: "id", enableHiding: false },
      { id: "primaryTag", accessorFn: (project) => project.tags[0] ?? "", enableHiding: false },
      {
        id: "select",
        meta: { mobileHidden: true },
        size: 44,
        enableHiding: false,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            aria-label={t("Select all")}
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            disabled={disabled}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`${t("Select")} ${row.original.name}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={disabled}
          />
        ),
      },
      {
        id: "expand",
        meta: { mobileHidden: true },
        size: 40,
        enableHiding: false,
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            aria-label={`${t("Expand")} ${row.original.name}`}
            aria-expanded={row.getIsExpanded()}
            variant="ghost"
            size="icon"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </Button>
        ),
      },
      {
        accessorKey: "name",
        meta: { mobileTitle: true, label: t("Name") },
        size: 260,
        minSize: 180,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("Name")} />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <Button
              variant="link"
              className="h-auto max-w-full justify-start truncate p-0 text-start"
              onClick={() => props.navigate(`/projects/${row.original.id}`)}
            >
              {row.original.name}
            </Button>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {row.original.id}
              <CopyButton value={row.original.id} className="size-5" />
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        meta: { mobileBadge: true, label: t("Status") },
        size: 120,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("Status")} />,
        filterFn: (row, id, value: string[]) => !value.length || value.includes(row.getValue(id)),
        cell: ({ row }) => (
          <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
            {t(row.original.enabled ? row.original.status : "Disabled")}
          </Badge>
        ),
      },
      {
        accessorKey: "priority",
        meta: { label: t("Priority") },
        size: 110,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("Priority")} />,
        filterFn: (row, id, value: string[]) => !value.length || value.includes(row.getValue(id)),
        cell: ({ row }) => t(row.original.priority),
      },
      {
        accessorKey: "owner",
        meta: { label: t("Owner") },
        size: 120,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("Owner")} />,
      },
      {
        accessorKey: "tags",
        size: 180,
        header: t("Tags"),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "progress",
        size: 140,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("Progress")} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.progress} className="w-16" />
            <span className="text-xs tabular-nums">{row.original.progress}%</span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        size: 260,
        header: t("Description"),
        cell: ({ row }) => (
          <p title={row.original.description} className="max-w-60 truncate text-muted-foreground">
            {row.original.description}
          </p>
        ),
      },
      {
        id: "actions",
        meta: { label: t("Actions") },
        size: 64,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <DataTableRowActionMenu ariaLabel={`${t("Actions")} ${row.original.name}`}>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setDetail(row.original.id)}>
                {t("Quick view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => props.navigate(`/projects/${row.original.id}`)}>
                {t("Details")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={disabled}
                onClick={() => setOverlay({ variant: "drawer", project: row.original })}
              >
                {t("Edit in drawer")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={disabled}
                onClick={() => setOverlay({ variant: "dialog", project: row.original })}
              >
                {t("Edit in dialog")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled={disabled} onClick={() => setDeleting([row.original.id])}>
                {t("Delete")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DataTableRowActionMenu>
        ),
      },
    ],
    [t, disabled, props.navigate],
  );
  const visibleColumns = useMemo(
    () => columns.filter((column) => column.id !== "select" || batchMode),
    [columns, batchMode],
  );
  const effectiveSorting = useMemo(
    () => (tagMode ? [{ id: "primaryTag", desc: false }, ...sorting] : sorting),
    [tagMode, sorting],
  );
  const { table } = useDataTable({
    data: query.data?.items ?? [],
    columns: visibleColumns,
    initialColumnVisibility: { id: false, primaryTag: false },
    sorting: effectiveSorting,
    onSortingChange: (updater) => {
      const current = tagMode ? [{ id: "primaryTag", desc: false }, ...sorting] : sorting;
      const next = typeof updater === "function" ? updater(current) : updater;
      setSorting(next.filter((item) => item.id !== "primaryTag"));
    },
    withFilteredRowModel: true,
    withSortedRowModel: true,
    withPaginationRowModel: true,
    withFacetedRowModel: true,
    withExpandedRowModel: true,
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
    enableRowSelection: batchMode && !disabled,
    enableColumnResizing: true,
    initialPagination: { pageIndex: 0, pageSize: 10 },
    columnVisibilityStorageKey: "new-api-admin:projects:columns",
    columnSizingStorageKey: "new-api-admin:projects:sizing",
  });
  return (
    <>
      <PageHeading
        title="Projects"
        actions={
          <DataTablePrimaryActions
            toggles={[
              {
                id: "batch",
                label: t("Batch Operations"),
                icon: <ListChecks />,
                checked: batchMode,
                disabled,
                onCheckedChange: (checked) => {
                  setBatchMode(checked);
                  table.resetRowSelection();
                },
              },
              {
                id: "tags",
                label: t("Tag Mode"),
                icon: <Tags />,
                checked: tagMode,
                onCheckedChange: (checked) => {
                  setTagMode(checked);
                  setCollapsedTags([]);
                  table.setPageIndex(0);
                },
              },
              {
                id: "id",
                label: t("Sort by ID"),
                icon: <SortAsc />,
                checked: sorting.some((item) => item.id === "id"),
                onCheckedChange: (checked) => {
                  setSorting(checked ? [{ id: "id", desc: true }] : []);
                  table.setPageIndex(0);
                },
              },
            ]}
            moreActions={
              <>
                <DropdownMenuItem onClick={() => void query.refetch()}>
                  <RefreshCw />
                  {t("Refresh")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={disabled}
                  onClick={() => setOverlay({ variant: "dialog" })}
                >
                  {t("Create in dialog")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={disabled}
                  onClick={() => setOverlay({ variant: "drawer" })}
                >
                  {t("Create in drawer")}
                </DropdownMenuItem>
              </>
            }
          >
            <Button disabled={disabled} onClick={() => props.navigate("/forms")}>
              <Plus />
              {t("Create project")}
            </Button>
          </DataTablePrimaryActions>
        }
      />
      <p className="text-sm text-muted-foreground">
        {t("A complete list example. Keep the columns and actions your business needs.")}
      </p>
      {tagMode && (
        <p className="text-sm text-muted-foreground">
          {t("Grouped by the first tag. Counts refer to this page.")}
        </p>
      )}
      {query.isError ? (
        <ErrorState title={t("Request failed")} onRetry={() => void query.refetch()} />
      ) : (
        <DataTablePage
          table={table}
          columns={visibleColumns}
          isLoading={query.isPending || mode === "loading"}
          isFetching={query.isFetching && !query.isPending}
          enableCardView={!tagMode}
          hideMobile={tagMode}
          showMobileBulkActions={batchMode}
          mobileProps={{ enableRowSelection: batchMode }}
          defaultViewMode="table"
          viewModeStorageKey="new-api-admin:projects:view"
          pinnedColumns={[
            ...(batchMode ? [{ columnId: "select", side: "left" as const }] : []),
            { columnId: "actions", side: "right" },
          ]}
          toolbarProps={{
            searchPlaceholder: t("Search projects..."),
            searchKey: "name",
            filters: [
              {
                columnId: "status",
                title: t("Status"),
                options: ["Active", "Draft", "Archived"].map((value) => ({
                  value,
                  label: t(value),
                })),
              },
              {
                columnId: "priority",
                title: t("Priority"),
                options: ["Low", "Medium", "High"].map((value) => ({ value, label: t(value) })),
              },
            ],
            leftActions: (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => setOverlay({ variant: "dialog" })}
                >
                  {t("Create in dialog")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => setOverlay({ variant: "drawer" })}
                >
                  {t("Create in drawer")}
                </Button>
              </>
            ),
          }}
          bulkActions={
            batchMode && (
              <ProjectBulkActions
                table={table}
                mode={mode}
                deleting={remove.isPending}
                onDelete={setDeleting}
              />
            )
          }
          renderRow={(row, helpers) => {
            const tag = row.original.tags[0] ?? "";
            const rows = table.getRowModel().rows;
            const index = rows.findIndex((item) => item.id === row.id);
            const firstInGroup =
              index === 0 || rows[index - 1].original.tags[0] !== row.original.tags[0];
            const collapsed = tagMode && collapsedTags.includes(tag);
            return (
              <Fragment key={row.id}>
                {tagMode && firstInGroup && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={row.getVisibleCells().length}>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                        aria-expanded={!collapsed}
                        onClick={() =>
                          setCollapsedTags((previous) =>
                            previous.includes(tag)
                              ? previous.filter((item) => item !== tag)
                              : [...previous, tag],
                          )
                        }
                      >
                        {collapsed ? <ChevronRight /> : <ChevronDown />}
                        <Tags />
                        {tag || t("Untagged")}
                        <Badge variant="secondary">
                          {rows.filter((item) => (item.original.tags[0] ?? "") === tag).length}
                        </Badge>
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
                {!collapsed && (
                  <>
                    <DataTableRow row={row} getColumnClassName={helpers.getCellClassName} />
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <div className="space-y-3 p-4 text-sm">
                            <p>{row.original.description}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDetail(row.original.id)}
                            >
                              {t("Quick view")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </Fragment>
            );
          }}
        />
      )}
      <ConfirmDialog
        open={deleting.length > 0}
        onOpenChange={(open) => {
          if (!open && !remove.isPending) setDeleting([]);
        }}
        title={t("Delete selected records?")}
        desc={t("This action removes the selected demo records.")}
        destructive
        isLoading={remove.isPending}
        handleConfirm={() => remove.mutate()}
      />
      {overlay && <FormOverlay {...overlay} onClose={() => setOverlay(null)} />}
      {detail && (
        <DetailDrawer id={detail} onClose={() => setDetail(null)} navigate={props.navigate} />
      )}
    </>
  );
}
