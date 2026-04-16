"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Input,
  Label,
  TextField,
  TextArea,
  FieldError,
  Card,
} from "@heroui/react";

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
    setValue,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    console.log(data);
  };

  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <h2 className="text-[#2d2d83] text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-10">
        Contacter le responsable du groupe
      </h2>
      <Card className="px-4 sm:px-10 py-12 lg:py-16">
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-6">
            <TextField isInvalid={!!errors.name}>
              <Label>Votre nom</Label>
              <Input {...register("name")} placeholder="Nom" />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </TextField>

            <TextField isInvalid={!!errors.first_name}>
              <Label>Prénom</Label>
              <Input {...register("first_name")} placeholder="Prénom" />
              {errors.first_name && <FieldError>{errors.first_name.message}</FieldError>}
            </TextField>

            <TextField isInvalid={!!errors.email}>
              <Label>Email</Label>
              <Input {...register("email")} type="email" placeholder="Email" />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </TextField>

            <TextField isInvalid={!!errors.phone}>
              <Label>Téléphone</Label>
              <Input {...register("phone")} type="tel" placeholder="Téléphone" />
              {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </TextField>

            <TextField isInvalid={!!errors.message}>
              <Label>Message ou questions</Label>
              <TextArea {...register("message")} placeholder="Votre message" rows={4} />
              {errors.message && <FieldError>{errors.message.message}</FieldError>}
            </TextField>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <input
                type="checkbox"
                {...register("conditions")}
                id="conditions"
                className="mt-1 w-5 h-5 accent-[#98141f]"
              />
              <label htmlFor="conditions" className="text-sm text-muted cursor-pointer leading-relaxed">
                J&apos;accepte les conditions de participation et j&apos;ai pris connaissance des modalités d&apos;inscription
              </label>
            </div>
            {errors.conditions && (
              <p className="text-red-500 text-xs">{errors.conditions.message}</p>
            )}

            <Button type="submit" variant="primary" className="bg-[#98141f] rounded-xl px-8 py-3">
              Envoyer
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
