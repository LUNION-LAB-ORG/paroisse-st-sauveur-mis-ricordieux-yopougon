/** Gabarit des modules du groupe « Autres » : marges du back-office autour des anciens écrans. */
export function AncienModule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col px-4 py-6 md:px-9">{children}</div>
  );
}
