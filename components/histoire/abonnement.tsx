import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export default function Abonnement() {
  return (
    <section className="w-full px-4 max-w-7xl mx-auto mb-8 lg:mb-16">
      <div className="border rounded-xl py-6 px-2 sm:px-4">
        <div className="max-w-5xl mx-auto ">
          <h2 className="text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold mb-8 lg:mb-14">
            Restez informé
          </h2>

          <p className="mb-8">
            {`
        Recevez les actualités de la paroisse directement dans votre boîte mail
        `}
          </p>
          <div className="flex flex-col lg:flex-row gap-4">
            <Input label="Email" size="lg" type="email" variant="bordered" />

            <Button
              className="text-md lg:text-xl w-fit px-16 py-8  lg:px-28 lg:py-8"
              color="primary"
            >
              {`S'abonner`}{" "}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
