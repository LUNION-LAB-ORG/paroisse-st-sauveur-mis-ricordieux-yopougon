"use client";

import Timeline from "./timeLine";

export default function CardHistoire() {
  return (
    <section>
      <div>
        <h2 className="max-w-4xl mx-auto text-blue-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-10">
          La fondation et le développement de notre paroisse
        </h2>
        <p className="mb-10 lg:mb-28 text-center max-w-4xl mx-auto text-xl  lg:text-2xl text-muted-foreground ">
          {` La Paroisse Saint Sauveur Miséricordieux possède une histoire riche qui témoigne de la foi et de l'engagement de notre communauté chrétienne à travers les décennies.`}
        </p>

        <div>
          <Timeline />
        </div>
      </div>
    </section>
  );
}
