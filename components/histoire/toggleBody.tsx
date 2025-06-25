"use client";

import { useState } from "react";
import Cures from "./cures";
import CardHistoire from "./cardHistoire";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

const listButton = [
  { label: "Notre Histoire", value: "NotreHistoire" },
  { label: "Nos Curés", value: "NosCurés" },
];

export default function ToggleBody() {
  const [table, setTable] = useState("NotreHistoire");
  const isMobile = useMediaQuery("(max-width: 767px)"); // mobile < 768px

  const fadeVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const slideVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

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

      {/* Content with conditional animation */}
      <div className="max-w-7xl mx-auto px-4 mb-16 relative min-h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={table}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={isMobile ? slideVariants : fadeVariants}
            transition={{ duration: 0.3 }}
          >
            {table === "NotreHistoire" ? <CardHistoire /> : <Cures />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
