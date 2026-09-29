"use client";

import type {
  ILecture,
  ILiturgie,
} from "@/features/liturgie/types/liturgie.type";

import { Button, Tabs } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { EnTeteSection } from "./en-tete-section";

import { useEstDesktop } from "@/hooks/use-media-query";
import { CONTENEUR, dateLongue, lienPartageWhatsapp } from "@/lib/charte";
import { cn } from "@/lib/utils";
import {
  lecturesDuJour,
  nettoyerHtml,
  referenceCourte,
  texteBrut,
  titreLecture,
} from "@/features/liturgie/utils/liturgie.utils";

type OngletId = "lecture1" | "psaume" | "lecture2" | "evangile" | "homelie";

interface Onglet {
  id: OngletId;
  label: string;
  labelCourt: string;
  ref: string;
}

const TEXTE_LECTURE =
  "texte-liturgique m-0 font-scripture text-lg leading-[1.6] text-encre-douce lg:text-[21px] lg:leading-[1.65] lg:text-[#2C2C36]";
const TITRE_LECTURE =
  "font-scripture text-[26px] leading-[1.25] text-encre lg:text-[38px] lg:leading-[1.2]";
const META = "text-sm text-gris lg:text-[15px]";

/**
 * Acclamation de l'Évangile sur une ligne : « Alléluia. Tous les anges… (Dn 3, 58) ».
 * Pendant le Carême, le verset ne commence pas par Alléluia : on l'affiche tel quel.
 */
function Acclamation({
  verset,
  refVerset,
}: {
  verset: string;
  refVerset: string | null;
}) {
  const texte = texteBrut(verset);
  const estAlleluia = /^allélu/i.test(texte);
  const acclamation = estAlleluia
    ? texte
        .replace(/^(Alléluia[.!]?\s*)+/i, "")
        .replace(/\s*Alléluia[.!]?$/i, "")
    : texte;

  return (
    <span className={META}>
      {estAlleluia && <strong className="text-rouge">Alléluia. </strong>}
      {acclamation}
      {refVerset && ` (${refVerset})`}
    </span>
  );
}

function Lecture({ lecture, sur }: { lecture: ILecture; sur: string }) {
  return (
    <div className="flex flex-col gap-3 lg:gap-5">
      <span className={META}>
        {lecture.intro ?? sur} ·{" "}
        <strong className="text-marine">{lecture.ref}</strong>
      </span>
      <div className={TITRE_LECTURE}>{titreLecture(lecture.title)}</div>
      <div
        dangerouslySetInnerHTML={{ __html: nettoyerHtml(lecture.content) }}
        className={TEXTE_LECTURE}
      />
    </div>
  );
}

interface ParoleDuJourProps {
  liturgie: ILiturgie | null;
  /** Adresse partagée sur WhatsApp (page « Parole du jour » de la date) */
  lienPartage: string;
  /** Numéro de section (accueil) ; absent sur la page dédiée */
  numero?: string;
  surtitre?: string;
  titre?: string;
  /** Remplace le rappel « date — fête » de la colonne de gauche */
  entete?: React.ReactNode;
  /** Mention AELF visible aussi sur mobile (page dédiée) */
  mentionAelfMobile?: boolean;
  id?: string;
  className?: string;
}

/**
 * Textes du jour (AELF) en onglets : lectures, psaume, Évangile, homélie.
 * Partagé par l'accueil et la page « Parole du jour ».
 */
export function ParoleDuJour({
  liturgie,
  lienPartage,
  numero = "02",
  surtitre = "La Parole de Dieu au quotidien",
  titre = "Textes du jour",
  entete,
  mentionAelfMobile = false,
  id = "parole",
  className,
}: ParoleDuJourProps) {
  const estDesktop = useEstDesktop();
  const lectures = lecturesDuJour(liturgie);
  const homelie = liturgie?.homily ?? null;
  const [onglet, setOnglet] = useState<OngletId>("evangile");
  const [alternative, setAlternative] = useState(false);
  const [lectureAudio, setLectureAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const onglets = useMemo<Onglet[]>(() => {
    const liste: Onglet[] = [];

    if (lectures.premiere)
      liste.push({
        id: "lecture1",
        label: "Première lecture",
        labelCourt: "1re lecture",
        ref: referenceCourte(lectures.premiere.ref),
      });
    if (lectures.psaume)
      liste.push({
        id: "psaume",
        label: "Psaume",
        labelCourt: "Psaume",
        ref: referenceCourte(lectures.psaume.ref),
      });
    if (lectures.deuxieme)
      liste.push({
        id: "lecture2",
        label: "Deuxième lecture",
        labelCourt: "2e lecture",
        ref: referenceCourte(lectures.deuxieme.ref),
      });
    if (lectures.evangile)
      liste.push({
        id: "evangile",
        label: "Évangile",
        labelCourt: "Évangile",
        ref: lectures.evangile.ref ?? "",
      });
    if (homelie)
      liste.push({
        id: "homelie",
        label: "Homélie du jour",
        labelCourt: "Homélie",
        ref: "Paroisse",
      });

    return liste;
  }, [
    lectures.premiere,
    lectures.psaume,
    lectures.deuxieme,
    lectures.evangile,
    homelie,
  ]);

  // Arrête toute lecture audio quand on change d'onglet ou qu'on quitte la page
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setLectureAudio(false);
  }, [onglet, alternative]);

  const premiere =
    alternative && lectures.premiereAlternative
      ? lectures.premiereAlternative
      : lectures.premiere;

  const texteAEcouter = (): string => {
    const bloc = (l: ILecture | null) =>
      l
        ? [
            l.intro,
            texteBrut(l.title),
            texteBrut(l.refrain),
            texteBrut(l.content),
          ]
            .filter(Boolean)
            .join(". ")
        : "";

    switch (onglet) {
      case "lecture1":
        return bloc(premiere);
      case "psaume":
        return bloc(lectures.psaume);
      case "lecture2":
        return bloc(lectures.deuxieme);
      case "evangile":
        return bloc(lectures.evangile);
      case "homelie":
        return homelie ? `${homelie.title}. ${homelie.content}` : "";
    }
  };

  const basculerEcoute = () => {
    if (onglet === "homelie" && homelie?.audio_url && audioRef.current) {
      if (audioRef.current.paused) void audioRef.current.play();
      else audioRef.current.pause();

      return;
    }
    const synthese = window.speechSynthesis;

    if (!synthese) return;
    if (lectureAudio) {
      synthese.cancel();
      setLectureAudio(false);

      return;
    }
    const enonce = new SpeechSynthesisUtterance(texteAEcouter());

    enonce.lang = "fr-FR";
    enonce.rate = 0.95;
    enonce.onend = () => setLectureAudio(false);
    enonce.onerror = () => setLectureAudio(false);
    synthese.speak(enonce);
    setLectureAudio(true);
  };

  const texteDePartage = liturgie
    ? [
        `Parole du jour — ${dateLongue(liturgie.date)}`,
        liturgie.feast,
        lectures.evangile &&
          `Évangile (${lectures.evangile.ref}) : ${titreLecture(lectures.evangile.title)}`,
        lienPartage,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const boutons = (
    <div className="flex gap-2 lg:mt-5 lg:flex-col lg:gap-2.5">
      <Button
        className="h-auto min-h-11 grow rounded-charte border border-marine bg-transparent lg:w-full p-[13px] text-sm font-bold text-marine lg:text-[15px]"
        variant="ghost"
        onPress={basculerEcoute}
      >
        {lectureAudio
          ? "Arrêter la lecture"
          : estDesktop
            ? "Écouter les lectures"
            : "Écouter"}
      </Button>
      <a
        className="flex min-h-11 grow items-center justify-center rounded-charte border border-ligne p-[13px] text-sm font-semibold text-encre hover:text-encre hover:no-underline lg:text-[15px]"
        href={lienPartageWhatsapp(texteDePartage)}
        rel="noopener noreferrer"
        target="_blank"
      >
        {estDesktop ? "Partager sur WhatsApp" : "Partager"}
      </a>
    </div>
  );

  return (
    <section
      className={cn(
        "scroll-mt-4 lg:border-y lg:border-ligne lg:bg-white",
        className,
      )}
      id={id}
    >
      <div className={cn(CONTENEUR, "pb-2.5 pt-8 lg:py-[100px]")}>
        {!liturgie || onglets.length === 0 ? (
          <div className="flex flex-col gap-4">
            <EnTeteSection numero={numero} surtitre={surtitre} titre={titre} />
            <p className="m-0 text-base text-gris">
              Les textes du jour sont momentanément indisponibles. Vous pouvez
              les lire sur{" "}
              <a
                className="font-bold text-rouge"
                href="https://www.aelf.org"
                rel="noopener noreferrer"
                target="_blank"
              >
                aelf.org
              </a>
              .
            </p>
          </div>
        ) : (
          <Tabs
            className={cn(
              "tabs-charte grid grid-cols-1 gap-y-3.5 lg:grid-cols-12 lg:gap-x-6",
              estDesktop && "tabs-charte--liste",
            )}
            orientation={estDesktop ? "vertical" : "horizontal"}
            selectedKey={onglet}
            variant="secondary"
            onSelectionChange={(k) => setOnglet(k as OngletId)}
          >
            <div className="flex flex-col gap-3.5 lg:col-span-4 lg:row-span-2 lg:gap-[18px]">
              <EnTeteSection
                numero={numero}
                surtitre={surtitre}
                titre={titre}
                titreClassName="lg:text-4xl text-2xl"
              />
              {entete ?? (
                <span className="hidden text-[17px] text-gris lg:block">
                  {dateLongue(liturgie.date)}
                  <br />
                  {liturgie.feast}
                  {liturgie.degree && ` — ${liturgie.degree}`}
                </span>
              )}
              <Tabs.ListContainer className="w-full lg:mt-[18px]">
                <Tabs.List
                  aria-label="Textes du jour"
                  className={cn("w-full", !estDesktop && "grid")}
                  style={
                    estDesktop
                      ? undefined
                      : {
                          gridTemplateColumns: `repeat(${onglets.length}, minmax(0, 1fr))`,
                        }
                  }
                >
                  {onglets.map((t) => (
                    <Tabs.Tab
                      key={t.id}
                      className={cn(!estDesktop && "px-1 pb-3 pt-2 text-sm")}
                      id={t.id}
                    >
                      {estDesktop ? (
                        <>
                          <span>{t.label}</span>
                          <span className="text-sm font-normal text-gris">
                            {t.ref}
                          </span>
                        </>
                      ) : (
                        t.labelCourt
                      )}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
              <div className="hidden lg:block">{boutons}</div>
              <span className="hidden text-[13px] text-gris lg:mt-2 lg:block">
                Textes liturgiques : AELF
              </span>
            </div>

            <div className="min-h-[300px] lg:col-span-7 lg:col-start-6 lg:min-h-[560px]">
              {premiere && (
                <Tabs.Panel id="lecture1">
                  <Lecture lecture={premiere} sur="Première lecture" />
                  {lectures.premiereAlternative && (
                    <p className={cn(META, "mt-5")}>
                      Ou bien :{" "}
                      <button
                        className="min-h-11 font-bold text-marine underline underline-offset-4 hover:text-rouge"
                        type="button"
                        onClick={() => setAlternative((v) => !v)}
                      >
                        {
                          (alternative
                            ? lectures.premiere
                            : lectures.premiereAlternative
                          )?.ref
                        }
                      </button>{" "}
                      —{" "}
                      {titreLecture(
                        (alternative
                          ? lectures.premiere
                          : lectures.premiereAlternative
                        )?.title,
                      )}
                    </p>
                  )}
                </Tabs.Panel>
              )}
              {lectures.psaume && (
                <Tabs.Panel id="psaume">
                  <div className="flex flex-col gap-3 lg:gap-5">
                    <span className={META}>
                      Psaume responsorial ·{" "}
                      <strong className="text-marine">
                        {lectures.psaume.ref}
                      </strong>
                    </span>
                    <div className="font-heading text-2xl italic leading-[1.25] text-marine lg:text-[38px]">
                      R/ {texteBrut(lectures.psaume.refrain)}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: nettoyerHtml(lectures.psaume.content),
                      }}
                      className={TEXTE_LECTURE}
                    />
                  </div>
                </Tabs.Panel>
              )}
              {lectures.deuxieme && (
                <Tabs.Panel id="lecture2">
                  <Lecture lecture={lectures.deuxieme} sur="Deuxième lecture" />
                </Tabs.Panel>
              )}
              {lectures.evangile && (
                <Tabs.Panel id="evangile">
                  <div className="flex flex-col gap-3 lg:gap-5">
                    {lectures.evangile.verse && (
                      <Acclamation
                        refVerset={lectures.evangile.verse_ref}
                        verset={lectures.evangile.verse}
                      />
                    )}
                    <Lecture lecture={lectures.evangile} sur="Évangile" />
                  </div>
                </Tabs.Panel>
              )}
              {homelie && (
                <Tabs.Panel id="homelie">
                  <div className="flex flex-col gap-3 lg:gap-5">
                    <span className={META}>
                      Homélie du jour
                      {homelie.author && (
                        <>
                          {" · "}
                          <strong className="text-marine">
                            {homelie.author.fullname}
                          </strong>
                          {homelie.author.function &&
                            `, ${homelie.author.function.toLowerCase()}`}
                        </>
                      )}
                    </span>
                    <div className="font-scripture text-[28px] leading-[1.15] text-marine lg:text-[40px]">
                      {homelie.title}
                    </div>
                    <p className={cn(TEXTE_LECTURE, "whitespace-pre-line")}>
                      {homelie.content}
                    </p>
                    {homelie.audio_url && (
                      <audio
                        ref={audioRef}
                        controls
                        className="w-full"
                        preload="none"
                        src={homelie.audio_url}
                      >
                        <track kind="captions" />
                      </audio>
                    )}
                  </div>
                </Tabs.Panel>
              )}
              <div className="mt-5 lg:hidden">{boutons}</div>
              {mentionAelfMobile && (
                <p className="m-0 mt-4 text-[13px] text-gris lg:hidden">
                  Textes liturgiques : AELF
                </p>
              )}
            </div>
          </Tabs>
        )}
      </div>
    </section>
  );
}
