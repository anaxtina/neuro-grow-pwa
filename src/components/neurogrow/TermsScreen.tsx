/**
 * TermsScreen v2 — Daninha brand with glassmorphism
 */
import { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import daninhaLogo from '@/assets/daninha-logo.png';

interface TermsScreenProps {
  onAccept: () => void;
}

const TermsScreen = ({ onAccept }: TermsScreenProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-botanical-radial px-6 py-8 animate-fade-in">
      <div className="flex-1 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-primary" />
          <div>
            <h1 className="text-2xl font-display text-foreground">Termos de Uso e Privacidade</h1>
            <p className="text-muted-foreground text-xs font-sans">Sua saúde, seus dados, sua escolha.</p>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-5 max-h-[52vh] overflow-y-auto text-sm text-foreground/75 leading-relaxed space-y-4">
          <h3 className="font-semibold text-foreground text-base">1. Dados Coletados</h3>
          <p>Coletamos informações de saúde (humor, sono, alimentação, dados biométricos) exclusivamente para recomendações personalizadas. Dados <strong>pessoais sensíveis</strong> conforme Art. 5, II da LGPD.</p>

          <h3 className="font-semibold text-foreground text-base">2. Finalidade e Base Legal</h3>
          <p>Dados utilizados <strong>apenas</strong> para: personalizar protocolos, gerar feedbacks e melhorar algoritmos. Base legal: <strong>consentimento explícito</strong> (Art. 7, I e Art. 11, I da LGPD).</p>

          <h3 className="font-semibold text-foreground text-base">3. Armazenamento</h3>
          <p>Dados armazenados localmente (localStorage) e em servidores com criptografia AES-256. Solicite <strong>exclusão total</strong> a qualquer momento.</p>

          <h3 className="font-semibold text-foreground text-base">4. Compartilhamento</h3>
          <p><strong>Não vendemos ou transferimos</strong> dados pessoais a terceiros.</p>

          <h3 className="font-semibold text-foreground text-base">5. Seus Direitos (LGPD Art. 18)</h3>
          <p>Acessar, corrigir, anonimizar, bloquear, eliminar, revogar consentimento e portabilidade.</p>

          <h3 className="font-semibold text-foreground text-base">6. Aviso Importante</h3>
          <p className="text-accent font-medium">O NeuroGrow NÃO substitui orientação médica profissional.</p>

          <h3 className="font-semibold text-foreground text-base">7. Contato DPO</h3>
          <p>privacidade@daninha.com.br</p>
        </div>

        <label className="flex items-start gap-3 mt-6 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed ? 'bg-primary border-primary' : 'border-muted-foreground/30 group-hover:border-primary/50'}`}>
            {agreed && <Check size={14} className="text-primary-foreground" />}
          </div>
          <span className="text-xs text-foreground/70 leading-relaxed">
            Li e concordo com os <strong className="text-foreground">Termos de Uso</strong> e a <strong className="text-foreground">Política de Privacidade</strong>.
            Autorizo o tratamento dos meus dados sensíveis de saúde.
          </span>
        </label>
      </div>

      <div className="max-w-lg mx-auto w-full mt-6">
        <button onClick={onAccept} disabled={!agreed}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${agreed ? 'btn-primary-glow' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
          Aceitar e Continuar
        </button>
      </div>
    </div>
  );
};

export default TermsScreen;
