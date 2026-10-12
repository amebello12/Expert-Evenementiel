import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, Volume2, Sparkles, Shield } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface NavbarProps {
  onOpenQuoteModal: (initialService?: string) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal, onOpenAdmin }) => {
  const { companyInfo } = useSiteContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Billetterie', href: '#billetterie', isBadge: true },
    { name: 'Services', href: '#services' },
    { name: 'Événements', href: '#evenements' },
    { name: 'Galerie', href: '#galerie' },
    { name: 'Pourquoi Nous ?', href: '#pourquoi-nous' },
    { name: 'Formules', href: '#formules' },
    { name: 'Avis', href: '#avis' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(companyInfo.whatsappDefaultMsg)}`;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#accueil"
          id="nav-logo-link"
          onClick={(e) => handleLinkClick(e, '#accueil')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:scale-105 transition-transform">
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-lg tracking-wider text-white flex items-center gap-1.5">
              EXPERT <span className="text-orange-500">ÉVÉNEMENTIEL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-medium">
              Sénégal • Son & Audiovisuel
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 flex items-center gap-1.5 ${
                link.isBadge
                  ? 'text-orange-400 font-bold hover:text-orange-300'
                  : 'text-neutral-300 hover:text-orange-400'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-200`}
            >
              <span>{link.name}</span>
              {link.isBadge && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-full animate-pulse">
                  Live
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${companyInfo.phone.replace(/\s+/g, '')}`}
            id="nav-phone-btn"
            className="hidden xl:flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 px-3 py-2 rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>{companyInfo.phone}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-direct-btn"
            className="hidden md:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {onOpenAdmin && (
            <button
              type="button"
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 hover:border-orange-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Espace Administrateur"
            >
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden xl:inline">Admin</span>
            </button>
          )}

          <button
            type="button"
            id="nav-devis-cta-btn"
            onClick={() => onOpenQuoteModal()}
            className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold tracking-wide uppercase text-black bg-gradient-to-r from-amber-400 via-orange-500 to-orange-500 hover:from-amber-300 hover:via-orange-400 hover:to-orange-500 rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            DEMANDER UN DEVIS
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            id="mobile-quote-quick-btn"
            onClick={() => onOpenQuoteModal()}
            className="sm:hidden text-xs font-bold uppercase bg-orange-500 text-black px-3 py-1.5 rounded-md"
          >
            Devis
          </button>
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-orange-500" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden bg-neutral-950/98 border-b border-neutral-800 px-5 pt-4 pb-6 mt-2 space-y-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-base font-semibold px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  link.isBadge
                    ? 'text-orange-400 bg-orange-500/10 border border-orange-500/30'
                    : 'text-neutral-200 hover:text-orange-400 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{link.name}</span>
                  {link.isBadge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-orange-500 text-black rounded">
                      Nouveau
                    </span>
                  )}
                </div>
                <span className="text-neutral-600 text-xs">→</span>
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-800/80 space-y-2.5">
            <button
              type="button"
              id="mobile-menu-devis-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold uppercase tracking-wider text-sm rounded-lg shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              DEMANDER UN DEVIS GRATUIT
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="mobile-menu-whatsapp-btn"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-lg shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Écrire sur WhatsApp (+221)
            </a>

            {onOpenAdmin && (
              <button
                type="button"
                id="mobile-menu-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold rounded-lg"
              >
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span>Administration du Site (Experteven)</span>
              </button>
            )}

            <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 px-1">
              <span>{companyInfo.phone}</span>
              <span>Dakar, Sénégal</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
