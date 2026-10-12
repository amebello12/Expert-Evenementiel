import React, { useState } from 'react';
import { Camera, Play, Maximize2, Sparkles, Filter, Check, Video } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  onOpenLightbox: (imageUrl: string, title: string, desc?: string, videoUrl?: string, type?: 'photo' | 'video') => void;
  onOpenQuoteModal: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onOpenLightbox,
  onOpenQuoteModal
}) => {
  const { gallery } = useSiteContent();
  const [activeFilter, setActiveFilter] = useState<string>('Tous');
  const [showAll, setShowAll] = useState<boolean>(false);

  const itemsToUse = gallery && gallery.length > 0 ? gallery : GALLERY_ITEMS;
  const filters = ['Tous', 'DJ en prestation', 'Matériel de sonorisation', 'Mariages', 'Éclairages', 'Soirées'];

  const filteredItems = activeFilter === 'Tous'
    ? itemsToUse
    : itemsToUse.filter((item) => item.category.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(item.category.toLowerCase()));

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

  return (
    <section id="galerie" className="py-20 lg:py-28 bg-neutral-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            IMMERSION VISUELLE & VIDÉOS 4K
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
            NOTRE <span className="text-orange-500">GALERIE & VIDÉOS</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Découvrez nos interventions en direct : DJ en live mix, foule en délire, scénographies lumineuses et régies son haute fidélité à Dakar et partout au Sénégal.
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              id={`gallery-filter-${f.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeFilter === f
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 scale-105'
                  : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700 border border-neutral-700/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Visual Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="group relative h-80 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 hover:border-orange-500/50 shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => onOpenLightbox(item.imageUrl, item.title, item.description, item.videoUrl, item.type)}
            >
              {/* Image with smooth zoom */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Play video overlay button if video */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-orange-500/90 text-black flex items-center justify-center shadow-2xl shadow-orange-500/50 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-orange-400 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
                {item.type === 'video' ? (
                  <span className="bg-sky-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>Vidéo</span>
                  </span>
                ) : item.durationOrTag ? (
                  <span className="bg-orange-500/90 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    {item.durationOrTag}
                  </span>
                ) : null}
              </div>

              {/* Zoom Hover Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-950/80 border border-neutral-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                <Maximize2 className="w-4 h-4 text-orange-400" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-2 text-[11px] text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>{item.type === 'video' ? 'Lire la vidéo' : 'Agrandir'}</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section "Voir nos réalisations" Button / Toggle */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          {filteredItems.length > 6 && (
            <button
              type="button"
              id="gallery-toggle-all-btn"
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-colors cursor-pointer"
            >
              {showAll ? 'Afficher moins de réalisations' : 'Voir toutes nos réalisations (+)'}
            </button>
          )}

          <button
            type="button"
            id="gallery-quote-cta-btn"
            onClick={onOpenQuoteModal}
            className="px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            Obtenir la même prestation pour mon événement
          </button>
        </div>
      </div>
    </section>
  );
};
