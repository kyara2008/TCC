"use strict";
/* Azulize — HTML/CSS/JS puro com localStorage.
   Senhas: PBKDF2-SHA256 com salt (Web Crypto). Nunca ficam em texto puro. */

const app = document.querySelector("#app");
const K = { users: "azulize:users", session: "azulize:session", reset: "azulize:reset", ex: (e) => `azulize:expenses:${e}` };
const CODE_TTL = 10 * 60 * 1000;

/* ---------- utilidades ---------- */
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = (s) => document.querySelector(s);

const P = {
  mail: "M4 6h16v12H4zM4 7l8 6 8-6", lock: "M6 11h12v9H6zM8 11V8a4 4 0 018 0v3", user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  wallet: "M3 7h15a3 3 0 013 3v8a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l12-3v3M17 14h2", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  eyeoff: "M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.7M6.6 6.7A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004-.9",
  home: "M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z", clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2", out: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus: "M12 5v14M5 12h14", alert: "M12 3l10 18H2zM12 10v5M12 18v.01", cart: "M3 4h2l2.5 11h10L20 7H6M9 20v.01M17 20v.01", key: "M15 8a4 4 0 11-2 3.4L4 20v-3H1v-3h3l7-7M16 7v.01",
  back: "M15 18l-6-6 6-6", send: "M22 2L11 13M22 2l-7 20-4-9-9-4z", check: "M5 13l4 4L19 7",
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;

let toastTimer;
function toast(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}
function say(text, ok = false) { const m = $("#msg"); m.className = "msg" + (ok ? " ok" : ""); m.textContent = ""; void m.offsetWidth; m.textContent = text; }

/* ---------- segurança ---------- */
const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (h) => new Uint8Array(h.match(/../g).map((x) => parseInt(x, 16)));
const newSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));
async function hashPw(pw, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  return toHex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromHex(salt), iterations: 150000, hash: "SHA-256" }, key, 256));
}
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
  input.addEventListener("input", () => {
    const s = strength(input.value);
    box.classList.toggle("show", !!input.value);
    box.querySelector("span").style.cssText = `width:${s.w}%;background:${s.color}`;
    const l = box.querySelector(".meter-label"); l.textContent = s.label; l.style.color = s.color;
  });
}
function bindEyes() {
  document.querySelectorAll(".eye").forEach((b) => b.addEventListener("click", () => {
    const i = $(`#${b.dataset.for}`), show = i.type === "password";
    i.type = show ? "text" : "password"; b.innerHTML = icon(show ? "eyeoff" : "eye"); b.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  }));
}
const pwField = (id, label, ph, auto, meter) => `<div class="field"><label for="${id}">${label}</label><div class="input-wrap">${icon("lock")}<input id="${id}" type="password" required minlength="8" autocomplete="${auto}" placeholder="${ph}" /><button class="eye" type="button" data-for="${id}" aria-label="Mostrar senha">${icon("eye")}</button></div>${meter ? `<div class="meter" id="meter"><div class="meter-bar"><span></span></div><b class="meter-label"></b></div>` : ""}</div>`;
const logo = () => `<div class="logo"><span class="logo-mark">${icon("wallet")}</span> Azulize</div>`;

/* ---------- autenticação ---------- */
function auth(mode = "login", info = "") {
  const create = mode === "create";
  const head = (t, s) => `${logo()}<h1>${t}</h1><p class="subtitle">${s}</p>`;
  const emailField = `<div class="field"><label for="email">E-mail</label><div class="input-wrap">${icon("mail")}<input id="email" type="email" required autocomplete="email" placeholder="voce@email.com" /></div></div>`;

  if (mode === "forgot") {
    app.innerHTML = `<section class="auth-card">${head("Recuperar senha", "Informe o e-mail cadastrado para receber um código de 6 dígitos.")}<form class="form" id="f" novalidate>${emailField}<p class="msg" id="msg"></p><button class="primary" type="submit">${icon("send")} Enviar código</button></form><p class="form-footer"><button class="link" type="button" id="back">Voltar ao login</button></p></section>`;
    $("#back").onclick = () => auth();
    $("#f").onsubmit = (e) => {
      e.preventDefault();
      const email = $("#email").value.trim().toLowerCase();
      if (!validEmail(email)) return say("Digite um e-mail válido.");
      if (!read(K.users, {})[email]) return say("Não encontramos uma conta com esse e-mail.");
      const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
      write(K.reset, { email, code, exp: Date.now() + CODE_TTL });
      auth("reset", code);
    };
    return;
  }
  if (mode === "reset") {
    const r = read(K.reset, null);
    app.innerHTML = `<section class="auth-card">${head("Nova senha", "Digite o código recebido e escolha uma nova senha.")}
      <div class="mail-sim">${icon("mail")}<div>E-mail simulado para <b>${esc(r?.email || "")}</b>. Seu código (válido por 10 minutos):<strong>${esc(info)}</strong></div></div>
      <form class="form" id="f" novalidate><div class="field"><label for="code">Código de 6 dígitos</label><input id="code" class="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" required /></div>
      ${pwField("password", "Nova senha", "Mínimo de 8 caracteres", "new-password", true)}<p class="msg" id="msg"></p><button class="primary" type="submit">${icon("check")} Redefinir senha</button></form>
      <p class="form-footer"><button class="link" type="button" id="back">Cancelar</button></p></section>`;
    bindMeter("password"); bindEyes();
    $("#back").onclick = () => { localStorage.removeItem(K.reset); auth(); };
    $("#f").onsubmit = async (e) => {
      e.preventDefault();
      const rec = read(K.reset, null), code = $("#code").value.trim(), pw = $("#password").value;
      if (!rec || Date.now() > rec.exp) { localStorage.removeItem(K.reset); return say("O código expirou. Peça um novo código."); }
      if (code !== rec.code) return say("Código incorreto. Confira os 6 dígitos.");
      if (pw.length < 8) return say("A senha precisa ter no mínimo 8 caracteres.");
      const users = read(K.users, {}), u = users[rec.email];
      u.salt = newSalt(); u.hash = await hashPw(pw, u.salt);
      write(K.users, users); localStorage.removeItem(K.reset);
      auth("login", "Senha alterada! Entre com a nova senha.");
    };
    return;
  }

  app.innerHTML = `<section class="auth-card">${head(create ? "Crie sua conta" : "Bem-vindo de volta", create ? "Organize sua vida financeira de um jeito simples." : "Entre para acompanhar seus gastos.")}
    <form class="form" id="f" novalidate>
      ${create ? `<div class="field"><label for="name">Nome completo</label><div class="input-wrap">${icon("user")}<input id="name" required autocomplete="name" placeholder="Como podemos chamar você?" /></div></div>` : ""}
      ${emailField}${pwField("password", "Senha", "Mínimo de 8 caracteres", create ? "new-password" : "current-password", create)}
      ${create ? `<div class="field"><label for="budget">Orçamento mensal</label><div class="input-wrap">${icon("wallet")}<input id="budget" type="number" min="0" step="0.01" required placeholder="R$ 0,00" /></div></div>` : `<div class="row-end"><button class="link" type="button" id="forgot">Esqueci minha senha</button></div>`}
      <p class="msg ${info ? "ok" : ""}" id="msg">${esc(info)}</p>
      <button class="primary" type="submit">${create ? "Criar minha conta" : "Entrar"}</button></form>
    <p class="form-footer">${create ? "Já possui uma conta?" : "Ainda não possui uma conta?"} <button class="link" type="button" id="switch">${create ? "Entrar" : "Criar conta"}</button></p></section>`;
  bindEyes(); if (create) bindMeter("password");
  $("#switch").onclick = () => auth(create ? "login" : "create");
  if (!create) $("#forgot").onclick = () => auth("forgot");

  $("#f").onsubmit = async (e) => {
    e.preventDefault();
    const email = $("#email").value.trim().toLowerCase(), pw = $("#password").value, users = read(K.users, {});
    if (!validEmail(email)) return say("Digite um e-mail válido, como voce@email.com.");
    if (pw.length < 8) return say("A senha precisa ter no mínimo 8 caracteres.");
    if (create) {
      const budget = Number($("#budget").value), name = $("#name").value.trim();
      if (!name) return say("Informe seu nome.");
      if (!(budget >= 0) || $("#budget").value === "") return say("Informe um orçamento mensal válido.");
      if (users[email]) return say("Já existe uma conta com esse e-mail. Tente entrar.");
      const salt = newSalt();
      users[email] = { name, email, budget, salt, hash: await hashPw(pw, salt) };
      write(K.users, users); localStorage.setItem(K.session, email);
    } else {
      const u = users[email];
      if (!u || (await hashPw(pw, u.salt)) !== u.hash) return say("E-mail ou senha incorretos.");
      localStorage.setItem(K.session, email);
    }
    dashboard();
  };
}

/* ---------- painel ---------- */
let view = "home";
const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
const fmtDate = (iso) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const rowHTML = (x) => `<div class="expense"><span class="ex-icon">${icon("cart")}</span><div class="ex-info"><strong>${esc(x.description)}</strong><small>${fmtDate(x.ts)}</small></div><span class="ex-val">${money(x.value)}</span></div>`;
const emptyHTML = `<div class="empty">${icon("wallet")}<b>Nenhum gasto registrado</b><span>Adicione seu primeiro gasto para começar.</span></div>`;

function dashboard() {
  const email = localStorage.getItem(K.session), user = read(K.users, {})[email];
  if (!user) { localStorage.removeItem(K.session); return auth(); }
  const all = read(K.ex(email), []).sort((a, b) => b.ts.localeCompare(a.ts));
  const mk = monthKey(new Date());
  const monthTotal = all.filter((x) => monthKey(new Date(x.ts)) === mk).reduce((s, x) => s + x.value, 0);
  const balance = user.budget - monthTotal, neg = balance < 0;
  const pct = user.budget > 0 ? Math.min(100, (monthTotal / user.budget) * 100) : monthTotal > 0 ? 100 : 0;
  const barColor = neg ? "var(--bad)" : pct > 80 ? "var(--warn)" : "var(--ok)";

  const home = `<div class="grid">
    <article class="panel"><h2>${icon("wallet")} Seu saldo do mês</h2><p>Orçamento menos o que você já gastou.</p>
      <div class="balance ${neg ? "negative" : ""}" id="bal"><span>Saldo disponível</span><strong>${money(balance)}</strong>
        <div class="progress"><i style="width:${pct}%;background:${barColor}"></i></div>
        <div class="stats"><span>Gasto: ${money(monthTotal)}</span><span>Orçamento: ${money(user.budget)}</span></div>
        ${neg ? `<div class="alert" role="alert">${icon("alert")} Atenção: você ultrapassou o orçamento em ${money(-balance)}.</div>` : ""}</div>
      <h2 style="font-size:16px">Últimos gastos</h2><div class="expense-list">${all.length ? all.slice(0, 5).map(rowHTML).join("") : emptyHTML}</div></article>
    <article class="panel"><h2>${icon("plus")} Adicionar gasto</h2><p>Registre cada compra e acompanhe seu mês.</p>
      <form class="form" id="xf" style="margin-top:20px">
        <div class="field"><label for="description">Descrição</label><div class="input-wrap">${icon("cart")}<input id="description" required maxlength="60" placeholder="Ex.: Mercado" /></div></div>
        <div class="field"><label for="value">Valor</label><div class="input-wrap">${icon("wallet")}<input id="value" type="number" min="0.01" step="0.01" required placeholder="R$ 0,00" /></div></div>
        <button class="primary" type="submit">${icon("plus")} Adicionar gasto</button></form></article></div>`;

  const hist = `<article class="panel"><h2>${icon("clock")} Histórico de gastos</h2><p>${all.length} ${all.length === 1 ? "registro" : "registros"} · total geral ${money(all.reduce((s, x) => s + x.value, 0))}</p><div class="expense-list">${all.length ? all.map(rowHTML).join("") : emptyHTML}</div></article>`;

  app.innerHTML = `<section class="dashboard"><header class="topbar"><div>${logo()}<p class="hello">Olá, <strong>${esc(user.name)}</strong>. Vamos cuidar do seu dinheiro?</p></div><button class="btn-ghost" id="logout">${icon("out")} Sair</button></header>
    <nav class="tabs"><button class="tab ${view === "home" ? "active" : ""}" data-v="home">${icon("home")} Início</button><button class="tab ${view === "hist" ? "active" : ""}" data-v="hist">${icon("clock")} Histórico</button></nav>
    ${view === "home" ? home : hist}</section>`;

  $("#logout").onclick = () => { localStorage.removeItem(K.session); view = "home"; auth(); };
  document.querySelectorAll(".tab").forEach((t) => (t.onclick = () => { view = t.dataset.v; dashboard(); }));
  const xf = $("#xf");
  if (xf) xf.onsubmit = (e) => {
    e.preventDefault();
    const description = $("#description").value.trim(), value = Math.round(Number($("#value").value) * 100) / 100;
    if (!description || !(value > 0)) return toast("Informe uma descrição e um valor maior que zero.");
    all.unshift({ id: Date.now(), description, value, ts: new Date().toISOString() });
    write(K.ex(email), all); dashboard();
    $("#bal").classList.add("pop");
    toast(`Gasto de ${money(value)} adicionado.`);
  };
}

localStorage.getItem(K.session) ? dashboard() : auth();
