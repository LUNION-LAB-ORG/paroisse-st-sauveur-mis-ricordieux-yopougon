import Image from "next/image";

export default function Cure() {
  return (
    <section className=" px-4 max-w-7xl mx-auto py-8">
      <h2 className="text-blue-900 text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-10 lg:mb-16">
        Le Mot du Curé
      </h2>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-8">
        {/* txt */}
        <div>
          <p className="text-lg text-semibold text-stone-700">
            Chers frères et sœurs en Christ, <br /> <br />
            {` C'est avec une immense joie que je vous accueille sur le site internet de notre paroisse Saint Sauveur Miséricordieux.
            Ce nouvel outil de communication nous permettra de renforcer les liens qui nous unissent et de partager plus facilement
            les informations importantes de notre vie paroissiale.`}{" "}
            <br /> <br />
            {`
            Notre communauté se veut fraternelle et ouverte à tous. Chacun y a sa place et peut apporter sa pierre à l'édifice que nous construisons ensemble,
             à l'image de notre église dont les travaux avancent grâce à votre générosité et votre engagement.
            `}{" "}
            <br /> <br />
            {`
                En ces temps parfois difficiles, notre paroisse se veut un lieu d'espérance,
                 de réconfort et de partage où la foi nourrit notre quotidien et nous pousse à témoigner de l'amour du Christ auprès de tous nos frères.
                `}{" "}
            <br />
            Que Dieu vous bénisse et que Saint Sauveur Miséricordieux intercède
            pour vous et vos familles. <br />
            <br /> <br />
            Père Jean-Baptiste KOFFI, Curé
          </p>
        </div>

        {/* img */}
        <div>
          <Image
            className="w-full object-cover "
            src="/assets/images/cure.jpg"
            alt="photo du core"
            width={500}
            height={300}
          />
        </div>
      </div>
    </section>
  );
}
