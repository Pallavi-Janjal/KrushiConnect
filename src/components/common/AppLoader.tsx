import React, { useEffect, useState } from 'react';

interface AppLoaderProps {
  onReady: () => void;
}

type Phase = 'booting' | 'waking' | 'ready';

const HEALTH_URL = '/api/health';
const WAKE_TIMEOUT_MS = 90_000; // 90 s max Render cold-start

export function AppLoader({ onReady }: AppLoaderProps) {
  const [phase, setPhase] = useState<Phase>('booting');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let aborted = false;
    const startTs = Date.now();

    // ── 1. Tick elapsed time + animate progress bar ──────────────────────
    timer = setInterval(() => {
      if (aborted) return;
      const sec = Math.round((Date.now() - startTs) / 1000);
      setElapsedSec(sec);
      // Non-linear progress: fast early, slow near end
      setProgress(Math.min(95, Math.round(100 * (1 - Math.exp(-sec / 30)))));
    }, 1000);

    // ── 2. Poll /api/health until it responds ────────────────────────────
    const poll = async () => {
      let attempt = 0;
      while (!aborted && Date.now() - startTs < WAKE_TIMEOUT_MS) {
        try {
          const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(8000) });
          if (res.ok) {
            if (!aborted) {
              setProgress(100);
              setPhase('ready');
              setTimeout(() => { if (!aborted) onReady(); }, 600);
            }
            clearInterval(timer);
            return;
          }
        } catch {
          // server still sleeping — keep polling
        }
        attempt++;
        // First call after 500 ms, then every 3 s
        const delay = attempt === 1 ? 500 : 3000;
        if (attempt === 2) setPhase('waking');
        await new Promise(r => setTimeout(r, delay));
      }
      // Timeout — show app anyway (maybe offline / API not needed for this page)
      if (!aborted) {
        setProgress(100);
        setPhase('ready');
        setTimeout(() => { if (!aborted) onReady(); }, 400);
        clearInterval(timer);
      }
    };

    poll();

    return () => {
      aborted = true;
      clearInterval(timer);
    };
  }, [onReady]);

  const messages: Record<Phase, { title: string; sub: string }> = {
    booting: {
      title: 'KrushiConnect',
      sub: 'Initialising…',
    },
    waking: {
      title: 'Server is Waking Up',
      sub: `This takes ~30 seconds on first visit (${elapsedSec}s)…`,
    },
    ready: {
      title: 'KrushiConnect',
      sub: 'Ready! Taking you in…',
    },
  };

  const { title, sub } = messages[phase];

  return (
    <div
      className="fixed inset-0 z-[99998] flex flex-col items-center justify-center select-none"
      style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #86efac, transparent)' }}
      />

      {/* Logo icon */}
      <img
        src="/logo.png"
        alt="KrushiConnect"
        className="w-20 h-20 object-contain mb-3 bg-white/95 rounded-2xl p-2 shadow-lg"
        style={{ animation: 'kc-bounce 1.4s ease-in-out infinite' }}
      />

      {/* App name */}
      <h1 className="text-white text-3xl font-extrabold tracking-tight mb-1 transition-all duration-300">
        {title}
      </h1>
      <p className="text-green-300 text-sm font-medium mb-8 transition-all duration-300 text-center px-8">
        {sub}
      </p>

      {/* Progress bar */}
      <div className="w-56 h-1.5 bg-white/15 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4ade80, #86efac)',
          }}
        />
      </div>

      {/* Dot spinners */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full bg-green-400"
            style={{ animation: `kc-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      {/* Waking-up tip card */}
      {phase === 'waking' && (
        <div
          className="mx-6 max-w-xs rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 text-center"
          style={{ animation: 'kc-fadein 0.4s ease' }}
        >
          <p className="text-green-200 text-xs font-medium leading-relaxed">
            ☕ Our server starts fresh on first visit.<br />
            It'll be ready in just a moment — thanks for your patience!
          </p>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes kc-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes kc-dot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40%           { transform: scale(1.1); opacity: 1; }
        }
        @keyframes kc-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
