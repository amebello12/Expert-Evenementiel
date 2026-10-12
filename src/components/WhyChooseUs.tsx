import React from 'react';
import { 
  Speaker, 
  Disc3, 
  Flame, 
  Volume2, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Award,
  Zap
} from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/mockData';

interface WhyChooseUsProps {
  onOpenQuoteModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuoteModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Speaker':
        return <Speaker className="w-6 h-6 text-orange-400" />;
      case 'Disc3':
        return <Disc3 className="w-6 h-6 text-orange-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-400" />;
      case 'Volume2':
        return <Volume2 className="w-6 h-6 text-orange-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-orange-400" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-orange-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-orange-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-orange-400" />;
      default:
        return <Award className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <section id="pourquoi-nous" className="py-20 lg:py-28 bg-neutral-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            L’ENGAGEMENT QUALITÉ SÉNÉGAL
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            POURQUOI <span className="text-orange-500">NOUS CHOISIR ?</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            La réussite de votre événement ne s’improvise pas. Nous associons la rigueur technique du matériel de pointe à la chaleur d’une animation taillée sur mesure pour le public sénégalais et international.
          </p>
        </div>

        {/* 8 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              key={idx}
              id={`why-us-card-${idx}`}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/80 group-hover:border-orange-500/50 flex items-center justify-center mb-5 transition-colors">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-orange-400/80 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-orange-400" />
                <span>Garantie Expert</span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Guarantee Box */}
        <div className="mt-14 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-2xl p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                <Zap className="w-4 h-4" />
                Sérénité Totale pour votre Cérémonie
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Installation 3h avant • Matériel de Secours Inclus • Son Calibré
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Chaque prestation fait l'objet d'un repérage technique et d'un contrat clair. Nous disposons systématiquement d’une chaîne audio de secours et d’une régie micro doublée pour parer à tout imprévu.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                type="button"
                id="why-us-cta-devis-btn"
                onClick={onOpenQuoteModal}
                className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all text-center cursor-pointer"
              >
                Demander un devis personnalisé
              </button>
              <a
                href="#contact"
                id="why-us-cta-contact-btn"
                className="w-full py-3 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-all text-center"
              >
                Parler avec notre équipe
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
