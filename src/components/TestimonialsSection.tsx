import React from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useSiteContent();

  return (
    <section id="avis" className="py-20 lg:py-28 bg-neutral-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5 fill-current" />
            TÉMOIGNAGES & RETOURS D’EXPÉRIENCE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            AVIS <span className="text-orange-500">CLIENTS</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            La confiance de nos clients est notre plus belle fierté. Découvrez comment nous avons transformé leurs célébrations en moments inoubliables.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {(testimonials || []).map((item) => (
            <div
              key={item.id}
              id={`testimonial-card-${item.id}`}
              className="bg-neutral-900/90 border border-neutral-800/90 hover:border-orange-500/40 rounded-2xl p-7 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 relative group"
            >
              {/* Quote mark decoration */}
              <Quote className="w-10 h-10 text-orange-500/15 absolute top-6 right-6 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-neutral-300 ml-2">
                    5.0 / 5.0
                  </span>
                </div>

                {/* Testimonial Text */}
                <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-6 italic">
                  « {item.comment} »
                </p>
              </div>

              {/* Author Information */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-white">
                        {item.name}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-orange-400" title="Avis vérifié" />
                    </div>
                    <div className="text-xs text-orange-400 font-medium">
                      {item.event}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {item.city} • {item.date}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Recommandé</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Summary Bar */}
        <div className="mt-12 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-white">4.9</span>
            <div className="flex flex-col text-left">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-neutral-400">+120 avis vérifiés</span>
            </div>
          </div>
          <div className="h-8 w-px bg-neutral-800 hidden sm:block" />
          <div className="text-xs text-neutral-300 font-medium">
            <strong className="text-orange-400 font-bold">100%</strong> de recommandations pour les mariages et cérémonies à Dakar
          </div>
        </div>
      </div>
    </section>
  );
};
