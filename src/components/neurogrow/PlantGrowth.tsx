/**
 * PlantGrowth v2 — Enhanced SVG with botanical glow and better visuals
 */

interface PlantGrowthProps {
  growthPercent: number;
  className?: string;
}

const PlantGrowth = ({ growthPercent, className = '' }: PlantGrowthProps) => {
  const growth = Math.max(0, Math.min(100, growthPercent));
  const stemHeight = 20 + (growth * 0.8);
  const leafCount = Math.floor(growth / 20);
  const flowerVisible = growth >= 90;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 200 220" className="w-full max-w-[160px]"
        style={{ filter: `drop-shadow(0 0 ${10 + growth * 0.3}px hsl(142 50% 42% / ${0.1 + growth * 0.003}))` }}>
        {/* Soil with glow */}
        <defs>
          <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(142, 50%, 30%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="210" rx="80" ry="8" fill="url(#soilGlow)" />
        <ellipse cx="100" cy="210" rx="50" ry="8" fill="hsl(32, 30%, 18%)" opacity="0.8" />

        {/* Stem */}
        <path d={`M100 210 Q100 ${210 - stemHeight} 100 ${210 - stemHeight}`}
          stroke="hsl(142, 50%, 38%)" strokeWidth="3.5" fill="none" strokeLinecap="round"
          style={{ transition: 'all 1s ease' }} />

        {/* Leaves with gradients */}
        {leafCount >= 1 && <path d="M100 195 Q82 185 75 172 Q88 180 100 188" fill="hsl(142, 48%, 40%)" opacity="0.9" />}
        {leafCount >= 2 && <path d="M100 180 Q118 170 128 158 Q115 168 100 175" fill="hsl(148, 45%, 38%)" opacity="0.9" />}
        {leafCount >= 3 && <path d="M100 162 Q78 155 68 142 Q83 150 100 158" fill="hsl(140, 52%, 42%)" opacity="0.9" />}
        {leafCount >= 4 && <path d="M100 145 Q122 138 135 125 Q118 135 100 142" fill="hsl(155, 48%, 36%)" opacity="0.9" />}
        {leafCount >= 5 && <path d="M100 130 Q75 120 65 105 Q80 115 100 125" fill="hsl(138, 55%, 44%)" opacity="0.9" />}

        {/* Flower bloom */}
        {flowerVisible && (
          <g>
            <circle cx="100" cy={210 - stemHeight - 8} r="10" fill="hsl(42, 80%, 55%)" opacity="0.9" />
            <circle cx="100" cy={210 - stemHeight - 8} r="5" fill="hsl(42, 90%, 65%)" />
            {/* Sparkles */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 100 + Math.cos(rad) * 16;
              const y = (210 - stemHeight - 8) + Math.sin(rad) * 16;
              return <circle key={i} cx={x} cy={y} r="1.5" fill="hsl(42, 80%, 65%)" className="animate-pulse-glow"
                style={{ animationDelay: `${i * 0.3}s` }} />;
            })}
          </g>
        )}
      </svg>

      <div className="text-center mt-2">
        <p className="text-2xl font-bold text-gradient-botanical">{growth}%</p>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          {growth < 20 && 'Brotando... 🌱'}
          {growth >= 20 && growth < 50 && 'Crescendo forte! 🪴'}
          {growth >= 50 && growth < 80 && 'Quase lá! 🌿'}
          {growth >= 80 && growth < 100 && 'Radiante! ✨'}
          {growth >= 100 && 'Floresceu! 🌸'}
        </p>
      </div>
    </div>
  );
};

export default PlantGrowth;
