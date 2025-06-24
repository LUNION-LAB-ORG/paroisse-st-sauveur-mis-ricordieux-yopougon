// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { toast } from "sonner";

// const formSchema = z.object({
//   email: z.string().email("Veuillez entrer une adresse email valide"),
// });

// export function Newsletter() {
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       toast.success("Inscription réussie! Merci de vous être inscrit à notre newsletter.");
//       form.reset();
//       setIsLoading(false);
//     }, 1000);
//   }

//   return (
//     <section className="container py-8">
//       <div className="max-w-2xl mx-auto text-center">
//         <h2 className="font-cinzel text-3xl font-bold mb-4">Restez informé</h2>
//         <p className="text-muted-foreground mb-8">
//           Inscrivez-vous à notre newsletter pour recevoir les dernières actualités, méditations et informations sur les événements de notre paroisse.
//         </p>
        
//         <div className="bg-card rounded-lg p-6 border shadow-sm">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Adresse email</FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="votre@email.com" 
//                         {...field} 
//                         type="email"
//                         className="bg-background"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Inscription en cours..." : "S'inscrire à la newsletter"}
//               </Button>
//             </form>
//           </Form>
          
//           <p className="text-xs text-muted-foreground mt-4">
//             En vous inscrivant, vous acceptez de recevoir des emails de la Paroisse Saint Michel. Vous pourrez vous désinscrire à tout moment.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }