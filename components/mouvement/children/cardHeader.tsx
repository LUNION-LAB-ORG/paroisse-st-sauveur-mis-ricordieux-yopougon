interface CardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function CardHeader({ title, subtitle }: CardHeaderProps = {}) {
  const showTitle = title ?? "Paroisse Saint Sauveur";
  const showSubtitle = subtitle ?? "Communauté de foi, d'espérance et de charité";

  return (
    <div className="bg-blue-900">
      <div className="px-4 max-w-7xl mx-auto text-center py-20 md:py-24 lg:py-28 text-white">
        <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-snug mb-6">
          {title ? showTitle : (
            <>
              Paroisse Saint Sauveur <br className="hidden md:block" />
              <span className="text-primary">Miséricordieux</span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-2xl max-w-2xl mx-auto opacity-90 leading-relaxed">
          {showSubtitle}
        </p>

        <div className="mt-8 w-24 h-1 bg-white/60 mx-auto rounded-full" />
      </div>
    </div>
  );
}
