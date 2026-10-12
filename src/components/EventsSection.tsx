import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Users, ArrowUpRight, Filter } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { EventCategory, EventShowcase } from '../types';

interface EventsSectionProps {
  onSelectEventForQuote: (eventType: string) => void;
  onOpenImageLightbox: (imageUrl: string, title: string) => void;
}

const CATEGORIES: EventCategory[] = [
  'Tous',
  'Mariages',
  'Anniversaires',
  'Soirées',
  'Baptêmes',
  'Conférences',
  'Événements d’entreprise',
  'Concerts',
  'Cérémonies',
];

export const EventsSection: React.FC<EventsSectionProps> = ({
  onSelectEventForQuote,
  onOpenImageLightbox
}) => {
  const { eventsShowcase } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState<EventCategory>('Tous');

  const eventsToUse = eventsShowcase && eventsShowcase.length > 0 ? eventsShowcase : [];
  const filteredEvents = activeCategory === 'Tous'
    ? eventsToUse
    : eventsToUse.filter((item) => item.category === activeCategory);

  return (
    <section id="evenements" className="py-20 lg:py-28 bg-neutral-900/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            EXPÉRIENCES & COUVERTURES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            NOS <span className="text-orange-500">ÉVÉNEMENTS</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Mariages de prestige, grands galas corporate, anniversaires intimistes ou concerts vibrants : nous créons l’atmosphère sonore et visuelle parfaite pour chaque célébration.
          </p>
        </div>

        {/* Category Filter Pills (Mobile scrollable, desktop flex wrap) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start md:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                id={`cat-filter-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/25 scale-105'
                    : 'bg-neutral-800/90 text-neutral-300 hover:text-white hover:bg-neutral-700 border border-neutral-700/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              id={`event-card-${evt.id}`}
              className="group relative bg-neutral-900 border border-neutral-800/90 hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between"
            >
              {/* Photo Area with hover zoom */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-orange-500 text-black text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  {evt.category}
                </div>

                {/* Attendees pill */}
                <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-neutral-200 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-orange-400" />
                  <span>{evt.attendees}</span>
                </div>

                {/* Lightbox Quick View Button */}
                <button
                  type="button"
                  id={`event-lightbox-btn-${evt.id}`}
                  onClick={() => onOpenImageLightbox(evt.imageUrl, evt.title)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-neutral-950/80 hover:bg-orange-500 text-neutral-300 hover:text-black border border-neutral-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
                  title="Agrandir l'image"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{evt.location}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-orange-400 transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                {/* Services Tags & CTA */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {evt.servicesProvided.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    id={`event-quote-btn-${evt.id}`}
                    onClick={() => onSelectEventForQuote(evt.category)}
                    className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-orange-500 text-neutral-200 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Organiser un événement similaire</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
