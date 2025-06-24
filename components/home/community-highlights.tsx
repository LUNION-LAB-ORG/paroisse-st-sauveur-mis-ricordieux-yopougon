// import Image from "next/image";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// const highlights = [
//   {
//     id: 1,
//     title: "Mission auprès des plus démunis",
//     description: "Notre équipe de bénévoles se mobilise chaque semaine pour distribuer des repas et apporter réconfort aux personnes sans-abri.",
//     image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg",
//     stats: "Plus de 50 bénévoles impliqués"
//   },
//   {
//     id: 2,
//     title: "Catéchisme pour les enfants",
//     description: "Nos séances de catéchisme accueillent les enfants de 7 à 12 ans pour leur faire découvrir la foi et les valeurs chrétiennes.",
//     image: "https://images.pexels.com/photos/8363075/pexels-photo-8363075.jpeg",
//     stats: "Plus de 60 enfants accompagnés"
//   },
//   {
//     id: 3,
//     title: "Chorale paroissiale",
//     description: "Notre chorale anime les célébrations dominicales et les grandes fêtes liturgiques avec passion et talent.",
//     image: "https://images.pexels.com/photos/6684554/pexels-photo-6684554.jpeg",
//     stats: "25 choristes de tous âges"
//   }
// ];

// export function CommunityHighlights() {
//   return (
//     <section className="container py-8">
//       <div className="text-center mb-10">
//         <h2 className="font-cinzel text-3xl font-bold mb-2">Notre communauté en action</h2>
//         <p className="text-muted-foreground max-w-2xl mx-auto">Découvrez les initiatives portées par les membres de notre paroisse</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {highlights.map((highlight) => (
//           <Card key={highlight.id} className="overflow-hidden">
//             <div className="relative h-48 w-full">
//               <Image 
//                 src={highlight.image} 
//                 alt={highlight.title}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <CardHeader>
//               <CardTitle className="font-cinzel">{highlight.title}</CardTitle>
//               <CardDescription>{highlight.description}</CardDescription>
//             </CardHeader>
//             <CardFooter>
//               <p className="text-sm font-medium text-chart-2">{highlight.stats}</p>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }