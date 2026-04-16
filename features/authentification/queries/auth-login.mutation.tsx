"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useInvalidateAuthentificationQuery } from "./index.query";

interface ILoginPayload {
  email: string;
  password: string;
}

export const useAuthLoginMutation = () => {
  const router = useRouter();
  const invalidate = useInvalidateAuthentificationQuery();

  return useMutation({
    mutationFn: async (data: ILoginPayload) => {
      const result = await signIn("credentials-user", {
        username: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Identifiants incorrects");
      }

      return result;
    },
    onSuccess: async () => {
      toast.success("Connexion reussie !");
      await invalidate();
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la connexion");
    },
  });
};
