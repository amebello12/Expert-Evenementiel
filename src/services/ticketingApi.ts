import { TicketEvent, IssuedTicket, TicketOrder, ValidationScanResult, SiteContent } from '../types';

export const ticketingApi = {
  // Fetch events
  async getEvents(params?: {
    city?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }): Promise<TicketEvent[]> {
    try {
      const query = new URLSearchParams();
      if (params?.city && params.city !== 'Toutes') query.set('city', params.city);
      if (params?.category && params.category !== 'Toutes') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
      if (params?.status) query.set('status', params.status);

      const res = await fetch(`/api/events?${query.toString()}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des événements');
      return await res.json();
    } catch (err) {
      console.error('getEvents error', err);
      return [];
    }
  },

  // Fetch single event
  async getEventById(id: string): Promise<TicketEvent | null> {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('getEventById error', err);
      return null;
    }
  },

  // Create event
  async createEvent(eventData: Partial<TicketEvent>): Promise<TicketEvent> {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la création de l’événement');
    }
    return await res.json();
  },

  // Update event
  async updateEvent(id: string, updates: Partial<TicketEvent>): Promise<TicketEvent> {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour');
    return await res.json();
  },

  // Delete event
  async deleteEvent(id: string): Promise<boolean> {
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    return true;
  },

  // Toggle Sales or Status
  async updateEventStatus(id: string, updates: { salesActive?: boolean; status?: string }): Promise<TicketEvent> {
    const res = await fetch(`/api/events/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Erreur lors du changement de statut');
    return await res.json();
  },

  // Checkout order
  async checkout(orderData: {
    eventId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    items: { ticketTierId: string; quantity: number }[];
    paymentMethod: string;
    deviceType?: string;
  }): Promise<{ order: TicketOrder; tickets: IssuedTicket[] }> {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors du paiement');
    }
    return await res.json();
  },

  // Gate Scanner: validate ticket
  async validateTicket(payload: {
    code: string;
    eventId?: string;
    agentName?: string;
  }): Promise<ValidationScanResult> {
    const res = await fetch('/api/tickets/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      return {
        valid: false,
        status: 'invalid',
        message: err.message || 'Erreur réseau de validation'
      };
    }
    return await res.json();
  },

  // Organizer Dashboard
  async getOrganizerDashboard(email: string): Promise<{
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
  }> {
    const res = await fetch(`/api/organizer/${encodeURIComponent(email || 'demo')}/dashboard`);
    if (!res.ok) throw new Error('Impossible de charger le tableau de bord');
    return await res.json();
  },

  // Admin Overview
  async getAdminOverview(): Promise<{
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
      clientEventsCount?: number;
      creationFeesCollected?: number;
    };
  }> {
    const res = await fetch('/api/admin/overview');
    if (!res.ok) throw new Error('Impossible de charger la vue administrateur');
    return await res.json();
  },

  // Admin Review
  async adminReviewEvent(id: string, updates: { status?: string; salesActive?: boolean }): Promise<TicketEvent> {
    const res = await fetch(`/api/admin/events/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Erreur lors de la validation');
    return await res.json();
  },

  // Admin Refund
  async adminRefundOrder(orderId: string): Promise<{ message: string; order: TicketOrder }> {
    const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors du remboursement');
    }
    return await res.json();
  },

  // Site Content CMS API
  async getSiteContent(): Promise<SiteContent | null> {
    try {
      const res = await fetch('/api/site-content');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateSiteContent(content: SiteContent): Promise<boolean> {
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async resetSiteContent(): Promise<SiteContent | null> {
    try {
      const res = await fetch('/api/site-content/reset', { method: 'POST' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.content;
    } catch {
      return null;
    }
  }
};
