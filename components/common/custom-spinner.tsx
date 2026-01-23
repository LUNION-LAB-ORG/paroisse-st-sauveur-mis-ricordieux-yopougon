// components/CustomSpinner.tsx
"use client";

import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";

const CustomSpinner = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000); // 10 secondes

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <Audio
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="loading-spinner"
      />

      {showMessage && (
        <p className="text-sm text-muted-foreground">
          Le chargement prend plus de temps que prévu…
        </p>
      )}
    </div>
  );
};

export default CustomSpinner;
