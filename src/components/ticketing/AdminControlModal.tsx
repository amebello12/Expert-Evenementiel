import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, DollarSign, Ticket, Calendar, User, Eye, Ban, RotateCcw } from 'lucide-react';
import { TicketEvent, IssuedTicket, TicketOrder } from '../../types';
import { ticketingApi } from '../../services/ticketingApi';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'orders' | 'organizers'>('events');
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState<{
    events: TicketEvent[];
    orders: TicketOrder[];
    tickets: IssuedTicket[];
    organizers: any[];
    stats: {
      totalEvents: number;
      publishedEvents: number;
      totalRevenue: number;
      totalTicketsSold: number;
      validatedTickets: number;
      totalOrders: number;
    };
  } | null>(null);

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const data = await ticketingApi.getAdminOverview();
      setAdminData(data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReviewEvent = async (eventId: string, newStatus: 'published' | 'blocked') => {
    try {
      await ticketingApi.adminReviewEvent(eventId, {
        status: newStatus,
        salesActive: newStatus === 'published'
      });
      setActionFeedback(`Événement ${newStatus === 'published' ? 'approuvé et publié' : 'bloqué'}.`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la modération');
    }
  };

  const handleRefundOrder = async (orderId: string) => {
    if (!confirm('Confirmez-vous le remboursement intégral de cette commande ? Les billets associés seront invalidés et le quota sera restauré.')) {
      return;
    }

    try {
      const res = await ticketingApi.adminRefundOrder(orderId);
      setActionFeedback(res.message);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du remboursement');
    }
  };

  return (
    <div
      id="admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="admin-modal-container"
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-5xl w-full text-white shadow-2xl overflow-hidden my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Supervision Billetterie • Expert Événementiel
              </h3>
              <div className="text-[10px] text-neutral-400">
                Administration centrale, contrôle des organisateurs, paiements et remboursements
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Statistics strip */}
        {adminData && (
          <div className="bg-neutral-950/80 border-b border-neutral-800 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Chiffre d’Affaires Total</span>
              <span className="font-extrabold text-orange-400 text-sm sm:text-base">
                {adminData.stats.totalRevenue.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Billets Vendus</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {adminData.stats.totalTicketsSold}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Événements Actifs</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {adminData.stats.publishedEvents} / {adminData.stats.totalEvents}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">Entrées Scannées</span>
              <span className="font-bold text-purple-400 text-sm sm:text-base">
                {adminData.stats.validatedTickets}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'events'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Événements ({adminData?.events.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Paiements & Commandes ({adminData?.orders.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('organizers')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'organizers'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Organisateurs ({adminData?.organizers.length || 0})
          </button>
        </div>

        {/* Action feedback toast */}
        {actionFeedback && (
          <div className="mx-6 mt-3 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
            <span>{actionFeedback}</span>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {isLoading ? (
            <div className="text-center py-16 text-neutral-400 text-sm">
              Chargement des données administratives...
            </div>
          ) : activeTab === 'events' && adminData ? (
            <div className="space-y-3">
              {adminData.events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ev.posterUrl}
                      alt={ev.title}
                      className="w-14 h-16 object-cover rounded-lg border border-neutral-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ev.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : ev.status === 'blocked'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {ev.status === 'published' ? 'Publié' : ev.status === 'blocked' ? 'Bloqué' : 'En attente'}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {ev.date} à {ev.startTime} • {ev.venueName}, {ev.city}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Organisateur : <strong className="text-neutral-300">{ev.organizerName}</strong> ({ev.organizerEmail} • {ev.organizerPhone})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {ev.status !== 'published' ? (
                      <button
                        type="button"
                        onClick={() => handleReviewEvent(ev.id, 'published')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valider & Publier</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReviewEvent(ev.id, 'blocked')}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-700 text-red-400 hover:bg-red-900/60 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspendre / Bloquer</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'orders' && adminData ? (
            <div className="space-y-3">
              {/* Single Centralized Database Banner */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Base de données unique centralisée</strong> • Toutes les commandes d'Android, iPhone, Mac, Windows et Tablette convergent ici en temps réel.
                  </span>
                </div>
                <span className="text-[11px] text-orange-400 font-mono font-bold shrink-0">
                  {adminData.orders.length} commande(s) enregistrée(s)
                </span>
              </div>

              <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Réf Commande</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Événement</th>
                      <th className="p-3">Billets / Appareil</th>
                      <th className="p-3">Montant</th>
                      <th className="p-3">Moyen</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {adminData.orders.map((ord) => {
                      const ticketsCount = ord.issuedTicketIds?.length || ord.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 1;
                      return (
                        <tr key={ord.id} className="hover:bg-neutral-900/40">
                          <td className="p-3 font-mono font-bold text-orange-400">
                            {ord.id}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">{ord.buyerName}</div>
                            <div className="text-[10px] text-neutral-400">{ord.buyerPhone}</div>
                          </td>
                          <td className="p-3 font-medium text-neutral-200">
                            {ord.eventTitle}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">
                              {ticketsCount} billet{ticketsCount > 1 ? 's' : ''}
                            </div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                              <span>📱</span>
                              <span>{ord.deviceType || 'Appareil Connecté'}</span>
                            </div>
                          </td>
                          <td className="p-3 font-bold text-white">
                            {ord.totalAmount === 0 ? 'Gratuit' : `${ord.totalAmount.toLocaleString('fr-FR')} FCFA`}
                          </td>
                          <td className="p-3 font-medium text-amber-400">
                            {ord.paymentMethod}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : ord.status === 'refunded'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {ord.status === 'completed' ? 'Payé' : ord.status === 'refunded' ? 'Remboursé' : ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {ord.status === 'completed' && ord.totalAmount > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRefundOrder(ord.id)}
                                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-red-950 text-red-400 hover:text-red-300 text-[11px] font-semibold border border-neutral-700 hover:border-red-600 transition-colors inline-flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Rembourser</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'organizers' && adminData ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adminData.organizers.map((org, i) => (
                  <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{org.name}</h4>
                      <span className="text-xs text-orange-400 font-bold">
                        {org.eventsCount} événement(s)
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 space-y-0.5">
                      <div>Structure : {org.company || 'Indépendant'}</div>
                      <div>Email : {org.email}</div>
                      <div>Tél : {org.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
