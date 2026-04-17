'use client'
import { useState } from 'react';
import { ArrowLeft, CheckCircle, CalendarPlus, DollarSign, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organisationAPI } from '@/features/organisation/apis/organisation.api';
import { OrganisationType } from '@/features/organisation/schemas/organisation.schema';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {
  Button,
  Input,
  Label,
  Select,
  ListBox,
  TextArea,
  TextField,
  RadioGroup,
  Radio,
  NumberField,
  Description,
  Card,
  DatePicker,
  DateField,
  Calendar,
  TimeField,
  Switch,
} from "@heroui/react";
import { PricingTiersEditor, type PricingTier } from "@/components/admin/pricing-tiers-editor";
import { today, getLocalTimeZone } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";

export default function OrganisationForm() {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    isParishMember: 'yes',
    movement: '',
    email: '',
    eventType: '',
    description: '',
    estimatedParticipants: '',
  });
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [startTime, setStartTime] = useState<TimeValue | null>(null);
  const [endTime, setEndTime] = useState<TimeValue | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Paiement et places (étape 4)
  const [isPaid, setIsPaid] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const handleNextStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.movement) errors.movement = "Veuillez sélectionner un mouvement";
      if (!formData.email.trim()) errors.email = "L'e-mail est obligatoire";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Adresse email invalide";
    }
    if (currentStep === 2) {
      if (!formData.eventType) errors.eventType = "Veuillez sélectionner un type d'activité";
    }
    if (currentStep === 3) {
      if (!selectedDate) errors.selectedDate = "Veuillez sélectionner une date";
      if (!startTime) errors.startTime = "Veuillez renseigner l'heure de début";
      if (!endTime) errors.endTime = "Veuillez renseigner l'heure de fin";
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setStepErrors({});
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setFormData({ isParishMember: 'yes', movement: '', email: '', eventType: '', description: '', estimatedParticipants: '' });
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const mutation = useMutation({
    mutationFn: (data: OrganisationType) => organisationAPI.ajouter(data),
    onSuccess: () => {
      toast.success('Organisation créée !');
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      toast.error('Erreur : ' + error.message);
    },
  });

  const steps = [
    { title: "Organisateur", description: "Informations sur votre mouvement" },
    { title: "Type d'événement", description: "Sélectionnez le type d'activité" },
    { title: "Date et Horaires", description: "Planifiez votre événement" },
    { title: "Détails", description: "Description et besoins spécifiques" },
  ];

  // ─── SUCCESS ───
  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/images/mvt-id.jpg" alt="Événement" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
        </div>
        <div className="relative z-10 w-full max-w-md mx-4">
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <Card.Header>
              <Card.Title className="text-2xl font-bold text-[#2d2d83]">Demande envoyée</Card.Title>
              <Card.Description>Un membre de notre équipe vous contactera sous 48 heures.</Card.Description>
            </Card.Header>
            <Card.Footer className="flex flex-col gap-3 mt-4">
              <Button variant="primary" className="w-full bg-[#98141f] rounded-xl" onPress={resetForm}>Nouvelle demande</Button>
              <Link href="/" className="text-[#2d2d83] hover:underline text-sm font-medium">Retour à l&apos;accueil</Link>
            </Card.Footer>
          </Card>
        </div>
      </div>
    );
  }

  // ─── FORM ───
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/mvt-id.jpg" alt="Événement paroissial" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      {/* Back to home (always) */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
          <ArrowLeft size={18} /><span className="text-sm font-medium">Accueil</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl mb-4">
            <CalendarPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Organiser un Événement</h1>
          <p className="text-white/70 text-sm">Planifiez un événement paroissial en quelques étapes</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? "bg-white w-10" : "bg-white/30 w-6"}`} />
          ))}
        </div>

        {/* Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <Card.Header className="px-6 pt-6 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-[#98141f] uppercase tracking-wider mb-1">Étape {currentStep} sur 4</p>
            <Card.Title className="text-lg font-bold text-[#2d2d83]">{steps[currentStep - 1].title}</Card.Title>
            <Card.Description>{steps[currentStep - 1].description}</Card.Description>
          </Card.Header>

          <Card.Content className="p-6">
            {currentStep === 1 && (
              <div className="space-y-5">
                <RadioGroup
                  value={formData.isParishMember}
                  onChange={(val) => setFormData((prev) => ({ ...prev, isParishMember: val }))}
                  orientation="horizontal"
                >
                  <Label>Membre de la paroisse ?</Label>
                  <div className="flex gap-4">
                    <Radio value="yes">
                      <Radio.Control><Radio.Indicator /></Radio.Control>
                      <Radio.Content><Label>Oui</Label></Radio.Content>
                    </Radio>
                    <Radio value="no">
                      <Radio.Control><Radio.Indicator /></Radio.Control>
                      <Radio.Content><Label>Non</Label></Radio.Content>
                    </Radio>
                  </div>
                </RadioGroup>

                <Select
                  placeholder="Sélectionnez un mouvement"
                  selectedKey={formData.movement || undefined}
                  onSelectionChange={(key) => setFormData((prev) => ({ ...prev, movement: String(key) }))}
                >
                  <Label>Mouvement</Label>
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="jeunesse" textValue="Jeunesse Catholique">Jeunesse Catholique</ListBox.Item>
                      <ListBox.Item id="famille" textValue="Famille Chrétienne">Famille Chrétienne</ListBox.Item>
                      <ListBox.Item id="catechese" textValue="Catéchèse">Catéchèse</ListBox.Item>
                      <ListBox.Item id="musique" textValue="Chorale">Chorale</ListBox.Item>
                      <ListBox.Item id="autre" textValue="Autre">Autre</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                {stepErrors.movement && <p className="text-red-500 text-xs">{stepErrors.movement}</p>}

                <TextField
                  value={formData.email}
                  onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
                  isInvalid={!!stepErrors.email}
                >
                  <Label>E-mail</Label>
                  <Input type="email" placeholder="jean@exemple.com" />
                  {stepErrors.email && <Description className="text-red-500 text-xs">{stepErrors.email}</Description>}
                </TextField>

                <div className="flex justify-between pt-2">
                  <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2d2d83] px-4 py-2 rounded-xl">
                    <ArrowLeft size={16} /> Annuler
                  </Link>
                  <Button variant="primary" className="bg-[#2d2d83] rounded-xl px-6" onPress={handleNextStep}>Suivant</Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <Select
                  placeholder="Sélectionnez un type"
                  selectedKey={formData.eventType || undefined}
                  onSelectionChange={(key) => setFormData((prev) => ({ ...prev, eventType: String(key) }))}
                >
                  <Label>Type d&apos;activité</Label>
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="messe" textValue="Messe">Messe</ListBox.Item>
                      <ListBox.Item id="adore" textValue="Adoration">Adoration</ListBox.Item>
                      <ListBox.Item id="formation" textValue="Formation">Formation</ListBox.Item>
                      <ListBox.Item id="fete" textValue="Fête paroissiale">Fête paroissiale</ListBox.Item>
                      <ListBox.Item id="autre" textValue="Autre">Autre</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                {stepErrors.eventType && <p className="text-red-500 text-xs">{stepErrors.eventType}</p>}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="rounded-xl" onPress={handlePrevStep}>Précédent</Button>
                  <Button variant="primary" className="bg-[#2d2d83] rounded-xl px-6" onPress={handleNextStep}>Suivant</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-5">
                <DatePicker
                  className="w-full"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minValue={today(getLocalTimeZone())}
                >
                  <Label>Date de l&apos;événement</Label>
                  <DateField.Group fullWidth>
                    <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <DatePicker.Popover>
                    <Calendar aria-label="Date événement">
                      <Calendar.Header>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.Heading />
                        <Calendar.NavButton slot="next" />
                      </Calendar.Header>
                      <Calendar.Grid>
                        <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                      </Calendar.Grid>
                    </Calendar>
                  </DatePicker.Popover>
                </DatePicker>

                <div className="grid grid-cols-2 gap-4">
                  <TimeField className="w-full" value={startTime} onChange={setStartTime}>
                    <Label>Heure de début</Label>
                    <TimeField.Group>
                      <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
                    </TimeField.Group>
                  </TimeField>

                  <TimeField className="w-full" value={endTime} onChange={setEndTime}>
                    <Label>Heure de fin</Label>
                    <TimeField.Group>
                      <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>

                {(stepErrors.selectedDate || stepErrors.startTime || stepErrors.endTime) && (
                  <div className="space-y-1">
                    {stepErrors.selectedDate && <p className="text-red-500 text-xs">{stepErrors.selectedDate}</p>}
                    {stepErrors.startTime && <p className="text-red-500 text-xs">{stepErrors.startTime}</p>}
                    {stepErrors.endTime && <p className="text-red-500 text-xs">{stepErrors.endTime}</p>}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="rounded-xl" onPress={handlePrevStep}>Précédent</Button>
                  <Button variant="primary" className="bg-[#2d2d83] rounded-xl px-6" onPress={handleNextStep}>Suivant</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                <TextField
                  value={formData.description}
                  onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
                  isInvalid={!!stepErrors.description}
                >
                  <Label>Description de l&apos;événement</Label>
                  <TextArea placeholder="Décrivez votre événement et vos besoins..." rows={4} />
                  {stepErrors.description && (
                    <Description className="text-red-500 text-xs">{stepErrors.description}</Description>
                  )}
                </TextField>

                <TextField
                  value={formData.estimatedParticipants}
                  onChange={(val) => setFormData((prev) => ({ ...prev, estimatedParticipants: val }))}
                >
                  <Label>Participants estimés (optionnel)</Label>
                  <Input type="number" placeholder="Ex: 50" />
                </TextField>

                {/* Tarification */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Tarification (optionnel)
                  </p>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Événement payant</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ajoutez un ou plusieurs tarifs (Standard/VIP/VVIP…)
                      </p>
                    </div>
                    <Switch isSelected={isPaid} onChange={(v) => {
                      setIsPaid(v);
                      if (!v) setPricingTiers([]);
                    }} />
                  </div>
                  {isPaid && (
                    <PricingTiersEditor tiers={pricingTiers} onChange={setPricingTiers} />
                  )}
                </div>

                {/* Places & deadline (indépendant) */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                    <Users className="w-4 h-4" /> Inscription (optionnel)
                  </p>
                  <TextField value={maxParticipants} onChange={setMaxParticipants}>
                    <Label>Nombre max de participants</Label>
                    <Input type="number" inputMode="numeric" placeholder="Laisser vide = illimité" />
                  </TextField>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date limite d&apos;inscription
                    </label>
                    <input
                      type="datetime-local"
                      value={registrationDeadline}
                      onChange={(e) => setRegistrationDeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="rounded-xl" onPress={handlePrevStep}>Précédent</Button>
                  <Button
                    variant="primary"
                    className="bg-[#98141f] rounded-xl px-6"
                    isDisabled={mutation.isPending}
                    onPress={() => {
                      if (!formData.description.trim() || formData.description.trim().length < 10) {
                        setStepErrors({ description: "La description doit contenir au moins 10 caractères" });
                        return;
                      }
                      if (isPaid && pricingTiers.length === 0) {
                        toast.error("Ajoutez au moins un tarif ou désactivez 'Événement payant'");
                        return;
                      }
                      const dateStr = selectedDate
                        ? `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`
                        : "";
                      const startTimeStr = startTime
                        ? `${String(startTime.hour).padStart(2, "0")}:${String(startTime.minute).padStart(2, "0")}`
                        : "";
                      const endTimeStr = endTime
                        ? `${String(endTime.hour).padStart(2, "0")}:${String(endTime.minute).padStart(2, "0")}`
                        : "";
                      const lowestPrice = isPaid && pricingTiers.length
                        ? Math.min(...pricingTiers.map(t => t.amount))
                        : null;
                      mutation.mutate({
                        ...formData,
                        date: dateStr,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        is_paid: isPaid,
                        price: lowestPrice,
                        pricing_tiers: isPaid && pricingTiers.length ? pricingTiers : null,
                        max_participants: maxParticipants ? Number(maxParticipants) : null,
                        registration_deadline: registrationDeadline || null,
                      } as any);
                    }}
                  >
                    {mutation.isPending ? 'Envoi...' : 'Soumettre'}
                  </Button>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
