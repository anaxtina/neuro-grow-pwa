/**
 * PaywallScreen v2 — Premium Daninha brand aesthetic
 */
import { useState } from 'react';
import { Crown, Sparkles, Check } from 'lucide-react';

interface PaywallScreenProps {
  userName: string;
  onSelect: (plan: 'trial' | 'monthly' | 'annual') => void;
}

const PaywallScreen = ({ userName, onSelect }: PaywallScreenProps) => {
  const [selected, setSelected] = useState<'trial' | 'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen flex flex-col bg-botanical-radial px-6 py-8 animate-fade-in">
      <div className="flex-1 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <Crown size={32} className="text-gold mx-auto mb-3" />
          <h1 className="text-3xl font-display text-foreground">{userName}, sua jornada começa agora</h1>
          <p className="text-muted-foreground text-sm mt-2 font-sans">Escolha o plano ideal para cultivar seu bem-estar.</p>
        </div>

        {/* Annual — highlighted */}
        <button onClick={() => setSelected('annual')}
          className={`w-full bento-card text-left mb-3 transition-all ${selected === 'annual' ? 'ring-2 ring-gold' : ''}`}
          style={selected === 'annual' ? { background: 'hsl(42 40% 12% / 0.5)', borderColor: 'hsl(var(--gold) / 0.3)' } : {}}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">Anual</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-gradient-gold">R$ 59,99</span>
                <span className="text-xs text-muted-foreground">/ano</span>
              </div>
              <p className="text-xs text-gold mt-1">≈ R$ 5,00/mês</p>
            </div>
            <span className="bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Melhor valor
            </span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {['Todos os protocolos', 'Feedback semanal + mensal', 'Artigos exclusivos', 'Suporte prioritário'].map(f => (
              <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                <Check size={12} className="text-gold flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </button>

        {/* Monthly */}
        <button onClick={() => setSelected('monthly')}
          className={`w-full bento-card text-left mb-3 transition-all ${selected === 'monthly' ? 'ring-2 ring-primary' : ''}`}>
          <p className="text-lg font-bold text-foreground">Mensal</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gradient-botanical">R$ 19,99</span>
            <span className="text-xs text-muted-foreground">/mês</span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {['Todos os protocolos', 'Feedback semanal + mensal', 'Artigos exclusivos'].map(f => (
              <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                <Check size={12} className="text-primary flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </button>

        {/* Free trial */}
        <button onClick={() => setSelected('trial')}
          className={`w-full glass-light rounded-2xl p-4 text-center transition-all ${selected === 'trial' ? 'ring-2 ring-primary' : ''}`}>
          <p className="text-foreground font-semibold text-sm flex items-center justify-center gap-2">
            🎁 Teste grátis por 1 mês
          </p>
          <p className="text-xs text-muted-foreground mt-1">Sem compromisso. Cancele quando quiser.</p>
        </button>
      </div>

      <div className="max-w-lg mx-auto w-full mt-6 space-y-3">
        <button onClick={() => onSelect(selected)}
          className={`w-full text-base ${selected === 'annual' ? 'btn-gold' : 'btn-primary-glow'}`}>
          {selected === 'trial' ? 'Começar teste grátis' : `Assinar plano ${selected === 'annual' ? 'anual' : 'mensal'}`}
        </button>
        <p className="text-center text-xs text-muted-foreground">Pagamento seguro. Cancele a qualquer momento.</p>
      </div>
    </div>
  );
};

export default PaywallScreen;
