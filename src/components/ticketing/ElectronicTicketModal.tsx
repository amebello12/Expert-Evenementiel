import React, { useState, useEffect } from 'react';
import { X, Download, MessageSquare, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, User, Ticket } from 'lucide-react';
import { IssuedTicket } from '../../types';
import { generateQrCodeDataUrl, downloadTicketPdf } from '../../utils/ticketPdf';

interface ElectronicTicketModalProps {
  isOpen: boolean;
  ticket: IssuedTicket | null;
  onClose: () => void;
}

export const ElectronicTicketModal: React.FC<ElectronicTicketModalProps> = ({
  isOpen,
  ticket,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (ticket) {
      generateQrCodeDataUrl(ticket.qrCodeHash).then(setQrDataUrl);
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleShareWhatsApp = () => {
    const text = `🎟️ Mon Billet Électronique Expert Événementiel :
• Événement : ${ticket.eventTitle}
• Date : ${ticket.eventDate} à ${ticket.eventTime}
• Lieu : ${ticket.eventVenue} (${ticket.eventCity})
• Catégorie : ${ticket.ticketTierName}
• Participant : ${ticket.attendeeName}
• N° Billet : ${ticket.id}
• Clé de contrôle : ${ticket.qrCodeHash}
Veuillez présenter ce billet ou le QR Code au poste de contrôle à l'entrée.`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="electronic-ticket-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="electronic-ticket-container"
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-lg w-full text-white shadow-2xl overflow-hidden my-6 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Billet Officiel Sécurisé
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => downloadTicketPdf(ticket)}
              className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold transition-colors"
              title="Télécharger PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Card */}
        <div className="p-6 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 space-y-5">
          {/* Header Banner */}
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 h-36 bg-neutral-900">
            <img
              src={ticket.eventPoster}
              alt={ticket.eventTitle}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 bg-black/60 px-2 py-0.5 rounded w-fit mb-1 backdrop-blur-sm">
                EXPERT ÉVÉNEMENTIEL SÉNÉGAL
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight drop-shadow-md">
                {ticket.eventTitle}
              </h3>
            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Formule & Catégorie
                </span>
                <span className="text-sm font-extrabold text-orange-400">
                  {ticket.ticketTierName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Tarif Réglé
                </span>
                <span className="text-sm font-bold text-white">
                  {ticket.price === 0 ? 'GRATUIT' : `${ticket.price.toLocaleString('fr-FR')} FCFA`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-neutral-400">Date & Heure</div>
                  <div className="font-semibold text-neutral-200">
                    {ticket.eventDate} à {ticket.eventTime}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-neutral-400">Lieu de l'événement</div>
                  <div className="font-semibold text-neutral-200 truncate max-w-[150px]">
                    {ticket.eventVenue}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-neutral-800 text-xs">
              <User className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-neutral-400">Titulaire du billet</div>
                <div className="font-bold text-white">
                  {ticket.attendeeName}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {ticket.attendeePhone} • {ticket.attendeeEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Central QR Code View */}
          <div className="bg-white rounded-2xl p-4 text-black text-center shadow-lg border-2 border-orange-500/80 flex flex-col items-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code Billet"
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                Génération du QR Code...
              </div>
            )}

            <div className="mt-2 text-center">
              <span className="font-mono font-bold text-xs sm:text-sm tracking-wider block text-neutral-900">
                {ticket.id}
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 block">
                Présentez ce QR Code au scanner de l’entrée
              </span>
            </div>
          </div>

          {/* Security & Verification status */}
          <div className="flex items-center justify-between text-xs px-2 text-neutral-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Certifié Authentique • Expert Événementiel</span>
            </div>
            <span className="font-mono text-[10px]">{ticket.qrCodeHash.slice(0, 18)}...</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => downloadTicketPdf(ticket)}
              className="py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Envoyer WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
