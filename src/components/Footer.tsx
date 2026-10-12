import React from 'react';
import { Volume2, MapPin, Phone, Mail, MessageSquare, Instagram, Facebook, Youtube, Sparkles, Heart, Shield } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  onOpenQuoteModal: (serviceTitle?: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal, onOpenAdmin }) => {
  const { companyInfo, services } = useSiteContent();
  const whatsappUrl = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(companyInfo.whatsappDefaultMsg)}`;

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-850">
          {/* Brand & Slogan column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                <Volume2 className="w-5 h-5 text-black" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                EXPERT <span className="text-orange-500">ÉVÉNEMENTIEL</span>
              </span>
            </div>

            <p className="text-white text-sm font-semibold italic">
              {companyInfo.slogan}
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Entreprise sénégalaise de référence spécialisée dans la sonorisation professionnelle, l’animation DJ, la maîtrise de cérémonie (MC), la couverture photo/vidéo 4K et les scénographies son & lumière à Dakar et sur l'ensemble du territoire sénégalais.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>
              <button
                type="button"
                onClick={() => onOpenQuoteModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-orange-500 text-neutral-300 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Devis Express</span>
              </button>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              Nos Prestations
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {(services || []).map((srv) => (
                <li key={srv.id}>
                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal(srv.title)}
                    className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span className="text-orange-500/80">›</span>
                    <span>{srv.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact & Geographic Coverage */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              Contact & Rayonnement
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{companyInfo.headquarters || 'Dakar, Saly, Thiès, Saint-Louis & partout au Sénégal'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${companyInfo.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {companyInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="hover:text-white">
                  {companyInfo.email}
                </a>
              </div>
            </div>

            <div className="pt-3">
              <div className="text-[11px] font-bold text-neutral-400 uppercase mb-2">
                Suivez nos événements en live :
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-orange-500 text-neutral-300 hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-orange-500 text-neutral-300 hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 hover:bg-orange-500 text-neutral-300 hover:text-black transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} <span className="text-neutral-300 font-bold">EXPERT ÉVÉNEMENTIEL</span>. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span>Créé avec passion pour la culture événementielle sénégalaise</span>
            {onOpenAdmin && (
              <button
                type="button"
                id="footer-admin-btn"
                onClick={onOpenAdmin}
                className="hover:text-orange-400 text-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-orange-500/70" />
                <span>Administration</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
