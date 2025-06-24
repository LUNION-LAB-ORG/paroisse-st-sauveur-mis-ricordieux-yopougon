export default function CardHeader() {
  return (
    <div className="bg-blue-900">
      <div className=" px-4 max-w-7xl mx-auto text-center relative z-10 py-20 md:py-32 text-white">
        <h1 className="font-cinzel text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 !leading-relaxed ">
          Paroisse Saint Sauveur Miséricordieux
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
          {` Communauté de foi, d'espérance et de charité`}
        </p>
      </div>
    </div>
  );
}
