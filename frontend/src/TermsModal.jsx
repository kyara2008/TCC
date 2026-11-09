import React, { useRef, useState, useEffect } from 'react';

/**
 * Modal de Termos de Uso e Política de Privacidade do Azulize
 */
export default function TermsModal({ isOpen, onClose, onAccept, isAccepted }) {
  const contentRef = useRef(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      // Foca o modal ou reseta o scroll
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // Se o usuário rolou próximo ao fim (margem de 40px)
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy/60 backdrop-blur-sm animate-rise"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-line animate-pop overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-line/70 bg-pale/50">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-sky text-blue flex items-center justify-center shadow-sm shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <div>
              <h2 id="terms-title" className="font-display font-extrabold text-base sm:text-xl text-navy leading-tight">
                Termos de Uso e Privacidade
              </h2>
              <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                Azulize • Controle Financeiro • Atualizado em Outubro/2026
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-navy p-2 rounded-xl hover:bg-line/40 transition-colors cursor-pointer"
            aria-label="Fechar termos de uso"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="overflow-y-auto px-4 sm:px-8 py-4 sm:py-5 space-y-5 text-ink text-xs sm:text-[14px] leading-relaxed"
        >
          {/* Alerta de Boas-vindas e Transparência */}
          <div className="bg-sky/60 border border-line rounded-2xl p-4 flex items-start gap-3">
            <span className="text-blue mt-0.5 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <p className="text-xs sm:text-sm text-navy/90 leading-snug">
              Bem-vindo ao <strong>Azulize</strong>. Sua privacidade e segurança financeira são nossas prioridades. Leia os termos abaixo antes de prosseguir com o seu cadastro.
            </p>
          </div>

          {/* Cláusula 1 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 1
              </span>
              <h3 className="font-display font-bold text-navy text-base">Aceitação dos Termos</h3>
            </div>
            <p className="text-muted">
              Ao criar uma conta, acessar ou utilizar a plataforma Azulize, você concorda expressamente com as disposições destes Termos de Uso e com nossa Política de Privacidade. Caso discorde de qualquer condição aqui estipulada, recomendamos a não utilização dos serviços.
            </p>
          </section>

          {/* Cláusula 2 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 2
              </span>
              <h3 className="font-display font-bold text-navy text-base">Finalidade e Natureza da Plataforma</h3>
            </div>
            <p className="text-muted">
              O Azulize é uma ferramenta digital voltada à organização financeira pessoal, planejamento orçamentário e registro de despesas diárias.
            </p>
            <ul className="list-disc list-inside text-muted space-y-1 pl-1">
              <li>O sistema não realiza movimentações bancárias, transferências de valores ou custódia de recursos.</li>
              <li>As informações geradas e relatórios visuais têm caráter exclusivamente informativo e educacional, não constituindo consultoria de investimento ou recomendação financeira formal.</li>
            </ul>
          </section>

          {/* Cláusula 3 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 3
              </span>
              <h3 className="font-display font-bold text-navy text-base">Privacidade e Proteção de Dados (LGPD)</h3>
            </div>
            <p className="text-muted">
              Em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-pale border border-line">
                <span className="font-bold text-navy text-xs block mb-1">🔐 Criptografia Avançada</span>
                <p className="text-xs text-muted">
                  Senhas são protegidas com derivação PBKDF2 e salt criptográfico individual de 150.000 iterações.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-pale border border-line">
                <span className="font-bold text-navy text-xs block mb-1">🚫 Não Comercialização</span>
                <p className="text-xs text-muted">
                  Seus dados financeiros e hábitos de consumo jamais são vendidos, alugados ou repassados a anunciantes.
                </p>
              </div>
            </div>
            <p className="text-muted text-xs pt-1">
              Coletamos estritamente os dados necessários para o funcionamento da sua conta: nome completo, e-mail para autenticação com código verificador e o orçamento mensal informado.
            </p>
          </section>

          {/* Cláusula 4 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 4
              </span>
              <h3 className="font-display font-bold text-navy text-base">Guarda de Credenciais e Segurança</h3>
            </div>
            <p className="text-muted">
              O usuário é o único responsável pela confidencialidade de sua senha de acesso e dos códigos transitórios de verificação enviados ao seu e-mail. Caso suspeite de qualquer acesso indevido ou não autorizado, altere sua senha imediatamente através das configurações de perfil.
            </p>
          </section>

          {/* Cláusula 5 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 5
              </span>
              <h3 className="font-display font-bold text-navy text-base">Conduta e Uso Adequado</h3>
            </div>
            <p className="text-muted">
              É estritamente vedado aos usuários:
            </p>
            <ul className="list-disc list-inside text-muted space-y-1 pl-1">
              <li>Praticar qualquer ato que viole leis, regulamentos ou direitos de terceiros.</li>
              <li>Tentar descompilar, fazer engenharia reversa ou sobrecarregar a infraestrutura do sistema.</li>
              <li>Inserir dados fraudulentos com intenção deliberada de corromper métricas ou causar inconsistências.</li>
            </ul>
          </section>

          {/* Cláusula 6 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 6
              </span>
              <h3 className="font-display font-bold text-navy text-base">Direitos do Usuário e Exclusão de Dados</h3>
            </div>
            <p className="text-muted">
              Você tem o direito irrevogável de solicitar a consulta, correção, exportação e a exclusão definitiva de sua conta e de todos os lançamentos de gastos vinculados a ela a qualquer momento.
            </p>
          </section>

          {/* Cláusula 7 */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue bg-sky px-2.5 py-0.5 rounded-md">
                Cláusula 7
              </span>
              <h3 className="font-display font-bold text-navy text-base">Atualizações dos Termos</h3>
            </div>
            <p className="text-muted">
              Buscando constante aprimoramento, o Azulize pode atualizar estes termos periodicamente. Notificaremos os usuários cadastrados sobre mudanças substanciais diretamente na interface do aplicativo.
            </p>
          </section>

          {/* Dica no fim do texto */}
          <div className="p-3.5 rounded-2xl bg-pale border border-line text-xs text-muted flex items-center justify-between">
            <span>Dúvidas ou solicitações de privacidade?</span>
            <span className="font-bold text-navy">suporte.azulize@gmail.com</span>
          </div>
        </div>

        {/* Rodapé com botões de ação */}
        <div className="px-6 py-4 border-t border-line/80 bg-pale/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isAccepted ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ok bg-[#e4f6ee] px-3 py-1.5 rounded-full border border-ok/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Você já aceitou estes termos
              </span>
            ) : (
              <span className="text-xs text-muted flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 14 14" />
                </svg>
                {hasScrolledToBottom ? 'Leitura concluída. Clique para aceitar.' : 'Leia os termos antes de aceitar.'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-line bg-white hover:bg-pale text-muted hover:text-navy font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue hover:bg-blue-dark text-white font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(47,143,220,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {isAccepted ? 'Termos Aceitos' : 'Aceitar Termos de Uso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
