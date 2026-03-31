/**
 * Dashboard v2 — Premium Bento Grid with color-coded glassmorphism cards
 * WHY color-coded cards: Each health domain has its own visual identity,
 * making the dashboard scannable at a glance (Gestalt: similarity principle).
 * Sleep=blue, Focus=amber, Mood=purple, Energy=orange, Nutrition=green.
 * 
 * WHY glassmorphism: Creates depth layers that feel premium and organic,
 * matching the Daninha brand's blend of nature and modern science.
 */
import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Brain, Zap, Heart, Leaf, TrendingUp, Calendar, BookOpen, Activity } from 'lucide-react';
import type { UserData, DailyCheckIn, ProtocolRecommendation } from '@/lib/ml';
import { predictProtocol, calculatePlantGrowth } from '@/lib/ml';
import { saveDailyCheckIn, loadCheckIns } from '@/lib/onboarding-state';
import PlantGrowth from './PlantGrowth';
import daninhaLogo from '@/assets/daninha-logo.png';
import sleepImg from '@/assets/sleep-collage.png';
import yogaImg from '@/assets/yoga-soldier.png';

interface DashboardProps {
  userData: Partial<UserData>;
}

const Dashboard = ({ userData }: DashboardProps) => {
  const [recommendations, setRecommendations] = useState<ProtocolRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [dailyData, setDailyData] = useState({
    mood: 3, sleepHours: 7, sleepDelay: 15, wakeUps: 1,
    mealsCount: 3, energyLevel: 3, symptoms: [] as string[],
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  useEffect(() => { setCheckIns(loadCheckIns()); }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const results = await predictProtocol(userData as UserData);
        setRecommendations(results);
      } finally { setLoading(false); }
    };
    run();
  }, [userData]);

  const alreadyCheckedIn = checkIns.some(c => c.date === todayStr);
  const plantGrowth = calculatePlantGrowth(checkIns, daysInMonth);

  const submitCheckIn = useCallback(() => {
    const checkIn: DailyCheckIn = { date: todayStr, ...dailyData };
    saveDailyCheckIn(checkIn);
    setCheckIns(prev => [...prev, checkIn]);
    setShowCheckIn(false);
  }, [dailyData, todayStr]);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  const symptomOptions = ['Dor de cabeça', 'Gripe', 'Ansiedade', 'Insônia', 'Fadiga', 'Dor muscular'];
  const lastCheckIn = checkIns.length > 0 ? checkIns[checkIns.length - 1] : null;

  return (
    <div className="min-h-screen bg-botanical-radial pb-28">
      {/* Header with logo */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-sans tracking-wider uppercase">{greeting}</p>
          <h1 className="text-2xl font-display text-foreground mt-0.5">
            {userData.name} <span className="text-primary">✦</span>
          </h1>
        </div>
        <img src={daninhaLogo} alt="Daninha" className="h-6 brightness-0 invert opacity-40" loading="lazy" />
      </div>

      {/* Daily check-in CTA */}
      {!alreadyCheckedIn && !showCheckIn && (
        <div className="px-5 mb-4">
          <button onClick={() => setShowCheckIn(true)} className="w-full btn-gold text-sm flex items-center justify-center gap-2">
            <Calendar size={18} />
            Registrar meu dia
          </button>
        </div>
      )}

      {alreadyCheckedIn && !showCheckIn && (
        <div className="px-5 mb-4">
          <div className="glass rounded-2xl p-3 text-center flex items-center justify-center gap-2">
            <Leaf size={16} className="text-primary" />
            <p className="text-sm text-primary font-medium">Dia registrado! Sua planta agradece.</p>
          </div>
        </div>
      )}

      {/* Daily Check-in Modal */}
      {showCheckIn && (
        <div className="px-5 mb-4 animate-fade-in-up">
          <div className="glass-strong rounded-3xl p-6 space-y-5">
            <h2 className="text-xl font-display text-foreground">Como você está hoje?</h2>

            <div>
              <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase">Humor</label>
              <div className="flex gap-2 mt-2">
                {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                  <button key={i} onClick={() => setDailyData(d => ({ ...d, mood: i + 1 }))}
                    className={`flex-1 py-2.5 rounded-2xl text-xl transition-all ${dailyData.mood === i + 1 ? 'bg-mood-accent/20 ring-1 ring-mood-accent/40 scale-110' : 'glass-light'}`}
                    style={dailyData.mood === i + 1 ? { background: 'hsl(var(--mood-bg) / 0.5)' } : {}}
                  >{emoji}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase">Horas de sono</label>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => setDailyData(d => ({ ...d, sleepHours: Math.max(0, d.sleepHours - 0.5) }))}
                  className="glass-light w-10 h-10 rounded-xl text-foreground font-bold flex items-center justify-center">−</button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-bold text-foreground">{dailyData.sleepHours}</span>
                  <span className="text-sm text-muted-foreground ml-1">horas</span>
                </div>
                <button onClick={() => setDailyData(d => ({ ...d, sleepHours: Math.min(14, d.sleepHours + 0.5) }))}
                  className="glass-light w-10 h-10 rounded-xl text-foreground font-bold flex items-center justify-center">+</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase">Disposição</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setDailyData(d => ({ ...d, energyLevel: v }))}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${dailyData.energyLevel === v ? 'text-primary-foreground' : 'glass-light text-muted-foreground'}`}
                    style={dailyData.energyLevel === v ? { background: 'hsl(var(--energy-accent))' } : {}}
                  >{v}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase">Sintomas</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {symptomOptions.map(s => (
                  <button key={s} onClick={() => setDailyData(d => ({
                    ...d, symptoms: d.symptoms.includes(s) ? d.symptoms.filter(x => x !== s) : [...d.symptoms, s]
                  }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${dailyData.symptoms.includes(s) ? 'bg-destructive/20 text-destructive ring-1 ring-destructive/30' : 'glass-light text-muted-foreground'}`}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCheckIn(false)} className="flex-1 glass-light rounded-2xl py-3.5 text-muted-foreground font-medium">
                Cancelar
              </button>
              <button onClick={submitCheckIn} className="flex-1 btn-primary-glow !py-3.5 text-sm">
                Salvar registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BENTO GRID DASHBOARD ===== */}
      <div className="px-5 space-y-3">
        {/* Plant Growth — full width hero card */}
        <div className="bento-card span-2 relative" style={{ gridColumn: 'span 2' }}>
          
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={16} className="text-primary" />
            <h3 className="text-xs font-sans font-semibold text-muted-foreground tracking-wider uppercase">
              Sua Planta do Mês
            </h3>
          </div>
          <PlantGrowth growthPercent={plantGrowth} />
          <p className="text-xs text-muted-foreground text-center mt-2">
            {checkIns.length} de {daysInMonth} dias registrados
          </p>
        </div>

        {/* Quick Stats — Color-coded bento cards */}
        <div className="bento-grid">
          {/* Sleep card — blue */}
          <div className="bento-card card-sleep">
            <div className="absolute top-3 right-3 w-14 h-14 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(var(--sleep-accent)), transparent)' }} />
            <Moon size={20} className="text-sleep-accent mb-3" />
            <p className="text-xs text-sleep-accent/70 font-sans font-medium">Sono</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {lastCheckIn ? `${lastCheckIn.sleepHours}h` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Última noite</p>
          </div>

          {/* Mood card — purple */}
          <div className="bento-card card-mood">
            <div className="absolute top-3 right-3 w-14 h-14 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(var(--mood-accent)), transparent)' }} />
            <Heart size={20} className="text-mood-accent mb-3" />
            <p className="text-xs text-mood-accent/70 font-sans font-medium">Humor</p>
            <p className="text-3xl mt-1">
              {lastCheckIn ? ['😢', '😕', '😐', '🙂', '😄'][(lastCheckIn.mood || 3) - 1] : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Último registro</p>
          </div>

          {/* Energy card — orange */}
          <div className="bento-card card-energy">
            <div className="absolute top-3 right-3 w-14 h-14 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(var(--energy-accent)), transparent)' }} />
            <Zap size={20} className="text-energy-accent mb-3" />
            <p className="text-xs text-energy-accent/70 font-sans font-medium">Energia</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {lastCheckIn ? `${lastCheckIn.energyLevel}/5` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Disposição</p>
          </div>

          {/* Streak card — gold */}
          <div className="bento-card" style={{ background: 'hsl(42 40% 12% / 0.6)', borderColor: 'hsl(var(--gold) / 0.2)' }}>
            <div className="absolute top-3 right-3 w-14 h-14 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent)' }} />
            <TrendingUp size={20} className="text-gold mb-3" />
            <p className="text-xs text-gold/70 font-sans font-medium">Streak</p>
            <p className="text-3xl font-bold text-gradient-gold mt-1">{checkIns.length}</p>
            <p className="text-xs text-muted-foreground mt-1">dias seguidos</p>
          </div>
        </div>

        {/* Sleep insight card — wide, with image */}
        <div className="bento-card card-sleep flex items-center gap-4" style={{ gridColumn: 'span 2' }}>
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
            <img src={sleepImg} alt="Higiene do Sono" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Moon size={14} className="text-sleep-accent" />
              <span className="text-xs font-sans text-sleep-accent font-medium">Higiene do Sono</span>
            </div>
            <p className="text-sm text-foreground font-medium">Protocolo noturno ativo</p>
            <p className="text-xs text-muted-foreground mt-1">Evite luz azul 2h antes de dormir</p>
          </div>
        </div>

        {/* ML Recommendations */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} className="text-primary" />
            <h2 className="text-xl font-display text-foreground">Protocolos Sugeridos</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                      <div className="h-2.5 bg-muted rounded w-full animate-pulse" />
                      <div className="h-2.5 bg-muted rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-center text-xs text-muted-foreground mt-3 animate-pulse-glow">
                <Activity size={14} className="inline mr-1" />
                Analisando seus dados com IA...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, i) => {
                const categoryColors: Record<string, string> = {
                  'Sono': 'card-sleep',
                  'Humor': 'card-mood',
                  'Energia': 'card-energy',
                  'Nutrição': 'card-nutrition',
                  'Foco': 'card-focus',
                };
                const categoryIcons: Record<string, typeof Moon> = {
                  'Sono': Moon,
                  'Humor': Heart,
                  'Energia': Zap,
                  'Nutrição': Leaf,
                  'Foco': Brain,
                };
                const CardIcon = categoryIcons[rec.category] || Brain;
                const cardClass = categoryColors[rec.category] || '';

                return (
                  <div key={i} className={`bento-card ${cardClass} animate-fade-in-up`}
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'hsl(0 0% 100% / 0.08)' }}>
                        <CardIcon size={20} className="text-foreground/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-sans font-semibold tracking-wider uppercase text-foreground/60">
                            {rec.category}
                          </span>
                          {rec.priority === 'high' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">{rec.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                        <p className="text-xs text-primary/50 mt-2 italic flex items-center gap-1">
                          <BookOpen size={10} />
                          {rec.scientific_basis}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Articles section */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-primary" />
            <h2 className="text-xl font-display text-foreground">Leituras</h2>
          </div>
          <div className="bento-grid">
            {[
              { title: 'Neurociência do Sono', cat: 'Sono', Icon: Moon, cls: 'card-sleep' },
              { title: 'Fitoterapia Brasileira', cat: 'Plantas', Icon: Leaf, cls: 'card-nutrition' },
              { title: 'Gut-Brain Axis', cat: 'Nutrição', Icon: Brain, cls: 'card-focus' },
              { title: 'Cold Exposure', cat: 'Energia', Icon: Zap, cls: 'card-energy' },
            ].map((article, i) => (
              <div key={i} className={`bento-card ${article.cls} cursor-pointer`}>
                <article.Icon size={18} className="text-foreground/60 mb-2" />
                <p className="text-xs text-foreground/40 font-sans font-medium uppercase tracking-wider">{article.cat}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{article.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical disclaimer */}
      <div className="px-5 mt-8 pb-6">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            ⚕️ O NeuroGrow não substitui consulta médica profissional.
            Recomendações baseadas em literatura científica — referência educacional.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/20 z-40">
        <div className="flex justify-around py-3 max-w-lg mx-auto">
          {[
            { Icon: Leaf, label: 'Home', active: true },
            { Icon: TrendingUp, label: 'Progresso', active: false },
            { Icon: Sun, label: 'Rituais', active: false },
            { Icon: Heart, label: 'Perfil', active: false },
          ].map(item => (
            <button key={item.label} className="flex flex-col items-center gap-1 min-w-[60px]">
              <item.Icon size={20} className={item.active ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`text-[10px] font-sans font-medium ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
