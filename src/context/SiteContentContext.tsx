import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, CompanyInfoData, ServiceItem, GalleryItem, PackageFormula, TestimonialItem, EventShowcase } from '../types';
import { COMPANY_INFO, SERVICES_LIST, GALLERY_ITEMS, FORMULAS_LIST, TESTIMONIALS_LIST, EVENTS_SHOWCASE } from '../data/mockData';
import { ticketingApi } from '../services/ticketingApi';

const DEFAULT_CONTENT: SiteContent = {
  companyInfo: COMPANY_INFO,
  services: SERVICES_LIST,
  gallery: GALLERY_ITEMS,
  formulas: FORMULAS_LIST,
  testimonials: TESTIMONIALS_LIST,
  eventsShowcase: EVENTS_SHOWCASE
};

const STORAGE_KEY = 'experteven_site_content_v1';

interface SiteContentContextType {
  content: SiteContent;
  companyInfo: CompanyInfoData;
  services: ServiceItem[];
  gallery: GalleryItem[];
  formulas: PackageFormula[];
  testimonials: TestimonialItem[];
  eventsShowcase: EventShowcase[];
  isLoading: boolean;
  updateCompanyInfo: (data: Partial<CompanyInfoData>) => Promise<void>;
  updateServices: (services: ServiceItem[]) => Promise<void>;
  addService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateGallery: (gallery: GalleryItem[]) => Promise<void>;
  addGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  updateFormulas: (formulas: PackageFormula[]) => Promise<void>;
  addFormula: (formula: PackageFormula) => Promise<void>;
  deleteFormula: (id: string) => Promise<void>;
  updateTestimonials: (testimonials: TestimonialItem[]) => Promise<void>;
  addTestimonial: (item: TestimonialItem) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  saveAll: (newContent: SiteContent) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | null>(null);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONTENT;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync with backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const backendData = await ticketingApi.getSiteContent();
        if (mounted && backendData && backendData.companyInfo) {
          setContent(backendData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(backendData));
        }
      } catch (err) {
        console.warn('Could not sync with backend site-content', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = async (newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
    try {
      await ticketingApi.updateSiteContent(newContent);
    } catch (e) {
      console.warn('Backend write error', e);
    }
  };

  const updateCompanyInfo = async (data: Partial<CompanyInfoData>) => {
    const updated: SiteContent = {
      ...content,
      companyInfo: { ...content.companyInfo, ...data }
    };
    await persist(updated);
  };

  const updateServices = async (services: ServiceItem[]) => {
    const updated: SiteContent = { ...content, services };
    await persist(updated);
  };

  const addService = async (service: ServiceItem) => {
    const updated: SiteContent = {
      ...content,
      services: [...content.services, service]
    };
    await persist(updated);
  };

  const deleteService = async (id: string) => {
    const updated: SiteContent = {
      ...content,
      services: content.services.filter((s) => s.id !== id)
    };
    await persist(updated);
  };

  const updateGallery = async (gallery: GalleryItem[]) => {
    const updated: SiteContent = { ...content, gallery };
    await persist(updated);
  };

  const addGalleryItem = async (item: GalleryItem) => {
    const updated: SiteContent = {
      ...content,
      gallery: [item, ...content.gallery]
    };
    await persist(updated);
  };

  const deleteGalleryItem = async (id: string) => {
    const updated: SiteContent = {
      ...content,
      gallery: content.gallery.filter((g) => g.id !== id)
    };
    await persist(updated);
  };

  const updateFormulas = async (formulas: PackageFormula[]) => {
    const updated: SiteContent = { ...content, formulas };
    await persist(updated);
  };

  const addFormula = async (formula: PackageFormula) => {
    const updated: SiteContent = {
      ...content,
      formulas: [...content.formulas, formula]
    };
    await persist(updated);
  };

  const deleteFormula = async (id: string) => {
    const updated: SiteContent = {
      ...content,
      formulas: content.formulas.filter((f) => f.id !== id)
    };
    await persist(updated);
  };

  const updateTestimonials = async (testimonials: TestimonialItem[]) => {
    const updated: SiteContent = { ...content, testimonials };
    await persist(updated);
  };

  const addTestimonial = async (item: TestimonialItem) => {
    const updated: SiteContent = {
      ...content,
      testimonials: [item, ...content.testimonials]
    };
    await persist(updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated: SiteContent = {
      ...content,
      testimonials: content.testimonials.filter((t) => t.id !== id)
    };
    await persist(updated);
  };

  const resetToDefaults = async () => {
    setIsLoading(true);
    try {
      const def = await ticketingApi.resetSiteContent();
      const nextContent = def || DEFAULT_CONTENT;
      setContent(nextContent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
    } catch {
      setContent(DEFAULT_CONTENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
    } finally {
      setIsLoading(false);
    }
  };

  const saveAll = async (newContent: SiteContent) => {
    await persist(newContent);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        companyInfo: content.companyInfo || DEFAULT_CONTENT.companyInfo,
        services: content.services || DEFAULT_CONTENT.services,
        gallery: content.gallery || DEFAULT_CONTENT.gallery,
        formulas: content.formulas || DEFAULT_CONTENT.formulas,
        testimonials: content.testimonials || DEFAULT_CONTENT.testimonials,
        eventsShowcase: content.eventsShowcase || DEFAULT_CONTENT.eventsShowcase,
        isLoading,
        updateCompanyInfo,
        updateServices,
        addService,
        deleteService,
        updateGallery,
        addGalleryItem,
        deleteGalleryItem,
        updateFormulas,
        addFormula,
        deleteFormula,
        updateTestimonials,
        addTestimonial,
        deleteTestimonial,
        resetToDefaults,
        saveAll
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
