import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_USER = 'Experteven';
const ADMIN_PASS = 'Cognediola@26';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim() === ADMIN_USER && password.trim() === ADMIN_PASS) {
        sessionStorage.setItem('admin_auth_session', 'true');
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Identifiant ou mot de passe incorrect. Veuillez vérifier vos accès administrateur.');
      }
    }, 400);
  };

  return (
    <div
      id="admin-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="admin-auth-container"
        className="relative max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-neutral-100"
      >
        {/* Close button */}
        <button
          type="button"
          id="close-admin-auth-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              Espace Restreint
            </span>
            <h2 className="text-xl font-black text-white mt-2">
              Administration du Site
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Connectez-vous pour gérer le contenu, la billetterie, les vidéos et images.
            </p>
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Identifiant Administrateur
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Experteven"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Mot de Passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Connexion en cours...' : 'Accéder au Panneau d’Administration'}
          </button>
        </form>
      </div>
    </div>
  );
};
