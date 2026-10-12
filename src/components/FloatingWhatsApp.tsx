import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const FloatingWhatsApp: React.FC = () => {
  const { companyInfo } = useSiteContent();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(companyInfo.whatsappDefaultMsg)}`;

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Optional small speech bubble */}
      {showTooltip && (
        <div
          id="whatsapp-speech-bubble"
          className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl p-3 max-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-300 relative text-xs flex items-start justify-between gap-2"
        >
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Service Client en direct</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-tight">
              Une question sur une date ou un devis ? Discutez avec nous !
            </p>
          </div>
          <button
            type="button"
            id="whatsapp-tooltip-close-btn"
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-white p-0.5"
            aria-label="Fermer la bulle d'aide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-emerald-400/30"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-emerald-600" />
        </div>
        <span className="whitespace-nowrap tracking-wide">
          Contactez-nous sur WhatsApp
        </span>
      </a>
    </div>
  );
};
