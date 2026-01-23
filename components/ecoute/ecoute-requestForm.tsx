"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EcouteType, CreateEcouteSchema } from "@/services/ecoute/ecoute.schema";
import { createEcoute } from "@/services/ecoute/ecoute.action";
import { toast } from "sonner";

// Type pour le formulaire
interface EcouteFormData {
    type: string;
    fullname: string;
    phone: string;
    availability: string;
    message: string;
    acceptConditions: boolean;
}

const EcouteRequestForm = () => {
    const [formData, setFormData] = useState<EcouteFormData>({
        type: "",
        fullname: "",
        phone: "",
        availability: "",
        message: "",
        acceptConditions: false,
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof EcouteFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when field is modified
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const toastId = toast.loading("Envoi de votre demande...");

        try {
            // Préparer les données pour la validation
            const submitData: EcouteType = {
                ...formData,
                request_status: "pending" as const,
            };

            // Validation avec le schéma Zod
            const result = CreateEcouteSchema.safeParse(submitData);
            if (!result.success) {
                const newErrors: Record<string, string> = {};
                result.error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                toast.error("Erreur de validation", { id: toastId });
                return;
            }

            // Envoyer les données au serveur
            const response = await createEcoute(result.data);

            if (!response.success) {
                toast.error(response.error || "Erreur", { id: toastId });
                return;
            }

            toast.success("Demande envoyée avec succès 🙏", { id: toastId });
            setShowSuccess(true);
        } catch (err) {
            console.error(err);
            toast.error("Erreur serveur", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            type: "",
            fullname: "",
            phone: "",
            availability: "",
            message: "",
            acceptConditions: false,
        });
        setShowSuccess(false);
    };

    return (
        <div className="min-h-screen bg-purple-50 flex items-center bg-cover bg-center justify-center p-4" style={{ backgroundImage: "url('/assets/images/mvt-id.jpg')" }}>
            <div className="">
                <div className="relative lg:-top-80 lg:-left-80 hidden lg:block">
                    {/* <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-white bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button> */}
                </div>
            </div>
            <div className=" rounded-lg shadow-xl overflow-hidden max-w-3xl w-full">
                {/* Header */}
                <div className=" sm:bg-red-700 lg:bg-transparent relative h-20 lg:flex lg:justify-center lg:items-center  ">
                    <div className="absolute top-4 left-4 lg:hidden md:block">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-white bg-black bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:w-full  lg:justify-between lg:items-center lg:px-4">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center font-bold text-white bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </button>
                        <span className="text-white font-extrabold text-2xl">Demander une Écoute</span>
                        <div></div>
                    </div>
                    <div className="absolute lg:hidden  lg:w-full lg:text-center  top-4 right-4">
                        <span className=" sm:text-white md:text-white font-bold md:text-lg text-sm">Demander une Écoute</span>
                    </div>
                </div>
                <div className="mb-6 bg-white border-l-8 border-blue-900">
                    {/* <h2 className="text-xl font-semibold text-red-700 mb-2">Demander une Écoute</h2> */}
                    <p className="text-gray-600 p-2 text-sm">
                        Vous souhaitez rencontrer un prêtre pour un accompagnement spirituel, un conseil ou simplement pour échanger ? Remplissez ce formulaire et nous vous contacterons rapidement pour organiser cette rencontre
                    </p>
                </div>
                {/* Form */}
                <div className="p-6 space-y-5 bg-white  ">

                    <div className="space-y-2 bg-white">
                        <Label htmlFor="type" className="text-foreground">
                            Type d'écoute (optionnel)
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => handleChange("type", value)}
                        >
                            <SelectTrigger className="bg-gray-50 border-1">
                                <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spirituel">Accompagnement spirituel</SelectItem>
                                <SelectItem value="conseil">Conseil</SelectItem>
                                <SelectItem value="confession">Confession</SelectItem>
                                <SelectItem value="echange">Échange</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-foreground">
                            Nom et prénom
                        </Label>
                        <Input
                            id="fullname"
                            value={formData.fullname}
                            onChange={(e) => handleChange("fullname", e.target.value)}
                            placeholder="Votre nom et prénom"
                            className="bg-gray-50 border-1"
                        />
                        {errors.fullname && (
                            <p className="text-destructive text-sm">{errors.fullname}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">
                            Numéro de téléphone (optionnel)
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="Votre numéro de téléphone"
                            className="bg-gray-50 border-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="availability" className="text-foreground">
                            Vos disponibilité
                        </Label>
                        <Select
                            value={formData.availability}
                            onValueChange={(value) => handleChange("availability", value)}
                        >
                            <SelectTrigger className="bg-gray-50 border-1">
                                <SelectValue placeholder="Sélectionnez vos disponibilités" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lundi-matin">Lundi matin</SelectItem>
                                <SelectItem value="lundi-apres-midi">Lundi après-midi</SelectItem>
                                <SelectItem value="mardi-matin">Mardi matin</SelectItem>
                                <SelectItem value="mardi-apres-midi">Mardi après-midi</SelectItem>
                                <SelectItem value="mercredi-matin">Mercredi matin</SelectItem>
                                <SelectItem value="mercredi-apres-midi">Mercredi après-midi</SelectItem>
                                <SelectItem value="jeudi-matin">Jeudi matin</SelectItem>
                                <SelectItem value="jeudi-apres-midi">Jeudi après-midi</SelectItem>
                                <SelectItem value="vendredi-matin">Vendredi matin</SelectItem>
                                <SelectItem value="vendredi-apres-midi">Vendredi après-midi</SelectItem>
                                <SelectItem value="samedi-matin">Samedi matin</SelectItem>
                                <SelectItem value="samedi-apres-midi">Samedi après-midi</SelectItem>
                                <SelectItem value="dimanche-matin">Dimanche matin</SelectItem>
                                <SelectItem value="dimanche-apres-midi">Dimanche après-midi</SelectItem>
                                <SelectItem value="soir-semaine">Soir en semaine</SelectItem>
                                <SelectItem value="weekend">Weekend</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.availability && (
                            <p className="text-destructive text-sm">{errors.availability}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-foreground">
                            Message ou questions
                        </Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            placeholder="Votre message ou vos questions"
                            className="bg-gray-50 border-1 min-h-[100px]"
                        />
                        {errors.message && (
                            <p className="text-destructive text-sm">{errors.message}</p>
                        )}
                    </div>

                    <div className="flex items-start gap-2">
                        <Checkbox
                            id="conditions"
                            checked={formData.acceptConditions}
                            onCheckedChange={(checked) =>
                                handleChange("acceptConditions", checked as boolean)
                            }
                            className="mt-1"
                        />
                        <Label
                            htmlFor="conditions"
                            className="text-sm text-muted-foreground cursor-pointer"
                        >
                            J'accepte les conditions de participation et j'ai pris connaissance des modalités d'inscription
                        </Label>
                    </div>
                    {errors.acceptConditions && (
                        <p className="text-destructive text-sm">{errors.acceptConditions}</p>
                    )}

                    <Button
                        onClick={handleSubmit}
                        className="bg-red-700 hover:bg-red-800 text-white"
                        disabled={loading}
                    >
                        {loading ? "Envoi..." : "Envoyer ma demande"}
                    </Button>
                </div>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md text-center">
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="absolute right-4 border-2 top-4 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center py-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                            <Check className="w-8 h-8 text-emerald-500" />
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Votre demande a bien été envoyée
                        </h2>

                        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                            Nous vous remercions pour votre confiance. Un membre de notre équipe paroissiale prendra contact avec vous dans les plus brefs délais, généralement sous 48 heures.
                        </p>

                        <Button
                            onClick={handleReset}
                            className="bg-red-700 hover:bg-red-800 text-white px-8"
                        >
                            Retour à l'accueil
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EcouteRequestForm;
