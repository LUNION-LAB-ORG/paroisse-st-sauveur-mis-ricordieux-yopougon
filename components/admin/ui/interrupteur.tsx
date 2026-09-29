"use client";

import { Switch } from "@heroui/react";

import { cn } from "@/lib/utils";

/** Interrupteur (« Publié sur le site », envois automatiques…). */
export function Interrupteur({
  valeur,
  onChange,
  children,
  isDisabled,
  className,
}: {
  valeur: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}) {
  return (
    <Switch
      className={cn(
        "group flex items-center gap-2.5 text-sm font-semibold text-encre",
        className,
      )}
      isDisabled={isDisabled}
      isSelected={valeur}
      onChange={onChange}
    >
      <Switch.Control className="h-6 w-10 rounded-full bg-champ transition-colors group-data-[selected=true]:bg-succes">
        <Switch.Thumb className="size-5 rounded-full bg-white shadow" />
      </Switch.Control>
      <Switch.Content>{children}</Switch.Content>
    </Switch>
  );
}
