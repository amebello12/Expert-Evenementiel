import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { COMPANY_INFO, SERVICES_LIST, GALLERY_ITEMS, FORMULAS_LIST, TESTIMONIALS_LIST, EVENTS_SHOWCASE } from './src/data/mockData';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Ensure server data directory exists
const DATA_DIR = path.join(process.cwd(), 'server-data');
const DB_FILE = path.join(DATA_DIR, 'tickets-db.json');
const SITE_CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getSiteContent() {
  if (fs.existsSync(SITE_CONTENT_FILE)) {
    try {
      const data = fs.readFileSync(SITE_CONTENT_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading site content:', e);
    }
  }
  const defaultContent = {
    companyInfo: COMPANY_INFO,
    services: SERVICES_LIST,
    gallery: GALLERY_ITEMS,
    formulas: FORMULAS_LIST,
    testimonials: TESTIMONIALS_LIST,
    eventsShowcase: EVENTS_SHOWCASE
  };
  try {
    fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
  } catch (err) {
    console.error('Failed to init site-content.json', err);
  }
  return defaultContent;
}

function saveSiteContent(content: any) {
  fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(content, null, 2));
}

// Device detection helper for multi-device cross-platform orders (Android, iPhone, Windows, Mac, Tablette)
function parseDeviceType(userAgent: string = '', explicit?: string): string {
  if (explicit && typeof explicit === 'string' && explicit.trim()) {
    return explicit;
  }
  const ua = (userAgent || '').toLowerCase();
  if (ua.includes('ipad')) return 'Tablette iPad';
  if (ua.includes('tablet') || (ua.includes('android') && !ua.includes('mobile'))) return 'Tablette Android';
  if (ua.includes('iphone')) return 'iPhone (iOS)';
  if (ua.includes('android')) return 'Android Mobile';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'Mac (macOS)';
  if (ua.includes('windows')) return 'Ordinateur Windows';
  if (ua.includes('linux')) return 'Linux PC';
  return 'Navigateur Web';
}

// Initial Database Seed
const initialEvents = [
  {
    id: 'evt-dakar-stars-2026',
    title: 'Festival Étoiles de Dakar 2026',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    description: 'Le plus grand festival de musiques actuelles et traditionnelles du Sénégal. Une scène monumentale sonorisée par Expert Événementiel avec les meilleurs artistes, DJ et performeurs d’Afrique de l’Ouest.',
    date: '2026-10-18',
    startTime: '20:00',
    endTime: '04:00',
    venueName: 'Monument de la Renaissance Africaine',
    address: 'Place de la Renaissance, Ouakam',
    city: 'Dakar',
    category: 'Concert & Festival',
    totalCapacity: 1200,
    ticketsSold: 348,
    ticketTiers: [
      {
        id: 'tier-fb-early',
        name: 'Early Bird Promo',
        category: 'Early Bird',
        price: 5000,
        totalQuantity: 200,
        soldQuantity: 185,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-09-30',
        description: 'Tarif préférentiel pour les premiers inscrits.',
        perks: ['Accès fosse standard', 'Entrée coupe-file jusqu’à 21h']
      },
      {
        id: 'tier-fb-std',
        name: 'Billet Standard',
        category: 'Standard',
        price: 10000,
        totalQuantity: 800,
        soldQuantity: 135,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-10-18',
        description: 'Accès complet au concert et aux espaces village.',
        perks: ['Accès scène centrale', '1 boisson soft offerte']
      },
      {
        id: 'tier-fb-vip',
        name: 'Billet VIP Prestige',
        category: 'VIP',
        price: 25000,
        totalQuantity: 150,
        soldQuantity: 24,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-10-18',
        description: 'Tribune surélevée avec vue imprenable sur la scène.',
        perks: ['Accès espace VIP privatif', 'Bar dédié', 'Service cocktail', 'Parking réservé']
      },
      {
        id: 'tier-fb-vvip',
        name: 'Table Lounge VVIP',
        category: 'VVIP',
        price: 75000,
        totalQuantity: 50,
        soldQuantity: 4,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-10-18',
        description: 'Salon lounge luxueux avec service hôtesse et champagne.',
        perks: ['Salon avec canapés', 'Service traiteur inclus', 'Accès backstage artistes', 'Sécurité rapprochée']
      }
    ],
    accessConditions: [
      'Billet avec QR Code obligatoire à présenter sur smartphone ou imprimé.',
      'Contrôle d’identité à l’entrée pour les billets VIP et VVIP.',
      'Ouverture des portes dès 18h30. Fin des entrées à 23h30.'
    ],
    organizerName: 'Dakar Live Productions & Culture',
    organizerEmail: 'contact@dakarlive.sn',
    organizerPhone: '+221 77 560 88 12',
    organizerCompany: 'Dakar Live SARL',
    status: 'published',
    salesActive: true,
    minPrice: 5000,
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'evt-gala-prestige-2026',
    title: 'Gala Prestige des Leaders & Entreprises',
    posterUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
    description: 'La prestigieuse soirée annuelle réunissant les décideurs, entrepreneurs et personnalités du Sénégal et de la diaspora dans les salons d’apparat du King Fahd Palace.',
    date: '2026-11-07',
    startTime: '19:30',
    endTime: '02:00',
    venueName: 'King Fahd Palace (Grand Salon)',
    address: 'Pointe des Almadies',
    city: 'Dakar',
    category: 'Gala & Soirée',
    totalCapacity: 450,
    ticketsSold: 162,
    ticketTiers: [
      {
        id: 'tier-gala-std',
        name: 'Pass Cocktail Réception',
        category: 'Pass',
        price: 35000,
        totalQuantity: 200,
        soldQuantity: 95,
        saleStartDate: '2026-08-15',
        saleEndDate: '2026-11-07',
        description: 'Accès au cocktail dînatoire et à la cérémonie de remise des prix.',
        perks: ['Cocktail champagne', 'Networking B2B exclusif', 'After-party DJ']
      },
      {
        id: 'tier-gala-vip',
        name: 'VIP Dîner Gastronomique',
        category: 'VIP',
        price: 75000,
        totalQuantity: 150,
        soldQuantity: 52,
        saleStartDate: '2026-08-15',
        saleEndDate: '2026-11-07',
        description: 'Dîner assis gastronomique 4 services avec les personnalités.',
        perks: ['Dîner gastronomique', 'Placement premier rang', 'Annuaire des décideurs', 'Photo call officiel']
      },
      {
        id: 'tier-gala-vvip',
        name: 'Table Corporate VVIP (10 Personnes)',
        category: 'VVIP',
        price: 500000,
        totalQuantity: 10,
        soldQuantity: 2,
        saleStartDate: '2026-08-15',
        saleEndDate: '2026-11-07',
        description: 'Table privée personnalisée au nom de votre entreprise.',
        perks: ['Visibilité logo entreprise sur les écrans', '3 bouteilles de champagne prestige', 'Prise de parole possible']
      }
    ],
    accessConditions: [
      'Tenue de gala ou tenue traditionnelle d’apparat exigée.',
      'Présentation impérative du QR Code au pupitre d’accueil.',
      'Réservation nominative non cessible sans accord préalable.'
    ],
    organizerName: 'Club Élite & Business Afrique',
    organizerEmail: 'direction@business-senegal.com',
    organizerPhone: '+221 78 112 34 56',
    organizerCompany: 'Afrique Élite Event Group',
    status: 'published',
    salesActive: true,
    minPrice: 35000,
    createdAt: '2026-08-10T14:30:00.000Z'
  },
  {
    id: 'evt-saly-sunset-2026',
    title: 'Saly Beach Sunset & Afro-House Fest',
    posterUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
    description: 'Pieds dans le sable sur la plage dorée de Saly Portudal. 10 heures de son non-stop avec les DJs résidents Expert Événementiel et des guests internationaux.',
    date: '2026-10-25',
    startTime: '16:00',
    endTime: '02:00',
    venueName: 'Plage Privée des Alizés',
    address: 'Boulevard de Saly, Station Balnéaire',
    city: 'Saly',
    category: 'Soirée & Clubbing',
    totalCapacity: 600,
    ticketsSold: 210,
    ticketTiers: [
      {
        id: 'tier-saly-early',
        name: 'Pass Early Bird Beach',
        category: 'Early Bird',
        price: 5000,
        totalQuantity: 150,
        soldQuantity: 150,
        saleStartDate: '2026-08-10',
        saleEndDate: '2026-09-15',
        description: 'Épuisé - Premier arrivage.',
        perks: ['Entrée avant 18h', '1 cocktail plage']
      },
      {
        id: 'tier-saly-std',
        name: 'Billet Standard Sunset',
        category: 'Standard',
        price: 10000,
        totalQuantity: 350,
        soldQuantity: 52,
        saleStartDate: '2026-09-01',
        saleEndDate: '2026-10-25',
        description: 'Accès complet à la plage et au dancefloor sonorisé.',
        perks: ['Accès plage privée', 'Cadeau goodies festival']
      },
      {
        id: 'tier-saly-vip',
        name: 'VIP Deck Lounge',
        category: 'VIP',
        price: 30000,
        totalQuantity: 100,
        soldQuantity: 8,
        saleStartDate: '2026-09-01',
        saleEndDate: '2026-10-25',
        description: 'Terrasse surélevée en bois surplombant l’océan.',
        perks: ['Transat réservé', 'Service bar VIP', 'Buffet grillades sunset']
      }
    ],
    accessConditions: [
      'Entrée réservée aux personnes majeures (+18 ans).',
      'Bracelet étanche remis après vérification du QR Code à l’entrée.',
      'Possibilité d’apporter sa tenue de bain.'
    ],
    organizerName: 'Saly Groove & Events',
    organizerEmail: 'info@salygroove.sn',
    organizerPhone: '+221 77 890 12 34',
    organizerCompany: 'Saly Groove SN',
    status: 'published',
    salesActive: true,
    minPrice: 5000,
    createdAt: '2026-08-12T16:00:00.000Z'
  },
  {
    id: 'evt-cicad-digital-2026',
    title: 'Sommet Sénégal Digital & Innovation 2026',
    posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    description: 'La grande rencontre technologique de l’Afrique de l’Ouest au CICAD de Diamniadio : IA, Fintech, Startups, cybersécurité et transformation numérique.',
    date: '2026-11-20',
    startTime: '08:30',
    endTime: '18:00',
    venueName: 'Centre International de Conférences Abdou Diouf (CICAD)',
    address: 'Pôle Urbain de Diamniadio',
    city: 'Dakar',
    category: 'Conférence & B2B',
    totalCapacity: 1500,
    ticketsSold: 420,
    ticketTiers: [
      {
        id: 'tier-cicad-free',
        name: 'Pass Étudiant & Chercheur',
        category: 'Gratuit',
        price: 0,
        totalQuantity: 300,
        soldQuantity: 190,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-11-15',
        description: 'Accès gratuit sur présentation de la carte d’étudiant.',
        perks: ['Accès plénières', 'Espace démonstrations tech']
      },
      {
        id: 'tier-cicad-std',
        name: 'Pass Délégué Professionnel',
        category: 'Standard',
        price: 25000,
        totalQuantity: 800,
        soldQuantity: 180,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-11-20',
        description: 'Accès complet aux ateliers, panels d’experts et déjeuners.',
        perks: ['Déjeuner buffet inclus', 'Accès ateliers B2B', 'Kit conférencier complet']
      },
      {
        id: 'tier-cicad-vip',
        name: 'VIP All-Access & Networking Lounge',
        category: 'VIP',
        price: 60000,
        totalQuantity: 200,
        soldQuantity: 50,
        saleStartDate: '2026-08-01',
        saleEndDate: '2026-11-20',
        description: 'Accès exclusif au salon des ministres et investisseurs.',
        perks: ['Salon VIP réservé', 'Rendez-vous One-to-One pré-programmés', 'Accès direct aux intervenants']
      }
    ],
    accessConditions: [
      'Badge visiteur imprimé à l’entrée sur présentation du QR Code reçu.',
      'Carte d’identité ou passeport requis pour l’accès au CICAD.',
      'Navettes gratuites depuis Dakar Plateau et Point E.'
    ],
    organizerName: 'Alliance Tech Sénégal & CEDEAO',
    organizerEmail: 'contact@senegaldigital.sn',
    organizerPhone: '+221 33 820 40 50',
    organizerCompany: 'Senegal Digital Hub',
    status: 'published',
    salesActive: true,
    minPrice: 0,
    createdAt: '2026-08-05T09:00:00.000Z'
  }
];

const initialTickets = [
  {
    id: 'TKT-SN-2026-88A1',
    orderId: 'ORD-SN-2026-901',
    qrCodeHash: 'VERIFY-EXP-2026-88A1-VALID',
    eventId: 'evt-dakar-stars-2026',
    eventTitle: 'Festival Étoiles de Dakar 2026',
    eventPoster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    eventDate: '2026-10-18',
    eventTime: '20:00',
    eventVenue: 'Monument de la Renaissance Africaine',
    eventAddress: 'Place de la Renaissance, Ouakam',
    eventCity: 'Dakar',
    ticketTierId: 'tier-fb-vip',
    ticketTierName: 'Billet VIP Prestige',
    ticketCategory: 'VIP',
    price: 25000,
    attendeeName: 'Amadou Moustapha Fall',
    attendeeEmail: 'amadou.fall@gmail.com',
    attendeePhone: '+221 77 450 12 34',
    paymentMethod: 'Wave',
    status: 'valid',
    createdAt: '2026-09-01T11:20:00.000Z'
  },
  {
    id: 'TKT-SN-2026-77B2',
    orderId: 'ORD-SN-2026-902',
    qrCodeHash: 'VERIFY-EXP-2026-77B2-USED',
    eventId: 'evt-dakar-stars-2026',
    eventTitle: 'Festival Étoiles de Dakar 2026',
    eventPoster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    eventDate: '2026-10-18',
    eventTime: '20:00',
    eventVenue: 'Monument de la Renaissance Africaine',
    eventAddress: 'Place de la Renaissance, Ouakam',
    eventCity: 'Dakar',
    ticketTierId: 'tier-fb-std',
    ticketTierName: 'Billet Standard',
    ticketCategory: 'Standard',
    price: 10000,
    attendeeName: 'Awa Diop',
    attendeeEmail: 'awa.diop@orange.sn',
    attendeePhone: '+221 78 300 45 67',
    paymentMethod: 'Orange Money',
    status: 'used',
    validatedAt: '2026-10-18T20:15:30.000Z',
    validatedBy: 'Agent Entrée Porte 2',
    createdAt: '2026-09-02T14:10:00.000Z'
  }
];

const initialOrders = [
  {
    id: 'ORD-SN-2026-901',
    eventId: 'evt-dakar-stars-2026',
    eventTitle: 'Festival Étoiles de Dakar 2026',
    buyerName: 'Amadou Moustapha Fall',
    buyerEmail: 'amadou.fall@gmail.com',
    buyerPhone: '+221 77 450 12 34',
    items: [
      {
        ticketTierId: 'tier-fb-vip',
        tierName: 'Billet VIP Prestige',
        category: 'VIP',
        quantity: 1,
        unitPrice: 25000
      }
    ],
    totalAmount: 25000,
    paymentMethod: 'Wave',
    paymentRef: 'WAVE-SN-TX-9988112',
    status: 'completed',
    issuedTicketIds: ['TKT-SN-2026-88A1'],
    createdAt: '2026-09-01T11:20:00.000Z'
  }
];

interface DatabaseStructure {
  events: typeof initialEvents;
  tickets: typeof initialTickets;
  orders: typeof initialOrders;
}

// Helper to load or initialize DB
function getDatabase(): DatabaseStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file, using in-memory / re-initializing', err);
  }

  const initialData: DatabaseStructure = {
    events: initialEvents,
    tickets: initialTickets,
    orders: initialOrders
  };
  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DatabaseStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file', err);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Expert Événementiel Centralized Ticketing API' });
});

// 2. Public / Filtered Events
app.get('/api/events', (req, res) => {
  const db = getDatabase();
  const { city, category, search, minPrice, maxPrice, status } = req.query;

  let filtered = [...db.events];

  // Default to published unless explicitly querying as admin
  if (status && typeof status === 'string') {
    if (status !== 'all') {
      filtered = filtered.filter((e) => e.status === status);
    }
  } else {
    filtered = filtered.filter((e) => e.status === 'published');
  }

  if (city && typeof city === 'string' && city !== 'Toutes') {
    filtered = filtered.filter((e) => e.city.toLowerCase() === city.toLowerCase());
  }

  if (category && typeof category === 'string' && category !== 'Toutes') {
    filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter((e) => e.minPrice >= min);
    }
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter((e) => e.minPrice <= max);
    }
  }

  res.json(filtered);
});

// 3. Single Event details
app.get('/api/events/:id', (req, res) => {
  const db = getDatabase();
  const event = db.events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Événement introuvable' });
  }
  res.json(event);
});

// 4. Create new Event (Organisateur)
app.post('/api/events', (req, res) => {
  const db = getDatabase();
  const body = req.body;

  if (!body.title || !body.date || !body.venueName || !body.city) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires' });
  }

  const newId = 'evt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);

  // Compute minimum price
  const tiers = Array.isArray(body.ticketTiers) && body.ticketTiers.length > 0
    ? body.ticketTiers.map((t: any, idx: number) => ({
        id: t.id || `tier-${newId}-${idx + 1}`,
        name: t.name || 'Billet Standard',
        category: t.category || 'Standard',
        price: Number(t.price) || 0,
        totalQuantity: Number(t.totalQuantity) || 100,
        soldQuantity: 0,
        saleStartDate: t.saleStartDate || new Date().toISOString().split('T')[0],
        saleEndDate: t.saleEndDate || body.date,
        description: t.description || '',
        perks: Array.isArray(t.perks) ? t.perks : []
      }))
    : [
        {
          id: `tier-${newId}-1`,
          name: 'Billet Standard',
          category: 'Standard',
          price: 5000,
          totalQuantity: 100,
          soldQuantity: 0,
          saleStartDate: new Date().toISOString().split('T')[0],
          saleEndDate: body.date,
          description: 'Accès général',
          perks: ['Entrée standard']
        }
      ];

  const minPrice = tiers.reduce((min: number, t: any) => (t.price < min ? t.price : min), tiers[0]?.price || 0);
  const totalCap = tiers.reduce((sum: number, t: any) => sum + (t.totalQuantity || 0), 0);

  const creatorDevice = parseDeviceType(req.headers['user-agent'] as string, body.createdFromDevice);

  const newEvent = {
    id: newId,
    title: body.title,
    posterUrl: body.posterUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    description: body.description || 'Événement géré via la plateforme billetterie Expert Événementiel.',
    date: body.date,
    startTime: body.startTime || '20:00',
    endTime: body.endTime || '02:00',
    venueName: body.venueName,
    address: body.address || `${body.venueName}, ${body.city}`,
    city: body.city || 'Dakar',
    category: body.category || 'Concert & Festival',
    totalCapacity: totalCap || 200,
    ticketsSold: 0,
    ticketTiers: tiers,
    accessConditions: Array.isArray(body.accessConditions) && body.accessConditions.length > 0
      ? body.accessConditions
      : ['Billet avec QR Code obligatoire à l’entrée.', 'Contrôle de sécurité systématique.'],
    organizerName: body.organizerName || 'Organisateur Partenaire',
    organizerEmail: body.organizerEmail || 'organisateur@event.sn',
    organizerPhone: body.organizerPhone || '+221 77 000 00 00',
    organizerCompany: body.organizerCompany || '',
    isClientCreated: Boolean(body.isClientCreated),
    creationFeeAmount: body.isClientCreated ? 10000 : 0,
    creationFeePaid: body.creationFeePaid !== undefined ? Boolean(body.creationFeePaid) : true,
    wavePaymentRef: body.wavePaymentRef || '',
    waveMerchantLink: 'https://pay.wave.com/m/M_sn_lHy4DaHe66Bv/c/sn/',
    creatorPaymentMethod: body.creatorPaymentMethod || 'wave_phone',
    creatorPaymentRecipient: body.creatorPaymentRecipient || body.organizerPhone || '',
    creatorPaymentName: body.creatorPaymentName || body.organizerName || '',
    creatorPaymentInstructions: body.creatorPaymentInstructions || '',
    createdFromDevice: creatorDevice,
    status: 'published', // Direct publication, reviewed in Admin panel
    salesActive: true,
    minPrice,
    createdAt: new Date().toISOString()
  };

  db.events.unshift(newEvent as any);
  saveDatabase(db);

  res.status(201).json(newEvent);
});

// 5. Update Event
app.put('/api/events/:id', (req, res) => {
  const db = getDatabase();
  const idx = db.events.findIndex((e) => e.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Événement introuvable' });
  }

  db.events[idx] = {
    ...db.events[idx],
    ...req.body,
    id: db.events[idx].id // Protect ID
  };
  saveDatabase(db);
  res.json(db.events[idx]);
});

// 5b. Delete Event
app.delete('/api/events/:id', (req, res) => {
  const db = getDatabase();
  const idx = db.events.findIndex((e) => e.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Événement introuvable' });
  }

  const deleted = db.events.splice(idx, 1)[0];
  saveDatabase(db);
  res.json({ success: true, deletedEvent: deleted });
});

// 6. Toggle Sales Active or Status
app.patch('/api/events/:id/status', (req, res) => {
  const db = getDatabase();
  const event = db.events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Événement introuvable' });
  }

  if (req.body.salesActive !== undefined) {
    event.salesActive = Boolean(req.body.salesActive);
  }
  if (req.body.status) {
    event.status = req.body.status;
  }

  saveDatabase(db);
  res.json(event);
});

// 7. Process Ticket Checkout (Atomic purchase with Wave, Orange Money, Free Money, CB)
app.post('/api/orders/checkout', (req, res) => {
  const db = getDatabase();
  const { eventId, buyerName, buyerEmail, buyerPhone, items, paymentMethod } = req.body;

  if (!eventId || !buyerName || !buyerEmail || !buyerPhone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Données de commande incomplètes' });
  }

  const event = db.events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Événement inexistant' });
  }

  if (!event.salesActive || event.status !== 'published') {
    return res.status(400).json({ error: 'Les ventes de billets pour cet événement sont actuellement fermées.' });
  }

  // Check inventory & calculate total
  let orderTotal = 0;
  for (const item of items) {
    const tier = event.ticketTiers.find((t: any) => t.id === item.ticketTierId);
    if (!tier) {
      return res.status(400).json({ error: `Formule de billet invalide: ${item.ticketTierId}` });
    }
    const remaining = tier.totalQuantity - tier.soldQuantity;
    if (item.quantity > remaining) {
      return res.status(400).json({
        error: `Places insuffisantes pour ${tier.name}. Il ne reste que ${remaining} place(s).`
      });
    }
    orderTotal += tier.price * item.quantity;
  }

  // Decrement inventory
  for (const item of items) {
    const tier = event.ticketTiers.find((t: any) => t.id === item.ticketTierId);
    if (tier) {
      tier.soldQuantity += item.quantity;
    }
  }
  event.ticketsSold += items.reduce((sum: number, it: any) => sum + it.quantity, 0);

  const buyerDevice = parseDeviceType(req.headers['user-agent'] as string, req.body.deviceType);

  // Generate Order
  const orderId = 'ORD-SN-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
  const paymentRef = (paymentMethod || 'WAVE').toUpperCase() + '-SN-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  const generatedTickets: any[] = [];
  const issuedTicketIds: string[] = [];

  for (const item of items) {
    const tier = event.ticketTiers.find((t: any) => t.id === item.ticketTierId)!;
    for (let i = 0; i < item.quantity; i++) {
      const ticketId = 'TKT-SN-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
      const qrCodeHash = `EXP-${event.id.substring(0, 8)}-${ticketId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const ticketRecord = {
        id: ticketId,
        orderId,
        qrCodeHash,
        eventId: event.id,
        eventTitle: event.title,
        eventPoster: event.posterUrl,
        eventDate: event.date,
        eventTime: event.startTime,
        eventVenue: event.venueName,
        eventAddress: event.address,
        eventCity: event.city,
        ticketTierId: tier.id,
        ticketTierName: tier.name,
        ticketCategory: tier.category,
        price: tier.price,
        attendeeName: buyerName,
        attendeeEmail: buyerEmail,
        attendeePhone: buyerPhone,
        paymentMethod: paymentMethod || 'Wave',
        deviceType: buyerDevice,
        status: 'valid',
        createdAt: new Date().toISOString()
      };

      generatedTickets.push(ticketRecord);
      issuedTicketIds.push(ticketId);
    }
  }

  const orderRecord = {
    id: orderId,
    eventId: event.id,
    eventTitle: event.title,
    buyerName,
    buyerEmail,
    buyerPhone,
    items,
    totalAmount: orderTotal,
    paymentMethod: paymentMethod || 'Wave',
    paymentRef,
    deviceType: buyerDevice,
    status: 'completed',
    issuedTicketIds,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(orderRecord as any);
  db.tickets.unshift(...generatedTickets);

  saveDatabase(db);

  res.status(201).json({
    order: orderRecord,
    tickets: generatedTickets
  });
});

// 8. Fetch Single Ticket (by ID or QR hash)
app.get('/api/tickets/:query', (req, res) => {
  const db = getDatabase();
  const q = req.params.query;
  const ticket = db.tickets.find((t) => t.id === q || t.qrCodeHash === q);
  if (!ticket) {
    return res.status(404).json({ error: 'Billet introuvable' });
  }
  res.json(ticket);
});

// 9. Central Gate Scanner: Validate Ticket (Idempotent, strictly prevents double-use)
app.post('/api/tickets/validate', (req, res) => {
  const db = getDatabase();
  const { code, eventId, agentName } = req.body;

  if (!code) {
    return res.status(400).json({
      valid: false,
      status: 'invalid',
      message: 'Code QR ou numéro de billet manquant'
    });
  }

  const cleanCode = String(code).trim();
  const ticket = db.tickets.find(
    (t) => t.qrCodeHash === cleanCode || t.id === cleanCode || cleanCode.includes(t.qrCodeHash)
  );

  if (!ticket) {
    return res.status(200).json({
      valid: false,
      status: 'invalid',
      message: '🔴 Billet introuvable ou faux billet — Accès refusé'
    });
  }

  // Check event constraint if scanner is locked to a specific event
  if (eventId && ticket.eventId !== eventId) {
    return res.status(200).json({
      valid: false,
      status: 'invalid',
      message: `🔴 Ce billet est valable pour un autre événement ("${ticket.eventTitle}") — Accès refusé`,
      ticket
    });
  }

  if (ticket.status === 'used') {
    const usedDate = ticket.validatedAt
      ? new Date(ticket.validatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : 'précédemment';
    return res.status(200).json({
      valid: false,
      status: 'already_used',
      message: `🔴 Billet déjà scanné et utilisé à ${usedDate} — Accès strictement refusé (Tentative de double passage)`,
      ticket,
      validatedAt: ticket.validatedAt
    });
  }

  if (ticket.status === 'cancelled') {
    return res.status(200).json({
      valid: false,
      status: 'cancelled',
      message: '🔴 Ce billet a été annulé ou remboursé — Accès refusé',
      ticket
    });
  }

  // Atomic update: Mark as used
  ticket.status = 'used';
  ticket.validatedAt = new Date().toISOString();
  ticket.validatedBy = agentName || 'Contrôleur Entrée Smartphone';

  saveDatabase(db);

  res.status(200).json({
    valid: true,
    status: 'success',
    message: '🟢 Billet valide — Accès autorisé',
    ticket,
    validatedAt: ticket.validatedAt
  });
});

// 10. Organizer Dashboard Summary
app.get('/api/organizer/:email/dashboard', (req, res) => {
  const db = getDatabase();
  const email = decodeURIComponent(req.params.email).toLowerCase();

  // Find all events for this organizer
  const myEvents = db.events.filter(
    (e) => e.organizerEmail.toLowerCase() === email || email === 'all' || email === 'demo'
  );

  const eventIds = myEvents.map((e) => e.id);
  const myOrders = db.orders.filter((o) => eventIds.includes(o.eventId));
  const myTickets = db.tickets.filter((t) => eventIds.includes(t.eventId));

  const totalRevenue = myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalTicketsSold = myTickets.length;
  const totalCapacity = myEvents.reduce((sum, e) => sum + (e.totalCapacity || 0), 0);
  const validatedCount = myTickets.filter((t) => t.status === 'used').length;

  res.json({
    events: myEvents,
    orders: myOrders,
    tickets: myTickets,
    stats: {
      totalEvents: myEvents.length,
      totalRevenue,
      totalTicketsSold,
      totalRemaining: Math.max(0, totalCapacity - totalTicketsSold),
      validatedCount,
      totalCapacity
    }
  });
});

// 11. Central Administrator Overview (Expert Événementiel)
app.get('/api/admin/overview', (req, res) => {
  const db = getDatabase();

  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalTicketsSold = db.tickets.length;
  const validatedTickets = db.tickets.filter((t) => t.status === 'used').length;

  // Organizers list
  const organizersMap = new Map<string, any>();
  for (const ev of db.events) {
    if (!organizersMap.has(ev.organizerEmail)) {
      organizersMap.set(ev.organizerEmail, {
        name: ev.organizerName,
        email: ev.organizerEmail,
        phone: ev.organizerPhone,
        company: ev.organizerCompany,
        eventCount: 1,
        totalSales: ev.ticketsSold
      });
    } else {
      const org = organizersMap.get(ev.organizerEmail);
      org.eventCount += 1;
      org.totalSales += ev.ticketsSold;
    }
  }

  const clientEvents = db.events.filter((e) => (e as any).isClientCreated);
  const creationFeesCollected = clientEvents.length * 10000;

  res.json({
    events: db.events,
    orders: db.orders,
    tickets: db.tickets,
    organizers: Array.from(organizersMap.values()),
    stats: {
      totalEvents: db.events.length,
      publishedEvents: db.events.filter((e) => e.status === 'published').length,
      totalRevenue,
      totalTicketsSold,
      validatedTickets,
      totalOrders: db.orders.length,
      clientEventsCount: clientEvents.length,
      creationFeesCollected
    }
  });
});

// 12. Admin Action: Validate or Block Event
app.post('/api/admin/events/:id/review', (req, res) => {
  const db = getDatabase();
  const { status, salesActive } = req.body;
  const event = db.events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Événement introuvable' });
  }

  if (status) event.status = status;
  if (salesActive !== undefined) event.salesActive = salesActive;

  saveDatabase(db);
  res.json(event);
});

// 13. Admin Action: Refund Order
app.post('/api/admin/orders/:id/refund', (req, res) => {
  const db = getDatabase();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  if (order.status === 'refunded') {
    return res.status(400).json({ error: 'Cette commande a déjà été remboursée' });
  }

  order.status = 'refunded';

  // Mark all issued tickets as cancelled
  for (const tktId of order.issuedTicketIds) {
    const tkt = db.tickets.find((t) => t.id === tktId);
    if (tkt) {
      tkt.status = 'cancelled';
    }
  }

  // Restore inventory
  const event = db.events.find((e) => e.id === order.eventId);
  if (event) {
    for (const item of order.items) {
      const tier = event.ticketTiers.find((t: any) => t.id === item.ticketTierId);
      if (tier) {
        tier.soldQuantity = Math.max(0, tier.soldQuantity - item.quantity);
      }
    }
    event.ticketsSold = Math.max(0, event.ticketsSold - order.items.reduce((s: number, i: any) => s + i.quantity, 0));
  }

  saveDatabase(db);
  res.json({ message: 'Commande remboursée avec succès', order });
});

// 14. Site Content CMS Routes (Admin Control)
app.get('/api/site-content', (req, res) => {
  res.json(getSiteContent());
});

app.put('/api/site-content', (req, res) => {
  try {
    saveSiteContent(req.body);
    res.json({ success: true, content: req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur d’enregistrement' });
  }
});

app.post('/api/site-content/reset', (req, res) => {
  const defaultContent = {
    companyInfo: COMPANY_INFO,
    services: SERVICES_LIST,
    gallery: GALLERY_ITEMS,
    formulas: FORMULAS_LIST,
    testimonials: TESTIMONIALS_LIST,
    eventsShowcase: EVENTS_SHOWCASE
  };
  saveSiteContent(defaultContent);
  res.json({ success: true, content: defaultContent });
});

// -------------------------------------------------------------
// VITE / STATIC SERVING
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
