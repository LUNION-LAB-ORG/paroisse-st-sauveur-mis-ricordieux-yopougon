import Link from "next/link";

import { cn } from "@/lib/utils";

/** Pagination par liens (?page=n), rendue côté serveur. */
export function PaginationLiens({
  page,
  pages,
  chemin,
}: {
  page: number;
  pages: number;
  chemin: string;
}) {
  if (pages <= 1) return null;
  const href = (n: number) => (n <= 1 ? chemin : `${chemin}?page=${n}`);
  const classe =
    "flex min-h-11 min-w-11 items-center justify-center rounded-charte border px-3 text-[15px] font-bold hover:no-underline";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 border-t border-ligne pt-8"
    >
      {page > 1 && (
        <Link
          className={cn(classe, "border-champ text-marine hover:text-marine")}
          href={href(page - 1)}
          rel="prev"
        >
          Précédent
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            className={cn(classe, "border-marine bg-marine text-white")}
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            aria-label={`Page ${n}`}
            className={cn(classe, "border-champ text-marine hover:text-marine")}
            href={href(n)}
          >
            {n}
          </Link>
        ),
      )}
      {page < pages && (
        <Link
          className={cn(classe, "border-champ text-marine hover:text-marine")}
          href={href(page + 1)}
          rel="next"
        >
          Suivant
        </Link>
      )}
    </nav>
  );
}
