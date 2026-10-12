import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { TicketCategoryType, TicketTier, TicketEvent } from '../../types';
import { ticketingApi } from '../../services/ticketingApi';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: TicketEvent) => void;
}

const DEFAULT_POSTERS = [
  { label: 'Concert & Festival Live', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Gala & Réception Prestige', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Soirée Sunset & Beach Club', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Conférence & Sommet B2B', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Cérémonie & Défilé de Mode', url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1200&auto=format&fit=crop' }
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const [title, setTitle] = useState('');
  const [posterUrl, setPosterUrl] = useState(DEFAULT_POSTERS[0].url);
  const [customPosterInput, setCustomPosterInput] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('20:00');
  const [endTime, setEndTime] = useState('02:00');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dakar');
  const [category, setCategory] = useState('Concert & Festival');
  const [totalCapacity, setTotalCapacity] = useState('500');
  const [accessConditions, setAccessConditions] = useState<string[]>([
    'Billet électronique QR Code obligatoire à l’entrée.',
    'Tenue correcte exigée.',
    'Interdit aux mineurs non accompagnés.'
  ]);
  const [newCondition, setNewCondition] = useState('');

  // Organizer details
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [organizerCompany, setOrganizerCompany] = useState('');

  // Creator payment receiving
  const [creatorPaymentMethod, setCreatorPaymentMethod] = useState<'wave_phone' | 'wave_link' | 'orange_money' | 'free_money' | 'bank_custom'>('wave_phone');
  const [creatorPaymentRecipient, setCreatorPaymentRecipient] = useState('');
  const [creatorPaymentName, setCreatorPaymentName] = useState('');
  const [creatorPaymentInstructions, setCreatorPaymentInstructions] = useState('');

  // Ticket Tiers
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: 'tier-init-1',
      name: 'Billet Standard',
      category: 'Standard',
      price: 5000,
      totalQuantity: 300,
      soldQuantity: 0,
      saleStartDate: new Date().toISOString().split('T')[0],
      saleEndDate: '',
      description: 'Accès général à l’événement',
      perks: ['Entrée standard']
    },
    {
      id: 'tier-init-2',
      name: 'Billet VIP Prestige',
      category: 'VIP',
      price: 20000,
      totalQuantity: 100,
      soldQuantity: 0,
      saleStartDate: new Date().toISOString().split('T')[0],
      saleEndDate: '',
      description: 'Espace privatif VIP avec service dédié',
      perks: ['Accès espace VIP', 'Boisson de bienvenue', 'Coupe-file']
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddTier = (categoryType: TicketCategoryType = 'Standard') => {
    const newTier: TicketTier = {
      id: 'tier-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      name: categoryType === 'Gratuit' ? 'Billet Gratuit' : `Billet ${categoryType}`,
      category: categoryType,
      price: categoryType === 'Gratuit' ? 0 : categoryType === 'VVIP' ? 50000 : 10000,
      totalQuantity: 50,
      soldQuantity: 0,
      saleStartDate: new Date().toISOString().split('T')[0],
      saleEndDate: date || '',
      description: `Accès formule ${categoryType}`,
      perks: []
    };
    setTicketTiers((prev) => [...prev, newTier]);
  };

  const handleRemoveTier = (tierId: string) => {
    if (ticketTiers.length <= 1) {
      alert('Vous devez conserver au moins un type de billet.');
      return;
    }
    setTicketTiers((prev) => prev.filter((t) => t.id !== tierId));
  };

  const handleTierChange = (index: number, field: keyof TicketTier, value: any) => {
    setTicketTiers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setAccessConditions((prev) => [...prev, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setAccessConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !venueName.trim() || !date || !organizerEmail.trim() || !organizerPhone.trim()) {
      setErrorMessage('Veuillez remplir les informations obligatoires.');
      return;
    }

    if (ticketTiers.length === 0) {
      setErrorMessage('Veuillez définir au moins un type de billet.');
      return;
    }

    try {
      setIsLoading(true);
      const computedCapacity = ticketTiers.reduce((sum, t) => sum + (Number(t.totalQuantity) || 0), 0);

      const created = await ticketingApi.createEvent({
        title,
        posterUrl: customPosterInput.trim() || posterUrl,
        description,
        date,
        startTime,
        endTime,
        venueName,
        address: address || `${venueName}, ${city}`,
        city,
        category,
        totalCapacity: computedCapacity || Number(totalCapacity) || 300,
        ticketTiers,
        accessConditions,
        organizerName: organizerName || 'Organisateur Partenaire',
        organizerEmail,
        organizerPhone,
        organizerCompany,
        status: 'published',
        salesActive: true
      });

      setIsSuccess(true);
      onEventCreated(created);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la publication de l’événement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="create-event-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="create-event-modal-container"
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-4xl w-full text-white shadow-2xl overflow-hidden my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              Espace Organisateur • Billetterie Sénégal
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-white">
              Créer et Publier un Événement
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-white">
                Votre événement a été publié avec succès !
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Votre billetterie en ligne est désormais active sur la plateforme <strong>Expert Événementiel</strong>. Les participants peuvent dès à présent acheter leurs billets via Wave, Orange Money et recevoir leur QR Code unique.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider"
                >
                  Voir dans la Billetterie
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 border-b border-neutral-800 pb-2">
                  1. Informations Générales de l'Événement
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nom de l'événement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nuit du Mbalax & Afrobeats 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Catégorie de l'événement *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    >
                      <option value="Concert & Festival">Concert & Festival</option>
                      <option value="Gala & Soirée">Gala & Soirée</option>
                      <option value="Soirée & Clubbing">Soirée & Clubbing</option>
                      <option value="Conférence & B2B">Conférence & B2B</option>
                      <option value="Spectacle & Humour">Spectacle & Humour</option>
                      <option value="Mode & Beauté">Mode & Beauté</option>
                      <option value="Cérémonie & Mariage">Cérémonie & Mariage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Ville *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Saly">Saly Portudal</option>
                      <option value="Thiès">Thiès</option>
                      <option value="Saint-Louis">Saint-Louis</option>
                      <option value="Cap Skirring">Cap Skirring</option>
                      <option value="Mbour">Mbour</option>
                    </select>
                  </div>
                </div>

                {/* Poster Choice */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    Affiche de l'événement (Choisir un modèle ou entrer un lien)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                    {DEFAULT_POSTERS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPosterUrl(p.url);
                          setCustomPosterInput('');
                        }}
                        className={`relative rounded-xl overflow-hidden border text-left p-1 group transition-all ${
                          posterUrl === p.url && !customPosterInput
                            ? 'border-orange-500 ring-2 ring-orange-500/30'
                            : 'border-neutral-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-16 object-cover rounded-lg" />
                        <span className="text-[9px] font-bold block truncate mt-1 text-neutral-300">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    placeholder="Ou collez l'URL d'une affiche personnalisée (https://...)"
                    value={customPosterInput}
                    onChange={(e) => setCustomPosterInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Description détaillée de l'événement
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Programme, artistes invités, ambiance, dress code..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* 2. Date & Venue */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 border-b border-neutral-800 pb-2">
                  <Calendar className="w-4 h-4" />
                  2. Date, Heure & Lieu
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Date de l'événement *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Heure de début *
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Heure de fin (estimée)
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nom du lieu *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: King Fahd Palace, Grand Théâtre, Esplanade..."
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Adresse précise
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Almadies, Route de l'Aéroport, Dakar"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Ticket Tiers Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" />
                    3. Types de Billets & Tarification
                  </h4>

                  {/* Add categories quick buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-neutral-400 mr-1 hidden sm:inline">Ajouter :</span>
                    {(['Standard', 'VIP', 'VVIP', 'Early Bird', 'Pass', 'Gratuit'] as TicketCategoryType[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleAddTier(cat)}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-neutral-800 hover:bg-orange-500 hover:text-black transition-colors"
                      >
                        + {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {ticketTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-bold text-orange-400">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                            placeholder="Nom du billet (ex: Pass VIP)"
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white flex-1"
                          />
                          <select
                            value={tier.category}
                            onChange={(e) => handleTierChange(idx, 'category', e.target.value as TicketCategoryType)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-orange-400 font-bold"
                          >
                            <option value="Standard">Standard</option>
                            <option value="VIP">VIP</option>
                            <option value="VVIP">VVIP</option>
                            <option value="Early Bird">Early Bird</option>
                            <option value="Pass">Pass</option>
                            <option value="Gratuit">Gratuit</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTier(tier.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                          title="Supprimer ce billet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-0.5">
                            Prix (FCFA)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={tier.category === 'Gratuit' ? 0 : tier.price}
                            disabled={tier.category === 'Gratuit'}
                            onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-0.5">
                            Places disponibles
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tier.totalQuantity}
                            onChange={(e) => handleTierChange(idx, 'totalQuantity', Number(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-0.5">
                            Début des ventes
                          </label>
                          <input
                            type="date"
                            value={tier.saleStartDate}
                            onChange={(e) => handleTierChange(idx, 'saleStartDate', e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-0.5">
                            Fin des ventes
                          </label>
                          <input
                            type="date"
                            value={tier.saleEndDate || date}
                            onChange={(e) => handleTierChange(idx, 'saleEndDate', e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Access Conditions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 border-b border-neutral-800 pb-2">
                  4. Conditions d'Accès
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une règle (ex: Pièce d'identité obligatoire)"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="space-y-1.5">
                  {accessConditions.map((cond, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-neutral-300 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-850">
                      <span>• {cond}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(i)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Organizer Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 border-b border-neutral-800 pb-2">
                  5. Coordonnées de l'Organisateur
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nom du responsable *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cheikh Tidiane Wade"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nom de la structure / Agence
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: AfroWave Production SARL"
                      value={organizerCompany}
                      onChange={(e) => setOrganizerCompany(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Email officiel *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@agence.sn"
                      value={organizerEmail}
                      onChange={(e) => setOrganizerEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Téléphone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+221 77 000 00 00"
                      value={organizerPhone}
                      onChange={(e) => setOrganizerPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-neutral-800">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  {isLoading ? 'Publication en cours...' : 'Publier mon événement sur Expert Événementiel'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
