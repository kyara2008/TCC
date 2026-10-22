"use strict";
/* Azulize — Controle de Gastos
   Conectado 100% diretamente ao Neon Serverless PostgreSQL
   Autenticação com Envio de Código por E-mail via Google SMTP */

const app = document.querySelector("#app");
const K = {
  session: "azulize:session_user"
};

// Remove chaves antigas de localStorage do modo legado sem banco
try {
  ["azulize:users", "azulize:session", "azulize:reset", "azulize:reset_data"].forEach((k) => localStorage.removeItem(k));
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("azulize:expenses:")) localStorage.removeItem(k);
  }
} catch (e) {}

// Detecta automaticamente o endereço do back-end (porta 3000 ou via Live Server / file://)
const API_BASE = (window.location.protocol.startsWith("http") && window.location.port === "3000")
  ? ""
  : "http://localhost:3000";

/* ---------- utilidades ---------- */
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = (s) => document.querySelector(s);

// Cliente centralizado de comunicação com o Neon PostgreSQL
async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const user = read(K.session, null);
  const headers = {
    "Content-Type": "application/json",
    ...(user?.id ? { "x-user-id": user.id } : {}),
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
    if (err.name === "TypeError" && (err.message.includes("fetch") || err.message.includes("NetworkError"))) {
      throw new Error("Não foi possível conectar ao back-end. Execute 'npm start' no terminal para subir o servidor.");
    }
    throw err;
  }
}

const P = {
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 018 0v3",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  wallet: "M3 7h15a3 3 0 013 3v8a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l12-3v3M17 14h2",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  eyeoff: "M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.7M6.6 6.7A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004-.9",
  home: "M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  out: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus: "M12 5v14M5 12h14",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  cart: "M3 4h2l2.5 11h10L20 7H6M9 20v.01M17 20v.01",
  key: "M15 8a4 4 0 11-2 3.4L4 20v-3H1v-3h3l7-7M16 7v.01",
  back: "M15 18l-6-6 6-6",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  check: "M5 13l4 4L19 7",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  database: "M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3v12c0 1.66-3.58 3-8 3s-8-1.34-8-3V6zm0 6c0 1.66 3.58 3 8 3s8-1.34 8-3M4 18c0 1.66 3.58 3 8 3s8-1.34 8-3"
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;

let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

function say(text, ok = false) {
  const m = $("#msg");
  if (!m) return;
  m.className = "msg" + (ok ? " ok" : "");
  m.textContent = "";
  void m.offsetWidth;
  m.textContent = text;
}

/* ---------- validação ---------- */
const validEmail = (e) => /^[^\s@.][^\s@]*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(e) && !e.includes("..");

function strength(pw) {
  if (!pw) return { n: 0, label: "", color: "", w: 0 };
  const types = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (pw.length >= 8 && types === 4) return { label: "Forte", color: "var(--ok)", w: 100 };
  if (types >= 2 && /[A-Za-z]/.test(pw) && /\d/.test(pw)) return { label: "Média", color: "var(--warn)", w: 66 };
  if (types >= 2) return { label: "Média", color: "var(--warn)", w: 60 };
  return { label: "Fraca", color: "var(--bad)", w: 33 };
}

function bindMeter(id) {
  const input = $(`#${id}`), box = $("#meter");
  if (!input || !box) return;
  input.addEventListener("input", () => {
    const s = strength(input.value);
    box.classList.toggle("show", !!input.value);
    box.querySelector("span").style.cssText = `width:${s.w}%;background:${s.color}`;
    const l = box.querySelector(".meter-label");
    l.textContent = s.label;
    l.style.color = s.color;
  });
}

function bindEyes() {
  document.querySelectorAll(".eye").forEach((b) =>
    b.addEventListener("click", () => {
      const i = $(`#${b.dataset.for}`), show = i.type === "password";
      i.type = show ? "text" : "password";
      b.innerHTML = icon(show ? "eyeoff" : "eye");
      b.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    })
  );
}

const pwField = (id, label, ph, auto, meter) =>
  `<div class="field"><label for="${id}">${label}</label><div class="input-wrap">${icon("lock")}<input id="${id}" type="password" required minlength="8" autocomplete="${auto}" placeholder="${ph}" /><button class="eye" type="button" data-for="${id}" aria-label="Mostrar senha">${icon("eye")}</button></div>${
    meter ? `<div class="meter" id="meter"><div class="meter-bar"><span></span></div><b class="meter-label"></b></div>` : ""
  }</div>`;

const logo = () => `<div class="logo"><span class="logo-mark">${icon("wallet")}</span> Azulize</div>`;

/* ---------- autenticação (100% no Neon PostgreSQL + Google SMTP) ---------- */
function auth(mode = "login", info = "") {
  const create = mode === "create";
  const head = (t, s) => `${logo()}<h1>${t}</h1><p class="subtitle">${s}</p>`;
  const emailField = `<div class="field"><label for="email">E-mail</label><div class="input-wrap">${icon("mail")}<input id="email" type="email" required autocomplete="email" placeholder="voce@email.com" /></div></div>`;

  // 1. Tela de confirmação de e-mail ao criar conta
  if (mode === "verify_register") {
    const rec = typeof info === "object" ? info : { email: "", code: info };
    app.innerHTML = `<section class="auth-card">
      ${head("Confirme seu e-mail", "Enviamos um código de 6 dígitos para o seu endereço de e-mail.")}
      ${rec?.code ? `<div class="mail-sim">${icon("mail")}<div>Código enviado para <b>${esc(rec.email)}</b>:<strong>${esc(rec.code)}</strong><small style="color:var(--muted);display:block;margin-top:4px">Código de teste (configure EMAIL_USER e EMAIL_PASS no .env para envio via Google SMTP)</small></div></div>` : `<div class="mail-sim">${icon("mail")}<div>Código enviado para <b>${esc(rec.email)}</b> via <strong>Google SMTP</strong>.<br/><small style="color:var(--muted)">Verifique sua caixa de entrada e pasta de spam.</small></div></div>`}
      <form class="form" id="f" novalidate>
        <div class="field">
          <label for="code">Código de verificação</label>
          <input id="code" class="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" value="${esc(rec?.code || "")}" required />
        </div>
        <p class="msg" id="msg"></p>
        <button class="primary" type="submit">${icon("check")} Confirmar e ativar conta</button>
      </form>
      <p class="form-footer"><button class="link" type="button" id="back">Voltar ao cadastro</button></p>
    </section>`;

    $("#back").onclick = () => auth("create");
    $("#f").onsubmit = async (e) => {
      e.preventDefault();
      const code = $("#code").value.trim();
      if (code.length !== 6) return say("Digite os 6 dígitos do código recebido por e-mail.");

      const btn = $("#f button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Ativando conta no Neon...";

      try {
        const data = await api("/api/auth/register-confirm", {
          method: "POST",
          body: JSON.stringify({ email: rec.email, code })
        });
        write(K.session, data.user);
        toast("Conta ativada com sucesso no Neon PostgreSQL!");
        dashboard();
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = `${icon("check")} Confirmar e ativar conta`;
        say(err.message);
      }
    };
    return;
  }

  // 2. Tela de solicitar recuperação de senha
  if (mode === "forgot") {
    app.innerHTML = `<section class="auth-card">
      ${head("Recuperar senha", "Informe o e-mail cadastrado para receber um código de 6 dígitos via Google SMTP.")}
      <form class="form" id="f" novalidate>
        ${emailField}
        <p class="msg" id="msg"></p>
        <button class="primary" type="submit">${icon("send")} Enviar código por e-mail</button>
      </form>
      <p class="form-footer"><button class="link" type="button" id="back">Voltar ao login</button></p>
    </section>`;

    $("#back").onclick = () => auth();
    $("#f").onsubmit = async (e) => {
      e.preventDefault();
      const email = $("#email").value.trim().toLowerCase();
      if (!validEmail(email)) return say("Digite um e-mail válido.");

      const btn = $("#f button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Enviando código por e-mail...";

      try {
        const data = await api("/api/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email })
        });
        auth("reset", { email, code: data.code, simulated: data.simulated });
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = `${icon("send")} Enviar código por e-mail`;
        say(err.message);
      }
    };
    return;
  }

  // 3. Tela de redefinir a senha com o código
  if (mode === "reset") {
    const rec = typeof info === "object" ? info : { email: "", code: info };
    app.innerHTML = `<section class="auth-card">
      ${head("Nova senha", "Digite o código recebido no seu e-mail e escolha uma nova senha.")}
      ${rec?.code ? `<div class="mail-sim">${icon("mail")}<div>Código para <b>${esc(rec?.email || "")}</b>:<strong>${esc(rec?.code || "")}</strong><small style="color:var(--muted);display:block;margin-top:4px">Código de teste (configure EMAIL_USER e EMAIL_PASS no .env para envio real)</small></div></div>` : `<div class="mail-sim">${icon("mail")}<div>Código enviado para <b>${esc(rec?.email || "")}</b> via <strong>Google SMTP</strong>.<br/><small style="color:var(--muted)">Verifique sua caixa de entrada e pasta de spam.</small></div></div>`}
      <form class="form" id="f" novalidate>
        <div class="field"><label for="code">Código de 6 dígitos</label><input id="code" class="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" value="${esc(rec?.code || "")}" required /></div>
        ${pwField("password", "Nova senha", "Mínimo de 8 caracteres", "new-password", true)}
        <p class="msg" id="msg"></p>
        <button class="primary" type="submit">${icon("check")} Redefinir senha</button>
      </form>
      <p class="form-footer"><button class="link" type="button" id="back">Cancelar</button></p>
    </section>`;
    bindMeter("password");
    bindEyes();
    $("#back").onclick = () => auth();
    $("#f").onsubmit = async (e) => {
      e.preventDefault();
      const code = $("#code").value.trim(), pw = $("#password").value;
      if (code.length !== 6) return say("Código incorreto. Digite os 6 dígitos.");
      if (pw.length < 8) return say("A senha precisa ter no mínimo 8 caracteres.");

      const btn = $("#f button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Atualizando senha no Neon...";

      try {
        const data = await api("/api/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ email: rec.email, code, newPassword: pw })
        });
        auth("login", data.message || "Senha alterada no Neon! Entre com sua nova senha.");
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = `${icon("check")} Redefinir senha`;
        say(err.message);
      }
    };
    return;
  }

  // 4. Telas de Login e Cadastro (com solicitação de código)
  app.innerHTML = `<section class="auth-card">
    ${head(create ? "Crie sua conta" : "Bem-vindo de volta", create ? "Um código de autenticação será enviado ao seu e-mail." : "Entre para acompanhar seus gastos no Neon.")}
    <form class="form" id="f" novalidate>
      ${create ? `<div class="field"><label for="name">Nome completo</label><div class="input-wrap">${icon("user")}<input id="name" required autocomplete="name" placeholder="Como podemos chamar você?" /></div></div>` : ""}
      ${emailField}
      ${pwField("password", "Senha", "Mínimo de 8 caracteres", create ? "new-password" : "current-password", create)}
      ${create ? `<div class="field"><label for="budget">Orçamento mensal</label><div class="input-wrap">${icon("wallet")}<input id="budget" type="number" min="0" step="0.01" required placeholder="R$ 0,00" /></div></div>` : `<div class="row-end"><button class="link" type="button" id="forgot">Esqueci minha senha</button></div>`}
      <p class="msg ${info ? "ok" : ""}" id="msg">${esc(info)}</p>
      <button class="primary" type="submit">${create ? "Enviar código por e-mail" : "Entrar"}</button>
    </form>
    <p class="form-footer">${create ? "Já possui uma conta?" : "Ainda não possui uma conta?"} <button class="link" type="button" id="switch">${create ? "Entrar" : "Criar conta"}</button></p>
  </section>`;

  bindEyes();
  if (create) bindMeter("password");
  $("#switch").onclick = () => auth(create ? "login" : "create");
  if (!create) $("#forgot").onclick = () => auth("forgot");

  $("#f").onsubmit = async (e) => {
    e.preventDefault();
    const email = $("#email").value.trim().toLowerCase(), pw = $("#password").value;
    if (!validEmail(email)) return say("Digite um e-mail válido, como voce@email.com.");
    if (pw.length < 8) return say("A senha precisa ter no mínimo 8 caracteres.");

    const btn = $("#f button[type=submit]");
    btn.disabled = true;

    try {
      if (create) {
        const budget = Number($("#budget").value), name = $("#name").value.trim();
        if (!name) { btn.disabled = false; return say("Informe seu nome."); }
        if (!(budget >= 0) || $("#budget").value === "") { btn.disabled = false; return say("Informe um orçamento mensal válido."); }

        btn.textContent = "Enviando código por e-mail...";
        const data = await api("/api/auth/register-request", {
          method: "POST",
          body: JSON.stringify({ name, email, password: pw, budget })
        });

        // Transiciona para a tela de confirmação de código
        auth("verify_register", { email, code: data.code, simulated: data.simulated });
      } else {
        btn.textContent = "Conectando ao banco Neon...";
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password: pw })
        });
        write(K.session, data.user);
        dashboard();
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = create ? "Enviar código por e-mail" : "Entrar";
      say(err.message);
    }
  };
}

/* ---------- painel principal (100% carregado do Neon) ---------- */
let view = "home";
const fmtDate = (iso) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

const rowHTML = (x) => `<div class="expense" data-id="${esc(x.id)}">
  <span class="ex-icon">${icon("cart")}</span>
  <div class="ex-info">
    <strong>${esc(x.description)}</strong>
    <small>${fmtDate(x.ts)}</small>
  </div>
  <span class="ex-val">${money(x.value)}</span>
  <button class="btn-del" type="button" data-del="${esc(x.id)}" title="Excluir gasto do banco Neon">&times;</button>
</div>`;

const emptyHTML = `<div class="empty">${icon("wallet")}<b>Nenhum gasto registrado</b><span>Adicione seu primeiro gasto para enviar ao Neon Postgres.</span></div>`;

async function dashboard() {
  const sessionUser = read(K.session, null);
  if (!sessionUser || !sessionUser.id) {
    localStorage.removeItem(K.session);
    return auth();
  }

  // Busca dados em tempo real direto do Neon PostgreSQL
  let summary = {
    user_name: sessionUser.name,
    user_budget: sessionUser.budget || 0,
    total_spent: 0,
    balance: sessionUser.budget || 0,
    budget_used_percentage: 0
  };
  let all = [];

  try {
    const [sumData, expData] = await Promise.all([
      api(`/api/user/summary?userId=${sessionUser.id}`),
      api(`/api/expenses?userId=${sessionUser.id}`)
    ]);
    summary = sumData;
    all = expData;
  } catch (err) {
    console.warn("Aviso ao carregar dados do Neon:", err.message);
  }

  const balance = summary.balance;
  const neg = balance < 0;
  const pct = Math.min(100, Math.max(0, summary.budget_used_percentage || 0));
  const barColor = neg ? "var(--bad)" : pct > 80 ? "var(--warn)" : "var(--ok)";

  const home = `<div class="grid">
    <article class="panel">
      <h2>${icon("wallet")} Seu saldo do mês</h2>
      <p>Calculado diretamente pelo Neon PostgreSQL.</p>
      <div class="balance ${neg ? "negative" : ""}" id="bal">
        <span>Saldo disponível</span>
        <strong>${money(balance)}</strong>
        <div class="progress"><i style="width:${pct}%;background:${barColor}"></i></div>
        <div class="stats">
          <span>Gasto: ${money(summary.total_spent)}</span>
          <span>Orçamento: ${money(summary.user_budget)}</span>
        </div>
        ${neg ? `<div class="alert" role="alert">${icon("alert")} Atenção: você ultrapassou o orçamento em ${money(-balance)}.</div>` : ""}
      </div>
      <h2 style="font-size:16px">Últimos gastos</h2>
      <div class="expense-list">${all.length ? all.slice(0, 5).map(rowHTML).join("") : emptyHTML}</div>
    </article>
    <article class="panel">
      <h2>${icon("plus")} Adicionar gasto</h2>
      <p>Registre cada compra diretamente no Neon Postgres.</p>
      <form class="form" id="xf" style="margin-top:20px">
        <div class="field"><label for="description">Descrição</label><div class="input-wrap">${icon("cart")}<input id="description" required maxlength="60" placeholder="Ex.: Mercado, Restaurante" /></div></div>
        <div class="field"><label for="value">Valor</label><div class="input-wrap">${icon("wallet")}<input id="value" type="number" min="0.01" step="0.01" required placeholder="R$ 0,00" /></div></div>
        <button class="primary" type="submit">${icon("plus")} Salvar no Neon PostgreSQL</button>
      </form>
    </article>
  </div>`;

  const hist = `<article class="panel">
    <h2>${icon("clock")} Histórico de gastos</h2>
    <p>${all.length} ${all.length === 1 ? "registro gravado no banco" : "registros gravados no banco"} · total geral ${money(all.reduce((s, x) => s + x.value, 0))}</p>
    <div class="expense-list">${all.length ? all.map(rowHTML).join("") : emptyHTML}</div>
  </article>`;

  app.innerHTML = `<section class="dashboard">
    <header class="topbar">
      <div>
        ${logo()}
        <p class="hello">Olá, <strong>${esc(summary.user_name || sessionUser.name)}</strong>. Seus dados estão salvos no Neon.</p>
        <span class="db-badge"><span class="dot"></span> Neon PostgreSQL Conectado</span>
      </div>
      <button class="btn-ghost" id="logout">${icon("out")} Sair</button>
    </header>
    <nav class="tabs">
      <button class="tab ${view === "home" ? "active" : ""}" data-v="home">${icon("home")} Início</button>
      <button class="tab ${view === "hist" ? "active" : ""}" data-v="hist">${icon("clock")} Histórico</button>
    </nav>
    ${view === "home" ? home : hist}
  </section>`;

  $("#logout").onclick = () => {
    localStorage.removeItem(K.session);
    view = "home";
    auth();
  };

  document.querySelectorAll(".tab").forEach((t) => {
    t.onclick = () => {
      view = t.dataset.v;
      dashboard();
    };
  });

  // Exclusão de gasto com DELETE no Neon
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = async () => {
      const expId = btn.dataset.del;
      btn.disabled = true;
      try {
        await api(`/api/expenses/${expId}`, { method: "DELETE" });
        toast("Gasto excluído do banco Neon!");
        await dashboard();
      } catch (err) {
        btn.disabled = false;
        toast(err.message);
      }
    };
  });

  // Cadastro de novo gasto com INSERT no Neon
  const xf = $("#xf");
  if (xf) {
    xf.onsubmit = async (e) => {
      e.preventDefault();
      const description = $("#description").value.trim();
      const value = Math.round(Number($("#value").value) * 100) / 100;
      if (!description || !(value > 0)) {
        return toast("Informe uma descrição e um valor maior que zero.");
      }

      const submitBtn = xf.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      submitBtn.textContent = "Gravando no Neon...";

      try {
        await api("/api/expenses", {
          method: "POST",
          body: JSON.stringify({ userId: sessionUser.id, description, value })
        });
        await dashboard();
        const balEl = $("#bal");
        if (balEl) balEl.classList.add("pop");
        toast(`Gasto de ${money(value)} gravado com sucesso no Neon!`);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `${icon("plus")} Salvar no Neon PostgreSQL`;
        toast(err.message);
      }
    };
  }
}

// Inicialização: se há sessão salva, valida com o servidor e entra no painel
(async function init() {
  const sessionUser = read(K.session, null);
  if (sessionUser?.id) {
    try {
      const verified = await api(`/api/user/me?userId=${sessionUser.id}`);
      write(K.session, verified);
      dashboard();
      return;
    } catch {
      localStorage.removeItem(K.session);
    }
  }
  auth();
})();
