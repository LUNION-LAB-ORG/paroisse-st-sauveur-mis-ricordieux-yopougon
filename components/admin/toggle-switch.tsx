"use client";

import { Switch } from "@heroui/react";

interface ToggleSwitchProps {
  isSelected: boolean;
  onChange: (v: boolean) => void;
  isDisabled?: boolean;
  "aria-label"?: string;
}

/**
 * Wrapper autour du Switch HeroUI v3 qui inclut la structure compound
 * (Switch.Control + Switch.Thumb) requise pour le rendu visuel.
 */
export function ToggleSwitch({
  isSelected,
  onChange,
  isDisabled,
  "aria-label": ariaLabel,
}: ToggleSwitchProps) {
  return (
    <Switch
      isSelected={isSelected}
      onChange={onChange}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
    >
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch>
  );
}
