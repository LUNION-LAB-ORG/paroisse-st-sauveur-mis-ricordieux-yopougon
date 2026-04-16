"use client";

import { useState } from "react";
import Cures from "./cures";
import CardHistoire from "./cardHistoire";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Pastor } from "@/features/cure/types/cure.type";

const listButton = [
  { label: "Notre Histoire", value: "NotreHistoire" },
  { label: "Nos Cures", value: "NosCures" },
];

export default function ToggleBody({ cure }: { cure: Pastor[] }) {
  const [table, setTable] = useState("NotreHistoire");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div
        role="tablist"
        className="flex justify-center flex-wrap gap-4 lg:gap-10 bg-blue-50 py-6 px-4 rounded-lg mb-10 shadow-sm"
      >
        {listButton.map((item, index) => {
          const isActive = table === item.value;

          return (
            <button
              key={index}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTable(item.value)}
              className={`text-lg lg:text-xl font-semibold px-6 py-3 rounded-full transition-all duration-300
              ${
                isActive
                  ? "bg-blue-900 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Content with CSS transition */}
      <div className="max-w-7xl mx-auto px-4 mb-16 relative min-h-[300px] overflow-hidden">
        <div
          key={table}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {table === "NotreHistoire" ? <CardHistoire /> : <Cures cure={cure} />}
        </div>
      </div>
    </div>
  );
}
