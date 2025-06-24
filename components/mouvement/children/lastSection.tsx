// 'use client'
// import Image from "next/image";

import Image from "next/image";

// export default function LastSection() {
//    <section>
//       <div className="px-4 max-w-7xl mx-auto">
//          <h2>dddddddddddd</h2>
//         {/* <Image src="/assets/images/mvt-paroise.jpg" alt="paroise" /> */}
//         {/* <Image src="/assets/images/evenement" alt="paroise" /> */}
//        </div>
//    </section>
// }


export default function LastSection() {
   return (
      <section className="mb-10">
         <div className="mx-auto grid lg:grid-cols-2 gap-5">
            <Image
            className="w-full h-[500px] lg:h-[700px] object-cover"
            width={2731}
            height={4096}
            src="/assets/images/evenement.jpg" alt="paroise" />

            <Image
            className="w-full h-[500px] lg:h-[700px] object-cover"
            width={2731}
            height={4096}
            src="/assets/images/mvt-paroise.jpg" alt="paroise" />

      
         </div>
      </section>
   )
}