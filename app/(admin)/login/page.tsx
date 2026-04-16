"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const handleConnexion: SubmitHandler<LoginFormData> = async (data) => {
    const result = await signIn("credentials-user", {
      username: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Identifiants incorrects");
      return;
    }

    toast.success("Connexion reussie !");
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/bg-auth.png')`,
      }}
    >
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="bg-primary rounded-t-2xl px-6 py-3 lg:px-8 lg:py-4 text-center">
          <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/logo-paroisse.png"
              alt="Logo Paroisse"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-white">
            Paroisse Saint Sauveur Misericordieux
          </h1>
          <p className="text-white/80 text-sm">Portail d&apos;administration</p>
        </div>

        {/* FORM */}
        <form
          className="bg-white rounded-b-2xl p-6 lg:p-8"
          onSubmit={handleSubmit(handleConnexion)}
        >
          <div className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Adresse email
              </label>
              <Input
                type="email"
                placeholder="Votre Email"
                {...register("email", {
                  required: "Email requis",
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="Votre Mot de Passe"
                {...register("password", {
                  required: "Mot de passe requis",
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Se souvenir de moi
                </label>
              </div>
              <Link href="#" className="text-sm underline">
                Mot de passe oublie ?
              </Link>
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent cursor-pointer hover:bg-accent/90 text-white py-5"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </div>
        </form>

        {/* FOOTER */}
        <div className="bg-muted rounded-b-2xl -mt-4 pt-8 pb-4 text-center px-4">
          <p className="text-sm text-muted-foreground">
            Besoin d&apos;aide ?{" "}
            <Link href="#" className="underline text-foreground">
              Contacter l&apos;administrateur
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
