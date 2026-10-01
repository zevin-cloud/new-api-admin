/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Archive, Power, PowerOff, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTableBulkActions } from "new-api-admin-ui/data-table";
import { Dialog, TagInput } from "new-api-admin-ui";
import { Button } from "new-api-admin-ui/ui/button";
import { Label } from "new-api-admin-ui/ui/label";
import { Alert, AlertDescription } from "new-api-admin-ui/ui/alert";
import { Tooltip, TooltipTrigger, TooltipContent } from "new-api-admin-ui/ui/tooltip";
import { Spinner } from "new-api-admin-ui/ui/spinner";
import { projectService, type DemoMode } from "./service";
import type { Project } from "./schema";

type BulkOperation = { ids: string[] } & (
  | { kind: "archive" }
  | { kind: "update"; changes: { enabled?: boolean; tags?: string[] } }
);

export function ProjectBulkActions(props: {
  table: Table<Project>;
  mode: DemoMode;
  deleting: boolean;
  onDelete: (ids: string[]) => void;
}) {
  const { t } = useTranslation();
  const client = useQueryClient();
  const [tagTargets, setTagTargets] = useState<string[] | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const selectedIds = props.table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);
  const operation = useMutation({
    mutationFn: (input: BulkOperation) =>
      input.kind === "archive"
        ? projectService.archive(input.ids, props.mode)
        : projectService.updateMany(input.ids, input.changes, props.mode),
    onSuccess: async () => {
      setTagTargets(null);
      props.table.resetRowSelection();
      await client.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("Saved successfully"), { position: "top-right" });
    },
    onError: (error) => toast.error(t(error.message), { position: "top-right" }),
  });
  const disabled =
    props.mode === "readonly" || props.mode === "disabled" || operation.isPending || props.deleting;
  const actions = [
    {
      label: t("Enable selected records"),
      icon: <Power />,
      run: () => operation.mutate({ kind: "update", ids: selectedIds, changes: { enabled: true } }),
    },
    {
      label: t("Disable selected records"),
      icon: <PowerOff />,
      run: () =>
        operation.mutate({ kind: "update", ids: selectedIds, changes: { enabled: false } }),
    },
    {
      label: t("Set tags"),
      icon: <Tags />,
      run: () => {
        operation.reset();
        setTags([]);
        setTagTargets(selectedIds);
      },
    },
    {
      label: t("Archive"),
      icon: <Archive />,
      run: () => operation.mutate({ kind: "archive", ids: selectedIds }),
    },
    {
      label: t("Delete"),
      icon: <Trash2 />,
      destructive: true,
      run: () => props.onDelete(selectedIds),
    },
  ];
  return (
    <>
      <DataTableBulkActions table={props.table} entityName={t("Projects")} placement="floating">
        {actions.map((action) => (
          <Tooltip key={action.label}>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant={action.destructive ? "destructive" : "outline"}
                  size="icon"
                  className="size-8"
                  disabled={disabled}
                  onClick={action.run}
                  aria-label={action.label}
                />
              }
            >
              {action.icon}
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        ))}
      </DataTableBulkActions>
      <Dialog
        open={tagTargets !== null}
        onOpenChange={(open) => {
          if (!open && !operation.isPending) setTagTargets(null);
        }}
        title={t("Set tags")}
        description={t("Replace tags on {{count}} selected records. Leave empty to clear tags.", {
          count: tagTargets?.length ?? 0,
        })}
        contentClassName="sm:max-w-lg"
        footer={
          <>
            <Button
              variant="outline"
              disabled={operation.isPending}
              onClick={() => setTagTargets(null)}
            >
              {t("Cancel")}
            </Button>
            <Button
              disabled={disabled || !tagTargets?.length}
              onClick={() =>
                operation.mutate({ kind: "update", ids: tagTargets ?? [], changes: { tags } })
              }
            >
              {operation.isPending && <Spinner />}
              {t("Save changes")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {operation.isError && (
            <Alert variant="destructive">
              <AlertDescription>{t(operation.error.message)}</AlertDescription>
            </Alert>
          )}
          <Label htmlFor="bulk-project-tags">{t("Tags")}</Label>
          <TagInput id="bulk-project-tags" value={tags} onChange={setTags} disabled={disabled} />
        </div>
      </Dialog>
    </>
  );
}
