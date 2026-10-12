import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TicketingSection } from './components/ticketing/TicketingSection';
import { ServicesSection } from './components/ServicesSection';
import { EventsSection } from './components/EventsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GallerySection } from './components/GallerySection';
import { FormulasSection } from './components/FormulasSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { QuoteModal } from './components/QuoteModal';
import { LightboxModal } from './components/LightboxModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalInitialService, setModalInitialService] = useState<string | undefined>(undefined);
  const [contactInitialService, setContactInitialService] = useState<string | undefined>(undefined);
  const [contactInitialFormula, setContactInitialFormula] = useState<string | undefined>(undefined);
  const [contactInitialEventType, setContactInitialEventType] = useState<string | undefined>(undefined);

  // Admin section states
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    videoUrl?: string;
    type?: 'photo' | 'video';
    title: string;
    description?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    description: ''
  });

  const handleOpenAdmin = () => {
    const isAuthed = sessionStorage.getItem('admin_auth_session') === 'true';
    if (isAuthed) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_auth_session');
    setIsAdminDashboardOpen(false);
  };

  const handleOpenQuoteModal = (initialService?: string) => {
    setModalInitialService(initialService);
    setIsQuoteModalOpen(true);
  };

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setContactInitialService(serviceTitle);
    handleScrollToContact();
  };

  const handleSelectFormulaForQuote = (formulaName: string) => {
    setContactInitialFormula(formulaName);
    handleScrollToContact();
  };

  const handleSelectEventForQuote = (eventType: string) => {
    setContactInitialEventType(eventType);
    handleScrollToContact();
  };

  const handleOpenLightbox = (
    imageUrl: string,
    title: string,
    description?: string,
    videoUrl?: string,
    type?: 'photo' | 'video'
  ) => {
    setLightboxData({
      isOpen: true,
      imageUrl,
      videoUrl,
      type: type || (videoUrl ? 'video' : 'photo'),
      title,
      description
    });
  };

  const handleCloseLightbox = () => {
    setLightboxData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-orange-500 selection:text-black flex flex-col font-sans">
      {/* Top Sticky Navbar */}
      <Navbar
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenQuoteModal={() => handleOpenQuoteModal()}
          onContactClick={handleScrollToContact}
        />

        {/* 2. Billetterie Officielle Sénégal */}
        <TicketingSection />

        {/* 3. Nos Services */}
        <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />

        {/* 3. Nos Événements */}
        <EventsSection
          onSelectEventForQuote={handleSelectEventForQuote}
          onOpenImageLightbox={(img, tit, desc) => handleOpenLightbox(img, tit, desc)}
        />

        {/* 4. Section "Pourquoi Nous Choisir ?" */}
        <WhyChooseUs onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* 5. Galerie & Réalisations */}
        <GallerySection
          onOpenLightbox={handleOpenLightbox}
          onOpenQuoteModal={() => handleOpenQuoteModal()}
        />

        {/* 6. Nos Formules */}
        <FormulasSection onSelectFormulaForQuote={handleSelectFormulaForQuote} />

        {/* 7. Avis Clients */}
        <TestimonialsSection />

        {/* 8. Contact & Formulaire de Devis */}
        <ContactSection
          initialService={contactInitialService}
          initialFormula={contactInitialFormula}
          initialEventType={contactInitialEventType}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Interactive Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialService={modalInitialService}
      />

      {/* Photo / Video Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxData.isOpen}
        onClose={handleCloseLightbox}
        imageUrl={lightboxData.imageUrl}
        videoUrl={lightboxData.videoUrl}
        type={lightboxData.type}
        title={lightboxData.title}
        description={lightboxData.description}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Admin Full Dashboard Console */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
