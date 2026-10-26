import React, { useState, useEffect, useRef } from 'react';

// Endereço base da API
const API_BASE = (window.location.protocol.startsWith('http') && (window.location.port === '3000' || window.location.port === '5173'))
  ? ''
  : 'http://localhost:3000';

const K = {
  session: 'azulize:session_user'
};

const P = {
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  wallet: 'M3 7h15a3 3 0 013 3v8a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l12-3v3M17 14h2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  eyeoff: 'M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.7M6.6 6.7A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004-.9',
  home: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  out: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  plus: 'M12 5v14M5 12h14',
  alert: 'M12 3l10 18H2zM12 10v5M12 18v.01',
  cart: 'M3 4h2l2.5 11h10L20 7H6M9 20v.01M17 20v.01',
  key: 'M15 8a4 4 0 11-2 3.4L4 20v-3H1v-3h3l7-7M16 7v.01',
  back: 'M15 18l-6-6 6-6',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  check: 'M5 13l4 4L19 7',
  trash: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  close: 'M18 6L6 18M6 6l12 12',
  image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21',
  chart: 'M18 20V10M12 20V4M6 20v-6',
  pie: 'M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  calendar: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01'
};

function Icon({ name, size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 inline-block align-middle ${className}`}
      aria-hidden="true"
    >
      <path d={P[name] || ''} />
    </svg>
  );
}

const getInitials = (n) => {
  if (!n) return 'U';
  const parts = n.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function UserAvatar({ user, size = 40, className = '' }) {
  const avatar = user?.avatar;
  const name = user?.name || '';
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ring-2 ring-blue/20 shadow-sm ${className}`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.38)) }}
      className={`rounded-full shrink-0 font-display font-extrabold text-white flex items-center justify-center bg-gradient-to-br from-[#52a9ee] to-blue shadow-sm select-none ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

const money = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtDate = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const validEmail = (e) => /^[^\s@.][^\s@]*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(e) && !e.includes('..');

function getStrength(pw) {
  if (!pw) return { label: '', color: '', w: 0 };
  const types = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (pw.length >= 8 && types === 4) return { label: 'Forte', color: '#35a77a', w: 100 };
  if (types >= 2 && /[A-Za-z]/.test(pw) && /\d/.test(pw)) return { label: 'Média', color: '#e8a317', w: 66 };
  if (types >= 2) return { label: 'Média', color: '#e8a317', w: 60 };
  return { label: 'Fraca', color: '#d64545', w: 33 };
}

// Configuração visual de cores, fundos e ícones por categoria
const CATEGORY_CONFIG = {
  'Alimentação': { color: '#f59e0b', bg: '#fef3c7', text: '#b45309', border: '#fde68a', icon: 'cart' },
  'Transporte': { color: '#06b6d4', bg: '#cffafe', text: '#0e7490', border: '#a5f3fc', icon: 'cart' },
  'Moradia & Contas': { color: '#8b5cf6', bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe', icon: 'home' },
  'Lazer & Cultura': { color: '#ec4899', bg: '#fce7f3', text: '#be185d', border: '#fbcfe8', icon: 'cart' },
  'Saúde': { color: '#10b981', bg: '#d1fae5', text: '#047857', border: '#a7f3d0', icon: 'shield' },
  'Compras': { color: '#3b82f6', bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe', icon: 'cart' },
  'Educação': { color: '#6366f1', bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe', icon: 'cart' },
  'Outros': { color: '#64748b', bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', icon: 'tag' }
};

// Detecção inteligente e classificação automática de categoria por palavras-chave
function detectCategory(desc, explicitCat) {
  if (explicitCat && explicitCat !== 'Geral' && CATEGORY_CONFIG[explicitCat]) {
    return explicitCat;
  }
  if (!desc) return 'Outros';
  const d = desc.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/mercado|supermercado|restaurante|lanche|comida|cafe|padaria|feira|delivery|ifood|burger|pizza|almoco|jantar|acougue|sorvete|bebida|churrasco|alimento/.test(d)) {
    return 'Alimentação';
  }
  if (/uber|99|gasolina|combustivel|posto|onibus|metro|taxi|passagem|pedagio|estacionamento|carro|moto|mecanic/.test(d)) {
    return 'Transporte';
  }
  if (/aluguel|condominio|luz|energia|agua|gas|internet|wifi|iptu|moradia|casa|apartamento/.test(d)) {
    return 'Moradia & Contas';
  }
  if (/cinema|netflix|spotify|jogo|game|steam|playstation|xbox|viagem|hotel|show|festa|bar|balada|lazer|passeio|livraria/.test(d)) {
    return 'Lazer & Cultura';
  }
  if (/farmacia|drogaria|remedio|medico|consulta|dentista|hospital|exame|plano|saude|terapia|psicolog/.test(d)) {
    return 'Saúde';
  }
  if (/shopping|roupa|calcado|tenis|amazon|mercado livre|magalu|shopee|eletronico|celular|presente/.test(d)) {
    return 'Compras';
  }
  if (/curso|faculdade|escola|livro|aula|educacao|material|udemy|pos/.test(d)) {
    return 'Educação';
  }
  return 'Outros';
}

// Componente Logo Azulize
function Logo() {
  return (
    <div className="flex items-center gap-2.5 mb-6 font-display font-extrabold text-xl sm:text-2xl text-navy tracking-tight select-none">
      <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white bg-gradient-to-br from-[#52a9ee] to-blue shadow-[0_6px_16px_rgba(47,143,220,0.35)] shrink-0">
        <Icon name="wallet" size={20} />
      </span>
      <span>Azulize</span>
    </div>
  );
}

// Gráfico de Rosca / Donut Interativo (Gastos por Categoria)
function CategoryDonutChart({ categories, total, activeCategory, onSelectCategory, onHoverCategory }) {
  const size = 220;
  const cx = 110;
  const cy = 110;
  const radius = 72;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius; // ~452.39

  let accumulatedPercent = 0;

  const currentDisplay = activeCategory
    ? categories.find((c) => c.name === activeCategory)
    : null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible select-none">
        {categories.length === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
        ) : (
          categories.map((cat) => {
            const pct = cat.percentage;
            const sliceLength = (pct / 100) * circumference;
            const gap = categories.length > 1 ? 3 : 0;
            const dashLength = Math.max(0.1, sliceLength - gap);
            const spaceLength = Math.max(0.1, circumference - dashLength);
            const dashOffset = -(accumulatedPercent / 100) * circumference;
            accumulatedPercent += pct;

            const isSelected = activeCategory === cat.name;

            return (
              <circle
                key={cat.name}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={cat.config.color}
                strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={`${dashLength} ${spaceLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                className="transition-all duration-300 cursor-pointer hover:opacity-90"
                style={{
                  filter: isSelected ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))' : 'none',
                  transformOrigin: `${cx}px ${cy}px`
                }}
                onMouseEnter={() => onHoverCategory(cat.name)}
                onMouseLeave={() => onHoverCategory(null)}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              />
            );
          })
        )}
      </svg>

      {/* Conteúdo Central da Rosca */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        {currentDisplay ? (
          <div className="animate-pop">
            <span
              className="text-[11px] font-bold uppercase tracking-wider block truncate max-w-[120px]"
              style={{ color: currentDisplay.config.color }}
            >
              {currentDisplay.name}
            </span>
            <strong className="font-display font-extrabold text-navy text-base sm:text-lg block leading-tight mt-0.5">
              {money(currentDisplay.total)}
            </strong>
            <span className="inline-block mt-0.5 text-[10px] font-bold py-0.5 px-2 rounded-full bg-slate-100 text-slate-700">
              {currentDisplay.percentage.toFixed(1)}% do total
            </span>
          </div>
        ) : (
          <div>
            <span className="text-muted text-[11px] uppercase tracking-wider font-semibold block">Total</span>
            <strong className="font-display font-extrabold text-navy text-base sm:text-lg block leading-tight mt-0.5">
              {money(total)}
            </strong>
            <span className="text-muted text-[11px] block mt-0.5">
              {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Gráfico de Barras / Linha do Tempo (Gastos Diários)
function SpendingBarChart({ data, onSelectDate, selectedDate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted text-xs sm:text-sm">
        <Icon name="chart" size={28} className="text-muted/40 mb-2" />
        Nenhum gasto no período selecionado.
      </div>
    );
  }

  const width = 460;
  const height = 190;
  const padLeft = 46;
  const padRight = 16;
  const padTop = 26;
  const padBottom = 34;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = Math.max(...data.map((d) => d.total), 10);
  const slotW = chartW / data.length;
  const barW = Math.max(12, Math.min(28, slotW * 0.62));

  // 3 linhas guias: 0%, 50%, 100%
  const guideLines = [
    { val: maxVal, y: padTop },
    { val: maxVal / 2, y: padTop + chartH / 2 },
    { val: 0, y: padTop + chartH }
  ];

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Linhas guias horizontais */}
        {guideLines.map((g, idx) => (
          <g key={idx}>
            <line
              x1={padLeft}
              y1={g.y}
              x2={width - padRight}
              y2={g.y}
              stroke="#e2e8f0"
              strokeDasharray={idx === 2 ? 'none' : '3 3'}
              strokeWidth={idx === 2 ? 1.5 : 1}
            />
            <text
              x={padLeft - 6}
              y={g.y + 3}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="sans-serif"
            >
              {g.val >= 1000 ? `R$ ${(g.val / 1000).toFixed(0)}k` : `R$ ${Math.round(g.val)}`}
            </text>
          </g>
        ))}

        {/* Barras por dia */}
        {data.map((d, i) => {
          const barH = Math.max(4, (d.total / maxVal) * chartH);
          const x = padLeft + (i + 0.5) * slotW - barW / 2;
          const y = padTop + chartH - barH;
          const isHovered = hoveredIndex === i;
          const isSelected = selectedDate === d.dateKey;

          return (
            <g
              key={d.dateKey}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectDate && onSelectDate(isSelected ? null : d.dateKey)}
            >
              {/* Área invisível ampla para facilitar hover no mobile */}
              <rect
                x={padLeft + i * slotW}
                y={padTop}
                width={slotW}
                height={chartH + padBottom}
                fill="transparent"
              />

              {/* Coluna / Barra */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={5}
                ry={5}
                fill={isHovered || isSelected ? 'url(#barHoverGradient)' : 'url(#barBlueGradient)'}
                className="transition-all duration-200"
                style={{
                  filter: isHovered || isSelected ? 'drop-shadow(0 4px 8px rgba(37,99,235,0.35))' : 'none'
                }}
              />

              {/* Rótulo de Data no Eixo X */}
              <text
                x={padLeft + (i + 0.5) * slotW}
                y={padTop + chartH + 16}
                textAnchor="middle"
                fill={isSelected ? '#1d4ed8' : '#64748b'}
                fontSize="10"
                fontWeight={isSelected ? 'bold' : 'normal'}
                fontFamily="sans-serif"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Tooltip flutuante sobre a barra em hover */}
        {hoveredItem && hoveredIndex !== null && (() => {
          const slotCenter = padLeft + (hoveredIndex + 0.5) * slotW;
          const barH = Math.max(4, (hoveredItem.total / maxVal) * chartH);
          const tooltipY = Math.max(8, padTop + chartH - barH - 24);
          const tooltipX = Math.max(60, Math.min(width - 60, slotCenter));

          return (
            <g className="pointer-events-none transition-all duration-150">
              <rect
                x={tooltipX - 48}
                y={tooltipY - 14}
                width={96}
                height={26}
                rx={6}
                fill="#0f172a"
                className="shadow-lg"
              />
              <polygon
                points={`${tooltipX - 4},${tooltipY + 12} ${tooltipX + 4},${tooltipY + 12} ${tooltipX},${tooltipY + 16}`}
                fill="#0f172a"
              />
              <text
                x={tooltipX}
                y={tooltipY + 3}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {money(hoveredItem.total)}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(K.session)) || null;
    } catch {
      return null;
    }
  });

  // Modos de tela de autenticação: 'login', 'create', 'verify_register', 'forgot', 'reset'
  const [authMode, setAuthMode] = useState('login');
  const [authInfo, setAuthInfo] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Campos de autenticação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estado do painel
  const [view, setView] = useState('home');
  const [summary, setSummary] = useState({
    user_name: '',
    user_budget: 0,
    total_spent: 0,
    balance: 0,
    budget_used_percentage: 0
  });
  const [expenses, setExpenses] = useState([]);
  const [newDesc, setNewDesc] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newCat, setNewCat] = useState('auto');

  // Estados de Filtro e Gráficos do Histórico
  const [historyPeriod, setHistoryPeriod] = useState('all'); // 'all' | 'month' | '30d' | '7d'
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState(null);
  const [historyDateFilter, setHistoryDateFilter] = useState(null);
  const [historySearch, setHistorySearch] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Toast
  const [toastText, setToastText] = useState('');
  const toastTimer = useRef(null);

  // Estados de Reenvio de Código
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Estados de Edição Rápida de Orçamento
  const [editBudgetOpen, setEditBudgetOpen] = useState(false);
  const [quickBudgetVal, setQuickBudgetVal] = useState('');

  // Estados da Página de Configurações
  const [configName, setConfigName] = useState('');
  const [configBudget, setConfigBudget] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [showConfigCurrPw, setShowConfigCurrPw] = useState(false);
  const [showConfigNewPw, setShowConfigNewPw] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const showToast = (msg) => {
    setToastText(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastText(''), 3500);
  };

  // Filtros aplicados sobre a lista completa de gastos
  const filteredExpenses = React.useMemo(() => {
    const nowTime = Date.now();
    const curDate = new Date();
    const curMonth = curDate.getMonth();
    const curYear = curDate.getFullYear();

    return expenses.filter((x) => {
      // 1. Filtro de Período
      if (historyPeriod !== 'all') {
        const ts = new Date(x.ts).getTime();
        if (historyPeriod === '7d' && ts < nowTime - 7 * 86400000) return false;
        if (historyPeriod === '30d' && ts < nowTime - 30 * 86400000) return false;
        if (historyPeriod === 'month') {
          const d = new Date(x.ts);
          if (d.getMonth() !== curMonth || d.getFullYear() !== curYear) return false;
        }
      }
      // 2. Filtro de Categoria
      const cat = detectCategory(x.description, x.category);
      if (historyCategoryFilter && cat !== historyCategoryFilter) return false;

      // 3. Filtro de Data Diária
      if (historyDateFilter) {
        const d = new Date(x.ts);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (key !== historyDateFilter) return false;
      }

      // 4. Filtro de Busca Textual
      if (historySearch.trim()) {
        const q = historySearch.trim().toLowerCase();
        if (!x.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [expenses, historyPeriod, historyCategoryFilter, historyDateFilter, historySearch]);

  const totalFiltered = React.useMemo(() => {
    return filteredExpenses.reduce((s, x) => s + x.value, 0);
  }, [filteredExpenses]);

  const avgExpense = filteredExpenses.length > 0 ? totalFiltered / filteredExpenses.length : 0;
  const maxExpense = filteredExpenses.reduce((m, x) => (x.value > m.value ? x : m), { value: 0, description: '-' });

  // Agrupamento por Categorias para o Gráfico de Rosca
  const categoryStats = React.useMemo(() => {
    const map = {};
    for (const exp of filteredExpenses) {
      const cat = detectCategory(exp.description, exp.category);
      if (!map[cat]) {
        map[cat] = { name: cat, total: 0, count: 0 };
      }
      map[cat].total += exp.value;
      map[cat].count += 1;
    }
    const tot = filteredExpenses.reduce((s, x) => s + x.value, 0);
    return Object.values(map)
      .map((c) => ({
        ...c,
        percentage: tot > 0 ? (c.total / tot) * 100 : 0,
        config: CATEGORY_CONFIG[c.name] || CATEGORY_CONFIG['Outros']
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  const topCategory = categoryStats[0] || null;

  // Agrupamento Diário para o Gráfico de Barras / Linha do Tempo
  const timelineStats = React.useMemo(() => {
    const map = {};
    for (const exp of filteredExpenses) {
      const d = new Date(exp.ts);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[key]) {
        map[key] = { dateKey: key, date: d, total: 0, count: 0 };
      }
      map[key].total += exp.value;
      map[key].count += 1;
    }
    const sorted = Object.values(map).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    return sorted.slice(-14).map((item) => {
      const day = String(item.date.getDate()).padStart(2, '0');
      const month = String(item.date.getMonth() + 1).padStart(2, '0');
      return {
        ...item,
        label: `${day}/${month}`,
        fullDate: item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    });
  }, [filteredExpenses]);

  const api = async (path, options = {}) => {
    const url = `${API_BASE}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(session?.id ? { 'x-user-id': session.id } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Erro HTTP ${res.status}`);
      }
      return data;
    } catch (err) {
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        throw new Error('Não foi possível carregar as informações. Verifique sua conexão com a internet.');
      }
      throw err;
    }
  };

  // Carrega dados do painel
  const loadDashboard = async (userObj = session) => {
    if (!userObj?.id) return;
    try {
      const [sumData, expData] = await Promise.all([
        api(`/api/user/summary?userId=${userObj.id}`),
        api(`/api/expenses?userId=${userObj.id}`)
      ]);
      setSummary(sumData);
      setExpenses(expData);
    } catch (err) {
      console.warn('Aviso ao carregar dados:', err.message);
    }
  };

  // Inicialização e validação de sessão
  useEffect(() => {
    if (session?.id) {
      api(`/api/user/me?userId=${session.id}`)
        .then((verified) => {
          localStorage.setItem(K.session, JSON.stringify(verified));
          setSession(verified);
          loadDashboard(verified);
        })
        .catch(() => {
          localStorage.removeItem(K.session);
          setSession(null);
        });
    }
  }, []);

  // Sincroniza campos de configuração com dados da sessão
  useEffect(() => {
    if (session) {
      setConfigName(session.name || '');
      const bVal = String(session.budget ?? summary.user_budget ?? '');
      setConfigBudget(bVal);
      setQuickBudgetVal(bVal);
    }
  }, [session?.name, session?.budget, summary.user_budget]);

  // Contagem regressiva do reenvio de código
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleLogout = () => {
    localStorage.removeItem(K.session);
    setSession(null);
    setView('home');
    setAuthMode('login');
    setPassword('');
    setCode('');
    setAuthError('');
  };

  // Reenviar código de confirmação de cadastro
  const handleResendRegisterCode = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setAuthError('');
    try {
      const data = await api('/api/auth/resend-register-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      setResendCooldown(60);
      if (data.code) {
        setCode(data.code);
        setAuthInfo('Novo código gerado e preenchido automaticamente.');
      } else {
        setAuthInfo(data.message || 'Novo código enviado para o seu e-mail!');
      }
      showToast('Novo código enviado com sucesso!');
    } catch (err) {
      setAuthError(err.message || 'Erro ao reenviar código.');
    } finally {
      setResendLoading(false);
    }
  };

  // Reenviar código de recuperação de senha
  const handleResendResetCode = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setAuthError('');
    try {
      const data = await api('/api/auth/resend-reset-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      setResendCooldown(60);
      if (data.code) {
        setCode(data.code);
        setAuthInfo('Novo código gerado e preenchido automaticamente.');
      } else {
        setAuthInfo(data.message || 'Novo código de recuperação enviado para seu e-mail!');
      }
      showToast('Novo código de recuperação enviado!');
    } catch (err) {
      setAuthError(err.message || 'Erro ao reenviar código.');
    } finally {
      setResendLoading(false);
    }
  };

  // Alterar / Atualizar orçamento mensal
  const handleUpdateBudget = async (newVal) => {
    const num = Number(newVal);
    if (isNaN(num) || num < 0 || String(newVal).trim() === '') {
      showToast('Informe um valor de orçamento válido maior ou igual a zero.');
      return;
    }
    setSavingBudget(true);
    try {
      await api('/api/user/budget', {
        method: 'PUT',
        body: JSON.stringify({ budget: num })
      });
      const updatedUser = { ...session, budget: num };
      setSession(updatedUser);
      localStorage.setItem(K.session, JSON.stringify(updatedUser));
      setSummary((prev) => {
        const balance = num - prev.total_spent;
        const budget_used_percentage = num > 0 ? (prev.total_spent / num) * 100 : (prev.total_spent > 0 ? 100 : 0);
        return {
          ...prev,
          user_budget: num,
          balance,
          budget_used_percentage
        };
      });
      setQuickBudgetVal(String(num));
      setConfigBudget(String(num));
      setEditBudgetOpen(false);
      showToast(`Orçamento atualizado para ${money(num)} com sucesso!`);
      loadDashboard(updatedUser);
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar orçamento.');
    } finally {
      setSavingBudget(false);
    }
  };

  // Upload e processamento de imagem de usuário (limite de 5 MB)
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      showToast(`A imagem selecionada possui ${(file.size / (1024 * 1024)).toFixed(1)} MB. O limite máximo permitido é de 5 MB.`);
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Selecione um formato de imagem válido (JPG, PNG, WebP, GIF).');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Redimensiona proporcionalmente mantendo alta resolução (máx 512x512) para rapidez e leveza
        const maxDim = 512;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

        setAvatarLoading(true);
        try {
          await api('/api/user/avatar', {
            method: 'PUT',
            body: JSON.stringify({ avatar: dataUrl })
          });
          const updatedUser = { ...session, avatar: dataUrl };
          setSession(updatedUser);
          localStorage.setItem(K.session, JSON.stringify(updatedUser));
          showToast('Foto de perfil alterada com sucesso!');
        } catch (err) {
          showToast(err.message || 'Erro ao atualizar foto de perfil.');
        } finally {
          setAvatarLoading(false);
          e.target.value = '';
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Remover foto de perfil
  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    try {
      await api('/api/user/avatar', {
        method: 'PUT',
        body: JSON.stringify({ avatar: null })
      });
      const updatedUser = { ...session, avatar: null };
      setSession(updatedUser);
      localStorage.setItem(K.session, JSON.stringify(updatedUser));
      showToast('Foto de perfil removida com sucesso!');
    } catch (err) {
      showToast(err.message || 'Erro ao remover foto.');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Atualizar nome do usuário
  const handleUpdateProfileName = async (e) => {
    e.preventDefault();
    if (!configName.trim()) {
      return showToast('Informe um nome válido.');
    }
    setSavingProfile(true);
    try {
      await api('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: configName.trim() })
      });
      const updatedUser = { ...session, name: configName.trim() };
      setSession(updatedUser);
      localStorage.setItem(K.session, JSON.stringify(updatedUser));
      setSummary((prev) => ({ ...prev, user_name: configName.trim() }));
      showToast('Nome atualizado com sucesso!');
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar nome.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Alterar senha (usuário logado)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPw) {
      return showToast('Digite sua senha atual.');
    }
    if (!newPw || newPw.length < 8) {
      return showToast('A nova senha deve ter pelo menos 8 caracteres.');
    }
    if (newPw !== confirmNewPw) {
      return showToast('A confirmação da nova senha não confere.');
    }
    setSavingPw(true);
    try {
      await api('/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw })
      });
      setCurrentPw('');
      setNewPw('');
      setConfirmNewPw('');
      showToast('Senha alterada com sucesso!');
    } catch (err) {
      showToast(err.message || 'Erro ao alterar senha.');
    } finally {
      setSavingPw(false);
    }
  };

  // Submissão do login / cadastro inicial
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!validEmail(cleanEmail)) {
      return setAuthError('Digite um e-mail válido, como voce@email.com.');
    }
    if (password.length < 8) {
      return setAuthError('A senha precisa ter no mínimo 8 caracteres.');
    }

    setLoading(true);

    try {
      if (authMode === 'create') {
        const numBudget = Number(budget);
        if (!name.trim()) {
          setLoading(false);
          return setAuthError('Informe seu nome completo.');
        }
        if (!(numBudget >= 0) || budget === '') {
          setLoading(false);
          return setAuthError('Informe um orçamento mensal válido.');
        }

        const data = await api('/api/auth/register-request', {
          method: 'POST',
          body: JSON.stringify({ name: name.trim(), email: cleanEmail, password, budget: numBudget })
        });

        setAuthMode('verify_register');
        if (data.code) {
          setCode(data.code);
          if (data.smtpSent === false) {
            setAuthInfo('Código gerado e preenchido automaticamente.');
          }
        }
      } else {
        const data = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: cleanEmail, password })
        });
        localStorage.setItem(K.session, JSON.stringify(data.user));
        setSession(data.user);
        loadDashboard(data.user);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirmação do código de criação de conta
  const handleVerifyRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      return setAuthError('Digite os 6 dígitos do código recebido por e-mail.');
    }

    setLoading(true);
    try {
      const data = await api('/api/auth/register-confirm', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: cleanCode })
      });
      localStorage.setItem(K.session, JSON.stringify(data.user));
      setSession(data.user);
      showToast('Conta criada com sucesso! Bem-vindo ao Azulize.');
      loadDashboard(data.user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Solicitar recuperação de senha
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();
    if (!validEmail(cleanEmail)) {
      return setAuthError('Digite um e-mail válido.');
    }

    setLoading(true);
    try {
      const data = await api('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail })
      });
      setAuthMode('reset');
      if (data.code) {
        setCode(data.code);
        if (data.smtpSent === false) {
          setAuthInfo('Código gerado e preenchido automaticamente.');
        }
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redefinir senha com o código
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      return setAuthError('Código incorreto. Digite os 6 dígitos.');
    }
    if (password.length < 8) {
      return setAuthError('A senha precisa ter no mínimo 8 caracteres.');
    }

    setLoading(true);
    try {
      const data = await api('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: cleanCode, newPassword: password })
      });
      setAuthMode('login');
      setAuthInfo(data.message || 'Senha alterada com sucesso! Entre com sua nova senha.');
      setPassword('');
      setCode('');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar gasto
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const desc = newDesc.trim();
    const val = Math.round(Number(newVal) * 100) / 100;

    if (!desc || !(val > 0)) {
      return showToast('Informe uma descrição e um valor maior que zero.');
    }

    const chosenCategory = newCat === 'auto' ? detectCategory(desc) : newCat;

    setLoading(true);
    try {
      await api('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          userId: session.id,
          description: desc,
          value: val,
          category: chosenCategory
        })
      });
      setNewDesc('');
      setNewVal('');
      setNewCat('auto');
      showToast(`Gasto de ${money(val)} adicionado com sucesso!`);
      await loadDashboard(session);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Excluir gasto
  const handleDeleteExpense = async (id) => {
    try {
      await api(`/api/expenses/${id}`, { method: 'DELETE' });
      showToast('Gasto excluído com sucesso!');
      await loadDashboard(session);
    } catch (err) {
      showToast(err.message);
    }
  };

  const pwStrength = getStrength(password);

  return (
    <div className="min-h-screen w-full flex flex-col justify-start sm:justify-center items-center py-5 sm:py-8 px-3.5 sm:px-6">
      {/* Toast Notification */}
      <div className={`fixed left-1/2 bottom-6 -translate-x-1/2 transition-all duration-300 z-50 pointer-events-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-navy text-white font-semibold text-xs sm:text-sm shadow-[0_12px_30px_rgba(18,57,92,0.3)] max-w-[90vw] text-center ${
        toastText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      }`}>
        {toastText}
      </div>

      {!session ? (
        /* ========================================================================= */
        /* TELAS DE AUTENTICAÇÃO                                                     */
        /* ========================================================================= */
        <section className="w-full max-w-[440px] mx-auto bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(34,111,163,0.12)] animate-rise my-auto">
          <Logo />

          {/* 1. Tela de Confirmação de Cadastro */}
          {authMode === 'verify_register' && (
            <>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-navy tracking-tight">Confirme seu e-mail</h1>
              <p className="text-muted leading-relaxed mt-2 mb-5 text-xs sm:text-sm">Enviamos um código de 6 dígitos para o seu endereço de e-mail.</p>

              <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-[#e5f4ff] border border-dashed border-blue mb-5 text-navy text-xs sm:text-sm leading-relaxed animate-pop">
                <Icon name="mail" size={20} className="text-blue mt-0.5 shrink-0" />
                <div className="min-w-0">
                  Código de validação para <b className="break-all">{email}</b>:
                  <br /><small className="text-muted">Verifique seu e-mail ou utilize o código abaixo:</small>
                  {code && <strong className="font-display font-extrabold text-xl sm:text-2xl tracking-[6px] block mt-1.5 text-navy">{code}</strong>}
                </div>
              </div>

              <form onSubmit={handleVerifyRegister} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="code" className="text-navy text-xs font-bold uppercase tracking-wider">Código de verificação</label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    required
                    className="code w-full border border-line rounded-xl py-3 sm:py-3.5 px-3 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all font-mono text-center text-xl sm:text-2xl font-bold tracking-[6px] sm:tracking-[8px]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm -mt-1">
                  <span className="text-muted">Não recebeu o código?</span>
                  <button
                    type="button"
                    onClick={handleResendRegisterCode}
                    disabled={resendCooldown > 0 || resendLoading}
                    className="inline-flex items-center gap-1.5 font-bold text-blue hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                  >
                    <Icon name="refresh" size={13} className={resendLoading ? 'animate-spin' : ''} />
                    {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : (resendLoading ? 'Reenviando...' : 'Reenviar código')}
                  </button>
                </div>

                {authError && <div className="text-bad bg-bad-bg p-3 rounded-xl font-semibold text-xs sm:text-sm animate-shake">{authError}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center gap-2 rounded-xl py-3.5 px-5 font-bold text-white bg-blue shadow-[0_8px_20px_rgba(47,143,220,0.22)] hover:bg-blue-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 text-sm sm:text-base"
                >
                  <Icon name="check" size={18} /> {loading ? 'Salvando usuário...' : 'Confirmar e ativar conta'}
                </button>
              </form>

              <p className="text-center text-muted text-xs sm:text-sm mt-5">
                <button type="button" onClick={() => setAuthMode('create')} className="text-blue font-bold hover:underline">Voltar ao cadastro</button>
              </p>
            </>
          )}

          {/* 2. Tela de Solicitar Recuperação de Senha */}
          {authMode === 'forgot' && (
            <>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-navy tracking-tight">Recuperar senha</h1>
              <p className="text-muted leading-relaxed mt-2 mb-5 text-xs sm:text-sm">Informe o e-mail cadastrado para receber seu código de verificação.</p>

              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-navy text-xs font-bold uppercase tracking-wider">E-mail</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                      <Icon name="mail" size={18} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@email.com"
                      required
                      className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                    />
                  </div>
                </div>

                {authError && <div className="text-bad bg-bad-bg p-3 rounded-xl font-semibold text-xs sm:text-sm animate-shake">{authError}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center gap-2 rounded-xl py-3.5 px-5 font-bold text-white bg-blue shadow-[0_8px_20px_rgba(47,143,220,0.22)] hover:bg-blue-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 text-sm sm:text-base"
                >
                  <Icon name="send" size={18} /> {loading ? 'Enviando código...' : 'Enviar código por e-mail'}
                </button>
              </form>

              <p className="text-center text-muted text-xs sm:text-sm mt-5">
                <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-blue font-bold hover:underline">Voltar ao login</button>
              </p>
            </>
          )}

          {/* 3. Tela de Redefinir Senha */}
          {authMode === 'reset' && (
            <>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-navy tracking-tight">Nova senha</h1>
              <p className="text-muted leading-relaxed mt-2 mb-5 text-xs sm:text-sm">Digite o código recebido no seu e-mail e escolha uma nova senha.</p>

              <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-[#e5f4ff] border border-dashed border-blue mb-5 text-navy text-xs sm:text-sm leading-relaxed animate-pop">
                <Icon name="mail" size={20} className="text-blue mt-0.5 shrink-0" />
                <div className="min-w-0">
                  Código de recuperação para <b className="break-all">{email}</b>:
                  <br /><small className="text-muted">Verifique seu e-mail ou utilize o código abaixo:</small>
                  {code && <strong className="font-display font-extrabold text-xl sm:text-2xl tracking-[6px] block mt-1.5 text-navy">{code}</strong>}
                </div>
              </div>

              <form onSubmit={handleResetSubmit} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="code" className="text-navy text-xs font-bold uppercase tracking-wider">Código de 6 dígitos</label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    required
                    className="code w-full border border-line rounded-xl py-3 sm:py-3.5 px-3 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all font-mono text-center text-xl sm:text-2xl font-bold tracking-[6px] sm:tracking-[8px]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm -mt-1">
                  <span className="text-muted">Não recebeu o código?</span>
                  <button
                    type="button"
                    onClick={handleResendResetCode}
                    disabled={resendCooldown > 0 || resendLoading}
                    className="inline-flex items-center gap-1.5 font-bold text-blue hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                  >
                    <Icon name="refresh" size={13} className={resendLoading ? 'animate-spin' : ''} />
                    {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : (resendLoading ? 'Reenviando...' : 'Reenviar código')}
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pw" className="text-navy text-xs font-bold uppercase tracking-wider">Nova senha</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                      <Icon name="lock" size={18} />
                    </span>
                    <input
                      id="pw"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo de 8 caracteres"
                      required
                      minLength={8}
                      className="w-full border border-line rounded-xl py-3 pl-11 pr-11 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 text-muted hover:text-blue p-2 rounded-lg flex items-center justify-center transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      <Icon name={showPassword ? 'eyeoff' : 'eye'} size={18} />
                    </button>
                  </div>

                  {password && (
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                        <span className="block h-full transition-all duration-300" style={{ width: `${pwStrength.w}%`, background: pwStrength.color }} />
                      </div>
                      <span className="text-xs font-bold min-w-[48px] text-right" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                    </div>
                  )}
                </div>

                {authError && <div className="text-bad bg-bad-bg p-3 rounded-xl font-semibold text-xs sm:text-sm animate-shake">{authError}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center gap-2 rounded-xl py-3.5 px-5 font-bold text-white bg-blue shadow-[0_8px_20px_rgba(47,143,220,0.22)] hover:bg-blue-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 text-sm sm:text-base"
                >
                  <Icon name="check" size={18} /> {loading ? 'Salvando nova senha...' : 'Redefinir senha'}
                </button>
              </form>

              <p className="text-center text-muted text-xs sm:text-sm mt-5">
                <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-blue font-bold hover:underline">Cancelar</button>
              </p>
            </>
          )}

          {/* 4. Telas de Login e Cadastro */}
          {(authMode === 'login' || authMode === 'create') && (
            <>
              <h1 className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-navy tracking-tight">
                {authMode === 'create' ? 'Crie sua conta' : 'Bem-vindo de volta'}
              </h1>
              <p className="text-muted leading-relaxed mt-2 mb-5 text-xs sm:text-sm">
                {authMode === 'create'
                  ? 'Um código de verificação de email será enviado para você.'
                  : 'Entre para acompanhar seus gastos diários.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4" noValidate>
                {authMode === 'create' && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-navy text-xs font-bold uppercase tracking-wider">Nome completo</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                        <Icon name="user" size={18} />
                      </span>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Como podemos chamar você?"
                        required
                        className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-navy text-xs font-bold uppercase tracking-wider">E-mail</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                      <Icon name="mail" size={18} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@email.com"
                      required
                      className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-navy text-xs font-bold uppercase tracking-wider">Senha</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                      <Icon name="lock" size={18} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo de 8 caracteres"
                      required
                      minLength={8}
                      className="w-full border border-line rounded-xl py-3 pl-11 pr-11 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 text-muted hover:text-blue p-2 rounded-lg flex items-center justify-center transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      <Icon name={showPassword ? 'eyeoff' : 'eye'} size={18} />
                    </button>
                  </div>

                  {authMode === 'create' && password && (
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                        <span className="block h-full transition-all duration-300" style={{ width: `${pwStrength.w}%`, background: pwStrength.color }} />
                      </div>
                      <span className="text-xs font-bold min-w-[48px] text-right" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                    </div>
                  )}
                </div>

                {authMode === 'create' ? (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="budget" className="text-navy text-xs font-bold uppercase tracking-wider">Orçamento mensal</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                        <Icon name="wallet" size={18} />
                      </span>
                      <input
                        id="budget"
                        type="number"
                        min="0"
                        step="0.01"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="R$ 0,00"
                        required
                        className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end -mt-1.5">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot'); setAuthError(''); }}
                      className="text-blue text-xs sm:text-sm font-bold hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}

                {authInfo && <div className="text-[#1f7a57] bg-[#e4f6ee] p-3 rounded-xl font-semibold text-xs sm:text-sm">{authInfo}</div>}
                {authError && <div className="text-bad bg-bad-bg p-3 rounded-xl font-semibold text-xs sm:text-sm animate-shake">{authError}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center gap-2 rounded-xl py-3.5 px-5 font-bold text-white bg-blue shadow-[0_8px_20px_rgba(47,143,220,0.22)] hover:bg-blue-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 text-sm sm:text-base"
                >
                  <Icon name={authMode === 'create' ? 'check' : 'user'} size={18} />
                  {loading
                    ? (authMode === 'create' ? 'Salvando usuário...' : 'Entrando...')
                    : (authMode === 'create' ? 'Criar conta' : 'Entrar')}
                </button>
              </form>

              <p className="text-center text-muted text-xs sm:text-sm mt-5">
                {authMode === 'create' ? 'Já possui uma conta?' : 'Ainda não possui uma conta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'create' ? 'login' : 'create');
                    setAuthError('');
                    setAuthInfo('');
                  }}
                  className="text-blue font-bold hover:underline"
                >
                  {authMode === 'create' ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </>
          )}
        </section>
      ) : (
        /* ========================================================================= */
        /* PAINEL PRINCIPAL (DASHBOARD)                                              */
        /* ========================================================================= */
        <section className="w-full max-w-5xl mx-auto animate-rise">
          {/* Topbar */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-line/60">
            <div className="flex items-center justify-between">
              <div
                onClick={() => setView('home')}
                className="flex items-center gap-2.5 font-display font-extrabold text-xl sm:text-2xl text-navy tracking-tight select-none cursor-pointer"
              >
                <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white bg-gradient-to-br from-[#52a9ee] to-blue shadow-[0_4px_14px_rgba(47,143,220,0.35)] shrink-0">
                  <Icon name="wallet" size={20} />
                </span>
                <span>Azulize</span>
              </div>

              {/* Botões visíveis no topo no mobile */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('settings')}
                  className={`inline-flex items-center gap-1.5 border border-line rounded-xl py-1.5 px-2.5 text-xs font-bold transition-colors shadow-sm active:scale-95 ${
                    view === 'settings' ? 'bg-blue text-white border-blue' : 'bg-white text-navy hover:bg-sky'
                  }`}
                  title="Configurações do usuário"
                >
                  <Icon name="settings" size={14} />
                  <span>Ajustes</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 border border-line rounded-xl py-1.5 px-2.5 bg-white text-navy font-bold text-xs hover:bg-sky transition-colors shadow-sm active:scale-95"
                >
                  <Icon name="out" size={14} /> Sair
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              {/* Perfil do usuário clicável que abre configurações */}
              <button
                type="button"
                onClick={() => setView('settings')}
                className="group flex items-center gap-3 p-1.5 sm:pr-3 rounded-2xl hover:bg-white/80 border border-transparent hover:border-line transition-all text-left"
                title="Abrir configurações de perfil"
              >
                <UserAvatar user={session} size={42} className="ring-2 ring-blue/30 group-hover:ring-blue transition-all" />
                <div className="hidden min-[420px]:block">
                  <p className="text-navy font-bold text-xs sm:text-sm m-0 leading-tight group-hover:text-blue transition-colors">
                    {summary.user_name || session?.name}
                  </p>
                  <span className="text-[11px] text-muted block mt-0.5">Meu perfil</span>
                </div>
              </button>

              {/* Botões visíveis em telas maiores */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('settings')}
                  className={`inline-flex items-center gap-2 border rounded-xl py-2.5 px-3.5 font-bold text-sm transition-all shadow-sm active:scale-95 ${
                    view === 'settings'
                      ? 'bg-blue text-white border-blue shadow-[0_4px_12px_rgba(47,143,220,0.25)]'
                      : 'border-line bg-white text-navy hover:bg-sky'
                  }`}
                  title="Configurações do usuário"
                >
                  <Icon name="settings" size={16} /> Configurações
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 border border-line rounded-xl py-2.5 px-3.5 bg-white text-navy font-bold text-sm hover:bg-bad-bg/60 hover:text-bad hover:border-bad/30 transition-all shadow-sm active:scale-95"
                >
                  <Icon name="out" size={16} /> Sair
                </button>
              </div>
            </div>
          </header>

          {/* Abas responsivas */}
          <nav className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex gap-1.5 p-1 rounded-2xl bg-white/80 border border-line mb-6 backdrop-blur-sm shadow-sm">
            <button
              type="button"
              onClick={() => setView('home')}
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] ${
                view === 'home'
                  ? 'bg-blue text-white shadow-[0_6px_14px_rgba(47,143,220,0.25)]'
                  : 'text-muted hover:bg-white/70 hover:text-navy'
              }`}
            >
              <Icon name="home" size={16} /> Início
            </button>
            <button
              type="button"
              onClick={() => setView('hist')}
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] ${
                view === 'hist'
                  ? 'bg-blue text-white shadow-[0_6px_14px_rgba(47,143,220,0.25)]'
                  : 'text-muted hover:bg-white/70 hover:text-navy'
              }`}
            >
              <Icon name="clock" size={16} /> Histórico
            </button>
            <button
              type="button"
              onClick={() => setView('settings')}
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] ${
                view === 'settings'
                  ? 'bg-blue text-white shadow-[0_6px_14px_rgba(47,143,220,0.25)]'
                  : 'text-muted hover:bg-white/70 hover:text-navy'
              }`}
            >
              <Icon name="settings" size={16} /> Configurações
            </button>
          </nav>

          {/* Conteúdo das Abas */}
          {view === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Card de Saldo */}
              <article className="lg:col-span-7 bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] flex flex-col justify-between">
                <div>
                  <h2 className="flex items-center gap-2.5 text-navy font-display font-bold text-base sm:text-lg mb-1">
                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                      <Icon name="wallet" size={16} />
                    </span>
                    Seu saldo do mês
                  </h2>
                  <p className="text-muted text-xs sm:text-sm m-0">Orçamento menos o que você já gastou.</p>

                  {(() => {
                    const balance = summary.balance;
                    const isNeg = balance < 0;
                    const pct = Math.min(100, Math.max(0, summary.budget_used_percentage || 0));
                    const barColor = isNeg ? '#d64545' : pct > 80 ? '#e8a317' : '#35a77a';

                    return (
                      <div className={`my-5 p-4 sm:p-5 rounded-2xl transition-all border ${
                        isNeg 
                          ? 'bg-bad-bg/60 border-bad/20' 
                          : 'bg-gradient-to-br from-[#eaf6ff] to-[#f4faff] border-blue/15'
                      }`}>
                        <div className="flex justify-between items-center text-xs text-muted font-medium">
                          <span>Saldo disponível</span>
                          <span className="font-semibold text-navy">{pct.toFixed(0)}% do orçamento</span>
                        </div>

                        <strong className={`block text-2xl sm:text-3xl lg:text-[34px] font-display font-extrabold tracking-tight mt-1 truncate ${
                          isNeg ? 'text-bad' : 'text-navy'
                        }`}>
                          {money(balance)}
                        </strong>

                        <div className="h-2.5 rounded-full bg-white/90 mt-3.5 overflow-hidden shadow-inner">
                          <i 
                            className="block h-full rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${pct}%`, background: barColor }} 
                          />
                        </div>

                        {/* Cards de estatísticas secundárias em grade responsiva */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 pt-3 border-t border-line/60">
                          <div className="bg-white/70 p-2.5 sm:p-3 rounded-xl border border-line/40">
                            <span className="text-[11px] sm:text-xs text-muted block">Total gasto</span>
                            <span className="text-xs sm:text-sm font-bold text-navy truncate block mt-0.5">
                              {money(summary.total_spent)}
                            </span>
                          </div>
                          <div className="bg-white/70 p-2.5 sm:p-3 rounded-xl border border-line/40">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] sm:text-xs text-muted block">Orçamento</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickBudgetVal(String(summary.user_budget ?? session?.budget ?? ''));
                                  setEditBudgetOpen(true);
                                }}
                                title="Alterar valor do orçamento"
                                className="text-blue hover:text-blue-dark inline-flex items-center gap-1 text-[11px] font-bold py-0.5 px-1.5 rounded-md hover:bg-sky transition-colors cursor-pointer active:scale-95"
                              >
                                <Icon name="edit" size={11} /> Alterar
                              </button>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-navy truncate block mt-0.5">
                              {money(summary.user_budget)}
                            </span>
                          </div>
                        </div>

                        {isNeg && (
                          <div className="flex gap-2.5 items-center mt-3.5 p-3 rounded-xl bg-bad text-white font-semibold text-xs sm:text-sm animate-pop">
                            <Icon name="alert" size={18} className="shrink-0" />
                            <span>Atenção: você ultrapassou o orçamento em {money(-balance)}.</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between mt-6 mb-3">
                    <h3 className="font-display font-bold text-navy text-sm sm:text-base m-0">Últimos gastos</h3>
                    {expenses.length > 5 && (
                      <button 
                        onClick={() => setView('hist')} 
                        className="text-blue text-xs font-bold hover:underline"
                      >
                        Ver todos ({expenses.length})
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col divide-y divide-line">
                    {expenses.length > 0 ? (
                      expenses.slice(0, 5).map((x) => {
                        const catName = detectCategory(x.description, x.category);
                        const catCfg = CATEGORY_CONFIG[catName] || CATEGORY_CONFIG['Outros'];
                        return (
                          <div key={x.id} className="flex justify-between items-center gap-3 py-3 group">
                            <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky text-blue shrink-0 group-hover:scale-105 transition-transform">
                              <Icon name={catCfg.icon || 'cart'} size={18} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <strong className="truncate text-navy text-xs sm:text-sm font-semibold">{x.description}</strong>
                                <span
                                  className="inline-flex items-center gap-1 py-0.5 px-2 rounded-lg text-[10px] font-bold shrink-0"
                                  style={{
                                    backgroundColor: catCfg.bg,
                                    color: catCfg.text,
                                    border: `1px solid ${catCfg.border}`
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catCfg.color }} />
                                  {catName}
                                </span>
                              </div>
                              <small className="text-muted text-[11px] sm:text-xs block mt-0.5">{fmtDate(x.ts)}</small>
                            </div>
                            <span className="font-bold text-navy text-xs sm:text-sm whitespace-nowrap">{money(x.value)}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(x.id)}
                              title="Excluir gasto"
                              className="text-muted hover:text-bad hover:bg-bad/10 p-2 rounded-xl transition-all shrink-0 active:scale-95"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="grid justify-items-center gap-2 py-8 text-center text-muted">
                        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-sky text-blue mb-1">
                          <Icon name="wallet" size={24} />
                        </span>
                        <b className="text-navy text-sm">Nenhum gasto registrado</b>
                        <span className="text-xs max-w-xs">Adicione seu primeiro gasto ao lado para começar a acompanhar seu saldo.</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {/* Card de Adicionar Gasto */}
              <article className="lg:col-span-5 bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] self-start">
                <h2 className="flex items-center gap-2.5 text-navy font-display font-bold text-base sm:text-lg mb-1">
                  <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                    <Icon name="plus" size={16} />
                  </span>
                  Adicionar gasto
                </h2>
                <p className="text-muted text-xs sm:text-sm m-0">Registre cada compra para acompanhar seu mês.</p>

                <form onSubmit={handleAddExpense} className="flex flex-col gap-4 mt-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-navy text-xs font-bold uppercase tracking-wider">Descrição</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                        <Icon name="cart" size={18} />
                      </span>
                      <input
                        id="description"
                        type="text"
                        maxLength={60}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Ex.: Mercado, Restaurante"
                        required
                        className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="value" className="text-navy text-xs font-bold uppercase tracking-wider">Valor</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                        <Icon name="wallet" size={18} />
                      </span>
                      <input
                        id="value"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={newVal}
                        onChange={(e) => setNewVal(e.target.value)}
                        placeholder="R$ 0,00"
                        required
                        className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className="text-navy text-xs font-bold uppercase tracking-wider">Categoria</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                        <Icon name="tag" size={18} />
                      </span>
                      <select
                        id="category"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-base sm:text-sm font-medium cursor-pointer"
                      >
                        <option value="auto">✨ Automática (identificar pelo nome)</option>
                        <option value="Alimentação">🍔 Alimentação (Mercado, Lanche)</option>
                        <option value="Transporte">🚗 Transporte (Uber, Combustível)</option>
                        <option value="Moradia & Contas">🏠 Moradia & Contas (Aluguel, Luz)</option>
                        <option value="Lazer & Cultura">🎮 Lazer & Cultura (Cinema, Jogos)</option>
                        <option value="Saúde">💊 Saúde (Farmácia, Consultas)</option>
                        <option value="Compras">🛍️ Compras (Roupas, Eletrônicos)</option>
                        <option value="Educação">📚 Educação (Cursos, Livros)</option>
                        <option value="Outros">📦 Outros</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center gap-2 rounded-xl py-3.5 px-5 font-bold text-white bg-blue shadow-[0_8px_20px_rgba(47,143,220,0.25)] hover:bg-blue-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 text-sm sm:text-base mt-1"
                  >
                    <Icon name="plus" size={18} /> {loading ? 'Salvando gasto...' : 'Adicionar gasto'}
                  </button>
                </form>
              </article>
            </div>
          )}

          {/* Aba de Histórico e Gráficos */}
          {view === 'hist' && (
            <div className="flex flex-col gap-6 animate-rise">
              {/* 1. Header do Histórico com Controles de Período e Busca */}
              <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-line">
                  <div>
                    <h2 className="flex items-center gap-2.5 text-navy font-display font-bold text-lg sm:text-xl mb-1">
                      <span className="grid place-items-center w-8 h-8 rounded-xl bg-sky text-blue">
                        <Icon name="chart" size={18} />
                      </span>
                      Histórico e Gráficos
                    </h2>
                    <p className="text-muted text-xs sm:text-sm m-0">
                      Análise visual completa de gastos por categorias e linha do tempo.
                    </p>
                  </div>

                  {/* Seletor de Período */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-pale border border-line rounded-2xl">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'month', label: 'Este mês' },
                      { id: '30d', label: '30 dias' },
                      { id: '7d', label: '7 dias' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setHistoryPeriod(p.id)}
                        className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
                          historyPeriod === p.id
                            ? 'bg-blue text-white shadow-sm'
                            : 'text-muted hover:text-navy hover:bg-white/80'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Barra de Busca e Filtros Rápidos */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                      <Icon name="search" size={16} />
                    </span>
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Pesquisar gastos por descrição (ex: mercado, uber)..."
                      className="w-full border border-line rounded-xl py-2.5 pl-10 pr-10 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-xs sm:text-sm"
                    />
                    {historySearch && (
                      <button
                        type="button"
                        onClick={() => setHistorySearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy text-sm p-1"
                        title="Limpar busca"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    )}
                  </div>

                  {(historyCategoryFilter || historyDateFilter || historySearch || historyPeriod !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryPeriod('all');
                        setHistoryCategoryFilter(null);
                        setHistoryDateFilter(null);
                        setHistorySearch('');
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-bad/30 bg-bad-bg/60 text-bad hover:bg-bad hover:text-white font-bold text-xs transition-all whitespace-nowrap active:scale-95"
                    >
                      <Icon name="refresh" size={14} /> Limpar filtros
                    </button>
                  )}
                </div>

                {/* Banner de Filtros Ativos (se houver algum ativo) */}
                {(historyCategoryFilter || historyDateFilter || historySearch || historyPeriod !== 'all') && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-line text-xs">
                    <span className="font-bold text-muted flex items-center gap-1">
                      <Icon name="filter" size={13} /> Filtro:
                    </span>
                    {historyPeriod !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-lg bg-sky text-navy font-semibold">
                        Período: {historyPeriod === 'month' ? 'Este mês' : historyPeriod === '30d' ? '30 dias' : '7 dias'}
                        <button type="button" onClick={() => setHistoryPeriod('all')} className="hover:text-bad font-bold">&times;</button>
                      </span>
                    )}
                    {historyCategoryFilter && (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-lg bg-[#e5f4ff] text-blue border border-blue/30 font-semibold">
                        Categoria: {historyCategoryFilter}
                        <button type="button" onClick={() => setHistoryCategoryFilter(null)} className="hover:text-bad font-bold">&times;</button>
                      </span>
                    )}
                    {historyDateFilter && (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Data: {historyDateFilter.split('-').reverse().join('/')}
                        <button type="button" onClick={() => setHistoryDateFilter(null)} className="hover:text-bad font-bold">&times;</button>
                      </span>
                    )}
                    {historySearch && (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                        Busca: "{historySearch}"
                        <button type="button" onClick={() => setHistorySearch('')} className="hover:text-bad font-bold">&times;</button>
                      </span>
                    )}
                  </div>
                )}
              </article>

              {/* 2. Quatro Cards de Estatísticas Rápidas do Histórico */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white/95 backdrop-blur-sm border border-line rounded-2xl p-4 sm:p-5 shadow-sm">
                  <span className="text-muted text-[11px] sm:text-xs font-semibold uppercase tracking-wider block">Total no período</span>
                  <strong className="font-display font-extrabold text-navy text-lg sm:text-2xl block mt-1">
                    {money(totalFiltered)}
                  </strong>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-muted">
                    {filteredExpenses.length} {filteredExpenses.length === 1 ? 'registro' : 'registros'}
                  </span>
                </div>

                <div className="bg-white/95 backdrop-blur-sm border border-line rounded-2xl p-4 sm:p-5 shadow-sm">
                  <span className="text-muted text-[11px] sm:text-xs font-semibold uppercase tracking-wider block">Média por gasto</span>
                  <strong className="font-display font-extrabold text-navy text-lg sm:text-2xl block mt-1">
                    {money(avgExpense)}
                  </strong>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-muted">
                    valor médio por item
                  </span>
                </div>

                <div className="bg-white/95 backdrop-blur-sm border border-line rounded-2xl p-4 sm:p-5 shadow-sm">
                  <span className="text-muted text-[11px] sm:text-xs font-semibold uppercase tracking-wider block">Maior despesa</span>
                  <strong className="font-display font-extrabold text-navy text-lg sm:text-2xl block mt-1 truncate" title={maxExpense.description}>
                    {money(maxExpense.value)}
                  </strong>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-muted truncate max-w-full" title={maxExpense.description}>
                    {maxExpense.description || 'Nenhum'}
                  </span>
                </div>

                <div className="bg-white/95 backdrop-blur-sm border border-line rounded-2xl p-4 sm:p-5 shadow-sm">
                  <span className="text-muted text-[11px] sm:text-xs font-semibold uppercase tracking-wider block">Top Categoria</span>
                  <div className="flex items-center gap-2 mt-1">
                    {topCategory ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: topCategory.config.color }} />
                        <strong className="font-display font-extrabold text-navy text-base sm:text-xl truncate" title={topCategory.name}>
                          {topCategory.name}
                        </strong>
                      </>
                    ) : (
                      <strong className="font-display font-extrabold text-navy text-base sm:text-xl">-</strong>
                    )}
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-muted">
                    {topCategory ? `${topCategory.percentage.toFixed(0)}% de todos os gastos` : 'Sem gastos'}
                  </span>
                </div>
              </div>

              {/* 3. Seção de Gráficos: Rosca de Categorias & Gráfico de Barras Temporal */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                {/* Gráfico 1: Rosca de Categorias */}
                <article className="lg:col-span-6 bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                    <div>
                      <h3 className="font-display font-bold text-navy text-base sm:text-lg flex items-center gap-2 m-0">
                        <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                          <Icon name="pie" size={16} />
                        </span>
                        Gastos por Categoria
                      </h3>
                      <p className="text-muted text-xs mt-0.5 mb-0">Distribuição percentual dos gastos</p>
                    </div>

                    {historyCategoryFilter && (
                      <button
                        type="button"
                        onClick={() => setHistoryCategoryFilter(null)}
                        className="text-xs text-blue hover:underline font-bold"
                      >
                        Ver todas
                      </button>
                    )}
                  </div>

                  {categoryStats.length > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
                      {/* Gráfico SVG de Rosca */}
                      <div className="shrink-0">
                        <CategoryDonutChart
                          categories={categoryStats}
                          total={totalFiltered}
                          activeCategory={hoveredCategory || historyCategoryFilter}
                          onSelectCategory={(cat) => setHistoryCategoryFilter(cat)}
                          onHoverCategory={(cat) => setHoveredCategory(cat)}
                        />
                      </div>

                      {/* Lista e Legenda de Categorias */}
                      <div className="flex-1 w-full flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                        {categoryStats.map((c) => {
                          const isSelected = historyCategoryFilter === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setHistoryCategoryFilter(isSelected ? null : c.name)}
                              onMouseEnter={() => setHoveredCategory(c.name)}
                              onMouseLeave={() => setHoveredCategory(null)}
                              className={`group w-full flex flex-col gap-1.5 p-2 rounded-xl text-left transition-all border ${
                                isSelected
                                  ? 'bg-sky/60 border-blue/40 shadow-sm'
                                  : 'border-transparent hover:bg-pale/70'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs gap-2">
                                <span className="flex items-center gap-2 font-bold text-navy truncate">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.config.color }} />
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <span className="font-extrabold text-navy shrink-0">{money(c.total)}</span>
                              </div>

                              {/* Barra de Progresso Proporcional */}
                              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${c.percentage}%`,
                                    backgroundColor: c.config.color
                                  }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-muted font-medium">
                                <span>{c.count} {c.count === 1 ? 'gasto' : 'gastos'}</span>
                                <span className="font-bold">{c.percentage.toFixed(1)}%</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid justify-items-center gap-2 py-12 text-center text-muted my-auto">
                      <Icon name="pie" size={32} className="text-muted/40 mb-1" />
                      <b className="text-navy text-sm">Sem categorias para exibir</b>
                      <span className="text-xs max-w-xs">Nenhum gasto encontrado para os filtros atuais.</span>
                    </div>
                  )}
                </article>

                {/* Gráfico 2: Linha do Tempo / Barras Diárias */}
                <article className="lg:col-span-6 bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                    <div>
                      <h3 className="font-display font-bold text-navy text-base sm:text-lg flex items-center gap-2 m-0">
                        <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                          <Icon name="chart" size={16} />
                        </span>
                        Evolução Temporal
                      </h3>
                      <p className="text-muted text-xs mt-0.5 mb-0">Gastos diários (clique em uma barra para filtrar o dia)</p>
                    </div>

                    {historyDateFilter && (
                      <button
                        type="button"
                        onClick={() => setHistoryDateFilter(null)}
                        className="text-xs text-blue hover:underline font-bold"
                      >
                        Ver todos os dias
                      </button>
                    )}
                  </div>

                  <div className="my-auto w-full">
                    <SpendingBarChart
                      data={timelineStats}
                      selectedDate={historyDateFilter}
                      onSelectDate={(dt) => setHistoryDateFilter(dt)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-line text-[11px] text-muted">
                    <span>Linha do tempo diária</span>
                    <span>Total de {timelineStats.length} {timelineStats.length === 1 ? 'dia com gastos' : 'dias com gastos'}</span>
                  </div>
                </article>
              </div>

              {/* 4. Lista Detalhada de Gastos Filtrados */}
              <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-line">
                  <div>
                    <h3 className="font-display font-bold text-navy text-base sm:text-lg flex items-center gap-2 m-0">
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                        <Icon name="clock" size={16} />
                      </span>
                      Lançamentos Detalhados
                    </h3>
                    <p className="text-muted text-xs mt-0.5 mb-0">
                      Exibindo {filteredExpenses.length} {filteredExpenses.length === 1 ? 'gasto encontrado' : 'gastos encontrados'}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-xl bg-[#e6f9f0] text-[#166534] font-bold text-xs sm:text-sm self-start sm:self-auto">
                    Total: {money(totalFiltered)}
                  </span>
                </div>

                <div className="flex flex-col divide-y divide-line mt-2">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((x) => {
                      const catName = detectCategory(x.description, x.category);
                      const catCfg = CATEGORY_CONFIG[catName] || CATEGORY_CONFIG['Outros'];

                      return (
                        <div key={x.id} className="flex justify-between items-center gap-3 py-3.5 group hover:bg-pale/50 px-2 rounded-xl transition-colors">
                          <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky text-blue shrink-0 group-hover:scale-105 transition-transform">
                            <Icon name={catCfg.icon || 'cart'} size={18} />
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="truncate text-navy text-xs sm:text-sm font-semibold">{x.description}</strong>
                              <span
                                className="inline-flex items-center gap-1 py-0.5 px-2 rounded-lg text-[10px] font-bold shrink-0"
                                style={{
                                  backgroundColor: catCfg.bg,
                                  color: catCfg.text,
                                  border: `1px solid ${catCfg.border}`
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catCfg.color }} />
                                {catName}
                              </span>
                            </div>
                            <small className="text-muted text-[11px] sm:text-xs block mt-0.5">{fmtDate(x.ts)}</small>
                          </div>

                          <span className="font-bold text-navy text-xs sm:text-sm whitespace-nowrap">{money(x.value)}</span>

                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(x.id)}
                            title="Excluir gasto"
                            className="text-muted hover:text-bad hover:bg-bad/10 p-2 rounded-xl transition-all shrink-0 active:scale-95"
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="grid justify-items-center gap-2 py-12 text-center text-muted">
                      <span className="grid place-items-center w-14 h-14 rounded-3xl bg-sky text-blue mb-2">
                        <Icon name="wallet" size={28} />
                      </span>
                      <b className="text-navy text-base">Nenhum gasto encontrado</b>
                      <span className="text-xs sm:text-sm max-w-sm">
                        {expenses.length === 0
                          ? 'Você ainda não registrou nenhum gasto. Adicione um gasto na tela inicial.'
                          : 'Nenhum lançamento corresponde aos filtros ou pesquisa selecionados.'}
                      </span>
                      {(historyCategoryFilter || historyDateFilter || historySearch || historyPeriod !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            setHistoryPeriod('all');
                            setHistoryCategoryFilter(null);
                            setHistoryDateFilter(null);
                            setHistorySearch('');
                          }}
                          className="mt-2 text-xs font-bold text-blue hover:underline"
                        >
                          Limpar filtros de busca
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </div>
          )}

          {/* Aba de Configurações do Usuário */}
          {view === 'settings' && (
            <div className="flex flex-col gap-6 animate-rise">
              {/* Cabeçalho do Perfil com Avatar */}
              <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                  {/* Foto de Perfil com botão interativo */}
                  <div className="relative group shrink-0">
                    <UserAvatar user={session} size={92} className="ring-4 ring-sky shadow-md" />

                    <label
                      htmlFor="avatar-file-input"
                      title="Alterar foto (máximo 5 MB)"
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-blue text-white shadow-lg cursor-pointer hover:bg-blue-dark transition-all transform hover:scale-110 active:scale-95"
                    >
                      <Icon name="camera" size={15} />
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/gif"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                      <h2 className="font-display font-extrabold text-xl sm:text-2xl text-navy truncate">
                        {session?.name || summary.user_name || 'Usuário'}
                      </h2>
                      <span className="inline-flex items-center self-center sm:self-auto gap-1.5 py-0.5 px-2.5 rounded-full bg-[#e6f9f0] text-[#166534] text-xs font-bold">
                        <Icon name="check" size={13} className="text-[#166534]" /> Conta Verificada
                      </span>
                    </div>

                    <p className="text-muted text-xs sm:text-sm mt-1">{session?.email}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3.5">
                      <label
                        htmlFor="avatar-file-input"
                        className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-line bg-pale hover:bg-sky text-navy text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Icon name="camera" size={14} className="text-blue" />
                        {avatarLoading ? 'Enviando imagem...' : 'Trocar foto de perfil'}
                      </label>

                      {session?.avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          disabled={avatarLoading}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-bad/30 bg-bad-bg/60 hover:bg-bad-bg text-bad text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Icon name="trash" size={14} /> Remover foto
                        </button>
                      )}
                    </div>
                    <small className="text-[11px] text-muted block mt-2">
                      Formatos aceitos: JPG, PNG, WebP. Limite máximo: <strong>5 MB</strong>.
                    </small>
                  </div>
                </div>
              </article>

              {/* Grid de Seções de Configuração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Dados Pessoais (Nome) */}
                <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] flex flex-col justify-between">
                  <div>
                    <h3 className="flex items-center gap-2.5 text-navy font-display font-bold text-base sm:text-lg mb-1">
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                        <Icon name="user" size={16} />
                      </span>
                      Dados do Perfil
                    </h3>
                    <p className="text-muted text-xs sm:text-sm m-0">Altere seu nome completo de exibição.</p>

                    <form onSubmit={handleUpdateProfileName} className="flex flex-col gap-4 mt-5">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="config-name" className="text-navy text-xs font-bold uppercase tracking-wider">Nome Completo</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                            <Icon name="user" size={18} />
                          </span>
                          <input
                            id="config-name"
                            type="text"
                            value={configName}
                            onChange={(e) => setConfigName(e.target.value)}
                            placeholder="Como prefere ser chamado?"
                            required
                            className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-navy text-xs font-bold uppercase tracking-wider">E-mail Cadastrado</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                            <Icon name="mail" size={18} />
                          </span>
                          <input
                            type="email"
                            value={session?.email || ''}
                            disabled
                            className="w-full border border-line/60 rounded-xl py-3 pl-11 pr-4 text-muted bg-pale/60 cursor-not-allowed text-sm"
                          />
                        </div>
                        <small className="text-[11px] text-muted">E-mail verificado para autenticação segura.</small>
                      </div>

                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="inline-flex justify-center items-center gap-2 rounded-xl py-3 px-5 font-bold text-white bg-blue hover:bg-blue-dark transition-all shadow-[0_6px_16px_rgba(47,143,220,0.22)] disabled:opacity-60 text-xs sm:text-sm mt-1 self-start"
                      >
                        <Icon name="check" size={16} />
                        {savingProfile ? 'Salvando...' : 'Salvar nome'}
                      </button>
                    </form>
                  </div>
                </article>

                {/* 2. Planejamento Financeiro / Orçamento Mensal */}
                <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] flex flex-col justify-between">
                  <div>
                    <h3 className="flex items-center gap-2.5 text-navy font-display font-bold text-base sm:text-lg mb-1">
                      <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                        <Icon name="wallet" size={16} />
                      </span>
                      Orçamento Mensal
                    </h3>
                    <p className="text-muted text-xs sm:text-sm m-0">Ajuste seu limite financeiro para o mês atual.</p>

                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateBudget(configBudget); }} className="flex flex-col gap-4 mt-5">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#eaf6ff] to-[#f4faff] border border-blue/20">
                        <div className="flex justify-between items-center text-xs text-muted">
                          <span>Orçamento ativo</span>
                          <span className="font-semibold text-navy">{money(summary.total_spent)} já gastos</span>
                        </div>
                        <strong className="text-2xl font-display font-extrabold text-navy block mt-0.5">
                          {money(summary.user_budget ?? session?.budget)}
                        </strong>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="config-budget" className="text-navy text-xs font-bold uppercase tracking-wider">Novo Orçamento (R$)</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                            <Icon name="wallet" size={18} />
                          </span>
                          <input
                            id="config-budget"
                            type="number"
                            min="0"
                            step="0.01"
                            value={configBudget}
                            onChange={(e) => setConfigBudget(e.target.value)}
                            placeholder="R$ 0,00"
                            required
                            className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-sm font-semibold"
                          />
                        </div>
                      </div>

                      {/* Botões de atalho rápido */}
                      <div className="flex flex-wrap gap-2">
                        {[100, 250, 500, 1000].map((add) => (
                          <button
                            key={add}
                            type="button"
                            onClick={() => {
                              const cur = Number(configBudget) || 0;
                              setConfigBudget(String(cur + add));
                            }}
                            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-line bg-pale text-navy hover:bg-sky hover:border-blue/30 transition-all active:scale-95"
                          >
                            +{money(add)}
                          </button>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={savingBudget}
                        className="inline-flex justify-center items-center gap-2 rounded-xl py-3 px-5 font-bold text-white bg-blue hover:bg-blue-dark transition-all shadow-[0_6px_16px_rgba(47,143,220,0.22)] disabled:opacity-60 text-xs sm:text-sm mt-1 self-start"
                      >
                        <Icon name="check" size={16} />
                        {savingBudget ? 'Salvando...' : 'Salvar orçamento'}
                      </button>
                    </form>
                  </div>
                </article>

                {/* 3. Segurança & Alterar Senha */}
                <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] md:col-span-2">
                  <h3 className="flex items-center gap-2.5 text-navy font-display font-bold text-base sm:text-lg mb-1">
                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                      <Icon name="lock" size={16} />
                    </span>
                    Segurança da Conta & Alterar Senha
                  </h3>
                  <p className="text-muted text-xs sm:text-sm m-0">Altere sua senha de acesso a qualquer momento digitando a senha atual para validação.</p>

                  <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="curr-pw" className="text-navy text-xs font-bold uppercase tracking-wider">Senha Atual</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                          <Icon name="lock" size={18} />
                        </span>
                        <input
                          id="curr-pw"
                          type={showConfigCurrPw ? 'text' : 'password'}
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          placeholder="Sua senha atual"
                          required
                          className="w-full border border-line rounded-xl py-3 pl-11 pr-11 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfigCurrPw(!showConfigCurrPw)}
                          className="absolute right-2 text-muted hover:text-blue p-2 rounded-lg transition-colors"
                        >
                          <Icon name={showConfigCurrPw ? 'eyeoff' : 'eye'} size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="new-pw" className="text-navy text-xs font-bold uppercase tracking-wider">Nova Senha</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                          <Icon name="lock" size={18} />
                        </span>
                        <input
                          id="new-pw"
                          type={showConfigNewPw ? 'text' : 'password'}
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          required
                          minLength={8}
                          className="w-full border border-line rounded-xl py-3 pl-11 pr-11 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfigNewPw(!showConfigNewPw)}
                          className="absolute right-2 text-muted hover:text-blue p-2 rounded-lg transition-colors"
                        >
                          <Icon name={showConfigNewPw ? 'eyeoff' : 'eye'} size={16} />
                        </button>
                      </div>
                      {newPw && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                            <span className="block h-full transition-all duration-300" style={{ width: `${getStrength(newPw).w}%`, background: getStrength(newPw).color }} />
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: getStrength(newPw).color }}>{getStrength(newPw).label}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="confirm-new-pw" className="text-navy text-xs font-bold uppercase tracking-wider">Confirmar Nova Senha</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                          <Icon name="check" size={18} />
                        </span>
                        <input
                          id="confirm-new-pw"
                          type={showConfigNewPw ? 'text' : 'password'}
                          value={confirmNewPw}
                          onChange={(e) => setConfirmNewPw(e.target.value)}
                          placeholder="Repita a nova senha"
                          required
                          minLength={8}
                          className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-3 flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={savingPw}
                        className="inline-flex justify-center items-center gap-2 rounded-xl py-3 px-6 font-bold text-white bg-blue hover:bg-blue-dark transition-all shadow-[0_6px_16px_rgba(47,143,220,0.22)] disabled:opacity-60 text-xs sm:text-sm"
                      >
                        <Icon name="lock" size={16} />
                        {savingPw ? 'Alterando senha...' : 'Atualizar senha'}
                      </button>
                    </div>
                  </form>
                </article>

                {/* 4. Informações da Conta & Sessão */}
                <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)] md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display font-bold text-navy text-sm sm:text-base m-0">Conta Azulize</h4>
                    <p className="text-muted text-xs sm:text-sm mt-0.5 mb-0">
                      {session?.email || 'Controle de gastos pessoais'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 border border-bad/30 bg-bad-bg/60 text-bad hover:bg-bad hover:text-white rounded-xl py-2.5 px-5 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
                  >
                    <Icon name="out" size={16} /> Encerrar sessão
                  </button>
                </article>
              </div>
            </div>
          )}

          {/* Modal de Alteração Rápida de Orçamento */}
          {editBudgetOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm animate-rise">
              <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-line animate-pop">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-extrabold text-lg text-navy flex items-center gap-2">
                    <span className="grid place-items-center w-8 h-8 rounded-xl bg-sky text-blue">
                      <Icon name="wallet" size={18} />
                    </span>
                    Alterar Orçamento Mensal
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditBudgetOpen(false)}
                    className="text-muted hover:text-navy p-1.5 rounded-lg hover:bg-pale transition-colors cursor-pointer"
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-muted mb-4">
                  Defina seu limite mensal de gastos. Seu saldo e gráficos serão recalculados imediatamente.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdateBudget(quickBudgetVal); }}>
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-navy text-xs font-bold uppercase tracking-wider">Novo Orçamento (R$)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
                        <Icon name="wallet" size={18} />
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={quickBudgetVal}
                        onChange={(e) => setQuickBudgetVal(e.target.value)}
                        placeholder="0,00"
                        required
                        autoFocus
                        className="w-full border border-line rounded-xl py-3 pl-11 pr-4 outline-none text-ink bg-pale focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all font-semibold text-lg"
                      />
                    </div>
                  </div>

                  {/* Atalhos rápidos */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[100, 200, 500, 1000].map((add) => (
                      <button
                        key={add}
                        type="button"
                        onClick={() => {
                          const current = Number(quickBudgetVal) || 0;
                          setQuickBudgetVal(String(current + add));
                        }}
                        className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-line bg-pale text-navy hover:bg-sky hover:border-blue/30 transition-all active:scale-95"
                      >
                        +{money(add)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setQuickBudgetVal('')}
                      className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-line bg-pale text-muted hover:text-bad hover:bg-bad-bg/40 transition-all"
                    >
                      Limpar
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setEditBudgetOpen(false)}
                      className="py-2.5 px-4 rounded-xl border border-line text-xs sm:text-sm font-bold text-muted hover:bg-pale transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingBudget}
                      className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue text-white text-xs sm:text-sm font-bold hover:bg-blue-dark transition-all shadow-[0_6px_16px_rgba(47,143,220,0.25)] disabled:opacity-60 cursor-pointer"
                    >
                      <Icon name="check" size={16} />
                      {savingBudget ? 'Salvando...' : 'Salvar orçamento'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
