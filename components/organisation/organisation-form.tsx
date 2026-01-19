'use client'
import { ChangeEvent, useState } from 'react';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Label } from '../ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrganisation } from '@/services/organisation/organisation.action';
import { OrganisationType } from '@/services/organisation/organisation.schema';
import { toast } from 'sonner';

export default function OrganisationForm() {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    isParishMember: 'yes',
    movement: '',
    email: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    estimatedParticipants: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  console.log(formData);
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // In a real app, you would send the form data to your backend here
  };

  const resetForm = () => {
    setFormData({
      isParishMember: 'yes',
      movement: '',
      email: '',
      eventType: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      estimatedParticipants: ''
    });
    setCurrentStep(1);
    setIsSubmitted(false);
  };
  const mutation = useMutation({
    mutationFn: (data: OrganisationType) => createOrganisation(data),
    onSuccess: () => {
      toast.success('✅ Organisation créée !');
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
      // reset formulaire si besoin
      setFormData({
        isParishMember: 'yes',
        movement: '',
        email: '',
        eventType: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        estimatedParticipants: '',
      });
      setCurrentStep(1);
    },
    onError: (error: any) => {
      toast.error('❌ Erreur création organisation :', error.message);
    },
  });
  const steps = [
    { title: "Organisateur", description: "Votre mouvement ou groupe fait-il déjà partie de la paroisse ?" },
    { title: "Type d'événement", description: "Sélectionnez le type d'activité" },
    { title: "Date et Horaires", description: "Planifiez votre événement" },
    { title: "Détails complémentaires", description: "Description de l'événement et besoins spécifiques" }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-end">
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Félicitation</h2>
            <p className="text-gray-600 mb-6">
              Votre demande a bien été envoyée. Nous vous remercions pour cette confiance. Un membre de notre équipe paroissiale prendra contact avec vous dans les plus brefs délais, généralement sous 48 heures.
            </p>
            <button className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors">
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cover bg-center items-center justify-center p-4 bg-red-900" style={{ backgroundImage: "url('/assets/images/avatar-temoin.jpg')" }}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="relative h-48 " >
          <div className="absolute top-4 left-4">
            <button
              onClick={handlePrevStep}
              className="flex items-center text-white bg-black bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour
            </button>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-white text-sm bg-red-700">Organiser un Événement Paroissial</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step indicator */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600 text-sm">{steps[currentStep - 1].description}</p>
          </div>

          {/* Form content based on current step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Votre mouvement ou groupe fait-il déjà partie de la paroisse ?</Label>
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="parishMemberYes"
                      name="isParishMember"
                      value="yes"
                      checked={formData.isParishMember === 'yes'}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    <label htmlFor="parishMemberYes" className="text-sm text-gray-700">Oui</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="parishMemberNo"
                      name="isParishMember"
                      value="no"
                      checked={formData.isParishMember === 'no'}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    <label htmlFor="parishMemberNo" className="text-sm text-gray-700">Non</label>
                  </div>
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner votre mouvement</Label>
                <select
                  name="movement"
                  value={formData.movement}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un mouvement</option>
                  <option value="jeunesse">Jeunesse Catholique</option>
                  <option value="famille">Famille Chrétienne</option>
                  <option value="catechese">Catéchèse</option>
                  <option value="musique">Chorale</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Votre email</Label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Type d&apos;activité</Label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un type d&apos;activité</option>
                  <option value="messe">Messe</option>
                  <option value="adore">Adoration</option>
                  <option value="formation">Formation</option>
                  <option value="fete">Fête paroissiale</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Date de l&apos;événement</Label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</Label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</Label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Description de l&apos;événement et besoins spécifiques</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Nombre de participants estimé (optionnel)</Label>
                <input
                  type="number"
                  name="estimatedParticipants"
                  value={formData.estimatedParticipants}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Soumettre la demande
                  {mutation.isPending ? 'Envoi...' : ''}
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
