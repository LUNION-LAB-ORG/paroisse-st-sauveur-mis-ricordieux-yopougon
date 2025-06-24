// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Menu } from "lucide-react";
// import { DonationButton } from "./donation-button";
// import { ThemeToggle } from "./theme-toggle";
// import Image from "next/image";

// const routes = [
//   {
//     href: "/",
//     label: "Accueil",
//   },
//   {
//     href: "/mouvement",
//     label: "Mouvement",
//   },
//   {
//     href: "/meditations",
//     label: "Méditations",
//   },
//   {
//     href: "/equipes",
//     label: "Équipes",
//   },
//   {
//     href: "/actualites",
//     label: "Actualités",
//   },
//   {
//     href: "/historique",
//     label: "Historique",
//   },
// ];

// export function MainNav() {
//   const pathname = usePathname();
//   const [isScrolled, setIsScrolled] = React.useState(false);

//   React.useEffect(() => {
//     const handleScroll = () => {
//       const offset = window.scrollY;
//       setIsScrolled(offset > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <header
//     // className="absolute top-10  z-50 !bg-transparent   w-full transition-all duration-300"
//       className={cn(
//         "ssticky absolute top-10 z-50 w-full transition-all duration-300",
//         isScrolled
//           ? " sticky top-0 py-5 bbg-background/95 bg-black/50 backdrop-blur-sm border-b shadow-sm"
//           : "bg-transparent"
//       )}
//     >
//       <div className="px-4  max-w-7xl mx-auto text-white  flex h-16 items-center justify-between py-4">
//         <Link href="/" className="flex items-center gap-2">
//         <Image
//         className="w-20 h-auto" 
//           src="/assets/images/logo-paroise.png"
//           alt="Logo"
//           width={50}
//           height={50}
          
//           />
//         </Link>

//         <nav className="hidden flex-1 justify-between max-w-xl md:flex gap-6 items-center">
//           {routes.map((route) => (
//             <Link
//               key={route.href}
//               href={route.href}
//               className={cn(
//                 "text-md font-medium transition-colors hover:text-white",
//                 pathname === route.href
//                   ? "ttext-primary"
//                   : "text-stone-400"
//               )}
//             >
//               {route.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="hidden md:flex items-center gap-4">
//           <Link href="/faire-don">
//             <DonationButton variant="defaultPerso"/>
//           </Link>
//         <ThemeToggle />
//         </div>
          
//         {/* mobile */}
//         <div className="flex md:hidden gap-2 items-center">
//         <Link href="/faire-don">
//           <DonationButton variant="outline" size="sm" />
//         </Link>

//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="default" size="icon">
//                 <Menu className="h-5 w-5" />
//                 <span className="sr-only">Toggle menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right">
//               <div className="flex flex-col gap-4 mt-8">
//                 {routes.map((route) => (
//                   <Link
//                     key={route.href}
//                     href={route.href}
//                     className={cn(
//                       "text-base font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
//                       pathname === route.href
//                         ? "text-primary bg-secondary"
//                         : "text-muted-foreground"
//                     )}
//                   >
//                     {route.label}
//                   </Link>
//                 ))}
//                 <div className="mt-4 flex items-center justify-between">
//                   <ThemeToggle />
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }