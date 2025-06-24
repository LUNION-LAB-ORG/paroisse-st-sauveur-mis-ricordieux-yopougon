import { Button } from "@heroui/button";
import Link from "next/link";

export default function Organisation() {
  return (
    <div className="text-center flex flex-col gap-8 lg:gap-14">
      <div>
        <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-14">
          Organisation Paroissiale
        </h2>
        <p>
          {` Découvrez les personnes qui œuvrent au service de notre communauté à la Paroisse Saint Sauveur Miséricordieux. Notre organisation comprend l'équipe pastorale et les différents conseils qui accompagnent notre paroisse dans sa mission d'évangélisation et de service.
        Équipe Paroissiale`}
        </p>
      </div>
      {/* div btn */}
      <div className="flex flex-col gap-6 items-center">
        <Button
          className="w-fit rounded-full font-bold text-xl lg:text-2xl  py-8 px-10 lg:py-10 lg:px-48"
          color="primary"
        >
          Équipe Paroissiale
        </Button>

        <Link href="/conseils-paroissiaux">
          <Button className="bg-opacity-0 border-4 border-red-800 w-fit rounded-full font-bold text-xl lg:text-2xl  py-8 px-10 lg:py-10 lg:px-48">
            Conseils Paroissiaux
          </Button>
        </Link>
      </div>
      <p>
        {`
        Notre équipe pastorale est composée de prêtres et de diacres engagés au service de notre communauté. Chacun d'eux met ses talents et son charisme particulier au service de l'annonce de l'Évangile et de l'accompagnement spirituel des fidèles.`}
      </p>
    </div>
  );
}
