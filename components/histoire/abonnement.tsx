"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export default function Abonnement() {
  return (
    <section className="w-full px-4 max-w-7xl mx-auto my-1">
      <div className="rounded-2xl border border-gray-200 shadow-sm py-10 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-blue-900 text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Restez informé
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-8">
            Recevez les actualités de la paroisse directement dans votre boîte mail.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Input
              placeholder="Entrez votre adresse email"
              type="email"
              variant="bordered"
              size="lg"
              className="w-full sm:flex-1"
            />
            <Button
              color="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold"
            >
              S'abonner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
