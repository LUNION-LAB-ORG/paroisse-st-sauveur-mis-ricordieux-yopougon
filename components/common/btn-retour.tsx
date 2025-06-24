// "use client";
// import { ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// export default function CardHeader() {
//   const router = useRouter();

//   return (
//     <div className="bg-blue-900">
//       <div className=" px-4 max-w-7xl mx-auto text-center relative z-10 py-10 md:py-16 llg:py-32 text-white">
//         <div className="flex gap-4 sm:gap-10 max-w-3xl mx-auto">
//           <button className="cursor-pointer" onClick={() => router.back()}>
//             <ArrowLeft className="w-8 h-8 lg:w-14 lg:h-14" />
//           </button>
//           <h1 className="font-cinzel text-white text-2xl md:text-3xl lg:text-5xl font-bold mb-6 !leading-relaxed ">
//             Retour aux actualités
//           </h1>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"; // si tu es dans un composant dans app/

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // ou autre icône
import React from "react";

const BtnRetour = () => {
  const router = useRouter();

  return (
    <div className="absolute z-20  top-[150px] left-0 text-white font-bold px-2 sm:px-4 lg:px-14 mb-6 lg:mb-10 flex items-center gap-2 cursor-pointer">
      <button className="cursor-pointer" onClick={() => router.back()}>
        <ArrowLeft className="w-8 h-8 lg:w-14 lg:h-14" />
      </button>
      {/* <ArrowLeft className='w-10 h-10 lg:w-20 lg:h-20'/> */}
    </div>
  );
};

export default BtnRetour;
