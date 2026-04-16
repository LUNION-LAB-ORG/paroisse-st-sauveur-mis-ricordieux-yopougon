"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={clsx(
        "p-2 rounded-lg transition-opacity hover:opacity-80 cursor-pointer",
        className
      )}
    >
      {isLight ? <MoonFilledIcon size={20} /> : <SunFilledIcon size={20} />}
    </button>
  );
};
