export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  imageUrl: string;
  iconName: string;
  highlightBadge?: string;
}

export type EventCategory = 
  | 'Tous'
  | 'Mariages'
  | 'Anniversaires'
  | 'Soirées'
  | 'Baptêmes'
  | 'Conférences'
  | 'Événements d’entreprise'
  | 'Concerts'
  | 'Cérémonies';

export interface EventShowcase {
  id: string;
  title: string;
  category: EventCategory;
  location: string;
  attendees: string;
  imageUrl: string;
  description: string;
  servicesProvided: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  type: 'photo' | 'video';
  videoUrl?: string; // YouTube, Vimeo, or direct MP4 link
  durationOrTag?: string;
  description: string;
}

export interface PackageFormula {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  priceNote: string;
  servicesIncluded: string[];
  idealFor: string;
  features: string[];
  isPopular?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  event: string;
  city: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  date: string;
}

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  locationCity: string;
  services: string[];
  selectedFormula?: string;
  message: string;
}

// ---------------- TICKETING PLATFORM TYPES ----------------

export type TicketCategoryType = 'Standard' | 'VIP' | 'VVIP' | 'Early Bird' | 'Pass' | 'Gratuit';

export interface TicketTier {
  id: string;
  name: string;
  category: TicketCategoryType;
  price: number; // in FCFA (0 for gratuit)
  totalQuantity: number;
  soldQuantity: number;
  saleStartDate: string;
  saleEndDate: string;
  description?: string;
  perks?: string[];
}

export type EventPublishStatus = 'published' | 'pending_validation' | 'blocked' | 'draft';

export interface TicketEvent {
  id: string;
  title: string;
  posterUrl: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string;
  venueName: string;
  address: string;
  city: string;
  category: string;
  totalCapacity: number;
  ticketsSold: number;
  ticketTiers: TicketTier[];
  accessConditions: string[];
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerCompany?: string;
  isClientCreated?: boolean;
  creationFeeAmount?: number; // e.g. 10000 FCFA
  creationFeePaid?: boolean;
  wavePaymentRef?: string;
  waveMerchantLink?: string;
  // Creator's payment receiver method for buyer ticket payments
  creatorPaymentMethod?: 'wave_link' | 'wave_phone' | 'orange_money' | 'free_money' | 'bank_custom';
  creatorPaymentRecipient?: string; // Phone number or payment link or account info
  creatorPaymentName?: string; // Account holder / beneficiary name
  creatorPaymentInstructions?: string; // Custom instructions for buyers
  status: EventPublishStatus;
  salesActive: boolean;
  minPrice: number;
  createdFromDevice?: string;
  createdAt: string;
}

export interface CompanyInfoData {
  name: string;
  slogan: string;
  heroTagline: string;
  taglineKeywords: string;
  country: string;
  headquarters: string;
  phone: string;
  phoneAlt: string;
  whatsappNumber: string;
  email: string;
  workingHours: string;
  whatsappDefaultMsg: string;
  heroBackgroundUrl?: string;
  stats: { value: string; label: string; desc: string }[];
}

export interface SiteContent {
  companyInfo: CompanyInfoData;
  services: ServiceItem[];
  gallery: GalleryItem[];
  formulas: PackageFormula[];
  testimonials: TestimonialItem[];
  eventsShowcase: EventShowcase[];
}

export type PaymentMethod = 'Wave' | 'Orange Money' | 'Free Money' | 'Carte Bancaire' | 'Gratuit';

export interface IssuedTicket {
  id: string; // e.g. TKT-2026-X8F4
  orderId: string;
  qrCodeHash: string; // unique scan payload
  eventId: string;
  eventTitle: string;
  eventPoster: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventAddress: string;
  eventCity: string;
  ticketTierId: string;
  ticketTierName: string;
  ticketCategory: TicketCategoryType;
  price: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  paymentMethod: PaymentMethod;
  deviceType?: string;
  status: 'valid' | 'used' | 'cancelled';
  validatedAt?: string;
  validatedBy?: string;
  createdAt: string;
}

export interface OrderItem {
  ticketTierId: string;
  tierName: string;
  category: TicketCategoryType;
  quantity: number;
  unitPrice: number;
}

export interface TicketOrder {
  id: string;
  eventId: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentRef: string;
  deviceType?: string;
  status: 'completed' | 'refunded';
  issuedTicketIds: string[];
  createdAt: string;
}

export interface ValidationScanResult {
  valid: boolean;
  status: 'success' | 'already_used' | 'invalid' | 'cancelled';
  message: string;
  ticket?: IssuedTicket;
  validatedAt?: string;
}

