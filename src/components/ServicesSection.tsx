import React, { useState } from 'react';
import { 
  Speaker, 
  Music, 
  Mic, 
  Camera, 
  Video, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  Info,
  Layers
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services } = useSiteContent();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Speaker':
        return <Speaker className="w-6 h-6 text-orange-400" />;
      case 'Music':
        return <Music className="w-6 h-6 text-orange-400" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-orange-400" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-orange-400" />;
      case 'Video':
        return <Video className="w-6 h-6 text-orange-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-orange-400" />;
      default:
        return <Speaker className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-neutral-950 relative">
      {/* Background accents */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5" />
            NOS PRESTATIONS SUR MESURE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            NOS <span className="text-orange-500">SERVICES</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            De la sonorisation haute puissance à la captation audiovisuelle, nous équipons et animons vos célébrations privées et événements institutionnels avec une rigueur absolue.
          </p>
        </div>

        {/* Services Grid (6 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {(services || []).map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group bg-neutral-900/90 border border-neutral-800/90 hover:border-orange-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between"
            >
              <div>
                {/* Photo with Overlay & Badge */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  
                  {/* Service Number Tag */}
                  <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 px-3 py-1 rounded-lg text-xs font-mono font-bold text-orange-400">
                    {service.number}
                  </div>

                  {/* Highlight Pill */}
                  {service.highlightBadge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {service.highlightBadge}
                    </div>
                  )}

                  {/* Icon & Title Header */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-950/90 border border-orange-500/40 flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:border-orange-500 transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-orange-400 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <p className="text-neutral-300 text-sm leading-relaxed mb-5 font-medium">
                    {service.shortDesc}
                  </p>

                  {/* Key Features Bullet List */}
                  <div className="space-y-2.5 mb-6">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 border-t border-neutral-800/60 flex items-center justify-between gap-3">
                <button
                  type="button"
                  id={`service-details-btn-${service.id}`}
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer py-2"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Détails & Matériel</span>
                </button>

                <button
                  type="button"
                  id={`service-devis-btn-${service.id}`}
                  onClick={() => onSelectServiceForQuote(service.title)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
                >
                  <span>Choisir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner call to action */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-white font-bold text-lg sm:text-xl">
              Vous organisez un événement combinant plusieurs prestations ?
            </div>
            <p className="text-neutral-400 text-sm">
              Profitez de nos formules clé-en-main comprenant la sonorisation, le DJ, la régie lumière et la captation vidéo.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#formules"
              id="services-to-formulas-btn"
              className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-neutral-700 transition-colors"
            >
              Voir les Formules
            </a>
            <button
              type="button"
              id="services-custom-quote-btn"
              onClick={() => onSelectServiceForQuote('Prestations Multiples / Sur Mesure')}
              className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div
          id="service-detail-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <div
            id="service-detail-modal-content"
            className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-neutral-100 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-orange-500/40 flex items-center justify-center">
                  {getServiceIcon(selectedService.iconName)}
                </div>
                <div>
                  <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">
                    Service {selectedService.number}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{selectedService.title}</h3>
                </div>
              </div>
              <button
                type="button"
                id="service-detail-close-btn"
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden mb-5 h-64">
              <img
                src={selectedService.imageUrl}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed mb-6">
              {selectedService.fullDesc}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3">
                Équipements & Spécifications Inclus :
              </h4>
              <div className="space-y-2">
                {selectedService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                type="button"
                id="service-modal-cancel-btn"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white"
              >
                Fermer
              </button>
              <button
                type="button"
                id="service-modal-devis-btn"
                onClick={() => {
                  const serviceName = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForQuote(serviceName);
                }}
                className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30"
              >
                Demander un devis pour ce service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
