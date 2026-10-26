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
  image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21'
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
      const res = await api('/api/user/budget', {
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

    setLoading(true);
    try {
      await api('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({ userId: session.id, description: desc, value: val })
      });
      setNewDesc('');
      setNewVal('');
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

  // Render do Logo
  const Logo = () => (
    <div className="flex items-center gap-2.5 mb-6 font-display font-extrabold text-xl sm:text-2xl text-navy tracking-tight select-none">
      <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white bg-gradient-to-br from-[#52a9ee] to-blue shadow-[0_6px_16px_rgba(47,143,220,0.35)] shrink-0">
        <Icon name="wallet" size={20} />
      </span>
      <span>Azulize</span>
    </div>
  );

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
                      expenses.slice(0, 5).map((x) => (
                        <div key={x.id} className="flex justify-between items-center gap-3 py-3 group">
                          <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky text-blue shrink-0 group-hover:scale-105 transition-transform">
                            <Icon name="cart" size={18} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <strong className="block truncate text-navy text-xs sm:text-sm font-semibold">{x.description}</strong>
                            <small className="text-muted text-[11px] sm:text-xs">{fmtDate(x.ts)}</small>
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
                      ))
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

          {/* Aba de Histórico */}
          {view === 'hist' && (
            <article className="bg-white/95 backdrop-blur-sm border border-line rounded-3xl p-5 sm:p-7 shadow-[0_15px_45px_rgba(34,111,163,0.08)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-line">
                <div>
                  <h2 className="flex items-center gap-2.5 text-navy font-display font-bold text-base sm:text-lg mb-0.5">
                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-sky text-blue">
                      <Icon name="clock" size={16} />
                    </span>
                    Histórico de gastos
                  </h2>
                  <p className="text-muted text-xs sm:text-sm m-0">Todos os gastos registrados na sua conta.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-xl bg-sky text-navy font-bold text-xs sm:text-sm">
                    {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-xl bg-[#e6f9f0] text-[#166534] font-bold text-xs sm:text-sm">
                    Total: {money(expenses.reduce((s, x) => s + x.value, 0))}
                  </span>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-line mt-2">
                {expenses.length > 0 ? (
                  expenses.map((x) => (
                    <div key={x.id} className="flex justify-between items-center gap-3 py-3.5 group hover:bg-pale/50 px-2 rounded-xl transition-colors">
                      <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky text-blue shrink-0 group-hover:scale-105 transition-transform">
                        <Icon name="cart" size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <strong className="block truncate text-navy text-xs sm:text-sm font-semibold">{x.description}</strong>
                        <small className="text-muted text-[11px] sm:text-xs">{fmtDate(x.ts)}</small>
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
                  ))
                ) : (
                  <div className="grid justify-items-center gap-2 py-12 text-center text-muted">
                    <span className="grid place-items-center w-14 h-14 rounded-3xl bg-sky text-blue mb-2">
                      <Icon name="wallet" size={28} />
                    </span>
                    <b className="text-navy text-base">Nenhum gasto registrado ainda</b>
                    <span className="text-xs sm:text-sm max-w-sm">Quando você adicionar despesas no painel inicial, elas aparecerão listadas em ordem cronológica aqui.</span>
                  </div>
                )}
              </div>
            </article>
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
