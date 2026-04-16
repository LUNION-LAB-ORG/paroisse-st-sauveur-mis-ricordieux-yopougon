"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

const CustomSpinner = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />

      {showMessage && (
        <p className="text-sm text-muted-foreground">
          Le chargement prend plus de temps que prevu...
        </p>
      )}
    </div>
  );
};

export default CustomSpinner;
