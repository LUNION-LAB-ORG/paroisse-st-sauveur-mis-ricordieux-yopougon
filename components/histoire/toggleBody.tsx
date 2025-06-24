"use client";
import { useState } from "react";

import Cures from "./cures";
import  CardHistoire from "./cardHistoire";

const listButton = [
  {
    label: "Notre Histoire",
    value: "NotreHistoire",
  },
  {
    label: "Nos Curés",
    value: "NosCurés",
  },
];

export default function ToggleBody() {
  const [table, setTable] = useState("NotreHistoire");

  const handlerTable = (value: string) => {
    setTable(value);
  };

  return (
    <div>
      {/* div btn */}

      <div className="mb-8 lg:mb-16 py-4 bg-blue-100 flex gap-10 justify-center  items-center  sm:text-xl lg:text-2xl">
        {listButton.map((item, index) => {
          return (
            <button
              key={index}
              className={`${table == item.value ? "text-white bg-blue-900" : ""} rounded-xl py-5 px-8 text-blue-800`}
              onClick={() => handlerTable(item.value)}
            >
              {`${item.label}`}
            </button>
          );
        })}
      </div>
      {/* show content toggle */}
      <div className="w-full px-4 max-w-7xl mx-auto mb-8 lg:mb-16">
        {table == "NotreHistoire" ? <CardHistoire /> : <Cures />}
      </div>
    </div>
  );
}
