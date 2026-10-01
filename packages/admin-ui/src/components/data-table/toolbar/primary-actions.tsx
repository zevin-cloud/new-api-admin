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
import { useId, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";

export interface DataTableActionToggle {
  id: string;
  label: string;
  icon?: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Responsive version of the original ChannelsPrimaryButtons, without business stores. */
export function DataTablePrimaryActions(props: {
  toggles: DataTableActionToggle[];
  children?: ReactNode;
  moreActions?: ReactNode;
}) {
  const { t } = useTranslation("admin-ui");
  const prefix = useId();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {props.toggles.map((toggle) => (
        <div
          key={toggle.id}
          className="hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:flex"
        >
          <span aria-hidden="true" className="text-muted-foreground [&>svg]:size-4">
            {toggle.icon}
          </span>
          <Label htmlFor={`${prefix}-${toggle.id}`} className="cursor-pointer text-sm">
            {toggle.label}
          </Label>
          <Switch
            id={`${prefix}-${toggle.id}`}
            checked={toggle.checked}
            disabled={toggle.disabled}
            onCheckedChange={toggle.onCheckedChange}
          />
        </div>
      ))}
      {props.children}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t("More actions")}
              className={props.moreActions ? undefined : "sm:hidden"}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup className="sm:hidden">
            {props.toggles.map((toggle) => (
              <DropdownMenuCheckboxItem
                key={toggle.id}
                checked={toggle.checked}
                disabled={toggle.disabled}
                onCheckedChange={toggle.onCheckedChange}
              >
                {toggle.icon}
                {toggle.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          {props.moreActions && (
            <>
              <DropdownMenuSeparator className="sm:hidden" />
              <DropdownMenuGroup>{props.moreActions}</DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
