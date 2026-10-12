import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  LayoutDashboard,
  FileText,
  Video,
  Image as ImageIcon,
  Ticket,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  Camera,
  Search,
  Upload,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Play,
  Share2,
  ShieldCheck,
  Check,
  DollarSign
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { ticketingApi } from '../../services/ticketingApi';
import { TicketEvent, TicketOrder, IssuedTicket, GalleryItem, ServiceItem, PackageFormula, TestimonialItem } from '../../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout
}) => {
  const {
    companyInfo,
    services,
    gallery,
    formulas,
    testimonials,
    updateCompanyInfo,
    updateServices,
    addService,
    deleteService,
    updateGallery,
    addGalleryItem,
    deleteGalleryItem,
    updateFormulas,
    deleteFormula,
    updateTestimonials,
    deleteTestimonial,
    resetToDefaults
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'media' | 'ticketing' | 'settings'>('overview');
  const [cmsSubTab, setCmsSubTab] = useState<'general' | 'services' | 'formulas' | 'testimonials'>('general');
  const [mediaSubTab, setMediaSubTab] = useState<'gallery' | 'hero-bg'>('gallery');
  const [ticketingSubTab, setTicketingSubTab] = useState<'events' | 'orders' | 'scanner'>('events');

  // Overview stats & data from backend
  const [adminOverview, setAdminOverview] = useState<{
    events: TicketEvent[];
    orders: TicketOrder[];
    tickets: IssuedTicket[];
    stats: any;
  } | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form states for CMS General
  const [companyForm, setCompanyForm] = useState(companyInfo);
  useEffect(() => {
    setCompanyForm(companyInfo);
  }, [companyInfo]);

  // Form state for adding media
  const [newMediaType, setNewMediaType] = useState<'video' | 'photo'>('video');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('DJ en prestation');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaVideoUrl, setNewMediaVideoUrl] = useState('');
  const [newMediaDesc, setNewMediaDesc] = useState('');
  const [newMediaDuration, setNewMediaDuration] = useState('Vidéo 4K');

  // Scanner state
  const [manualTicketCode, setManualTicketCode] = useState('');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Modal for editing an event
  const [editingEvent, setEditingEvent] = useState<TicketEvent | null>(null);

  // Load backend admin overview
  const loadAdminData = async () => {
    setLoadingOverview(true);
    try {
      const data = await ticketingApi.getAdminOverview();
      setAdminOverview(data);
    } catch (err) {
      console.error('Failed to load admin overview', err);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  if (!isOpen) return null;

  // Handle Save Company Info
  const handleSaveCompanyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyInfo(companyForm);
    showNotification('Informations générales enregistrées avec succès !');
  };

  // Handle Add Media
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim()) return;

    let finalImageUrl = newMediaUrl.trim();
    // If it's a YouTube video, try to auto-extract thumbnail
    if (newMediaType === 'video' && newMediaVideoUrl) {
      const ytMatch = newMediaVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch && ytMatch[1] && !finalImageUrl) {
        finalImageUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop';
    }

    const newItem: GalleryItem = {
      id: `media-${Date.now()}`,
      title: newMediaTitle.trim(),
      category: newMediaCategory,
      imageUrl: finalImageUrl,
      type: newMediaType,
      videoUrl: newMediaType === 'video' ? newMediaVideoUrl.trim() : undefined,
      durationOrTag: newMediaDuration.trim() || (newMediaType === 'video' ? 'Vidéo 4K' : 'Photo Pro'),
      description: newMediaDesc.trim() || 'Réalisation signée Expert Événementiel.'
    };

    await addGalleryItem(newItem);
    setNewMediaTitle('');
    setNewMediaVideoUrl('');
    setNewMediaUrl('');
    setNewMediaDesc('');
    showNotification('Nouveau média ajouté à la galerie !');
  };

  // Handle Media File Upload (Local image to base64)
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setNewMediaUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Delete Event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cet événement ?')) return;
    try {
      await ticketingApi.deleteEvent(id);
      await loadAdminData();
      showNotification('Événement supprimé avec succès.');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  // Handle Toggle Sales Status
  const handleToggleSales = async (id: string, currentStatus: boolean) => {
    try {
      await ticketingApi.updateEventStatus(id, { salesActive: !currentStatus });
      await loadAdminData();
      showNotification(`Vente de billets ${!currentStatus ? 'activée' : 'suspendue'}.`);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la modification');
    }
  };

  // Handle Ticket Validation in Admin Scanner
  const handleValidateTicketCode = async (codeToValidate?: string) => {
    const code = codeToValidate || manualTicketCode;
    if (!code.trim()) return;

    try {
      const res = await ticketingApi.validateTicket({
        code: code.trim(),
        agentName: 'Super Admin'
      });
      setScanResult(res);
      setManualTicketCode('');
      await loadAdminData();
    } catch (err: any) {
      setScanResult({
        valid: false,
        status: 'invalid',
        message: err.message || 'Erreur de validation'
      });
    }
  };

  // Handle Refund Order
  const handleRefundOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler et rembourser cette commande ? Les billets associés seront invalidés.')) return;
    try {
      await ticketingApi.adminRefundOrder(orderId);
      await loadAdminData();
      showNotification('Commande remboursée avec succès.');
    } catch (err: any) {
      alert(err.message || 'Erreur lors du remboursement');
    }
  };

  const totalEventsCount = adminOverview?.events?.length || 0;
  const clientEventsCount = adminOverview?.events?.filter((e) => (e as any).isClientCreated)?.length || 0;
  const waveCreationFeesTotal = clientEventsCount * 10000;
  const totalRevenue = adminOverview?.stats?.totalRevenue || 0;
  const totalTicketsSold = adminOverview?.stats?.totalTicketsSold || 0;

  return (
    <div
      id="admin-dashboard-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md overflow-hidden"
    >
      <div
        id="admin-dashboard-container"
        className="relative w-full max-w-6xl h-[94vh] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-neutral-100"
      >
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  Console d’Administration
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connecté (Experteven)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Expert Événementiel • Gestion Intégrale
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors"
              title="Voir le site"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Voir le Site</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
            >
              Déconnexion
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500 text-black px-6 py-2 text-xs font-extrabold flex items-center justify-between animate-in fade-in shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="px-5 sm:px-8 py-2.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
            { id: 'cms', label: 'Contenu du Site (CMS)', icon: FileText },
            { id: 'media', label: 'Médiathèque (Vidéos & Photos)', icon: Video },
            { id: 'ticketing', label: 'Billetterie & Événements', icon: Ticket },
            { id: 'settings', label: 'Sauvegarde & Paramètres', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Financial & General Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Total Événements en Ligne
                  </span>
                  <div className="text-2xl font-black text-white">{totalEventsCount}</div>
                  <div className="text-[11px] text-orange-400 font-medium">
                    dont {clientEventsCount} créés par des clients
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/40 to-neutral-950 border border-sky-500/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Frais Wave Publication Récoltés
                  </span>
                  <div className="text-2xl font-black text-sky-400">
                    {waveCreationFeesTotal.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    10 000 FCFA / événement client
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Ventes Billetterie
                  </span>
                  <div className="text-2xl font-black text-emerald-400">
                    {totalRevenue.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {totalTicketsSold} billets électroniques vendus
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Médiathèque Active
                  </span>
                  <div className="text-2xl font-black text-purple-400">{gallery.length}</div>
                  <div className="text-[11px] text-neutral-400">
                    {gallery.filter((m) => m.type === 'video').length} vidéos & {gallery.filter((m) => m.type === 'photo').length} photos
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Accès Rapides & Actions Fréquentes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('media');
                      setNewMediaType('video');
                    }}
                    className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left space-y-1 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-white text-xs">Intégrer une Vidéo</div>
                    <div className="text-[11px] text-neutral-400">Lien YouTube ou MP4 dans la galerie</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('media');
                      setNewMediaType('photo');
                    }}
                    className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left space-y-1 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-white text-xs">Ajouter une Photo</div>
                    <div className="text-[11px] text-neutral-400">Téléverser une photo de vos prestations</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('ticketing');
                      setTicketingSubTab('scanner');
                    }}
                    className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left space-y-1 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-white text-xs">Scanner les Entrées (QR Code)</div>
                    <div className="text-[11px] text-neutral-400">Contrôle d’accès aux portes</div>
                  </button>
                </div>
              </div>

              {/* Recent Events & Wave Payments Table */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Derniers Événements & Paiements Wave
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ticketing')}
                    className="text-xs text-orange-400 hover:underline font-bold"
                  >
                    Tout afficher →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="py-2.5 font-bold">Événement</th>
                        <th className="py-2.5 font-bold">Date & Lieu</th>
                        <th className="py-2.5 font-bold">Type</th>
                        <th className="py-2.5 font-bold">Règlement Wave</th>
                        <th className="py-2.5 font-bold">Places vendues</th>
                        <th className="py-2.5 font-bold">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {adminOverview?.events?.slice(0, 5).map((ev) => (
                        <tr key={ev.id} className="hover:bg-neutral-900/40">
                          <td className="py-3 font-bold text-white flex items-center gap-2">
                            <img src={ev.posterUrl} className="w-8 h-10 object-cover rounded" alt="" />
                            <span className="truncate max-w-[180px]">{ev.title}</span>
                          </td>
                          <td className="py-3 text-neutral-300">
                            {ev.date} • {ev.city}
                          </td>
                          <td className="py-3">
                            {(ev as any).isClientCreated ? (
                              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                                Créé par Client
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px]">
                                Agence
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            {(ev as any).isClientCreated ? (
                              <span className="text-emerald-400 font-mono text-[11px] font-bold">
                                10 000 F (Réf: {(ev as any).wavePaymentRef || 'Wave OK'})
                              </span>
                            ) : (
                              <span className="text-neutral-500 text-[11px]">Inclus</span>
                            )}
                          </td>
                          <td className="py-3 font-bold text-neutral-200">
                            {ev.ticketsSold} / {ev.totalCapacity}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ev.salesActive
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {ev.salesActive ? 'En vente' : 'Suspendu'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CMS CONTENT MANAGEMENT */}
          {activeTab === 'cms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* CMS Sub navigation */}
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                {[
                  { id: 'general', label: 'Coordonnées & Textes Généraux' },
                  { id: 'services', label: `Nos Services (${services.length})` },
                  { id: 'formulas', label: `Formules & Packs (${formulas.length})` },
                  { id: 'testimonials', label: `Avis Clients (${testimonials.length})` }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setCmsSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      cmsSubTab === sub.id
                        ? 'bg-neutral-800 text-orange-400 border border-neutral-700'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Subtab 2.1: General Info */}
              {cmsSubTab === 'general' && (
                <form onSubmit={handleSaveCompanyInfo} className="space-y-5">
                  <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Identité de l’Entreprise & Accroches
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Nom de l’Agence
                        </label>
                        <input
                          type="text"
                          value={companyForm.name}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, name: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Slogan Principal
                        </label>
                        <input
                          type="text"
                          value={companyForm.slogan}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, slogan: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Accroche Hero (Grand Titre Accueil)
                      </label>
                      <input
                        type="text"
                        value={companyForm.heroTagline}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, heroTagline: e.target.value })
                        }
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Contacts, Téléphones & WhatsApp
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Téléphone Principal (Affichage)
                        </label>
                        <input
                          type="text"
                          value={companyForm.phone}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, phone: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Téléphone Secondaire
                        </label>
                        <input
                          type="text"
                          value={companyForm.phoneAlt}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, phoneAlt: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Numéro WhatsApp (sans le +)
                        </label>
                        <input
                          type="text"
                          value={companyForm.whatsappNumber}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, whatsappNumber: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Email de Contact
                        </label>
                        <input
                          type="email"
                          value={companyForm.email}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, email: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Adresse / Siège
                        </label>
                        <input
                          type="text"
                          value={companyForm.headquarters}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, headquarters: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les Modifications du Site</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Subtab 2.2: Services */}
              {cmsSubTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400">
                      Modifiez directement les textes et images des services affichés sur le site.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {services.map((srv, idx) => (
                      <div
                        key={srv.id}
                        className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-orange-400">
                              #{srv.number}
                            </span>
                            <input
                              type="text"
                              value={srv.title}
                              onChange={(e) => {
                                const next = [...services];
                                next[idx] = { ...next[idx], title: e.target.value };
                                updateServices(next);
                              }}
                              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-bold text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteService(srv.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                            title="Supprimer ce service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                            Description Courte
                          </label>
                          <textarea
                            rows={2}
                            value={srv.shortDesc}
                            onChange={(e) => {
                              const next = [...services];
                              next[idx] = { ...next[idx], shortDesc: e.target.value };
                              updateServices(next);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                            URL de l’Image
                          </label>
                          <input
                            type="text"
                            value={srv.imageUrl}
                            onChange={(e) => {
                              const next = [...services];
                              next[idx] = { ...next[idx], imageUrl: e.target.value };
                              updateServices(next);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 2.3: Formulas */}
              {cmsSubTab === 'formulas' && (
                <div className="space-y-4">
                  {formulas.map((form, idx) => (
                    <div
                      key={form.id}
                      className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => {
                            const next = [...formulas];
                            next[idx] = { ...next[idx], name: e.target.value };
                            updateFormulas(next);
                          }}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-bold text-xs"
                        />
                        <input
                          type="text"
                          value={form.priceNote}
                          placeholder="Ex: Sur devis"
                          onChange={(e) => {
                            const next = [...formulas];
                            next[idx] = { ...next[idx], priceNote: e.target.value };
                            updateFormulas(next);
                          }}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-orange-400 font-bold text-xs"
                        />
                      </div>
                      <input
                        type="text"
                        value={form.tagline}
                        onChange={(e) => {
                          const next = [...formulas];
                          next[idx] = { ...next[idx], tagline: e.target.value };
                          updateFormulas(next);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Subtab 2.4: Testimonials */}
              {cmsSubTab === 'testimonials' && (
                <div className="space-y-4">
                  {testimonials.map((test, idx) => (
                    <div
                      key={test.id}
                      className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={test.name}
                            onChange={(e) => {
                              const next = [...testimonials];
                              next[idx] = { ...next[idx], name: e.target.value };
                              updateTestimonials(next);
                            }}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-white font-bold text-xs"
                          />
                          <input
                            type="text"
                            value={test.event}
                            onChange={(e) => {
                              const next = [...testimonials];
                              next[idx] = { ...next[idx], event: e.target.value };
                              updateTestimonials(next);
                            }}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-400 text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(test.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={test.comment}
                        onChange={(e) => {
                          const next = [...testimonials];
                          next[idx] = { ...next[idx], comment: e.target.value };
                          updateTestimonials(next);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEDIA (PHOTOS & VIDEOS) */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Add New Media Form */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-orange-400" />
                    <span>Intégrer une Vidéo ou une Photo</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewMediaType('video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        newMediaType === 'video'
                          ? 'bg-orange-500 text-black'
                          : 'bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      Format Vidéo (YouTube / MP4)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMediaType('photo')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        newMediaType === 'photo'
                          ? 'bg-orange-500 text-black'
                          : 'bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      Format Photo
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddMedia} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Titre du Média *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Show DJ Live Almadies, Teaser Aftermovie 2026..."
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs font-medium focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={newMediaCategory}
                        onChange={(e) => setNewMediaCategory(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      >
                        <option value="DJ en prestation">DJ en prestation</option>
                        <option value="Matériel de sonorisation">Matériel de sonorisation</option>
                        <option value="Mariages">Mariages</option>
                        <option value="Public & Ambiance">Public & Ambiance</option>
                        <option value="Éclairages">Éclairages</option>
                        <option value="Événements">Événements</option>
                        <option value="Soirées">Soirées</option>
                      </select>
                    </div>
                  </div>

                  {newMediaType === 'video' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Lien de la Vidéo (YouTube ou MP4) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                        value={newMediaVideoUrl}
                        onChange={(e) => setNewMediaVideoUrl(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Les liens YouTube seront automatiquement intégrés avec prévisualisation et lecteur interactif.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Image (Fichier local ou URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                        />
                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 cursor-pointer text-xs font-bold text-neutral-200 transition-colors shrink-0">
                          <Upload className="w-3.5 h-3.5 text-orange-400" />
                          <span>Parcourir photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMediaFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Tag / Durée (Ex: "Vidéo 4K", "3:45", "Live DJ")
                      </label>
                      <input
                        type="text"
                        value={newMediaDuration}
                        onChange={(e) => setNewMediaDuration(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                        Description succincte
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Ambiance féerique captée lors du gala annuel..."
                        value={newMediaDesc}
                        onChange={(e) => setNewMediaDesc(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter ce Média à la Galerie</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery Items Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Médias Actuellement en Ligne ({gallery.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[9px] font-extrabold uppercase tracking-wider text-orange-400">
                          {item.type}
                        </span>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 font-bold block truncate">
                            {item.category}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                            {item.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-800/80">
                          <span className="text-[10px] text-neutral-500">{item.durationOrTag}</span>
                          <button
                            type="button"
                            onClick={() => deleteGalleryItem(item.id)}
                            className="text-neutral-500 hover:text-red-400 p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TICKETING & EVENTS MANAGEMENT */}
          {activeTab === 'ticketing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Ticketing sub navigation */}
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                {[
                  { id: 'events', label: `Événements (${adminOverview?.events?.length || 0})` },
                  { id: 'orders', label: `Commandes & Billets (${adminOverview?.orders?.length || 0})` },
                  { id: 'scanner', label: 'Scanner Contrôle d’Accès (Caméra & Code)' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setTicketingSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      ticketingSubTab === sub.id
                        ? 'bg-neutral-800 text-orange-400 border border-neutral-700'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Subtab 4.1: Events List */}
              {ticketingSubTab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400">
                      Gérez les événements officiels et ceux créés par les clients (10 000 FCFA Wave).
                    </p>
                  </div>

                  <div className="space-y-3">
                    {adminOverview?.events?.map((ev) => {
                      const isClient = Boolean((ev as any).isClientCreated);
                      return (
                        <div
                          key={ev.id}
                          className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={ev.posterUrl}
                              alt={ev.title}
                              className="w-14 h-18 rounded-xl object-cover shrink-0 border border-neutral-700"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {isClient ? (
                                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-extrabold text-[10px] border border-sky-500/30">
                                    Client • Frais Wave 10 000 F
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-[10px] border border-orange-500/30">
                                    Événement Officiel
                                  </span>
                                )}
                                <span className="text-[10px] text-neutral-400">
                                  {ev.category}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                              <p className="text-xs text-neutral-400">
                                📅 {ev.date} ({ev.startTime} - {ev.endTime}) • 📍 {ev.venueName}, {ev.city}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-300">
                                <span>Organisateur: <strong className="text-white">{ev.organizerName}</strong> ({ev.organizerPhone})</span>
                                {(ev as any).wavePaymentRef && (
                                  <span className="text-emerald-400 font-mono">
                                    Réf Wave création: {(ev as any).wavePaymentRef}
                                  </span>
                                )}
                              </div>
                              {(ev.creatorPaymentRecipient || ev.creatorPaymentMethod) && (
                                <div className="text-[11px] text-sky-300 bg-sky-950/50 border border-sky-800/60 rounded-lg px-2.5 py-1 flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sky-400">💳 Encaissement des ventes :</span>
                                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold uppercase text-[10px]">
                                    {ev.creatorPaymentMethod === 'wave_link' ? 'Lien Wave' : ev.creatorPaymentMethod === 'wave_phone' ? 'Wave Sénégal' : ev.creatorPaymentMethod === 'orange_money' ? 'Orange Money' : ev.creatorPaymentMethod === 'free_money' ? 'Free Money' : 'Banque / Perso'}
                                  </span>
                                  <span className="font-mono text-white">{ev.creatorPaymentRecipient}</span>
                                  {ev.creatorPaymentName && <span className="text-neutral-400">• Bénéficiaire: <strong className="text-neutral-200">{ev.creatorPaymentName}</strong></span>}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSales(ev.id, ev.salesActive)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                ev.salesActive
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                              }`}
                            >
                              {ev.salesActive ? 'Vente Active' : 'Vente Suspendue'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-2 text-neutral-500 hover:text-red-400 rounded-xl hover:bg-neutral-800 transition-colors"
                              title="Supprimer l'événement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subtab 4.2: Orders & Issued Tickets */}
              {ticketingSubTab === 'orders' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-neutral-400 border-b border-neutral-800">
                        <tr>
                          <th className="py-2.5 font-bold">Commande</th>
                          <th className="py-2.5 font-bold">Acheteur</th>
                          <th className="py-2.5 font-bold">Événement</th>
                          <th className="py-2.5 font-bold">Montant</th>
                          <th className="py-2.5 font-bold">Paiement</th>
                          <th className="py-2.5 font-bold">Statut</th>
                          <th className="py-2.5 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {adminOverview?.orders?.map((order) => (
                          <tr key={order.id} className="hover:bg-neutral-900/40">
                            <td className="py-3 font-mono font-bold text-white">
                              {order.id}
                            </td>
                            <td className="py-3">
                              <div className="font-bold text-white">{order.buyerName}</div>
                              <div className="text-[10px] text-neutral-400">{order.buyerPhone}</div>
                            </td>
                            <td className="py-3 font-medium text-neutral-300">
                              {order.eventTitle}
                            </td>
                            <td className="py-3 font-extrabold text-orange-400">
                              {order.totalAmount.toLocaleString('fr-FR')} FCFA
                            </td>
                            <td className="py-3 text-neutral-300">
                              {order.paymentMethod}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.status === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {order.status === 'paid' ? 'Payé' : 'Remboursé'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {order.status === 'paid' && (
                                <button
                                  type="button"
                                  onClick={() => handleRefundOrder(order.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold"
                                >
                                  Rembourser
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab 4.3: Gate Scanner */}
              {ticketingSubTab === 'scanner' && (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Scanner & Validation des Billets d’Entrée
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Vérifiez l’authenticité des billets présentés par les spectateurs en saisissant leur code QR ou en scannant.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Saisissez ou collez le code billet (ex: TKT-2026-X8F4)"
                      value={manualTicketCode}
                      onChange={(e) => setManualTicketCode(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleValidateTicketCode()}
                      className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20"
                    >
                      Valider le Billet
                    </button>
                  </div>

                  {/* Scan Result Box */}
                  {scanResult && (
                    <div
                      className={`p-4 rounded-2xl border ${
                        scanResult.valid
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      } space-y-2`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {scanResult.valid ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>BILLET VALIDE • ACCÈS AUTORISÉ</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            <span>{scanResult.message || 'BILLET INVALIDE OU DÉJÀ UTILISÉ'}</span>
                          </>
                        )}
                      </div>
                      {scanResult.ticket && (
                        <div className="text-xs text-neutral-300 space-y-1 pt-1 border-t border-neutral-800">
                          <div>Événement : <strong className="text-white">{scanResult.ticket.eventTitle}</strong></div>
                          <div>Porteur : <strong className="text-white">{scanResult.ticket.buyerName}</strong> ({scanResult.ticket.tierName})</div>
                          <div>Code Billet : <span className="font-mono text-orange-400">{scanResult.ticket.id}</span></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Sauvegarde & Restauration du Site
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Toutes vos modifications sont sauvegardées en temps réel sur le serveur et dans votre navigateur.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <h4 className="text-xs font-bold text-white">Réinitialisation d'Origine</h4>
                <p className="text-xs text-neutral-400">
                  Restaure les textes, services et médias par défaut initiaux d’Expert Événementiel.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Attention : Voulez-vous réinitialiser tous les contenus du site par défaut ?')) {
                      await resetToDefaults();
                      showNotification('Contenus par défaut restaurés avec succès.');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                  <span>Réinitialiser aux contenus par défaut</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
