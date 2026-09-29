/** Données structurées schema.org (JSON-LD), échappées pour une insertion sûre dans le HTML. */
export function DonneesStructurees({ donnees }: { donnees: object }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(donnees).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
