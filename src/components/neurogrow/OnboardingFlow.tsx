/**
 * OnboardingFlow v2 — Daninha brand with botanical glassmorphism
 * WHY: Consistent with new design system, uses Instrument Serif headings,
 * Space Grotesk body text, color-coded selections, and glass cards.
 */
import { useState, useCallback } from 'react';
import { Target, Moon, Zap, Brain, Heart, Flower2 } from 'lucide-react';
import type { UserData } from '@/lib/ml';
import { validateName, validateBirthDate } from '@/lib/onboarding-state';

interface OnboardingFlowProps {
  onComplete: (data: Partial<UserData>) => void;
}

const KNOWLEDGE_PILLS: Record<string, string> = {
  sleep: '💡 A melatonina começa a ser liberada ~2h antes de dormir. Luz azul de telas bloqueia esse processo.',
  mood: '💡 95% da serotonina é produzida no intestino. Alimentação impacta diretamente seu humor!',
  energy: '💡 Exposição solar nos primeiros 30min após acordar regula seu ritmo circadiano.',
  food: '💡 Cúrcuma com pimenta-do-reino tem biodisponibilidade 2000% maior. Fitoterapia ancestral é ciência.',
};

const GOALS = [
  { id: 'focus', label: 'Foco & Produtividade', Icon: Brain, color: 'focus' },
  { id: 'sleep', label: 'Qualidade do Sono', Icon: Moon, color: 'sleep' },
  { id: 'energy', label: 'Energia & Disposição', Icon: Zap, color: 'energy' },
  { id: 'longevity', label: 'Longevidade', Icon: Target, color: 'nutrition' },
  { id: 'mood', label: 'Equilíbrio Emocional', Icon: Heart, color: 'mood' },
  { id: 'cycle', label: 'Saúde Feminina', Icon: Flower2, color: 'cycle' },
];

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({
    goals: [], medications: [], healthConditions: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPill, setShowPill] = useState<string | null>(null);
  const totalSteps = 5;

  const updateField = useCallback(<K extends keyof UserData>(key: K, value: UserData[K]) => {
    setUserData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  const toggleGoal = useCallback((goalId: string) => {
    setUserData(prev => {
      const goals = prev.goals || [];
      return { ...prev, goals: goals.includes(goalId) ? goals.filter(g => g !== goalId) : [...goals, goalId] };
    });
  }, []);

  const nextStep = () => {
    if (step === 0) { const err = validateName(userData.name || ''); if (err) { setErrors({ name: err }); return; } }
    if (step === 1 && (!userData.goals || userData.goals.length === 0)) { setErrors({ goals: 'Selecione pelo menos um' }); return; }
    if (step === 2) {
      const dateErr = validateBirthDate(userData.birthDate || '');
      if (dateErr) { setErrors({ birthDate: dateErr }); return; }
      if (!userData.biologicalSex) { setErrors({ biologicalSex: 'Selecione o sexo biológico' }); return; }
    }
    if (step === totalSteps - 1) { onComplete(userData); return; }
    setStep(s => s + 1); setShowPill(null);
  };

  const prevStep = () => step > 0 && setStep(s => s - 1);

  return (
    <div className="min-h-screen flex flex-col bg-botanical-radial px-6 py-8 animate-fade-in">
      {/* Progress */}
      <div className="max-w-lg mx-auto w-full mb-8">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevStep} className={`text-xs font-sans text-muted-foreground hover:text-foreground transition-colors ${step === 0 ? 'invisible' : ''}`}>
            ← Voltar
          </button>
          <span className="text-xs text-muted-foreground font-sans">{step + 1} / {totalSteps}</span>
        </div>
        <div className="progress-botanical">
          <div className="bar" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full">
        {step === 0 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display text-foreground mb-2">Como devemos te chamar?</h1>
            <p className="text-muted-foreground text-sm mb-8">A Daninha gosta de chamar pelo nome.</p>
            <input type="text" value={userData.name || ''} onChange={e => updateField('name', e.target.value)}
              placeholder="Seu nome" autoFocus
              className="w-full glass rounded-2xl px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" />
            {errors.name && <p className="text-destructive text-sm mt-2">{errors.name}</p>}
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display text-foreground mb-1">Prazer, {userData.name}</h1>
            <p className="text-muted-foreground text-sm mb-6">O que te trouxe aqui?</p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => {
                const selected = userData.goals?.includes(goal.id);
                const colorMap: Record<string, string> = {
                  focus: 'card-focus', sleep: 'card-sleep', energy: 'card-energy',
                  nutrition: 'card-nutrition', mood: 'card-mood', cycle: 'card-cycle',
                };
                return (
                  <button key={goal.id} onClick={() => toggleGoal(goal.id)}
                    className={`bento-card text-left p-4 transition-all ${selected ? `${colorMap[goal.color]} ring-1 ring-foreground/10` : ''}`}>
                    <goal.Icon size={22} className={`mb-2 ${selected ? 'text-foreground' : 'text-muted-foreground'}`} />
                    <p className="text-sm font-semibold text-foreground">{goal.label}</p>
                  </button>
                );
              })}
            </div>
            {errors.goals && <p className="text-destructive text-sm mt-3">{errors.goals}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display text-foreground mb-2">Seus dados biológicos</h1>
            <p className="text-muted-foreground text-sm mb-6">Para personalizar seus protocolos.</p>
            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase mb-2 block">Data de nascimento</label>
                <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={userData.birthDate || ''}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                    if (v.length >= 5) v = v.slice(0, 5) + '/' + v.slice(5);
                    if (v.length > 10) v = v.slice(0, 10);
                    updateField('birthDate', v);
                  }} maxLength={10}
                  className="w-full glass rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/40" />
                {errors.birthDate && <p className="text-destructive text-sm mt-1">{errors.birthDate}</p>}
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase mb-2 block">Sexo biológico</label>
                <div className="grid grid-cols-3 gap-3">
                  {([['female', 'Feminino', Flower2], ['male', 'Masculino', Zap], ['other', 'Outro', Heart]] as const).map(([val, label, Icon]) => (
                    <button key={val} onClick={() => updateField('biologicalSex', val)}
                      className={`glass rounded-2xl py-4 text-center transition-all flex flex-col items-center gap-2 ${userData.biologicalSex === val ? 'ring-2 ring-primary bg-primary/10' : ''}`}>
                      <Icon size={18} className={userData.biologicalSex === val ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="text-xs text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
                {errors.biologicalSex && <p className="text-destructive text-sm mt-1">{errors.biologicalSex}</p>}
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase mb-2 block">Peso (kg) — opcional</label>
                <input type="number" value={userData.weight || ''} onChange={e => updateField('weight', Number(e.target.value))}
                  placeholder="70"
                  className="w-full glass rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display text-foreground mb-2">Como está seu dia a dia?</h1>
            <p className="text-muted-foreground text-sm mb-6">Avalie de 1 a 5.</p>
            {[
              { key: 'sleepQuality' as const, label: 'Qualidade do Sono', Icon: Moon, pill: 'sleep', color: 'sleep-accent' },
              { key: 'dietQuality' as const, label: 'Alimentação', Icon: Target, pill: 'food', color: 'nutrition-accent' },
              { key: 'moodLevel' as const, label: 'Humor', Icon: Heart, pill: 'mood', color: 'mood-accent' },
              { key: 'energyLevel' as const, label: 'Disposição', Icon: Zap, pill: 'energy', color: 'energy-accent' },
            ].map(({ key, label, Icon, pill, color }) => (
              <div key={key} className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={`text-${color}`} />
                    <span className="text-sm text-foreground font-medium">{label}</span>
                  </div>
                  <span className={`text-xs text-${color} font-semibold`}>{(userData[key] as number) || 0}/5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => { updateField(key, v as any); if (v <= 2) setShowPill(pill); }}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${(userData[key] as number) === v ? 'bg-primary text-primary-foreground' : 'glass-light text-muted-foreground'}`}>
                      {v}
                    </button>
                  ))}
                </div>
                {showPill === pill && (
                  <div className="mt-2 glass rounded-xl p-3 text-xs text-foreground/80 animate-fade-in border-l-2 border-primary leading-relaxed">
                    {KNOWLEDGE_PILLS[pill]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display text-foreground mb-2">Informações de saúde</h1>
            <p className="text-muted-foreground text-sm mb-6">Para sua segurança.</p>
            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase mb-2 block">Medicações (separar por vírgula)</label>
                <textarea value={(userData.medications || []).join(', ')}
                  onChange={e => updateField('medications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ex: Antidepressivo, Anticoncepcional..." rows={2}
                  className="w-full glass rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-sans tracking-wider uppercase mb-2 block">Condições ou alergias</label>
                <textarea value={(userData.healthConditions || []).join(', ')}
                  onChange={e => updateField('healthConditions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Ex: Diabetes, Alergia a frutos do mar..." rows={2}
                  className="w-full glass rounded-2xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>
              <div className="glass rounded-xl p-4 border-l-2 border-accent">
                <p className="text-xs text-foreground/80">
                  ⚠️ <strong>Importante:</strong> Recomendações consideram suas medicações. Sempre consulte seu médico.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto w-full mt-6">
        <button onClick={nextStep} className="w-full btn-primary-glow text-base">
          {step === totalSteps - 1 ? 'Começar minha jornada ✦' : 'Continuar'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
