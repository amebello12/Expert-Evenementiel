import React from 'react';
import { X } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  videoUrl?: string;
  type?: 'photo' | 'video';
  title: string;
  description?: string;
  onOpenQuoteModal: () => void;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
  }
  return null;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  videoUrl,
  type = 'photo',
  title,
  description,
  onOpenQuoteModal
}) => {
  if (!isOpen) return null;

  const isVideo = type === 'video' || Boolean(videoUrl);
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;

  return (
    <div
      id="lightbox-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="lightbox-modal-container"
        className="relative max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/80 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 block">
              EXPERT ÉVÉNEMENTIEL SÉNÉGAL • {isVideo ? 'VIDÉO' : 'PHOTO'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md sm:max-w-xl">
              {title}
            </h3>
          </div>
          <button
            type="button"
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Media Area */}
        <div className="relative min-h-[300px] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
          {isVideo ? (
            embedUrl ? (
              <div className="w-full aspect-video">
                <iframe
                  src={embedUrl}
                  title={title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="max-h-[68vh] w-full object-contain mx-auto"
              />
            ) : (
              <img
                src={imageUrl}
                alt={title}
                className="max-h-[68vh] w-auto object-contain mx-auto"
              />
            )
          ) : (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[68vh] w-auto object-contain mx-auto"
            />
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="p-5 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-300 text-center sm:text-left leading-relaxed">
            {description || 'Prestation professionnelle réalisée par les équipes d’Expert Événementiel.'}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              id="lightbox-quote-btn"
              onClick={() => {
                onClose();
                onOpenQuoteModal();
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20"
            >
              Demander un devis similaire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
