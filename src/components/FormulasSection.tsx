import React from 'react';
import { Check, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PackageFormula } from '../types';

interface FormulasSectionProps {
  onSelectFormulaForQuote: (formulaName: string) => void;
}

export const FormulasSection: React.FC<FormulasSectionProps> = ({
  onSelectFormulaForQuote
}) => {
  const { formulas } = useSiteContent();

  return (
    <section id="formules" className="py-20 lg:py-28 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PACKS CLÉ-EN-MAIN
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            NOS <span className="text-orange-500">FORMULES</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Des packages conçus pour s’adapter aux dimensions de votre fête, du cocktail intime à la grande célébration de gala. Tarification transparente et sur mesure après étude technique.
          </p>
        </div>

        {/* 4 Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {(formulas || []).map((formula) => {
            const isHighlighted = formula.isPopular;
            return (
              <div
                key={formula.id}
                id={`formula-card-${formula.id}`}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-orange-500 shadow-2xl shadow-orange-500/20 lg:-translate-y-2'
                    : 'bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Popular / Highlight Pill */}
                {formula.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {formula.badge}
                  </div>
                )}

                <div className="p-6 sm:p-7">
                  {/* Formula Name */}
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white uppercase tracking-wide mb-2">
                    {formula.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs text-neutral-400 min-h-[36px] mb-6 leading-relaxed">
                    {formula.tagline}
                  </p>

                  {/* Price Banner */}
                  <div className="mb-6 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
                    <span className="text-xs uppercase font-bold text-neutral-400 block mb-0.5">
                      Tarification
                    </span>
                    <span className="text-2xl font-extrabold text-orange-400 tracking-tight">
                      {formula.priceNote}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      Étude & devis gratuit sans engagement
                    </span>
                  </div>

                  {/* Included Services Tags */}
                  <div className="mb-6">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-300 mb-2">
                      Inclusions majeures :
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {formula.servicesIncluded.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ideal For note */}
                  <div className="mb-6 text-xs text-neutral-300 bg-neutral-800/40 p-2.5 rounded-lg border border-neutral-800">
                    <strong className="text-white block mb-0.5 font-semibold">Idéal pour :</strong>
                    <span className="text-neutral-400">{formula.idealFor}</span>
                  </div>

                  {/* Detailed Features Checkmarks */}
                  <div className="space-y-2.5 pt-2 border-t border-neutral-800/70">
                    {formula.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    id={`formula-select-btn-${formula.id}`}
                    onClick={() => onSelectFormulaForQuote(formula.name)}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                      isHighlighted
                        ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/30 hover:scale-[1.02]'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white hover:text-orange-400 border border-neutral-700'
                    }`}
                  >
                    <span>Demander cette formule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Custom Requirements */}
        <div className="mt-12 text-center text-xs text-neutral-400 max-w-2xl mx-auto">
          * Les tarifs « Sur devis » permettent de calibrer la puissance en watts, le nombre d'enceintes et la complexité des éclairages en fonction du volume exact de votre salle et du nombre d’invités.
        </div>
      </div>
    </section>
  );
};
