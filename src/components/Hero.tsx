import React from 'react';
import { Sparkles, MessageSquare, PhoneCall, ChevronDown, CheckCircle2, Volume2, Disc, Play } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onOpenQuoteModal: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onContactClick }) => {
  const { companyInfo } = useSiteContent();
  const whatsappUrl = `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(companyInfo.whatsappDefaultMsg)}`;
  const heroBg = companyInfo.heroBackgroundUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop";

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 lg:py-32 overflow-hidden bg-neutral-950"
    >
      {/* Immersive Background Image with Multi-layer Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="DJ professionnel en prestation avec jeux de lumières spectaculaires"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[8000ms]"
          loading="eager"
        />
        {/* Dark luxury vignette & color tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        <div className="absolute inset-0 bg-radial-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Tag & Location Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-orange-500/40 backdrop-blur-md shadow-lg shadow-orange-500/10 mb-6">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-neutral-200 uppercase">
            Leader Événementiel & Audiovisuel au Sénégal
          </span>
          <span className="hidden sm:inline-block text-orange-400 font-bold">•</span>
          <span className="hidden sm:inline-block text-xs text-orange-400 font-medium">
            Dakar, Saly, Thiès & Régions
          </span>
        </div>

        {/* Brand Name Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 uppercase drop-shadow-2xl">
          EXPERT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-orange-400">ÉVÉNEMENTIEL</span>
        </h1>

        {/* Main Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-neutral-100 max-w-3xl mb-4 leading-snug drop-shadow-md">
          {companyInfo.heroTagline}
        </p>

        {/* Brand Recommended Slogan */}
        <p className="text-sm sm:text-base font-medium italic text-orange-400/90 max-w-2xl mb-6 tracking-wide">
          {companyInfo.slogan}
        </p>

        {/* Dynamic Soundwave Equalizer Graphic */}
        <div className="flex items-end gap-1.5 h-8 mb-6 opacity-85" aria-hidden="true">
          <div className="w-1.5 bg-orange-500 rounded-full animate-soundwave-1"></div>
          <div className="w-1.5 bg-amber-400 rounded-full animate-soundwave-2"></div>
          <div className="w-1.5 bg-orange-500 rounded-full animate-soundwave-3"></div>
          <div className="w-1.5 bg-orange-400 rounded-full animate-soundwave-4"></div>
          <div className="w-1.5 bg-amber-500 rounded-full animate-soundwave-5"></div>
          <div className="w-1.5 bg-orange-500 rounded-full animate-soundwave-2"></div>
          <div className="w-1.5 bg-amber-400 rounded-full animate-soundwave-1"></div>
        </div>

        {/* Keyword Services Strip */}
        <div className="mb-9 px-4 py-2.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-md max-w-3xl">
          <p className="text-xs sm:text-sm md:text-base font-medium text-neutral-300 tracking-wide">
            <span className="text-white font-semibold">Sonorisation</span> <span className="text-orange-500 mx-1.5">•</span>
            <span className="text-white font-semibold">DJ</span> <span className="text-orange-500 mx-1.5">•</span>
            <span className="text-white font-semibold">Animation</span> <span className="text-orange-500 mx-1.5">•</span>
            <span className="text-white font-semibold">MC</span> <span className="text-orange-500 mx-1.5">•</span>
            <span className="text-white font-semibold">Photographie</span> <span className="text-orange-500 mx-1.5">•</span>
            <span className="text-white font-semibold">Vidéo</span> <span className="text-orange-500 mx-1.5">•</span>
            <span className="text-white font-semibold">Audiovisuel</span>
          </p>
        </div>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xl mb-12">
          {/* Demander un devis */}
          <button
            type="button"
            id="hero-cta-devis-btn"
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:via-orange-500 hover:to-orange-500 text-black font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-black" />
            <span>DEMANDER UN DEVIS</span>
          </button>

          {/* Nous contacter */}
          <button
            type="button"
            id="hero-cta-contact-btn"
            onClick={onContactClick}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white font-bold text-sm sm:text-base uppercase tracking-wider border border-neutral-700 hover:border-neutral-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-orange-400" />
            <span>NOUS CONTACTER</span>
          </button>

          {/* WhatsApp Visible Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-cta-whatsapp-btn"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>WHATSAPP DIRECT</span>
          </a>
        </div>

        {/* Stats and Guarantees Counter Ribbon */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          {(companyInfo.stats || []).map((stat, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/80 border border-neutral-800/90 rounded-xl p-3.5 sm:p-4 backdrop-blur-sm hover:border-orange-500/40 transition-colors text-center"
            >
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-orange-400 mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white">
                {stat.label}
              </div>
              <div className="text-[11px] text-neutral-400 hidden sm:block mt-0.5">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <a
          href="#services"
          id="hero-scroll-indicator"
          className="mt-12 text-neutral-400 hover:text-orange-400 transition-colors flex flex-col items-center gap-1.5"
          aria-label="Découvrir nos services"
        >
          <span className="text-[11px] uppercase tracking-widest font-semibold">Découvrir nos services</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-orange-400" />
        </a>
      </div>
    </section>
  );
};
