export default function CardHeader() {
  return (
    <div className="bg-blue-900">
      <div className="px-4 max-w-7xl mx-auto text-center py-24 md:py-32 lg:py-40 text-white">
        <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-snug mb-6">
          Paroisse Saint Sauveur <br className="hidden md:block" />
          <span className="text-primary">Miséricordieux</span>
        </h1>

        <p className="text-lg md:text-2xl max-w-2xl mx-auto opacity-90 leading-relaxed">
          {`Communauté de foi, d'espérance et de charité`}
        </p>

        <div className="mt-10 w-24 h-1 bg-white/60 mx-auto rounded-full" />
      </div>
    </div>
  );
}
