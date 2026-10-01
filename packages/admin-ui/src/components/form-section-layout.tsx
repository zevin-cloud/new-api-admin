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
import { useId, useRef, useState, type ReactNode } from "react";
import { Check, CircleAlert, CircleDashed } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export interface FormSectionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  status: "incomplete" | "complete" | "error";
}

/** Section metadata describes navigation only; fields and validation stay in the page. */
export function FormSectionLayout(props: {
  sections: FormSectionItem[];
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation("admin-ui");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | undefined>(props.sections[0]?.id);
  const labelId = useId();
  return (
    <div
      ref={scrollRef}
      className={cn(
        "grid min-h-0 min-w-0 grid-cols-1 flex-1 items-start gap-6 overflow-y-auto overscroll-contain p-1 md:grid-cols-[15rem_minmax(0,1fr)]",
        props.className,
      )}
      onScroll={(event) => {
        const root = event.currentTarget;
        const top = root.getBoundingClientRect().top;
        let next: string | undefined = props.sections[0]?.id;
        for (const section of props.sections) {
          const target = document.getElementById(section.id);
          if (target && root.contains(target) && target.getBoundingClientRect().top <= top + 48)
            next = section.id;
        }
        if (
          root.scrollHeight > root.clientHeight &&
          root.scrollTop + root.clientHeight >= root.scrollHeight - 2
        )
          next = props.sections.at(-1)?.id;
        setActive(next);
      }}
    >
      <aside className="min-w-0 space-y-4 md:sticky md:top-0">
        {props.summary && <div className="rounded-xl border bg-card p-4">{props.summary}</div>}
        <nav aria-labelledby={labelId} className="min-w-0 rounded-xl border bg-background p-1.5">
          <span id={labelId} className="sr-only">
            {t("Form sections")}
          </span>
          <div className="flex gap-1 overflow-x-auto md:flex-col">
            {props.sections.map((section) => {
              let label = t("Incomplete");
              let StatusIcon = CircleDashed;
              let color = "text-muted-foreground";
              if (section.status === "complete") {
                label = t("Completed");
                StatusIcon = Check;
                color = "text-success";
              }
              if (section.status === "error") {
                label = t("Error");
                StatusIcon = CircleAlert;
                color = "text-destructive";
              }
              return (
                <Button
                  key={section.id}
                  type="button"
                  variant="ghost"
                  aria-label={`${section.label}: ${label}`}
                  aria-current={active === section.id ? "location" : undefined}
                  aria-controls={section.id}
                  className={cn(
                    "h-auto shrink-0 justify-start gap-3 rounded-lg px-3 py-3 text-start md:w-full md:whitespace-normal",
                    active === section.id && "bg-accent",
                  )}
                  onClick={() => {
                    const target = document.getElementById(section.id);
                    const root = scrollRef.current;
                    if (!root || !target || !root.contains(target)) return;
                    setActive(section.id);
                    root.scrollTo({
                      top:
                        root.scrollTop +
                        target.getBoundingClientRect().top -
                        root.getBoundingClientRect().top -
                        8,
                      behavior: "instant",
                    });
                    target.focus({ preventScroll: true });
                  }}
                >
                  {section.icon && (
                    <span
                      className="rounded-full bg-primary/5 p-2 text-primary [&>svg]:size-4"
                      aria-hidden="true"
                    >
                      {section.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{section.label}</span>
                    <span className={cn("mt-1 block text-xs font-normal", color)}>{label}</span>
                  </span>
                  <StatusIcon aria-hidden="true" className={cn("size-4 shrink-0", color)} />
                </Button>
              );
            })}
          </div>
        </nav>
      </aside>
      <div className="min-w-0 space-y-6">{props.children}</div>
    </div>
  );
}

export function FormSection(props: { id: string; label: string; children: ReactNode }) {
  return (
    <section
      id={props.id}
      aria-label={props.label}
      tabIndex={-1}
      className="scroll-mt-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {props.children}
    </section>
  );
}
