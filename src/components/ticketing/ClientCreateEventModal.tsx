import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Share2,
  Info
} from 'lucide-react';
import { TicketEvent, TicketTier } from '../../types';
import { ticketingApi } from '../../services/ticketingApi';

interface ClientCreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: TicketEvent) => void;
}

const WAVE_MERCHANT_URL = 'https://pay.wave.com/m/M_sn_lHy4DaHe66Bv/c/sn/';
const CREATION_FEE_CFA = 10000;

// Device detection helper
const getClientDeviceName = (): string => {
  if (typeof navigator === 'undefined') return 'Appareil Connecté';
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('ipad')) return 'Tablette iPad';
  if (ua.includes('tablet') || (ua.includes('android') && !ua.includes('mobile'))) return 'Tablette Android';
  if (ua.includes('iphone')) return 'iPhone (iOS)';
  if (ua.includes('android')) return 'Android Mobile';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'Mac (macOS)';
  if (ua.includes('windows')) return 'Ordinateur Windows';
  if (ua.includes('linux')) return 'Linux PC';
  return 'Navigateur Web';
};

const SUGGESTED_POSTERS = [
  {
    label: 'Concert & Show Live',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Soirée Club & DJ Mix',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Gala & Réception VIP',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Conférence & Forum',
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Festival en Plein Air',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop'
  }
];

export const ClientCreateEventModal: React.FC<ClientCreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = useState<TicketEvent | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Concert & Festival');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('20:00');
  const [endTime, setEndTime] = useState('02:00');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('Dakar');
  const [address, setAddress] = useState('');
  const [posterUrl, setPosterUrl] = useState(SUGGESTED_POSTERS[0].url);
  const [description, setDescription] = useState('');

  // Tiers
  const [tiers, setTiers] = useState<TicketTier[]>([
    {
      id: 'tier-std',
      name: 'Pass Standard',
      category: 'Standard',
      price: 5000,
      totalQuantity: 200,
      soldQuantity: 0,
      saleStartDate: new Date().toISOString(),
      saleEndDate: '',
      perks: ['Entrée simple à l’événement', 'Billet électronique avec QR Code sécurisé']
    },
    {
      id: 'tier-vip',
      name: 'Pass VIP',
      category: 'VIP',
      price: 15000,
      totalQuantity: 50,
      soldQuantity: 0,
      saleStartDate: new Date().toISOString(),
      saleEndDate: '',
      perks: ['Accès espace VIP réservé', '1 Boisson offerte', 'File d’attente prioritaire']
    }
  ]);

  // Organizer info
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [organizerCompany, setOrganizerCompany] = useState('');

  // Creator payment receiving setup (how buyer pays the organizer)
  const [creatorPaymentMethod, setCreatorPaymentMethod] = useState<'wave_phone' | 'wave_link' | 'orange_money' | 'free_money' | 'bank_custom'>('wave_phone');
  const [creatorPaymentRecipient, setCreatorPaymentRecipient] = useState('');
  const [creatorPaymentName, setCreatorPaymentName] = useState('');
  const [creatorPaymentInstructions, setCreatorPaymentInstructions] = useState('');

  // Payment proof (Wave 10 000 FCFA fee to platform)
  const [wavePaymentRef, setWavePaymentRef] = useState('');
  const [confirmedPaidInWave, setConfirmedPaidInWave] = useState(false);
  const [waveLinkClicked, setWaveLinkClicked] = useState(false);

  if (!isOpen) return null;

  const handleAddTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: 'Nouveau Billet',
      category: 'Standard',
      price: 10000,
      totalQuantity: 100,
      soldQuantity: 0,
      saleStartDate: new Date().toISOString(),
      saleEndDate: '',
      perks: ['Accès à l’événement', 'Billet avec QR Code sécurisé']
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleUpdateTier = (index: number, field: keyof TicketTier, value: any) => {
    const next = [...tiers];
    next[index] = { ...next[index], [field]: value };
    setTiers(next);
  };

  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Veuillez choisir une image de moins de 8 Mo');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPosterUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    if (!title.trim()) {
      setErrorMsg('Veuillez renseigner le titre de l’événement.');
      return false;
    }
    if (!date) {
      setErrorMsg('Veuillez renseigner la date de l’événement.');
      return false;
    }
    if (!venueName.trim()) {
      setErrorMsg('Veuillez indiquer le lieu de réception.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep2 = () => {
    if (tiers.length === 0) {
      setErrorMsg('Veuillez définir au moins une catégorie de billet.');
      return false;
    }
    for (const t of tiers) {
      if (!t.name.trim() || t.price < 0 || t.totalQuantity <= 0) {
        setErrorMsg('Vérifiez les tarifs et quantités de chaque formule de billet.');
        return false;
      }
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep3 = () => {
    if (!organizerName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return false;
    }
    if (!organizerPhone.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone WhatsApp.');
      return false;
    }
    if (!organizerEmail.trim() || !organizerEmail.includes('@')) {
      setErrorMsg('Veuillez renseigner une adresse email valide pour recevoir vos récapitulatifs.');
      return false;
    }
    // Auto populate creator payment fields if empty
    if (!creatorPaymentRecipient.trim()) {
      setCreatorPaymentRecipient(organizerPhone.trim());
    }
    if (!creatorPaymentName.trim()) {
      setCreatorPaymentName(organizerName.trim());
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep4 = () => {
    if (!creatorPaymentRecipient.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone ou lien de paiement pour encaisser les ventes.');
      return false;
    }
    if (!creatorPaymentName.trim()) {
      setErrorMsg('Veuillez renseigner le nom de bénéficiaire du compte pour rassurer vos acheteurs.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleResetAndCreateAnother = () => {
    setTitle('');
    setCategory('Concert & Festival');
    setDate('');
    setStartTime('20:00');
    setEndTime('02:00');
    setVenueName('');
    setCity('Dakar');
    setAddress('');
    setPosterUrl(SUGGESTED_POSTERS[0].url);
    setDescription('');
    setTiers([
      {
        id: 'tier-std',
        name: 'Pass Standard',
        category: 'Standard',
        price: 5000,
        totalQuantity: 200,
        soldQuantity: 0,
        saleStartDate: new Date().toISOString(),
        saleEndDate: '',
        perks: ['Entrée simple à l’événement', 'Billet électronique avec QR Code sécurisé']
      },
      {
        id: 'tier-vip',
        name: 'Pass VIP',
        category: 'VIP',
        price: 15000,
        totalQuantity: 50,
        soldQuantity: 0,
        saleStartDate: new Date().toISOString(),
        saleEndDate: '',
        perks: ['Accès espace VIP réservé', '1 Boisson offerte', 'File d’attente prioritaire']
      }
    ]);
    setOrganizerName('');
    setOrganizerEmail('');
    setOrganizerPhone('');
    setOrganizerCompany('');
    setCreatorPaymentMethod('wave_phone');
    setCreatorPaymentRecipient('');
    setCreatorPaymentName('');
    setCreatorPaymentInstructions('');
    setWavePaymentRef('');
    setConfirmedPaidInWave(false);
    setWaveLinkClicked(false);
    setErrorMsg(null);
    setCreatedEvent(null);
    setStep(1);
  };

  const handleCloseAndReset = () => {
    handleResetAndCreateAnother();
    onClose();
  };

  const handleFinalSubmit = async () => {
    if (!wavePaymentRef.trim()) {
      setErrorMsg('Veuillez saisir votre référence de transaction Wave ou numéro payeur.');
      return;
    }
    if (!confirmedPaidInWave) {
      setErrorMsg('Veuillez cocher la case attestant le paiement sur le lien Wave officiel.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const totalCapacity = tiers.reduce((acc, t) => acc + (t.totalQuantity || 0), 0);
      const minPrice = Math.min(...tiers.map((t) => t.price));

      const newEventPayload: Partial<TicketEvent> = {
        title: title.trim(),
        posterUrl: posterUrl || SUGGESTED_POSTERS[0].url,
        description: description.trim() || 'Événement officiel hébergé sur la billetterie Expert Événementiel.',
        date,
        startTime,
        endTime,
        venueName: venueName.trim(),
        address: address.trim() || `${venueName}, ${city}`,
        city,
        category,
        totalCapacity,
        ticketsSold: 0,
        ticketTiers: tiers,
        accessConditions: [
          'Billet avec QR Code officiel obligatoire à l’entrée.',
          'Une seule validation par QR Code (inviolable).',
          'Tenue correcte exigée par l’organisateur.'
        ],
        organizerName: organizerName.trim(),
        organizerEmail: organizerEmail.trim(),
        organizerPhone: organizerPhone.trim(),
        organizerCompany: organizerCompany.trim(),
        creatorPaymentMethod,
        creatorPaymentRecipient: creatorPaymentRecipient.trim(),
        creatorPaymentName: creatorPaymentName.trim(),
        creatorPaymentInstructions: creatorPaymentInstructions.trim(),
        isClientCreated: true,
        creationFeeAmount: CREATION_FEE_CFA,
        creationFeePaid: true,
        wavePaymentRef: wavePaymentRef.trim(),
        waveMerchantLink: WAVE_MERCHANT_URL,
        createdFromDevice: getClientDeviceName(),
        status: 'published',
        salesActive: true,
        minPrice
      };

      const created = await ticketingApi.createEvent(newEventPayload);
      setCreatedEvent(created);
      onEventCreated(created);
      setStep(6); // Success step
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la publication de votre événement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCalculatedCapacity = tiers.reduce((s, t) => s + (Number(t.totalQuantity) || 0), 0);
  const lowestPrice = tiers.length > 0 ? Math.min(...tiers.map((t) => Number(t.price) || 0)) : 0;

  return (
    <div
      id="client-create-event-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="client-create-event-modal"
        className="relative max-w-3xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-neutral-100 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  Création Événement Client
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  Wave 10 000 FCFA
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Publier votre Événement dans la Billetterie
              </h2>
            </div>
          </div>
          <button
            type="button"
            id="close-client-create-btn"
            onClick={step === 6 ? handleCloseAndReset : onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 5) */}
        {step < 6 && (
          <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
              {[
                { num: 1, label: '1. Informations' },
                { num: 2, label: '2. Billets & Tarifs' },
                { num: 3, label: '3. Organisateur' },
                { num: 4, label: '4. Encaissement Billets' },
                { num: 5, label: '5. Paiement Wave (10 000 F)' }
              ].map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center gap-1.5 whitespace-nowrap font-bold px-2.5 py-1 rounded-lg transition-all ${
                    step === s.num
                      ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                      : step > s.num
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-neutral-500'
                  }`}
                >
                  <span>{s.label}</span>
                  {step > s.num && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
          {/* STEP 1: Event Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Titre de votre Événement *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Concert Afrobeats Live, Gala de Charité, Soirée Blanche..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Catégorie *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
                  >
                    <option value="Concert & Festival">Concert & Festival</option>
                    <option value="Soirée & Nightlife">Soirée & Nightlife</option>
                    <option value="Gala & Réception">Gala & Réception</option>
                    <option value="Conférence & Séminaire">Conférence & Séminaire</option>
                    <option value="Théâtre & Humour">Théâtre & Humour</option>
                    <option value="Sport & Compétition">Sport & Compétition</option>
                    <option value="Autre Événement">Autre Événement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Date de l’événement *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Heure Début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Heure Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Ville *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
                  >
                    <option value="Dakar">Dakar</option>
                    <option value="Thiès">Thiès</option>
                    <option value="Saly Portudal">Saly Portudal</option>
                    <option value="Saint-Louis">Saint-Louis</option>
                    <option value="Mbour">Mbour</option>
                    <option value="Ziguinchor">Ziguinchor</option>
                    <option value="Autre ville">Autre ville</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Nom du Lieu / Salle *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Monument Renaissance, Terrou-Bi, CICES..."
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Adresse ou Quartier
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Almadies, Route de la Corniche..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Poster Upload or Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Affiche de l’événement (Image / Poster)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-28 h-36 rounded-xl border-2 border-dashed border-neutral-700 overflow-hidden shrink-0 bg-neutral-950 relative flex items-center justify-center">
                    {posterUrl ? (
                      <img src={posterUrl} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-xs font-bold text-neutral-200 transition-colors border border-neutral-700">
                      <Upload className="w-4 h-4 text-orange-400" />
                      <span>Téléverser votre propre affiche (Fichier image)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePosterFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-neutral-500">Ou choisissez parmi ces visuels professionnels :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_POSTERS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPosterUrl(p.url)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                            posterUrl === p.url
                              ? 'border-orange-500 bg-orange-500/20 text-orange-400 font-bold'
                              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Description détaillée de l’événement
                </label>
                <textarea
                  rows={3}
                  placeholder="Présentez le programme, les artistes ou intervenants, les surprises, le dress code..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Tiers & Pricing */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Catégories de Billets en Vente</h3>
                  <p className="text-xs text-neutral-400">
                    Définissez les formules de billets que le public pourra acheter en ligne.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une formule</span>
                </button>
              </div>

              <div className="space-y-3">
                {tiers.map((tier, idx) => (
                  <div
                    key={tier.id || idx}
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                          Nom du Billet (Ex: Pass Standard, VIP, Table...)
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleUpdateTier(idx, 'name', e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                          Prix (FCFA)
                        </label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleUpdateTier(idx, 'price', Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-orange-400 font-extrabold text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="w-28">
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                          Quota places
                        </label>
                        <input
                          type="number"
                          value={tier.totalQuantity}
                          onChange={(e) =>
                            handleUpdateTier(idx, 'totalQuantity', Number(e.target.value))
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTier(idx)}
                          className="p-2 text-neutral-500 hover:text-red-400 transition-colors mt-4"
                          title="Supprimer ce billet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary box */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                <div>
                  Capacité totale en vente :{' '}
                  <span className="font-extrabold text-white">{totalCalculatedCapacity} places</span>
                </div>
                <div>
                  Tarif d'appel :{' '}
                  <span className="font-extrabold text-orange-400">{lowestPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Organizer Details */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Vos Coordonnées d’Organisateur</h3>
                <p className="text-xs text-neutral-400">
                  Ces informations permettront de vous identifier et de vous transmettre les notifications de ventes de billets.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Nom & Prénom de l’Organisateur *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ibrahima Diop, Awa Ndiaye..."
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Téléphone WhatsApp (avec indicatif) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    placeholder="contact@mon-evenement.sn"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Structure / Nom du Collectif / Entreprise (Facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sunu Vibes Production, Club des Jeunes Cadres..."
                  value={organizerCompany}
                  onChange={(e) => setOrganizerCompany(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Mode de réception des paiements acheteurs (Votre moyen de paiement) */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-neutral-900 to-neutral-950 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Encaissement Direct
                  </span>
                  <span className="text-xs text-neutral-400">100% de vos recettes vous sont directement versées</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  Choisissez comment vous souhaitez recevoir l'argent des acheteurs
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  L'acheteur paiera directement sur votre propre compte ou lien lors de sa commande de billets.
                </p>
              </div>

              {/* Payment methods selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Sélectionnez votre méthode d'encaissement préférée :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Wave Phone */}
                  <button
                    type="button"
                    onClick={() => setCreatorPaymentMethod('wave_phone')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      creatorPaymentMethod === 'wave_phone'
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-sm text-sky-400">Wave Numéro</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${creatorPaymentMethod === 'wave_phone' ? 'bg-sky-400' : 'bg-neutral-700'}`}></span>
                    </div>
                    <span className="text-[11px] text-neutral-300">Numéro direct Wave</span>
                  </button>

                  {/* Wave Link */}
                  <button
                    type="button"
                    onClick={() => setCreatorPaymentMethod('wave_link')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      creatorPaymentMethod === 'wave_link'
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-sm text-sky-400">Lien Marchand</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${creatorPaymentMethod === 'wave_link' ? 'bg-sky-400' : 'bg-neutral-700'}`}></span>
                    </div>
                    <span className="text-[11px] text-neutral-300">pay.wave.com/m/...</span>
                  </button>

                  {/* Orange Money */}
                  <button
                    type="button"
                    onClick={() => setCreatorPaymentMethod('orange_money')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      creatorPaymentMethod === 'orange_money'
                        ? 'bg-orange-500/20 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-sm text-orange-500">Orange Money</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${creatorPaymentMethod === 'orange_money' ? 'bg-orange-500' : 'bg-neutral-700'}`}></span>
                    </div>
                    <span className="text-[11px] text-neutral-300">OM / Code marchand</span>
                  </button>

                  {/* Free Money */}
                  <button
                    type="button"
                    onClick={() => setCreatorPaymentMethod('free_money')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      creatorPaymentMethod === 'free_money'
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-sm text-emerald-400">Free Money</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${creatorPaymentMethod === 'free_money' ? 'bg-emerald-400' : 'bg-neutral-700'}`}></span>
                    </div>
                    <span className="text-[11px] text-neutral-300">Portefeuille mobile</span>
                  </button>
                </div>
              </div>

              {/* Payment Details Inputs */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    {creatorPaymentMethod === 'wave_link'
                      ? 'Lien de paiement Wave Marchand de l\'organisateur (URL) *'
                      : creatorPaymentMethod === 'wave_phone'
                      ? 'Numéro Wave de l\'organisateur pour recevoir les paiements *'
                      : creatorPaymentMethod === 'orange_money'
                      ? 'Numéro Orange Money ou Code Marchand OM *'
                      : creatorPaymentMethod === 'free_money'
                      ? 'Numéro Free Money pour recevoir les fonds *'
                      : 'Coordonnées de réception de l\'organisateur *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      creatorPaymentMethod === 'wave_link'
                        ? 'https://pay.wave.com/m/M_sn_... ou votre lien de paiement'
                        : '+221 77 000 00 00'
                    }
                    value={creatorPaymentRecipient}
                    onChange={(e) => setCreatorPaymentRecipient(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {creatorPaymentMethod === 'wave_link'
                      ? 'Les acheteurs cliqueront sur votre lien Wave pour vous transférer le coût des billets.'
                      : 'Les acheteurs enverront le règlement de leurs billets à ce numéro.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Nom du titulaire / Nom affiché à l'acheteur *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Abdoulaye Ba / Dakar Prod"
                    value={creatorPaymentName}
                    onChange={(e) => setCreatorPaymentName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Ce nom rassurera l'acheteur lors de son paiement direct.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Instructions particulières pour les acheteurs (Facultatif)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Merci de mentionner votre nom complet en note du transfert Wave."
                    value={creatorPaymentInstructions}
                    onChange={(e) => setCreatorPaymentInstructions(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 text-xs font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Payment of 10 000 FCFA via Wave Merchant Link to platform */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Highlight Fee Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/60 via-neutral-900 to-neutral-950 border border-sky-500/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        Règlement Obligatoire
                      </span>
                      <span className="text-xs text-neutral-400">Plateforme Expert Événementiel</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Frais de Mise en Ligne :{' '}
                      <span className="text-sky-400">10 000 FCFA</span>
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 max-w-lg leading-relaxed">
                      Ce forfait unique active votre billetterie en ligne, l’encaissement direct de vos ventes, et la génération de billets avec QR Code sécurisé.
                    </p>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-sky-500 flex items-center justify-center text-black shadow-lg shadow-sky-500/30 font-black text-xl mx-auto">
                      🌊
                    </div>
                    <span className="text-[10px] font-bold text-sky-400 block mt-1">
                      Wave Sénégal
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Wave Merchant Button */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 text-center">
                <div className="max-w-md mx-auto space-y-2">
                  <p className="text-xs font-bold text-neutral-300">
                    Cliquez sur le bouton ci-dessous pour effectuer le paiement de{' '}
                    <span className="text-sky-400 font-extrabold">10 000 FCFA</span> sur notre lien marchand Wave officiel :
                  </p>
                  <a
                    href={WAVE_MERCHANT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setWaveLinkClicked(true)}
                    className="inline-flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-sky-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Payer 10 000 FCFA via Wave Sénégal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[11px] text-neutral-500">
                    Lien marchand officiel : <span className="font-mono text-sky-400">{WAVE_MERCHANT_URL}</span>
                  </p>
                </div>

                <div className="border-t border-neutral-800/80 pt-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 justify-center text-xs text-neutral-400 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Code Marchand Wave : <strong className="text-white">M_sn_lHy4DaHe66Bv</strong></span>
                  </div>
                </div>
              </div>

              {/* Payment Proof Fields */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Confirmation de votre règlement Wave
                </h4>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Référence de la transaction Wave ou Numéro ayant payé *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: WAVE-SN-982341 ou 77 XXX XX XX"
                    value={wavePaymentRef}
                    onChange={(e) => setWavePaymentRef(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 font-mono text-sm"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Indiquez le code reçu par SMS de Wave ou le numéro de téléphone utilisé pour régler.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={confirmedPaidInWave}
                    onChange={(e) => setConfirmedPaidInWave(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-neutral-700 text-sky-500 focus:ring-sky-400"
                  />
                  <span className="text-xs text-neutral-300 leading-relaxed">
                    Je certifie avoir effectué le règlement des <strong className="text-white">10 000 FCFA</strong> sur le lien marchand Wave officiel de l’agence Expert Événementiel et souhaite la publication immédiate de ma billetterie.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Success Screen & Multi-event Creation Option */}
          {step === 6 && createdEvent && (
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Publication Confirmée
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Félicitations ! Votre Événement est en Ligne !
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                  Votre billetterie a été créée avec succès. Les participants paieront directement sur votre moyen de paiement configuré.
                </p>
              </div>

              {/* Event Card Summary */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left flex gap-4 items-center">
                <img
                  src={createdEvent.posterUrl}
                  alt={createdEvent.title}
                  className="w-20 h-24 rounded-xl object-cover shrink-0 border border-neutral-700"
                />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-sm line-clamp-1">
                    {createdEvent.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-orange-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{createdEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{createdEvent.venueName}, {createdEvent.city}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    Frais Wave 10 000 F acquittés • Réf: {createdEvent.wavePaymentRef}
                  </div>
                </div>
              </div>

              {/* Creator payment confirmation badge */}
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs text-neutral-300 text-left max-w-md mx-auto space-y-1">
                <div className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Réception directe de vos recettes de billets :</span>
                </div>
                <div>Méthode : <strong className="text-white uppercase">{createdEvent.creatorPaymentMethod?.replace('_', ' ') || 'Wave'}</strong></div>
                <div>Coordonnées : <strong className="text-white font-mono">{createdEvent.creatorPaymentRecipient || createdEvent.organizerPhone}</strong></div>
                <div>Bénéficiaire : <strong className="text-white">{createdEvent.creatorPaymentName || createdEvent.organizerName}</strong></div>
              </div>

              {/* Action Buttons: Close, Create Another, View, Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                {/* Fermer */}
                <button
                  type="button"
                  id="client-created-close-btn"
                  onClick={handleCloseAndReset}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Fermer
                </button>

                {/* Créer un autre événement */}
                <button
                  type="button"
                  id="client-created-another-btn"
                  onClick={handleResetAndCreateAnother}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Créer un autre événement</span>
                </button>

                {/* Voir dans la billetterie */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('billetterie');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-orange-500/15 border border-orange-500/40 hover:bg-orange-500/25 text-orange-400 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Voir dans la Billetterie
                </button>

                {/* Partager sur WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `🎟️ Les billets pour l'événement *${createdEvent.title}* sont disponibles en ligne sur la billetterie Expert Événementiel ! Réservez vos places : ${window.location.origin}#billetterie`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls (Steps 1 to 5) */}
        {step < 6 && (
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-t border-neutral-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setStep((prev) => (prev - 1) as any);
                }}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-bold transition-colors"
              >
                Précédent
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Suivant : Formules de Billets
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Suivant : Vos Coordonnées
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setStep(4);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Suivant : Encaissement des Recettes
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep4()) setStep(5);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Suivant : Règlement Wave 10 000 F
              </button>
            )}

            {step === 5 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Publication en cours...' : 'Valider & Mettre en Ligne (10 000 FCFA)'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
