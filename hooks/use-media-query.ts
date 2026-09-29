import * as React from "react";

/** Vrai si la media query correspond (false au rendu serveur). */
export function useMediaQuery(query: string) {
  const [correspond, setCorrespond] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setCorrespond(mql.matches);

    onChange();
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return correspond;
}

/** Point de rupture « lg » de Tailwind (1024 px) : mise en page desktop du site public. */
export const useEstDesktop = () => useMediaQuery("(min-width: 1024px)");
