import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  Calendar, 
  Users, 
  Layers, 
  Instagram, 
  Facebook, 
  Youtube,
  Share2
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { QuoteFormData } from '../types';

interface ContactSectionProps {
  initialService?: string;
  initialFormula?: string;
  initialEventType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService,
  initialFormula,
  initialEventType
}) => {
  const { companyInfo, services, formulas } = useSiteContent();
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    phone: '',
    email: '',
    eventType: initialEventType || 'Mariage',
    eventDate: '',
    guestCount: '100 à 250 personnes',
    locationCity: 'Dakar',
    services: initialService ? [initialService] : ['Location de sonorisation', 'DJ & Animation'],
    selectedFormula: initialFormula || '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.includes(initialService) ? prev.services : [...prev.services, initialService]
      }));
    }
  }, [initialService]);

  useEffect(() => {
    if (initialFormula) {
      setFormData((prev) => ({
        ...prev,
        selectedFormula: initialFormula
      }));
    }
  }, [initialFormula]);

  useEffect(() => {
    if (initialEventType) {
      setFormData((prev) => ({
        ...prev,
        eventType: initialEventType
      }));
    }
  }, [initialEventType]);

  const handleCheckboxChange = (serviceTitle: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceTitle);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== serviceTitle)
          : [...prev.services, serviceTitle]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate brief processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleSendViaWhatsApp = () => {
    const text = `*DEMANDE DE DEVIS - EXPERT ÉVÉNEMENTIEL*
• Nom: ${formData.fullName || 'Non spécifié'}
• Téléphone: ${formData.phone || 'Non spécifié'}
• Email: ${formData.email || 'Non spécifié'}
• Type d'événement: ${formData.eventType}
• Date prévue: ${formData.eventDate || 'À définir'}
• Nombre de convives: ${formData.guestCount}
• Lieu: ${formData.locationCity}
${formData.selectedFormula ? `• Formule choisie: ${formData.selectedFormula}\n` : ''}• Services souhaités: ${formData.services.join(', ') || 'À conseiller'}
• Message: ${formData.message || 'Aucun message particulier'}`;

    const url = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const eventTypesList = [
    'Mariage',
    'Anniversaire',
    'Soirée privée / Gala',
    'Baptême',
    'Conférence / Séminaire',
    'Événement d’entreprise',
    'Concert / Festival',
    'Cérémonie protocolaire',
    'Autre événement'
  ];

  const guestCountOptions = [
    'Moins de 50 personnes',
    '50 à 100 personnes',
    '100 à 250 personnes',
    '250 à 500 personnes',
    'Plus de 500 personnes'
  ];

  const citiesOptions = [
    'Dakar (Almadies, Ngor, Plateau, etc.)',
    'Thiès & environs',
    'Saly / Mbour / Petite Côte',
    'Saint-Louis',
    'Ziguinchor / Casamance',
    'Autre ville / Région au Sénégal'
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            DEVIS EXPRESS & ÉCOUTE CLIENT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            DEMANDER <span className="text-orange-500">UN DEVIS</span> & CONTACT
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Parlez-nous de votre projet. Nous vous répondons sous 24h ouvrées avec une proposition technique et tarifaire sur mesure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Coordinates & Information */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-7 sm:p-8 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-orange-500 block mb-1">
                  Entreprise Sénégalaise
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  EXPERT ÉVÉNEMENTIEL
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                  {companyInfo.slogan}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-neutral-800">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Localisation
                    </div>
                    <div className="text-sm font-semibold text-white">
                      📍 Sénégal
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {companyInfo.headquarters}
                    </div>
                  </div>
                </div>

                {/* Telephone / WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Téléphone & WhatsApp
                    </div>
                    <div className="text-sm font-bold text-white flex flex-col gap-0.5 mt-0.5">
                      <a href={`tel:${companyInfo.phone.replace(/\s+/g, '')}`} className="hover:text-orange-400 transition-colors">
                        📱 {companyInfo.phone}
                      </a>
                      {companyInfo.phoneAlt && (
                        <a href={`tel:${companyInfo.phoneAlt.replace(/\s+/g, '')}`} className="hover:text-orange-400 transition-colors">
                          📱 {companyInfo.phoneAlt}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Email professionnel
                    </div>
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-sm font-semibold text-white hover:text-orange-400 transition-colors"
                    >
                      📧 {companyInfo.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Disponibilité
                    </div>
                    <div className="text-xs font-medium text-neutral-300">
                      {companyInfo.workingHours}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Networks */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  📲 Réseaux sociaux & Vidéos
                </div>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-orange-500 text-neutral-300 hover:text-black flex items-center justify-center transition-all"
                    aria-label="Instagram Expert Événementiel"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-orange-500 text-neutral-300 hover:text-black flex items-center justify-center transition-all"
                    aria-label="Facebook Expert Événementiel"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-orange-500 text-neutral-300 hover:text-black flex items-center justify-center transition-all font-bold text-xs"
                    aria-label="TikTok Expert Événementiel"
                  >
                    TT
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-orange-500 text-neutral-300 hover:text-black flex items-center justify-center transition-all"
                    aria-label="YouTube Expert Événementiel"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-neutral-900 border border-emerald-600/40 text-neutral-100 flex items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                  Besoin d’une réponse immédiate ?
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Échangez en direct avec notre responsable technique
                </div>
              </div>
              <a
                href={`https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(companyInfo.whatsappDefaultMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-side-whatsapp-btn"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Quote Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              {isSubmitted ? (
                <div className="text-center py-12 px-4 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Demande de devis bien reçue !
                  </h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                    Merci <strong className="text-white">{formData.fullName}</strong>. Notre équipe étudie actuellement votre besoin pour votre événement prévu le <strong className="text-orange-400">{formData.eventDate || 'prochainement'}</strong>.
                  </p>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 max-w-md mx-auto text-left text-xs space-y-1.5 text-neutral-300">
                    <div><span className="text-neutral-500 font-medium">Type d'événement:</span> <strong className="text-white">{formData.eventType}</strong></div>
                    <div><span className="text-neutral-500 font-medium">Services:</span> <strong className="text-orange-400">{formData.services.join(', ')}</strong></div>
                    <div><span className="text-neutral-500 font-medium">Lieu:</span> <strong className="text-white">{formData.locationCity}</strong></div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      id="submitted-whatsapp-share-btn"
                      onClick={handleSendViaWhatsApp}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Transmettre aussi sur WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      id="submitted-reset-btn"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs uppercase tracking-wider"
                    >
                      Nouvelle demande
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Formulaire de Devis Express
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Tous les champs marqués d’une * sont requis pour l’étude technique.
                      </p>
                    </div>
                    {formData.selectedFormula && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 font-bold px-2.5 py-1 rounded-md border border-orange-500/30">
                        {formData.selectedFormula}
                      </span>
                    )}
                  </div>

                  {/* Row 1: Nom & Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-fullName" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="quote-fullName"
                        required
                        placeholder="Ex: Ibrahima Diallo"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Téléphone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        id="quote-phone"
                        required
                        placeholder="Ex: +221 77 000 00 00"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Ville */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-email" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Adresse Email *
                      </label>
                      <input
                        type="email"
                        id="quote-email"
                        required
                        placeholder="Ex: diallo@exemple.sn"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-locationCity" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Lieu / Ville de l'événement
                      </label>
                      <select
                        id="quote-locationCity"
                        value={formData.locationCity}
                        onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      >
                        {citiesOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Type d'événement & Date & Nombre de personnes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="quote-eventType" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Type d’événement *
                      </label>
                      <select
                        id="quote-eventType"
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      >
                        {eventTypesList.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quote-eventDate" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Date de l'événement *
                      </label>
                      <input
                        type="date"
                        id="quote-eventDate"
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-guestCount" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Nombre de personnes
                      </label>
                      <select
                        id="quote-guestCount"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      >
                        {guestCountOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Services souhaités (checkboxes) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      Services souhaités (sélectionnez une ou plusieurs options) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(services || []).map((srv) => {
                        const isChecked = formData.services.includes(srv.title);
                        return (
                          <label
                            key={srv.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-orange-500/15 border-orange-500/80 text-white font-semibold'
                                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(srv.title)}
                              className="accent-orange-500 w-4 h-4 rounded"
                            />
                            <span>{srv.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="quote-message" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Message / Précisions particulières
                    </label>
                    <textarea
                      id="quote-message"
                      rows={3}
                      placeholder="Indiquez vos besoins spécifiques, vos horaires souhaités ou tout équipement particulier..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Bouton DEMANDER MON DEVIS */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      id="quote-submit-btn"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:via-orange-400 hover:to-orange-500 text-black font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Transmission en cours...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>DEMANDER MON DEVIS</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
