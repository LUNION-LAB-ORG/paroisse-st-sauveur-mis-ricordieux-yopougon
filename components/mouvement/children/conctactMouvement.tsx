import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Veuillez entrer votre nom"),
    first_name: z.string().min(1, "Veuillez entrer un sujet"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    phone: z.number().min(8,"Veuillez entrer une adresse email valide"),
    message: z.string().min(1, "Veuillez entrer votre message"),
  });


export default function contactMouvement() {
  return (
    <section className="w-full px-4 max-w-7xl mx-auto">
        <h2 className="font-cinzel text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold py-6 !leading-relaxed ">
        Contacter le responsable du groupe
        </h2>

        <div className="border ">

        </div>
    </section>
    
  );
}