import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialService
}) => {
  const { companyInfo, services } = useSiteContent();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Mariage');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('100 à 250 personnes');
  const [locationCity, setLocationCity] = useState('Dakar');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFormula, setSelectedFormula] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialService) {
      setSelectedServices([initialService]);
    } else {
      setSelectedServices(['Location de sonorisation', 'DJ & Animation']);
    }
    setIsSubmitted(false);
  }, [initialService, isOpen]);

  if (!isOpen) return null;

  const handleServiceToggle = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const handleWhatsAppForward = () => {
    const text = `*NOUVELLE DEMANDE DE DEVIS (EXPERT ÉVÉNEMENTIEL)*
• Client: ${fullName || 'Non renseigné'}
• Contact: ${phone || 'Non renseigné'}
• Email: ${email || 'Non renseigné'}
• Événement: ${eventType}
• Date: ${eventDate || 'À convenir'}
• Lieu: ${locationCity}
• Convives: ${guestCount}
${selectedFormula ? `• Formule: ${selectedFormula}\n` : ''}• Services: ${selectedServices.join(', ')}
• Message: ${message || 'Pas de note particulière'}`;

    const url = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      id="quote-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quote-modal-container"
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl my-8 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Devis Gratuit en 24h
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Demande de Devis Personnalisé
            </h3>
          </div>
          <button
            type="button"
            id="quote-modal-close-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto pr-1 py-4 flex-1">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                Votre demande a été transmise avec succès !
              </h4>
              <p className="text-neutral-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Notre régisseur commercial vous contactera très rapidement par téléphone ou WhatsApp pour finaliser le calibrage technique.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  id="modal-submitted-whatsapp-btn"
                  onClick={handleWhatsAppForward}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Envoyer aussi sur WhatsApp</span>
                </button>
                <button
                  type="button"
                  id="modal-submitted-close-btn"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs uppercase tracking-wider"
                >
                  Terminer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fatou Ndiaye"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Téléphone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nom@exemple.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Lieu de l'événement
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Almadies, Dakar ou Saly"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Type d'événement *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  >
                    <option value="Mariage">Mariage</option>
                    <option value="Anniversaire">Anniversaire</option>
                    <option value="Soirée privée">Soirée privée</option>
                    <option value="Baptême">Baptême</option>
                    <option value="Conférence">Conférence</option>
                    <option value="Événement entreprise">Événement entreprise</option>
                    <option value="Concert">Concert</option>
                    <option value="Cérémonie">Cérémonie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Date prévue *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Nombre d'invités
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  >
                    <option value="Moins de 50 personnes">Moins de 50 pers.</option>
                    <option value="50 à 100 personnes">50 à 100 pers.</option>
                    <option value="100 à 250 personnes">100 à 250 pers.</option>
                    <option value="250 à 500 personnes">250 à 500 pers.</option>
                    <option value="Plus de 500 personnes">+500 pers.</option>
                  </select>
                </div>
              </div>

              {/* Services multi-selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Prestations souhaitées
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(services || []).map((srv) => {
                    const checked = selectedServices.includes(srv.title);
                    return (
                      <label
                        key={srv.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                          checked
                            ? 'bg-orange-500/15 border-orange-500 text-white font-medium'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleServiceToggle(srv.title)}
                          className="accent-orange-500 rounded"
                        />
                        <span className="truncate">{srv.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Message additionnel
                </label>
                <textarea
                  rows={2}
                  placeholder="Heures souhaitées, particularités de la salle..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="modal-quote-submit-btn"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Envoyer ma demande de devis
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
