/**
 * SplashScreen v2 — Daninha Mind Bloom brand identity
 * WHY: Uses the actual Daninha logo with botanical glow effect.
 * The dark environment + green glow creates a premium, organic feel
 * that matches the brand manifesto's connection to nature and science.
 */
import { useEffect, useState } from 'react';
import daninhaLogo from '@/assets/daninha-logo.png';
import heroBg from '@/assets/hero-botanical.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo' | 'greeting' | 'fade-out'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('greeting'), 2000);
    const t2 = setTimeout(() => setPhase('fade-out'), 5500);
    const t3 = setTimeout(onComplete, 6300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-700 ${phase === 'fade-out' ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background: botanical image with dark overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-botanical-radial" />
      </div>

      {/* Animated green particles/dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              background: `hsl(142 50% ${40 + Math.random() * 20}% / ${0.3 + Math.random() * 0.3})`,
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Daninha Logo with glow */}
        <div className={`transition-all duration-1000 ${phase === 'logo' ? 'animate-scale-in' : 'scale-95 -translate-y-6'}`}>
          <div className="logo-glow">
            {/* Logo "Daninha" Gerada por Código (Fundo Transparente, Texto Branco) */}
<div className="mx-auto flex items-center justify-center bg-transparent p-2">
  <span className="font-sans text-4xl font-bold tracking-tight text-white">
    Daninha
  </span>
</div>
          </div>
          <p className="text-center text-muted-foreground text-xs tracking-[0.3em] uppercase mt-4 font-sans">
            Mind Bloom
          </p>
        </div>

        {/* Manifesto greeting */}
        {(phase === 'greeting' || phase === 'fade-out') && (
          <div className="mt-10 max-w-sm text-center animate-fade-in-up">
            <p className="text-foreground/90 text-xl leading-relaxed font-display italic">
              "Nasço onde ninguém espera — e cresço com você."
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-8 bg-primary/30" />
              <p className="text-primary text-xs font-sans tracking-widest uppercase">
                Tudo que brota e desperta
              </p>
              <div className="h-px w-8 bg-primary/30" />
            </div>
          </div>
        )}

        {/* Loading dots */}
        <div className="absolute bottom-20 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
