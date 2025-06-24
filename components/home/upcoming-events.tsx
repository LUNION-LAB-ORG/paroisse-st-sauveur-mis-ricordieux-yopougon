// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, Clock, MapPin } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// const events = [
//   {
//     id: 1,
//     title: "Retraite spirituelle de Carême",
//     date: "15 Mars 2025",
//     time: "9h00 - 17h00",
//     location: "Abbaye Saint-Martin",
//     description: "Une journée de recueillement et de prière pour préparer son cœur à la fête de Pâques."
//   },
//   {
//     id: 2,
//     title: "Veillée de prière et adoration",
//     date: "28 Février 2025",
//     time: "20h00 - 22h00",
//     location: "Église Saint Michel",
//     description: "Soirée de louange, d'adoration et de prière pour toute la communauté."
//   },
//   {
//     id: 3,
//     title: "Journée des familles",
//     date: "12 Avril 2025",
//     time: "11h00 - 16h00",
//     location: "Salle paroissiale",
//     description: "Rencontre, partage et activités pour les familles de la paroisse."
//   }
// ];

// export function UpcomingEvents() {
//   return (
//     <section className="container py-8">
//       <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
//         <div>
//           <h2 className="ffont-cinzel text-3xl font-bold mb-2">Événements à venir</h2>
//           <p className="text-muted-foreground">Rejoignez-nous pour nos prochaines célébrations et activités</p>
//         </div>
//         <Button variant="link" asChild className="mt-2 md:mt-0">
//           <Link href="/actualites">Voir tous les événements</Link>
//         </Button>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map((event) => (
//           <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
//             <CardHeader className="pb-3">
//               <CardTitle className="font-cinzel">{event.title}</CardTitle>
//               <CardDescription>{event.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="flex items-center text-sm">
//                   <Calendar className="mr-2 h-4 w-4 text-chart-1" />
//                   <span>{event.date}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <Clock className="mr-2 h-4 w-4 text-chart-1" />
//                   <span>{event.time}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <MapPin className="mr-2 h-4 w-4 text-chart-1" />
//                   <span>{event.location}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }