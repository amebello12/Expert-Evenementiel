import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, CheckCircle2, XCircle, AlertTriangle, RefreshCw, QrCode, ShieldCheck, User, Calendar, MapPin, Volume2, Search } from 'lucide-react';
import jsQR from 'jsqr';
import { ticketingApi } from '../../services/ticketingApi';
import { ValidationScanResult } from '../../types';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockedEventId?: string;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({
  isOpen,
  onClose,
  lockedEventId
}) => {
  const [manualCode, setManualCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ValidationScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ValidationScanResult[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synthesize audio feedback using Web Audio API
  const playSound = (type: 'success' | 'error') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio not permitted or supported
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.warn('Camera access error', err);
      setCameraError('Accès caméra indisponible ou refusé. Vous pouvez saisir le code manuellement ou utiliser les tests rapides ci-dessous.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Continuous Camera QR Code reading loop
  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data && !isProcessing) {
          handleValidateCode(code.data);
          return; // Pause tick until processed
        }
      }
    }
    if (isCameraActive) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  };

  const handleValidateCode = async (codeStr: string) => {
    if (!codeStr || isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await ticketingApi.validateTicket({
        code: codeStr.trim(),
        eventId: lockedEventId,
        agentName: 'Contrôleur Entrée Smartphone'
      });

      setLastScanResult(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 19)]);

      if (result.valid) {
        playSound('success');
      } else {
        playSound('error');
      }
    } catch (err) {
      console.error('Validation error', err);
      const errRes: ValidationScanResult = {
        valid: false,
        status: 'invalid',
        message: '🔴 Erreur de connexion au serveur central'
      };
      setLastScanResult(errRes);
      playSound('error');
    } finally {
      setIsProcessing(false);
      // Restart camera scanning loop after 2 seconds
      setTimeout(() => {
        if (isCameraActive) {
          requestAnimationFrame(tick);
        }
      }, 2000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleValidateCode(manualCode);
      setManualCode('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="scanner-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="scanner-modal-container"
        className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-2xl w-full text-white shadow-2xl overflow-hidden my-6 flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Contrôle d'Accès & Scanner de Billets
              </h3>
              <div className="text-[10px] text-neutral-400">
                Vérification temps réel anti-doublon • Base centrale Expert Événementiel
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-5">
          {/* Real Camera Feed or fallback */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[16/9] border-2 border-neutral-800 flex items-center justify-center shadow-inner">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Laser / Frame Overlay */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-orange-500 rounded-2xl relative shadow-lg">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
                  {/* Red Laser Sweep line */}
                  <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce mt-24 opacity-80" />
                </div>
                <span className="absolute bottom-4 text-[11px] font-bold text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm">
                  Pointez vers le QR Code du billet
                </span>
              </div>
            )}

            {!isCameraActive && (
              <div className="p-6 text-center space-y-3">
                <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  {cameraError || 'La caméra est en veille. Activez-la ou utilisez la saisie directe ci-dessous.'}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white"
                >
                  Activer la Caméra Smartphone
                </button>
              </div>
            )}
          </div>

          {/* INSTANT RESULT BADGE */}
          {lastScanResult && (
            <div
              className={`p-5 rounded-2xl border-2 transition-all animate-in zoom-in-95 duration-200 ${
                lastScanResult.valid
                  ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : lastScanResult.status === 'already_used'
                  ? 'bg-red-950/70 border-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'bg-red-950/70 border-red-500 text-white shadow-lg shadow-red-500/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    lastScanResult.valid ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                  }`}
                >
                  {lastScanResult.valid ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="font-black text-lg sm:text-xl tracking-tight">
                    {lastScanResult.message}
                  </div>

                  {lastScanResult.ticket && (
                    <div className="pt-2 text-xs space-y-1 border-t border-white/10 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          {lastScanResult.ticket.attendeeName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/40 font-mono font-bold text-amber-300">
                          {lastScanResult.ticket.ticketTierName}
                        </span>
                      </div>
                      <div className="text-neutral-300 text-[11px]">
                        N° Billet : <strong className="text-white">{lastScanResult.ticket.id}</strong> • {lastScanResult.ticket.eventTitle}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Date : {lastScanResult.ticket.eventDate} à {lastScanResult.ticket.eventTime} • {lastScanResult.ticket.eventVenue}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Saisie manuelle du code ou douchette code-barres
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Collez ou saisissez le code (ex: TKT-SN-2026-88A1 ou hash QR)"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isProcessing || !manualCode.trim()}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs uppercase tracking-wider disabled:opacity-40"
              >
                Vérifier
              </button>
            </div>
          </form>

          {/* Quick Simulation & Test Buttons (Perfect for testing all 3 conditions without camera) */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Boutons de simulation rapide (Tester les 3 cas d'accès) :
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleValidateCode('VERIFY-EXP-2026-88A1-VALID')}
                className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/50 text-xs font-bold text-left transition-colors"
              >
                🟢 Tester Billet Valide
                <span className="block text-[10px] text-emerald-400 font-normal">Accès autorisé (Amadou Fall)</span>
              </button>

              <button
                type="button"
                onClick={() => handleValidateCode('VERIFY-EXP-2026-77B2-USED')}
                className="p-2 rounded-lg bg-red-950/60 border border-red-600/40 text-red-300 hover:bg-red-900/50 text-xs font-bold text-left transition-colors"
              >
                🔴 Tester Billet Déjà Utilisé
                <span className="block text-[10px] text-red-400 font-normal">Double passage refusé (Awa Diop)</span>
              </button>

              <button
                type="button"
                onClick={() => handleValidateCode('FAUX-BILLET-FRAUDE-999')}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-bold text-left transition-colors"
              >
                🔴 Tester Faux Billet
                <span className="block text-[10px] text-neutral-400 font-normal">Code inexistant / Refusé</span>
              </button>
            </div>
          </div>

          {/* Scan History in this session */}
          {scanHistory.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Historique des scans récents ({scanHistory.length})
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-neutral-850 border border-neutral-800 rounded-xl bg-neutral-950">
                {scanHistory.map((h, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {h.valid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className="font-semibold text-neutral-200">
                        {h.ticket?.attendeeName || 'Code inconnu'}
                      </span>
                      {h.ticket?.ticketTierName && (
                        <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                          {h.ticket.ticketTierName}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {h.status === 'success' ? 'Autorisé' : h.status === 'already_used' ? 'Déjà scanné' : 'Refusé'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
