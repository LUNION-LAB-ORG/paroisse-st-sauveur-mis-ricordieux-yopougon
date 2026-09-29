/** Pictogrammes de la maquette (cœur, bulle, guillemets, lecture). */
export function Coeur({
  plein = false,
  className = "size-[18px]",
}: {
  plein?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill={plein ? "#B71C3A" : "none"}
      stroke="#B71C3A"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function Bulle({
  className = "size-[18px]",
  couleur = "#5A5A66",
}: {
  className?: string;
  couleur?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke={couleur}
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );
}

export function Guillemets({
  className = "size-[34px]",
}: {
  className?: string;
}) {
  return (
    <svg aria-hidden className={className} fill="#6CC0F5" viewBox="0 0 24 24">
      <path d="M4 18h6v-6H6c0-2.2 1.8-4 4-4V6c-3.3 0-6 2.7-6 6v6zm10 0h6v-6h-4c0-2.2 1.8-4 4-4V6c-3.3 0-6 2.7-6 6v6z" />
    </svg>
  );
}

export function Lecture({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="#2B337E" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function Photos({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="14" rx="1" width="18" x="3" y="5" />
      <circle cx="9" cy="11" r="2" />
      <path d="M21 17l-5-5-9 7" />
    </svg>
  );
}
