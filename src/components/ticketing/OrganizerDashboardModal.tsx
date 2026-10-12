import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Users, Ticket, DollarSign, ToggleLeft, ToggleRight, CheckCircle2, Search, Filter, ShieldCheck, Download, QrCode } from 'lucide-react';
import { TicketEvent, IssuedTicket, TicketOrder } from '../../types';
import { ticketingApi } from '../../services/ticketingApi';

interface OrganizerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGateScanner: (eventId?: string) => void;
}

export const OrganizerDashboardModal: React.FC<OrganizerDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenGateScanner
}) => {
  const [organizerEmail, setOrganizerEmail] = useState('demo');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    events: TicketEvent[];
    orders: TicketOrder[];
    tickets: IssuedTicket[];
    stats: {
      totalEvents: number;
      totalRevenue: number;
      totalTicketsSold: number;
      totalRemaining: number;
      validatedCount: number;
      totalCapacity: number;
    };
  } | null>(null);

  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [searchAttendee, setSearchAttendee] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const fetchDashboard = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await ticketingApi.getOrganizerDashboard(email);
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDashboard(organizerEmail);
    }
  }, [isOpen, organizerEmail]);

  if (!isOpen) return null;

  const handleToggleSales = async (event: TicketEvent) => {
    try {
      const updated = await ticketingApi.updateEventStatus(event.id, {
        salesActive: !event.salesActive
      });
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          events: prev.events.map((e) => (e.id === event.id ? updated : e))
        };
      });
    } catch (err) {
      console.error('Failed to toggle sales', err);
    }
  };

  // Filtered tickets/attendees
  const filteredTickets = (data?.tickets || []).filter((ticket) => {
    if (selectedEventId !== 'all' && ticket.eventId !== selectedEventId) return false;
    if (filterTier !== 'all' && ticket.ticketCategory !== filterTier) return false;
    if (searchAttendee.trim()) {
      const q = searchAttendee.toLowerCase();
      return (
        ticket.attendeeName.toLowerCase().includes(q) ||
        ticket.attendeeEmail.toLowerCase().includes(q) ||
        ticket.attendeePhone.includes(q) ||
        ticket.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div
      id="organizer-dashboard-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="organizer-dashboard-container"
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-5xl w-full text-white shadow-2xl overflow-hidden my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
              Espace Gestion Organisateur
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Tableau de Bord des Ventes & Billetterie
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGateScanner(selectedEventId !== 'all' ? selectedEventId : undefined);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <QrCode className="w-4 h-4" />
              <span>Contrôle Entrée (Scanner)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {isLoading ? (
            <div className="text-center py-20 text-neutral-400 text-sm">
              Chargement des statistiques de billetterie...
            </div>
          ) : data ? (
            <>
              {/* Top 4 Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Revenue */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Chiffre d’Affaires</span>
                    <DollarSign className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-orange-400">
                    {data.stats.totalRevenue.toLocaleString('fr-FR')} <span className="text-xs text-neutral-300">FCFA</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Wave & Orange Money direct
                  </div>
                </div>

                {/* 2. Tickets Sold */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Billets Vendus</span>
                    <Ticket className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {data.stats.totalTicketsSold} <span className="text-xs text-neutral-400">/ {data.stats.totalCapacity}</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (data.stats.totalTicketsSold / (data.stats.totalCapacity || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* 3. Remaining */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Places Restantes</span>
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {data.stats.totalRemaining}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Disponibles à la vente
                  </div>
                </div>

                {/* 4. Gate entries */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Entrées Validées</span>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-purple-400">
                    {data.stats.validatedCount}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Passages au scanner d’entrée
                  </div>
                </div>
              </div>

              {/* Event Sales Management (Active / Inactive Toggle) */}
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Vos Événements & État des Ventes
                  </h4>
                  <span className="text-xs text-neutral-400">
                    {data.events.length} événement(s) actif(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {data.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.posterUrl}
                          alt={ev.title}
                          className="w-12 h-16 object-cover rounded-lg border border-neutral-700 shrink-0"
                        />
                        <div>
                          <h5 className="font-bold text-sm text-white">{ev.title}</h5>
                          <div className="text-xs text-neutral-400">
                            {ev.date} à {ev.startTime} • {ev.venueName}, {ev.city}
                          </div>
                          <div className="text-[11px] text-orange-400 font-medium mt-0.5">
                            {ev.ticketsSold} billets vendus / {ev.totalCapacity} places
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSales(ev)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            ev.salesActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {ev.salesActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{ev.salesActive ? 'Ventes Actives' : 'Ventes Suspendues'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenGateScanner(ev.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-orange-400" />
                          <span>Scanner</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendees & Tickets List */}
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Liste des Participants & Billets Vendus
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Recherche instantanée et filtrage par catégorie de billet
                    </p>
                  </div>

                  {/* Filter & Search Controls */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Chercher un nom, tél..."
                        value={searchAttendee}
                        onChange={(e) => setSearchAttendee(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <select
                      value={filterTier}
                      onChange={(e) => setFilterTier(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="all">Tous les types</option>
                      <option value="Standard">Standard</option>
                      <option value="VIP">VIP</option>
                      <option value="VVIP">VVIP</option>
                      <option value="Early Bird">Early Bird</option>
                      <option value="Pass">Pass</option>
                      <option value="Gratuit">Gratuit</option>
                    </select>
                  </div>
                </div>

                {/* Table of Attendees */}
                <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-900 text-neutral-400 font-bold uppercase text-[10px] border-b border-neutral-800">
                      <tr>
                        <th className="p-3">N° Billet</th>
                        <th className="p-3">Participant</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Formule</th>
                        <th className="p-3">Tarif</th>
                        <th className="p-3">Paiement</th>
                        <th className="p-3">Statut Entrée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-neutral-500">
                            Aucun participant trouvé pour cette sélection.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((t) => (
                          <tr key={t.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="p-3 font-mono text-[11px] text-orange-400 font-bold">
                              {t.id}
                            </td>
                            <td className="p-3 font-bold text-white">
                              <div>{t.attendeeName}</div>
                              {t.deviceType && (
                                <div className="text-[10px] text-neutral-400 font-normal flex items-center gap-1 mt-0.5">
                                  <span>📱</span>
                                  <span>{t.deviceType}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-neutral-400">
                              <div>{t.attendeePhone}</div>
                              <div className="text-[10px] text-neutral-500">{t.attendeeEmail}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-200">
                                {t.ticketTierName}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-white">
                              {t.price === 0 ? 'Gratuit' : `${t.price.toLocaleString('fr-FR')} FCFA`}
                            </td>
                            <td className="p-3">
                              <span className="text-[11px] font-medium text-neutral-300">
                                {t.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3">
                              {t.status === 'used' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                  Entré à {t.validatedAt ? new Date(t.validatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              ) : t.status === 'cancelled' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                                  Annulé
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Valide (Non scanné)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
