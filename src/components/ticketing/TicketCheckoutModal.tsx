import React, { useState } from 'react';
import { X, Calendar, MapPin, Sparkles, CheckCircle2, Download, MessageSquare, AlertCircle, ShieldCheck, Ticket, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { TicketEvent, IssuedTicket, TicketTier, PaymentMethod } from '../../types';
import { ticketingApi } from '../../services/ticketingApi';
import { downloadTicketPdf, generateQrCodeDataUrl } from '../../utils/ticketPdf';

interface TicketCheckoutModalProps {
  isOpen: boolean;
  event: TicketEvent | null;
  onClose: () => void;
  onOpenElectronicTicket: (ticket: IssuedTicket) => void;
}

// Automatic detection of user's device (Android, iPhone, Mac, Windows, Tablette)
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

export const TicketCheckoutModal: React.FC<TicketCheckoutModalProps> = ({
  isOpen,
  event,
  onClose,
  onOpenElectronicTicket
}) => {
  const [selectedTiers, setSelectedTiers] = useState<Record<string, number>>({});
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wave');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [buyerPaymentRef, setBuyerPaymentRef] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOrderData, setSuccessOrderData] = useState<{
    orderId: string;
    tickets: IssuedTicket[];
    qrPreviews: Record<string, string>;
  } | null>(null);

  if (!isOpen || !event) return null;

  const clientDevice = getClientDeviceName();

  const handleQuantityChange = (tierId: string, delta: number, maxAvailable: number) => {
    setSelectedTiers((prev) => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, Math.min(maxAvailable, current + delta));
      return { ...prev, [tierId]: next };
    });
  };

  const handleSetQuantity = (tierId: string, qty: number, maxAvailable: number) => {
    const safeQty = Math.max(0, Math.min(maxAvailable, Math.max(0, qty)));
    setSelectedTiers((prev) => ({
      ...prev,
      [tierId]: safeQty
    }));
  };

  // Complete reset & close: allows closing and coming back fresh
  const handleCloseAndReset = () => {
    setSuccessOrderData(null);
    setSelectedTiers({});
    setBuyerPaymentRef('');
    setErrorMessage('');
    onClose();
  };

  // Allows immediately buying another ticket without leaving
  const handleBuyAnotherTicket = () => {
    setSuccessOrderData(null);
    setSelectedTiers({});
    setBuyerPaymentRef('');
    setErrorMessage('');
  };

  // Download all tickets for multi-ticket orders (e.g. 10 billets)
  const handleDownloadAllPdfs = async () => {
    if (!successOrderData) return;
    for (const t of successOrderData.tickets) {
      await downloadTicketPdf(t);
    }
  };

  const totalTicketsCount: number = Object.values(selectedTiers).reduce<number>(
    (sum, q) => sum + (Number(q) || 0),
    0
  );

  const totalAmount = event.ticketTiers.reduce((sum, tier) => {
    const qty = Number(selectedTiers[tier.id]) || 0;
    return sum + tier.price * qty;
  }, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (totalTicketsCount === 0) {
      setErrorMessage('Veuillez sélectionner au moins un billet.');
      return;
    }

    if (!buyerName.trim() || !buyerPhone.trim() || !buyerEmail.trim()) {
      setErrorMessage('Veuillez remplir vos coordonnées de contact.');
      return;
    }

    const items = Object.entries(selectedTiers)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([tierId, qty]) => ({
        ticketTierId: tierId,
        quantity: Number(qty)
      }));

    const hasCreatorPayment = Boolean(event.creatorPaymentRecipient || event.creatorPaymentMethod);
    if (totalAmount > 0 && hasCreatorPayment && !buyerPaymentRef.trim()) {
      setErrorMessage('Veuillez saisir la référence de votre paiement ou votre numéro payeur.');
      return;
    }

    const resolvedMethod: PaymentMethod = totalAmount === 0
      ? 'Gratuit'
      : hasCreatorPayment
      ? (event.creatorPaymentMethod === 'orange_money' ? 'Orange Money' : event.creatorPaymentMethod === 'free_money' ? 'Free Money' : 'Wave')
      : paymentMethod;

    try {
      setIsLoading(true);
      const result = await ticketingApi.checkout({
        eventId: event.id,
        buyerName,
        buyerEmail,
        buyerPhone,
        items,
        paymentMethod: resolvedMethod,
        deviceType: clientDevice
      });

      // Generate QR Code previews for generated tickets
      const previews: Record<string, string> = {};
      for (const t of result.tickets) {
        previews[t.id] = await generateQrCodeDataUrl(t.qrCodeHash);
      }

      setSuccessOrderData({
        orderId: result.order.id,
        tickets: result.tickets,
        qrPreviews: previews
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Le paiement a échoué. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWhatsApp = (ticket: IssuedTicket) => {
    const text = `🎟️ Mon Billet Officiel Expert Événementiel :
• Événement : ${ticket.eventTitle}
• Date : ${ticket.eventDate} à ${ticket.eventTime}
• Lieu : ${ticket.eventVenue} (${ticket.eventCity})
• Formule : ${ticket.ticketTierName}
• Participant : ${ticket.attendeeName}
• N° Billet : ${ticket.id}
• Clé de contrôle : ${ticket.qrCodeHash}
Présentez ce message ou le QR Code au contrôle d’accès.`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={handleCloseAndReset}
    >
      <div
        id="checkout-modal-container"
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with event summary */}
        <div className="relative bg-neutral-950 p-5 sm:p-6 border-b border-neutral-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-neutral-700 shadow-md shrink-0 hidden xs:block"
            />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {event.category}
                </span>
                <span className="text-xs text-neutral-400">
                  Organisé par {event.organizerName}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {event.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-neutral-300 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  {event.date} à {event.startTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {event.venueName}, {event.city}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            id="checkout-close-btn"
            onClick={handleCloseAndReset}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors shrink-0 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6">
          {successOrderData ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Paiement Confirmé avec Succès !
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                  Votre commande <strong className="text-orange-400">{successOrderData.orderId}</strong> a été validée. Vos billets électroniques sécurisés sont prêts.
                </p>
              </div>

              {/* Generated Tickets Cards */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Vos Billets Électroniques ({successOrderData.tickets.length})
                  </h5>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Enregistré dans la base de données unique</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {successOrderData.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between space-y-3 relative hover:border-orange-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500 text-black">
                            {ticket.ticketTierName}
                          </span>
                          <h6 className="font-bold text-sm text-white mt-1.5 truncate max-w-[180px]">
                            {ticket.attendeeName}
                          </h6>
                          <div className="text-[11px] text-neutral-400">
                            N° : {ticket.id}
                          </div>
                          {ticket.deviceType && (
                            <div className="text-[10px] text-neutral-500 mt-0.5">
                              📱 {ticket.deviceType}
                            </div>
                          )}
                        </div>

                        {successOrderData.qrPreviews[ticket.id] && (
                          <img
                            src={successOrderData.qrPreviews[ticket.id]}
                            alt="QR Code"
                            className="w-16 h-16 bg-white p-1 rounded-lg border border-neutral-700 shrink-0"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                        <button
                          type="button"
                          onClick={() => downloadTicketPdf(ticket)}
                          className="flex-1 py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareWhatsApp(ticket)}
                          className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                          title="Partager sur WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenElectronicTicket(ticket)}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                          title="Aperçu grand format"
                        >
                          <Ticket className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS: FERMER & ACHETER UN AUTRE TICKET */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center border-t border-neutral-800">
                {/* 1. FERMER (Closes and cleanly resets state for next visit) */}
                <button
                  type="button"
                  id="checkout-confirm-close-btn"
                  onClick={handleCloseAndReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Fermer
                </button>

                {/* 2. ACHETER UN AUTRE BILLET (Immediate reset to purchase another ticket) */}
                <button
                  type="button"
                  id="checkout-confirm-another-btn"
                  onClick={handleBuyAnotherTicket}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-black" />
                  <span>Acheter un autre billet</span>
                </button>

                {/* Batch download button if user purchased multiple tickets (e.g. 10 billets) */}
                {successOrderData.tickets.length > 1 && (
                  <button
                    type="button"
                    id="checkout-download-all-btn"
                    onClick={handleDownloadAllPdfs}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-orange-500 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-orange-400" />
                    <span>Télécharger tous les billets ({successOrderData.tickets.length} PDF)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              {/* Multi-Device & Single Database Banner */}
              <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Smartphone className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Appareil : <strong className="text-white">{clientDevice}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Base de données unique • Synchro tous appareils</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Ticket Tiers Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" />
                    1. Choisissez vos billets
                  </h4>
                  <span className="text-xs text-neutral-400">
                    Capacité max : {event.totalCapacity} places
                  </span>
                </div>

                <div className="space-y-3">
                  {event.ticketTiers.map((tier) => {
                    const remaining = Math.max(0, tier.totalQuantity - tier.soldQuantity);
                    const isSoldOut = remaining <= 0;
                    const selectedCount = selectedTiers[tier.id] || 0;

                    return (
                      <div
                        key={tier.id}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedCount > 0
                            ? 'bg-orange-500/10 border-orange-500/60'
                            : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                        } ${isSoldOut ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm sm:text-base text-white">
                                {tier.name}
                              </span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-orange-400 border border-neutral-700">
                                {tier.category}
                              </span>
                              {isSoldOut && (
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                                  Épuisé
                                </span>
                              )}
                            </div>

                            {tier.description && (
                              <p className="text-xs text-neutral-400">
                                {tier.description}
                              </p>
                            )}

                            {tier.perks && tier.perks.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap pt-1">
                                {tier.perks.map((p, i) => (
                                  <span key={i} className="text-[10px] text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded">
                                    ✓ {p}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Quick Selectors for phone and fast checkout (1, 2, 3, 5, 10 billets) */}
                            {!isSoldOut && (
                              <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                                <span className="text-[11px] text-neutral-400 font-medium">Sélection directe :</span>
                                {[1, 2, 3, 5, 10].map((preset) => {
                                  const isAvail = remaining >= preset;
                                  const isCurrent = selectedCount === preset;
                                  return (
                                    <button
                                      key={preset}
                                      type="button"
                                      disabled={!isAvail}
                                      onClick={() => handleSetQuantity(tier.id, preset, remaining)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        isCurrent
                                          ? 'bg-orange-500 text-black shadow-md ring-2 ring-orange-400'
                                          : isAvail
                                          ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                                          : 'bg-neutral-900 text-neutral-600 cursor-not-allowed opacity-40'
                                      }`}
                                    >
                                      {preset === 10 ? '10 billets' : `${preset}`}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-850">
                            <div className="text-right">
                              <div className="font-bold text-base sm:text-lg text-white">
                                {tier.price === 0 ? 'GRATUIT' : `${tier.price.toLocaleString('fr-FR')} FCFA`}
                              </div>
                              <div className="text-[10px] text-neutral-400">
                                {remaining} places restantes
                              </div>
                            </div>

                            {/* Quantity Controls (+ / -) */}
                            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                              <button
                                type="button"
                                disabled={selectedCount === 0}
                                onClick={() => handleQuantityChange(tier.id, -1, remaining)}
                                className="w-8 h-8 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold disabled:opacity-30 disabled:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                                aria-label="Moins un billet"
                              >
                                -
                              </button>
                              <span className="w-7 text-center text-sm font-extrabold text-white">
                                {selectedCount}
                              </span>
                              <button
                                type="button"
                                disabled={selectedCount >= remaining || selectedCount >= 50}
                                onClick={() => handleQuantityChange(tier.id, 1, remaining)}
                                className="w-8 h-8 rounded bg-orange-500 hover:bg-orange-400 text-black font-extrabold disabled:opacity-30 disabled:hover:bg-orange-500 transition-colors flex items-center justify-center cursor-pointer"
                                aria-label="Plus un billet"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Buyer Information */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  2. Coordonnées du participant
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fatou Sylla"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
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
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Email de réception *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@exemple.sn"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method (Senegal) */}
              {totalAmount > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      3. Mode de paiement sécurisé au Sénégal
                    </h4>
                    {(event.creatorPaymentRecipient || event.creatorPaymentMethod) && (
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        Direct Organisateur
                      </span>
                    )}
                  </div>

                  {(event.creatorPaymentRecipient || event.creatorPaymentMethod) ? (
                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                      {/* Notice */}
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25">
                        <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-neutral-300">
                          <div>
                            Le paiement de vos billets est directement transmis à l'organisateur :{' '}
                            <strong className="text-white">
                              {event.creatorPaymentName || event.organizerName}
                            </strong>
                          </div>
                          {event.creatorPaymentInstructions && (
                            <div className="mt-1 text-orange-300 italic text-[11px]">
                              « {event.creatorPaymentInstructions} »
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Wave Link */}
                      {event.creatorPaymentMethod === 'wave_link' && (
                        <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/40 space-y-3 text-center">
                          <div className="text-xs text-neutral-300 font-medium">
                            Réglez <strong className="text-sky-400">{totalAmount.toLocaleString('fr-FR')} FCFA</strong> directement sur le lien Wave de l'organisateur :
                          </div>
                          <a
                            href={
                              event.creatorPaymentRecipient?.startsWith('http')
                                ? event.creatorPaymentRecipient
                                : `https://${event.creatorPaymentRecipient}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>Payer {totalAmount.toLocaleString('fr-FR')} FCFA via Wave</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                            <span className="truncate max-w-[200px] font-mono text-sky-300">
                              {event.creatorPaymentRecipient}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (event.creatorPaymentRecipient) {
                                  navigator.clipboard.writeText(event.creatorPaymentRecipient);
                                  setCopiedText(event.creatorPaymentRecipient);
                                  setTimeout(() => setCopiedText(null), 2500);
                                }
                              }}
                              className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedText === event.creatorPaymentRecipient ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedText === event.creatorPaymentRecipient ? 'Copié !' : 'Copier le lien'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Wave Phone */}
                      {(!event.creatorPaymentMethod || event.creatorPaymentMethod === 'wave_phone') && (
                        <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                              <span className="font-extrabold text-sm text-sky-400">Transfert Wave Sénégal</span>
                            </div>
                            <span className="text-[10px] text-neutral-400">0% de frais</span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-700">
                            <div>
                              <div className="text-[10px] uppercase font-bold text-neutral-400">
                                Numéro Wave Organisateur
                              </div>
                              <div className="font-mono text-base font-black text-white">
                                {event.creatorPaymentRecipient || event.organizerPhone}
                              </div>
                              <div className="text-[11px] text-neutral-300">
                                Titulaire : <strong>{event.creatorPaymentName || event.organizerName}</strong>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const targetNum = event.creatorPaymentRecipient || event.organizerPhone;
                                navigator.clipboard.writeText(targetNum);
                                setCopiedText(targetNum);
                                setTimeout(() => setCopiedText(null), 2500);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              {copiedText === (event.creatorPaymentRecipient || event.organizerPhone) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedText === (event.creatorPaymentRecipient || event.organizerPhone) ? 'Copié !' : 'Copier'}</span>
                            </button>
                          </div>

                          <div className="text-xs text-neutral-300 leading-relaxed">
                            Envoyez exactement <strong className="text-white">{totalAmount.toLocaleString('fr-FR')} FCFA</strong> via votre application Wave au numéro ci-dessus.
                          </div>
                        </div>
                      )}

                      {/* Orange Money */}
                      {event.creatorPaymentMethod === 'orange_money' && (
                        <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                              <span className="font-extrabold text-sm text-orange-500">Orange Money Sénégal</span>
                            </div>
                            <span className="text-[10px] text-neutral-400">#144# / Max it</span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-700">
                            <div>
                              <div className="text-[10px] uppercase font-bold text-neutral-400">
                                Numéro OM Organisateur
                              </div>
                              <div className="font-mono text-base font-black text-white">
                                {event.creatorPaymentRecipient || event.organizerPhone}
                              </div>
                              <div className="text-[11px] text-neutral-300">
                                Titulaire : <strong>{event.creatorPaymentName || event.organizerName}</strong>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const targetNum = event.creatorPaymentRecipient || event.organizerPhone;
                                navigator.clipboard.writeText(targetNum);
                                setCopiedText(targetNum);
                                setTimeout(() => setCopiedText(null), 2500);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              {copiedText === (event.creatorPaymentRecipient || event.organizerPhone) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedText === (event.creatorPaymentRecipient || event.organizerPhone) ? 'Copié !' : 'Copier'}</span>
                            </button>
                          </div>

                          <div className="text-xs text-neutral-300 leading-relaxed">
                            Composez <strong className="text-white">#144#</strong> ou ouvrez l'application Orange Money pour envoyer <strong className="text-white">{totalAmount.toLocaleString('fr-FR')} FCFA</strong>.
                          </div>
                        </div>
                      )}

                      {/* Free Money */}
                      {event.creatorPaymentMethod === 'free_money' && (
                        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-emerald-400">Free Money Sénégal</span>
                            <span className="text-[10px] text-neutral-400">Portefeuille mobile</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-700">
                            <div>
                              <div className="text-[10px] uppercase font-bold text-neutral-400">Numéro Free Money</div>
                              <div className="font-mono text-base font-black text-white">
                                {event.creatorPaymentRecipient || event.organizerPhone}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const targetNum = event.creatorPaymentRecipient || event.organizerPhone;
                                navigator.clipboard.writeText(targetNum);
                                setCopiedText(targetNum);
                                setTimeout(() => setCopiedText(null), 2500);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1"
                            >
                              {copiedText === (event.creatorPaymentRecipient || event.organizerPhone) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedText === (event.creatorPaymentRecipient || event.organizerPhone) ? 'Copié !' : 'Copier'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bank / Custom */}
                      {event.creatorPaymentMethod === 'bank_custom' && (
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700 space-y-2">
                          <div className="text-xs font-bold text-neutral-300">Coordonnées de l'organisateur :</div>
                          <div className="font-mono text-xs text-white p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                            {event.creatorPaymentRecipient}
                          </div>
                        </div>
                      )}

                      {/* Transaction reference proof input */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          Référence de votre transaction ou Numéro ayant payé *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: WAVE-SN-12345 ou 77 XXX XX XX"
                          value={buyerPaymentRef}
                          onChange={(e) => setBuyerPaymentRef(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Cette référence sera inscrite sur votre billet et permettra à l'organisateur de valider votre réservation.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Default 4-way selector for platform events */
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {/* Wave */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Wave')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            paymentMethod === 'Wave'
                              ? 'bg-sky-500/15 border-sky-400 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-extrabold text-sm text-sky-400">Wave</span>
                            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          </div>
                          <span className="text-[10px] text-neutral-300">0% de frais</span>
                        </button>

                        {/* Orange Money */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Orange Money')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            paymentMethod === 'Orange Money'
                              ? 'bg-orange-500/15 border-orange-500 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-extrabold text-sm text-orange-500">Orange Money</span>
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          </div>
                          <span className="text-[10px] text-neutral-300">#144# / Max it</span>
                        </button>

                        {/* Free Money */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Free Money')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            paymentMethod === 'Free Money'
                              ? 'bg-emerald-500/15 border-emerald-500 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-extrabold text-sm text-emerald-400">Free Money</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          </div>
                          <span className="text-[10px] text-neutral-300">Portefeuille mobile</span>
                        </button>

                        {/* Carte Bancaire */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Carte Bancaire')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            paymentMethod === 'Carte Bancaire'
                              ? 'bg-amber-500/15 border-amber-500 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-extrabold text-sm text-amber-400">Carte Visa/MC</span>
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          </div>
                          <span className="text-[10px] text-neutral-300">International & UEMOA</span>
                        </button>
                      </div>

                      {(paymentMethod === 'Wave' || paymentMethod === 'Orange Money' || paymentMethod === 'Free Money') && (
                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            Paiement sécurisé instantané via <strong>{paymentMethod} Sénégal</strong>. Votre billet et son QR Code unique seront générés instantanément.
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Order Summary Footer */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-400">
                    Total ({totalTicketsCount} billet{totalTicketsCount > 1 ? 's' : ''})
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-orange-400">
                    {totalAmount === 0 ? '0 FCFA (Gratuit)' : `${totalAmount.toLocaleString('fr-FR')} FCFA`}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || totalTicketsCount === 0}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:via-orange-400 hover:to-orange-500 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 disabled:opacity-40 transition-all cursor-pointer"
                >
                  {isLoading ? 'Génération du billet...' : totalAmount === 0 ? 'Confirmer ma réservation gratuite' : `Payer ${totalAmount.toLocaleString('fr-FR')} FCFA`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
