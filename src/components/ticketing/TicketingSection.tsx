import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Ticket,
  Sparkles,
  Filter,
  ArrowRight,
  PlusCircle,
  Smartphone
} from 'lucide-react';
import { TicketEvent, IssuedTicket } from '../../types';
import { ticketingApi } from '../../services/ticketingApi';
import { TicketCheckoutModal } from './TicketCheckoutModal';
import { ElectronicTicketModal } from './ElectronicTicketModal';
import { ClientCreateEventModal } from './ClientCreateEventModal';

interface TicketingSectionProps {
  onEventSelect?: (event: TicketEvent) => void;
}

export const TicketingSection: React.FC<TicketingSectionProps> = () => {
  const [events, setEvents] = useState<TicketEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedCity, setSelectedCity] = useState('Toutes');

  // Modals state
  const [activeCheckoutEvent, setActiveCheckoutEvent] = useState<TicketEvent | null>(null);
  const [viewTicket, setViewTicket] = useState<IssuedTicket | null>(null);
  const [isClientCreateOpen, setIsClientCreateOpen] = useState(false);

  const categories = [
    'Toutes',
    'Concert & Festival',
    'Gala & Soirée',
    'Soirée & Clubbing',
    'Conférence & B2B',
    'Spectacle & Humour',
    'Mode & Beauté',
    'Cérémonie & Mariage'
  ];

  const cities = ['Toutes', 'Dakar', 'Saly', 'Thiès', 'Saint-Louis', 'Cap Skirring'];

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await ticketingApi.getEvents({
        category: selectedCategory !== 'Toutes' ? selectedCategory : undefined,
        city: selectedCity !== 'Toutes' ? selectedCity : undefined,
        search: searchQuery.trim() || undefined
      });
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, selectedCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEvents();
  };

  return (
    <section id="billetterie" className="py-20 bg-neutral-950 text-white relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Plateforme Billetterie Officielle
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Billetterie & Événements au Sénégal
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
              Achetez vos places en toute sécurité via <strong>Wave, Orange Money & Free Money</strong> avec QR Code nominatif unique. Retrouvez les plus grands concerts, galas, festivals et soirées de la saison.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="client-create-event-top-btn"
              onClick={() => setIsClientCreateOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer mon Événement (10 000 F Wave)</span>
            </button>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-orange-500/40 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span>Vendre vos billets avec nous</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </a>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Rechercher par titre, artiste, lieu ou organisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    Ville : {city}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                Filtrer
              </button>
            </div>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-850'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Cards Grid */}
        {isLoading ? (
          <div className="text-center py-24 text-neutral-400 text-sm">
            Chargement de la billetterie en direct...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 space-y-4">
            <Ticket className="w-12 h-12 text-neutral-600 mx-auto" />
            <h4 className="text-lg font-bold text-white">Aucun événement ne correspond à vos critères</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Essayez d'ajuster votre recherche ou publiez le premier événement de cette catégorie.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Toutes');
                setSelectedCity('Toutes');
                setSearchQuery('');
                loadEvents();
              }}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-orange-400"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const lowestPrice = Math.min(...event.ticketTiers.map((t) => t.price));
              const remaining = event.totalCapacity - event.ticketsSold;
              const isSoldOut = remaining <= 0 || !event.salesActive;

              return (
                <div
                  key={event.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5"
                >
                  {/* Event Poster Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                    <img
                      src={event.posterUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/75 text-orange-400 border border-orange-500/40 backdrop-blur-md">
                        {event.category}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-black/70 text-white backdrop-blur-md flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        {event.city}
                      </span>
                    </div>

                    {/* Remaining seats warning */}
                    {remaining < 50 && remaining > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-500 text-white animate-pulse">
                          Plus que {remaining} places !
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{event.date} à {event.startTime}</span>
                      </div>

                      <h3 className="text-lg font-extrabold text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="text-[11px] text-neutral-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span className="truncate">{event.venueName}, {event.address || event.city}</span>
                      </div>
                    </div>

                    {/* Footer: Starting price & Buy button */}
                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          À partir de
                        </span>
                        <span className="text-base sm:text-lg font-black text-white">
                          {lowestPrice === 0 ? 'GRATUIT' : `${lowestPrice.toLocaleString('fr-FR')} FCFA`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCheckoutEvent(event)}
                        disabled={isSoldOut}
                        className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          isSoldOut
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer'
                        }`}
                      >
                        <span>{isSoldOut ? 'Complet' : 'Acheter'}</span>
                        {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Benefits banner for organizers */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Vous organisez un événement au Sénégal ?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Bénéficiez de la billetterie intégrée d'<strong>Expert Événementiel</strong> : encaissement Wave / Orange Money direct, validation d'accès anti-fraude et sonorisation / DJ clé en main pour votre événement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="client-create-event-bottom-btn"
              onClick={() => setIsClientCreateOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider whitespace-nowrap shadow-lg shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer mon Événement (10 000 F Wave)</span>
            </button>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider whitespace-nowrap shadow-lg shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Confier ma billetterie à l'agence</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <TicketCheckoutModal
        isOpen={!!activeCheckoutEvent}
        event={activeCheckoutEvent}
        onClose={() => setActiveCheckoutEvent(null)}
        onOpenElectronicTicket={(t) => setViewTicket(t)}
      />

      <ElectronicTicketModal
        isOpen={!!viewTicket}
        ticket={viewTicket}
        onClose={() => setViewTicket(null)}
      />

      <ClientCreateEventModal
        isOpen={isClientCreateOpen}
        onClose={() => setIsClientCreateOpen(false)}
        onEventCreated={(newEvent) => {
          loadEvents();
        }}
      />
    </section>
  );
};
