"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@heroui/button";

const schema = z.object({
  name: z.string().min(1, "Entrez votre nom"),
  first_name: z.string().min(1, "Entrez votre prénom"),
  email: z.string().email("Entrez une adresse email valide"),
  phone: z.string().min(8, "Entrez votre numéro de téléphone"),
  message: z.string().min(3, "Entrez votre message"),
  conditions: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
});

type Schema = z.infer<typeof schema>;

export default function FormulaireContact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    console.log(data);
  };

  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-10">
      Contacter le responsable du groupe
      </h2>
      <div className="border rounded-xl px-4 sm:px-10 py-20">
        <form  onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto text-xl lg:text-2xl text-stone-700 space-y-8">
            <div className="flex flex-col gap-2">
            <label >Votre nom</label>
            <input className="border-2 py-5 px-2 rounded-xl" {...register("name")} placeholder="Nom" />
            {errors.name && <p>{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
            <label>Prénom</label>
            <input className="border-2 py-5 px-2 rounded-xl" {...register("first_name")} placeholder="Prénom" />
            {errors.first_name && <p>{errors.first_name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
            <label>Email</label>
            <input className="border-2 py-5 px-2 rounded-xl" {...register("email")} placeholder="Email" />
            {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
            <label>Téléphone</label>
            <input className="border-2 py-5 px-2 rounded-xl" {...register("phone")} type="tel" placeholder="Téléphone" />
            {errors.phone && <p>{errors.phone.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
            <label>Message ou questions</label>
            <textarea className="border-2 py-5 px-2 rounded-xl" {...register("message")} placeholder="Votre message" />
            {errors.message && <p>{errors.message.message}</p>}
            </div>
            <div className="flex items-start space-x-2">
            <input  className="w-8 h-8 accent-red-600" type="checkbox" {...register("conditions")} id="conditions" />
            <label htmlFor="conditions" className="text-md">
                J'accepte les conditions de participation et j'ai pris connaissance des modalités d'inscription
            </label>
            </div>
            {errors.conditions && (
            <p className="text-red-500 text-sm">{errors.conditions.message}</p>
            )}
            <Button color="primary" className="text-md lg:text-xl py-4 lg:px-20 lg:py-8" >
              <input type="submit" value="Envoyer" />
            </Button>
        </form>

      </div>
     
    </div>
  );
}
