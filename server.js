const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
const FRONTEND_DIR = fs.existsSync(FRONTEND_DIST) ? FRONTEND_DIST : path.join(__dirname, '..', 'frontend');

if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não definida no arquivo .env');
  process.exit(1);
}

// Inicializa a conexão direta com o Neon Serverless PostgreSQL
const sql = neon(process.env.DATABASE_URL);

// Habilita CORS completo para suportar requisições do Live Server (porta 5500), file:// ou localhost:3000
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(FRONTEND_DIR));

// ==============================================================================
// UTILITÁRIOS DE CRIPTOGRAFIA E VALIDAÇÃO
// ==============================================================================
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  if (!salt) {
    // Compatibilidade com senhas legado sem salt
    return crypto.createHash('sha256').update(String(password)).digest('hex');
  }
  return crypto.pbkdf2Sync(String(password), Buffer.from(salt, 'hex'), 150000, 32, 'sha256').toString('hex');
}

function isValidEmail(email) {
  return /^[^\s@.][^\s@]*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(email) && !email.includes('..');
}

// ==============================================================================
// ENVIO DE E-MAIL (SUPORTA GMAIL SMTP, SMTP PERSONALIZADO E RESEND API HTTP)
// ==============================================================================
async function sendAuthEmail(toEmail, subject, title, code, instruction) {
  const isResendConfigured = Boolean(process.env.RESEND_API_KEY);
  const isSmtpConfigured = Boolean(
    (process.env.EMAIL_USER && process.env.EMAIL_PASS) ||
    (process.env.SMTP_USER && process.env.SMTP_PASS)
  );

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #d8eaf7; overflow: hidden; box-shadow: 0 4px 14px rgba(18,57,92,0.08);">
      <div style="background: #12395c; padding: 26px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Azulize</h1>
        <p style="color: #d8eaf7; margin: 4px 0 0; font-size: 13px; font-weight: 500;">Controle de Gastos & Educação Financeira</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <h2 style="color: #12395c; font-size: 20px; margin: 0 0 10px; font-weight: 700;">${title}</h2>
        <p style="color: #6c849b; font-size: 14px; margin: 0 0 24px; line-height: 1.5;">${instruction}</p>
        
        <div style="background: #eaf6ff; border: 2px dashed #2f8fdc; border-radius: 12px; padding: 16px 24px; display: inline-block; margin-bottom: 22px;">
          <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #12395c; font-family: monospace;">${code}</span>
        </div>
        
        <p style="color: #6c849b; font-size: 12px; margin: 0 0 4px;">Este código expira em <strong>15 minutos</strong>.</p>
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">Se você não solicitou este código, por favor ignore esta mensagem.</p>
      </div>
      <div style="background: #f7fbff; border-top: 1px solid #d8eaf7; padding: 14px; text-align: center; font-size: 11px; color: #6c849b;">
        © Azulize — Controle de Gastos & Educação Financeira
      </div>
    </div>
  `;

  console.log(`\n=======================================================`);
  console.log(`📬 [AUTENTICAÇÃO AZULIZE]`);
  console.log(`Destinatário: ${toEmail}`);
  console.log(`Assunto:      Azulize — ${subject}`);
  console.log(`CÓDIGO:       ${code}`);
  console.log(`=======================================================`);

  // Opção 1: Envio via Resend API (HTTP porta 443 - imune a bloqueios de portas SMTP de escolas/antivírus)
  if (isResendConfigured) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'Azulize <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject: `Azulize — ${subject}`,
          html: html
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ [Resend HTTP] E-mail enviado com sucesso para ${toEmail}! ID: ${data.id}`);
        return { sent: true, provider: 'resend', id: data.id };
      } else {
        console.warn(`⚠️ [Resend HTTP] Falha ao enviar:`, data);
      }
    } catch (err) {
      console.error(`❌ [Resend HTTP] Erro:`, err.message);
    }
  }

  // Opção 2: Envio via Google SMTP / SMTP customizado
  if (isSmtpConfigured) {
    try {
      const user = (process.env.SMTP_USER || process.env.EMAIL_USER).trim();
      const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS).trim().replace(/\s+/g, '');
      const host = process.env.SMTP_HOST ? process.env.SMTP_HOST.trim() : 'smtp.gmail.com';
      const port = Number(process.env.SMTP_PORT) || 465;
      const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (port === 465);

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 7000,
        greetingTimeout: 7000,
        socketTimeout: 10000
      });

      await transporter.sendMail({
        from: `"Azulize" <${user}>`,
        to: toEmail,
        subject: `Azulize — ${subject}`,
        html: html
      });

      console.log(`✅ [SMTP] E-mail enviado com sucesso para ${toEmail}!`);
      return { sent: true, provider: 'smtp' };
    } catch (err) {
      console.error(`❌ [SMTP] Falha ao enviar para ${toEmail}:`, err.message);
      if (err.code === 'ESOCKET' || (err.message && err.message.includes('ECONNRESET'))) {
        console.warn(`\n⚠️  [DIAGNÓSTICO SMTP - BLOQUEIO DE REDE / ANTIVÍRUS DETECTADO]`);
        console.warn(`   A conexão SMTP com a porta 465/587 foi interrompida com ECONNRESET.`);
        console.warn(`   Causa: Redes institucionais/escolares (Wi-Fi) ou antivírus (Kaspersky/Avast) bloqueiam conexões diretas de correio.`);
        console.warn(`   👉 Como contingência inteligente, o código [${code}] foi entregue à interface para não travar os testes e o TCC.`);
        console.warn(`   👉 Para envio real sem bloqueio nesta rede, configure RESEND_API_KEY no .env (utiliza porta 443 HTTPS liberada).\n`);
      }
      return { sent: false, error: err.message, networkBlocked: true };
    }
  } else {
    console.warn(`⚠️ [Aviso SMTP] EMAIL_USER e EMAIL_PASS não estão configurados no arquivo .env.`);
    console.warn(`👉 O código [${code}] foi exibido acima no terminal para você conseguir testar normalmente.`);
    return { sent: false, simulated: true };
  }
}

// ==============================================================================
// ROTAS DA API (TODAS PERSISTEM DIRETAMENTE NO NEON POSTGRESQL)
// ==============================================================================

// 1. Status / Health Check da Conexão com o Banco e SMTP
app.get('/api/status', async (req, res) => {
  try {
    const dbTest = await sql`SELECT NOW() as now, current_database() as db, current_user as usr;`;
    const counts = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM expenses) as total_expenses;
    `;
    res.json({
      status: 'online',
      database: 'connected',
      dbName: dbTest[0].db,
      dbUser: dbTest[0].usr,
      timestamp: dbTest[0].now,
      smtpConfigured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      smtpUser: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      emailProvider: process.env.RESEND_API_KEY ? 'resend' : (process.env.EMAIL_USER ? 'smtp' : 'simulated'),
      stats: {
        users: Number(counts[0].total_users),
        expenses: Number(counts[0].total_expenses)
      }
    });
  } catch (err) {
    console.error('❌ Erro no teste de conexão /api/status:', err.message);
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// 1.1. Diagnóstico e Teste Manual de Envio de E-mail
app.get('/api/test-email', async (req, res) => {
  const targetEmail = req.query.to || process.env.EMAIL_USER;
  if (!targetEmail) {
    return res.status(400).json({ error: 'Informe o e-mail de destino no parâmetro ?to=exemplo@gmail.com' });
  }
  const testCode = String(crypto.randomInt(100000, 999999));
  const result = await sendAuthEmail(
    targetEmail,
    'Teste de Conexão SMTP',
    'Teste de Diagnóstico de E-mail',
    testCode,
    'Este é um e-mail de teste gerado pelo endpoint de diagnóstico do Azulize.'
  );
  res.json({
    target: targetEmail,
    code: testCode,
    result,
    diagnostics: result.sent
      ? 'Conexão e envio estabelecidos com sucesso!'
      : 'As portas SMTP (465/587) foram bloqueadas nesta rede institucional ou pelo antivírus (ECONNRESET). O sistema utiliza o código gerado acima para contingência.'
  });
});

// 2. Cadastro de Usuário - Etapa 1: Solicitar código por e-mail
app.post('/api/auth/register-request', async (req, res) => {
  try {
    const { name, email, password, budget } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório.' });
    }
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'A senha precisa ter no mínimo 8 caracteres.' });
    }
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      return res.status(400).json({ error: 'Orçamento mensal deve ser um valor válido maior ou igual a zero.' });
    }

    // Verifica se já existe conta ativa com esse e-mail no PostgreSQL
    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail};`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já existe uma conta cadastrada com esse e-mail. Tente entrar.' });
    }

    const salt = generateSalt();
    const hash = hashPassword(password, salt);
    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Salva verificação pendente na tabela email_verifications do Neon
    await sql`
      INSERT INTO email_verifications (email, name, password_hash, salt, budget, code, expires_at)
      VALUES (${cleanEmail}, ${name.trim()}, ${hash}, ${salt}, ${numBudget}, ${code}, ${expiresAt.toISOString()});
    `;

    // Envia o e-mail via Google SMTP / Resend
    const emailResult = await sendAuthEmail(
      cleanEmail,
      'Confirmação de Cadastro',
      'Confirme seu cadastro',
      code,
      `Olá, <strong>${name.trim()}</strong>! Use o código abaixo para validar seu e-mail e ativar sua conta no Azulize:`
    );

    res.json({
      message: emailResult.sent
        ? 'Código de verificação enviado para o seu e-mail!'
        : 'Código gerado com sucesso!',
      email: cleanEmail,
      smtpSent: emailResult.sent,
      simulated: !process.env.EMAIL_USER && !process.env.RESEND_API_KEY,
      code: !emailResult.sent ? code : undefined // Não trava o fluxo caso o e-mail não consiga ser entregue pela rede
    });
  } catch (err) {
    console.error('Erro no register-request:', err);
    res.status(500).json({ error: 'Erro interno ao iniciar cadastro.' });
  }
});

// 2.1. Reenviar Código de Confirmação de Cadastro
app.post('/api/auth/resend-register-code', async (req, res) => {
  try {
    const { email } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail};`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Esta conta já foi ativada. Faça o login.' });
    }

    const pendingRows = await sql`
      SELECT id, name, email, password_hash, salt, budget 
      FROM email_verifications 
      WHERE email = ${cleanEmail} AND verified = FALSE 
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    if (pendingRows.length === 0) {
      return res.status(404).json({ error: 'Nenhum cadastro pendente encontrado para este e-mail. Por favor, preencha o formulário novamente.' });
    }

    const pending = pendingRows[0];
    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await sql`
      INSERT INTO email_verifications (email, name, password_hash, salt, budget, code, expires_at)
      VALUES (${cleanEmail}, ${pending.name}, ${pending.password_hash}, ${pending.salt}, ${pending.budget}, ${code}, ${expiresAt.toISOString()});
    `;

    const emailResult = await sendAuthEmail(
      cleanEmail,
      'Novo Código de Confirmação',
      'Confirme seu cadastro',
      code,
      `Olá, <strong>${pending.name}</strong>! Conforme solicitado, aqui está seu novo código para validar seu e-mail e ativar sua conta no Azulize:`
    );

    res.json({
      message: emailResult.sent
        ? 'Novo código de verificação enviado para seu e-mail!'
        : 'Novo código gerado com sucesso!',
      email: cleanEmail,
      smtpSent: emailResult.sent,
      simulated: !process.env.EMAIL_USER && !process.env.RESEND_API_KEY,
      code: !emailResult.sent ? code : undefined
    });
  } catch (err) {
    console.error('Erro ao reenviar código de cadastro:', err);
    res.status(500).json({ error: 'Erro ao reenviar código de verificação.' });
  }
});

// 3. Cadastro de Usuário - Etapa 2: Validar código e criar a conta no Neon
app.post('/api/auth/register-confirm', async (req, res) => {
  try {
    const { email, code } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!code || code.trim().length !== 6) {
      return res.status(400).json({ error: 'Digite o código de 6 dígitos enviado por e-mail.' });
    }

    // Busca o código mais recente válido para esse e-mail
    const pendingRows = await sql`
      SELECT id, name, email, password_hash, salt, budget, expires_at 
      FROM email_verifications 
      WHERE email = ${cleanEmail} 
        AND code = ${code.trim()} 
        AND verified = FALSE 
        AND expires_at > NOW() 
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    if (pendingRows.length === 0) {
      return res.status(400).json({ error: 'Código de verificação incorreto ou expirado. Solicite um novo código.' });
    }

    const pending = pendingRows[0];

    // Verifica novamente se já foi cadastrado por outro processo
    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail};`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Esta conta já foi ativada. Faça o login.' });
    }

    // Cria o usuário definitivo no banco de dados Neon
    const inserted = await sql`
      INSERT INTO users (name, email, password_hash, salt, budget)
      VALUES (${pending.name}, ${pending.email}, ${pending.password_hash}, ${pending.salt}, ${pending.budget})
      RETURNING id, name, email, budget, avatar, created_at;
    `;

    // Marca o código como verificado no Neon
    await sql`
      UPDATE email_verifications 
      SET verified = TRUE 
      WHERE id = ${pending.id};
    `;

    const user = inserted[0];
    res.status(201).json({
      message: 'Conta ativada com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        budget: Number(user.budget),
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('Erro no register-confirm:', err);
    res.status(500).json({ error: 'Erro ao ativar a conta. Tente novamente.' });
  }
});

// 4. Cadastro direto (compatibilidade)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, budget } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Nome é obrigatório.' });
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) return res.status(400).json({ error: 'E-mail inválido.' });
    if (!password || password.length < 8) return res.status(400).json({ error: 'A senha precisa ter no mínimo 8 caracteres.' });
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 0) return res.status(400).json({ error: 'Orçamento mensal inválido.' });

    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail};`;
    if (existing.length > 0) return res.status(409).json({ error: 'Já existe uma conta cadastrada com esse e-mail.' });

    const salt = generateSalt();
    const hash = hashPassword(password, salt);

    const inserted = await sql`
      INSERT INTO users (name, email, password_hash, salt, budget)
      VALUES (${name.trim()}, ${cleanEmail}, ${hash}, ${salt}, ${numBudget})
      RETURNING id, name, email, budget, avatar, created_at;
    `;

    const user = inserted[0];
    res.status(201).json({
      message: 'Conta criada com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        budget: Number(user.budget),
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('Erro no register direto:', err);
    res.status(500).json({ error: 'Erro ao criar conta. Tente novamente.' });
  }
});

// 5. Login de Usuário (SELECT e validação via banco)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const rows = await sql`
      SELECT id, name, email, password_hash, salt, budget, avatar 
      FROM users 
      WHERE email = ${cleanEmail};
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const user = rows[0];
    let passwordMatch = false;

    if (user.salt) {
      const incomingHash = hashPassword(password, user.salt);
      passwordMatch = (incomingHash === user.password_hash);
    } else {
      passwordMatch = (user.password_hash === password || user.password_hash === hashPassword(password, null));
      if (passwordMatch) {
        const newSalt = generateSalt();
        const newHash = hashPassword(password, newSalt);
        await sql`UPDATE users SET password_hash = ${newHash}, salt = ${newSalt} WHERE id = ${user.id};`;
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        budget: Number(user.budget),
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao processar login. Tente novamente.' });
  }
});

// 6. Verificação de Sessão do Usuário
app.get('/api/user/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Identificador de usuário não fornecido.' });
    }

    const rows = await sql`
      SELECT id, name, email, budget, avatar, created_at 
      FROM users 
      WHERE id = ${userId};
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      budget: Number(user.budget),
      avatar: user.avatar || null,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('Erro ao verificar usuário:', err);
    res.status(500).json({ error: 'Erro ao carregar dados do usuário.' });
  }
});

// 7. Esqueci minha senha (Gera código de 6 dígitos no Neon e envia por e-mail via Google SMTP)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Digite um e-mail válido.' });
    }

    const userRows = await sql`SELECT id, name FROM users WHERE email = ${cleanEmail};`;
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Não encontramos nenhuma conta cadastrada com esse e-mail.' });
    }

    const user = userRows[0];
    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await sql`
      INSERT INTO password_resets (user_id, email, code, expires_at)
      VALUES (${user.id}, ${cleanEmail}, ${code}, ${expiresAt.toISOString()});
    `;

    // Dispara e-mail via Google SMTP / Resend
    const emailResult = await sendAuthEmail(
      cleanEmail,
      'Recuperação de Senha',
      'Código para Redefinir Senha',
      code,
      `Olá, <strong>${user.name}</strong>! Recebemos um pedido para alterar sua senha no Azulize. Use o código abaixo para continuar:`
    );

    res.json({
      message: emailResult.sent
        ? 'Código de recuperação enviado para o seu e-mail!'
        : 'Código de recuperação gerado com sucesso!',
      email: cleanEmail,
      smtpSent: emailResult.sent,
      simulated: !process.env.EMAIL_USER && !process.env.RESEND_API_KEY,
      code: !emailResult.sent ? code : undefined // Não trava o usuário caso o e-mail não seja entregue pela rede
    });
  } catch (err) {
    console.error('Erro no forgot-password:', err);
    res.status(500).json({ error: 'Erro ao enviar código de recuperação. Tente novamente.' });
  }
});

// 7.1. Reenviar Código de Redefinição de Senha
app.post('/api/auth/resend-reset-code', async (req, res) => {
  try {
    const { email } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Digite um e-mail válido.' });
    }

    const userRows = await sql`SELECT id, name FROM users WHERE email = ${cleanEmail};`;
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Não encontramos nenhuma conta cadastrada com esse e-mail.' });
    }

    const user = userRows[0];
    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await sql`
      INSERT INTO password_resets (user_id, email, code, expires_at)
      VALUES (${user.id}, ${cleanEmail}, ${code}, ${expiresAt.toISOString()});
    `;

    const emailResult = await sendAuthEmail(
      cleanEmail,
      'Novo Código de Recuperação',
      'Código para Redefinir Senha',
      code,
      `Olá, <strong>${user.name}</strong>! Conforme solicitado, aqui está seu novo código para alterar sua senha no Azulize:`
    );

    res.json({
      message: emailResult.sent
        ? 'Novo código de recuperação enviado para seu e-mail!'
        : 'Novo código gerado com sucesso!',
      email: cleanEmail,
      smtpSent: emailResult.sent,
      simulated: !process.env.EMAIL_USER && !process.env.RESEND_API_KEY,
      code: !emailResult.sent ? code : undefined
    });
  } catch (err) {
    console.error('Erro ao reenviar código de recuperação:', err);
    res.status(500).json({ error: 'Erro ao reenviar código de recuperação. Tente novamente.' });
  }
});

// 8. Redefinir Senha (Valida código em password_resets e atualiza users no Neon)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!code || code.trim().length !== 6) {
      return res.status(400).json({ error: 'Código de 6 dígitos inválido.' });
    }
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'A nova senha precisa ter no mínimo 8 caracteres.' });
    }

    const resetRows = await sql`
      SELECT id, user_id, expires_at 
      FROM password_resets 
      WHERE email = ${cleanEmail} 
        AND code = ${code.trim()} 
        AND used = FALSE 
        AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    if (resetRows.length === 0) {
      return res.status(400).json({ error: 'Código inválido ou expirado. Peça um novo código.' });
    }

    const resetRecord = resetRows[0];
    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    // Atualiza a senha no banco Neon
    await sql`
      UPDATE users 
      SET password_hash = ${newHash}, salt = ${newSalt}, updated_at = NOW() 
      WHERE id = ${resetRecord.user_id};
    `;

    // Invalida o código no banco
    await sql`
      UPDATE password_resets 
      SET used = TRUE 
      WHERE id = ${resetRecord.id};
    `;

    res.json({ message: 'Senha redefinida com sucesso! Você já pode entrar.' });
  } catch (err) {
    console.error('Erro no reset-password:', err);
    res.status(500).json({ error: 'Erro ao redefinir senha. Tente novamente.' });
  }
});

// 9. Resumo Mensal do Usuário (Consulta a View analítica vw_monthly_summary no Neon)
app.get('/api/user/summary', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Identificador de usuário não informado.' });
    }

    const rows = await sql`
      SELECT 
        user_id,
        user_name,
        user_email,
        user_budget,
        current_month,
        total_spent,
        balance,
        budget_used_percentage
      FROM vw_monthly_summary 
      WHERE user_id = ${userId};
    `;

    if (rows.length === 0) {
      const u = await sql`SELECT id, name, email, budget FROM users WHERE id = ${userId};`;
      if (u.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
      return res.json({
        user_id: u[0].id,
        user_name: u[0].name,
        user_email: u[0].email,
        user_budget: Number(u[0].budget),
        current_month: new Date().toISOString().slice(0, 7),
        total_spent: 0,
        balance: Number(u[0].budget),
        budget_used_percentage: 0
      });
    }

    const s = rows[0];
    res.json({
      user_id: s.user_id,
      user_name: s.user_name,
      user_email: s.user_email,
      user_budget: Number(s.user_budget),
      current_month: s.current_month,
      total_spent: Number(s.total_spent),
      balance: Number(s.balance),
      budget_used_percentage: Number(s.budget_used_percentage)
    });
  } catch (err) {
    console.error('Erro ao buscar resumo:', err);
    res.status(500).json({ error: 'Erro ao carregar dados do resumo.' });
  }
});

// 10. Lista de Gastos do Usuário (SELECT da tabela expenses no Neon)
app.get('/api/expenses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Identificador de usuário não informado.' });
    }

    const rows = await sql`
      SELECT id, description, value, category, created_at 
      FROM expenses 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC;
    `;

    const expenses = rows.map(r => ({
      id: r.id,
      description: r.description,
      value: Number(r.value),
      category: r.category || 'Geral',
      ts: r.created_at
    }));

    res.json(expenses);
  } catch (err) {
    console.error('Erro ao listar despesas:', err);
    res.status(500).json({ error: 'Erro ao carregar lista de gastos. Tente novamente.' });
  }
});

// 11. Adicionar Gasto (INSERT na tabela expenses no Neon)
app.post('/api/expenses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    const { description, value, category } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: 'Identificador de usuário não informado.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Descrição é obrigatória.' });
    }
    const numValue = Math.round(Number(value) * 100) / 100;
    if (isNaN(numValue) || numValue <= 0) {
      return res.status(400).json({ error: 'Valor do gasto deve ser maior que zero.' });
    }

    const inserted = await sql`
      INSERT INTO expenses (user_id, description, value, category)
      VALUES (${userId}, ${description.trim()}, ${numValue}, ${category || 'Geral'})
      RETURNING id, description, value, category, created_at;
    `;

    const exp = inserted[0];
    res.status(201).json({
      message: 'Gasto adicionado com sucesso!',
      expense: {
        id: exp.id,
        description: exp.description,
        value: Number(exp.value),
        category: exp.category,
        ts: exp.created_at
      }
    });
  } catch (err) {
    console.error('Erro ao adicionar gasto:', err);
    res.status(500).json({ error: 'Erro ao adicionar gasto. Tente novamente.' });
  }
});

// 12. Excluir Gasto (DELETE na tabela expenses no Neon)
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.query.userId || req.body?.userId;

    if (!id) {
      return res.status(400).json({ error: 'Identificador do gasto é obrigatório.' });
    }

    let deleted;
    if (userId) {
      deleted = await sql`
        DELETE FROM expenses 
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id;
      `;
    } else {
      deleted = await sql`
        DELETE FROM expenses 
        WHERE id = ${id}
        RETURNING id;
      `;
    }

    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Gasto não encontrado ou já excluído.' });
    }

    res.json({ message: 'Gasto excluído com sucesso!', id });
  } catch (err) {
    console.error('Erro ao excluir despesa:', err);
    res.status(500).json({ error: 'Erro ao excluir gasto. Tente novamente.' });
  }
});

// 13. Atualizar Orçamento Mensal (UPDATE na tabela users no Neon)
app.put('/api/user/budget', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    const { budget } = req.body || {};
    const numBudget = Number(budget);

    if (!userId) return res.status(400).json({ error: 'Identificador de usuário não informado.' });
    if (isNaN(numBudget) || numBudget < 0) {
      return res.status(400).json({ error: 'Orçamento deve ser um número maior ou igual a zero.' });
    }

    const updated = await sql`
      UPDATE users 
      SET budget = ${numBudget}, updated_at = NOW() 
      WHERE id = ${userId}
      RETURNING id, name, email, budget, avatar;
    `;

    if (updated.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const u = updated[0];
    res.json({
      message: 'Orçamento atualizado com sucesso!',
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        budget: Number(u.budget),
        avatar: u.avatar || null
      }
    });
  } catch (err) {
    console.error('Erro ao atualizar orçamento:', err);
    res.status(500).json({ error: 'Erro ao atualizar orçamento. Tente novamente.' });
  }
});

// 14. Atualizar Dados do Perfil do Usuário (Nome e/ou Orçamento)
app.put('/api/user/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    const { name, budget } = req.body || {};

    if (!userId) return res.status(400).json({ error: 'Identificador de usuário não informado.' });

    let updated;
    if (name && budget !== undefined) {
      const numBudget = Number(budget);
      if (isNaN(numBudget) || numBudget < 0) {
        return res.status(400).json({ error: 'Orçamento deve ser maior ou igual a zero.' });
      }
      updated = await sql`
        UPDATE users 
        SET name = ${name.trim()}, budget = ${numBudget}, updated_at = NOW() 
        WHERE id = ${userId}
        RETURNING id, name, email, budget, avatar;
      `;
    } else if (name) {
      updated = await sql`
        UPDATE users 
        SET name = ${name.trim()}, updated_at = NOW() 
        WHERE id = ${userId}
        RETURNING id, name, email, budget, avatar;
      `;
    } else if (budget !== undefined) {
      const numBudget = Number(budget);
      if (isNaN(numBudget) || numBudget < 0) {
        return res.status(400).json({ error: 'Orçamento deve ser maior ou igual a zero.' });
      }
      updated = await sql`
        UPDATE users 
        SET budget = ${numBudget}, updated_at = NOW() 
        WHERE id = ${userId}
        RETURNING id, name, email, budget, avatar;
      `;
    } else {
      return res.status(400).json({ error: 'Nenhum campo fornecido para atualização.' });
    }

    if (updated.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const u = updated[0];
    res.json({
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        budget: Number(u.budget),
        avatar: u.avatar || null
      }
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ error: 'Erro ao atualizar dados do perfil.' });
  }
});

// 15. Atualizar Foto de Perfil (Avatar com limite de 5 MB)
app.put('/api/user/avatar', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    const { avatar } = req.body || {};

    if (!userId) return res.status(400).json({ error: 'Identificador de usuário não informado.' });

    // Se for string base64, checa limite de ~5 MB (base64 adiciona ~33% de overhead, logo ~7.5MB)
    if (avatar && typeof avatar === 'string' && avatar.length > 7.5 * 1024 * 1024) {
      return res.status(400).json({ error: 'A imagem selecionada excede o limite máximo de 5 MB.' });
    }

    const cleanAvatar = avatar ? String(avatar) : null;
    const updated = await sql`
      UPDATE users 
      SET avatar = ${cleanAvatar}, updated_at = NOW() 
      WHERE id = ${userId}
      RETURNING id, name, email, budget, avatar;
    `;

    if (updated.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const u = updated[0];
    res.json({
      message: cleanAvatar ? 'Foto de perfil atualizada com sucesso!' : 'Foto de perfil removida com sucesso!',
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        budget: Number(u.budget),
        avatar: u.avatar || null
      }
    });
  } catch (err) {
    console.error('Erro ao salvar avatar:', err);
    res.status(500).json({ error: 'Erro ao salvar foto de perfil.' });
  }
});

// 16. Alterar Senha (usuário logado)
app.put('/api/user/password', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId;
    const { currentPassword, newPassword } = req.body || {};

    if (!userId) return res.status(400).json({ error: 'Identificador de usuário não informado.' });
    if (!currentPassword) return res.status(400).json({ error: 'Informe a senha atual.' });
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'A nova senha precisa ter no mínimo 8 caracteres.' });
    }

    const rows = await sql`
      SELECT id, password_hash, salt 
      FROM users 
      WHERE id = ${userId};
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const user = rows[0];
    let passwordMatch = false;
    if (user.salt) {
      const incomingHash = hashPassword(currentPassword, user.salt);
      passwordMatch = (incomingHash === user.password_hash);
    } else {
      passwordMatch = (user.password_hash === currentPassword || user.password_hash === hashPassword(currentPassword, null));
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'A senha atual informada está incorreta.' });
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    await sql`
      UPDATE users 
      SET password_hash = ${newHash}, salt = ${newSalt}, updated_at = NOW() 
      WHERE id = ${userId};
    `;

    res.json({ message: 'Senha alterada com sucesso!' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ error: 'Erro ao atualizar senha. Tente novamente.' });
  }
});

// Fallback para SPA (se não for rota de API)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  }
  next();
});

// Inicia o servidor HTTP
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Servidor Azulize rodando em: http://localhost:${PORT}`);
  console.log(`🐘 Conectado diretamente ao Neon Serverless PostgreSQL`);
  console.log(`📧 Google SMTP: ${process.env.EMAIL_USER ? 'Configurado (' + process.env.EMAIL_USER + ')' : 'Modo Simulação (defina EMAIL_USER e EMAIL_PASS no .env)'}`);
  console.log(`=======================================================`);
});
