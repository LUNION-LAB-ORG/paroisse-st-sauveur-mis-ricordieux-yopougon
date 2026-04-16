"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const messages = [
  "Chargement des donnees...",
  "Le chargement prend plus de temps que prevu...",
  "Toujours en cours de chargement...",
  "Le chargement a pris trop de temps, verifier votre connexion",
  "Un probleme technique est survenu, revenez plus tard",
];

export interface MorphingSquareProps {
  messagePlacement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function MorphingSquare({
  className,
  messagePlacement = "right",
}: MorphingSquareProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setMessageIndex(1), 5000),
      setTimeout(() => setMessageIndex(2), 10000),
      setTimeout(() => setMessageIndex(3), 15000),
      setTimeout(() => setMessageIndex(4), 20000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const placementClasses = {
    bottom: "flex-col",
    top: "flex-col-reverse",
    right: "flex-row",
    left: "flex-row-reverse",
  };

  return (
    <div
      className={cn(
        "flex gap-3 items-center justify-center",
        placementClasses[messagePlacement]
      )}
    >
      <div
        className={cn(
          "w-10 h-10 bg-blue-800 animate-spin rounded-md",
          className
        )}
        style={{
          animation: "morphSpin 2s ease-in-out infinite",
        }}
      />

      <div className="text-base font-semibold text-primary">
        {messages[messageIndex]}
      </div>

      <style jsx>{`
        @keyframes morphSpin {
          0% { border-radius: 6%; transform: rotate(0deg); }
          50% { border-radius: 50%; transform: rotate(180deg); }
          100% { border-radius: 6%; transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
