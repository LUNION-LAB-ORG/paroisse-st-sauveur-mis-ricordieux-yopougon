"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function CardHeader() {
  const router = useRouter();

  return (
    <div className="bg-blue-900">
      <div className=" px-4 max-w-7xl mx-auto text-center relative z-10 py-10 md:py-16 llg:py-32 text-white">
        <div className="flex gap-4 sm:gap-10 max-w-3xl mx-auto">
          <button className="cursor-pointer" onClick={() => router.back()}>
            <ArrowLeft className="w-8 h-8 lg:w-14 lg:h-14" />
          </button>
          <h1 className="font-cinzel text-white text-2xl md:text-3xl lg:text-5xl font-bold mb-6 !leading-relaxed ">
            Retour aux actualités
          </h1>
        </div>
      </div>
    </div>
  );
}
