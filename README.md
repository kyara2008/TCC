# Azulize — Controle de Gastos com Neon PostgreSQL & Google SMTP

Sistema web completo de controle financeiro pessoal integrado diretamente ao banco de dados relacional **PostgreSQL (Neon)** com autenticação segura por e-mail via **Google SMTP (Gmail)**.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3 moderno (Vanilla CSS), JavaScript (ES6+ modular).
- **Back-end:** Node.js com Express, `@neondatabase/serverless` e `nodemailer`.
- **Banco de Dados:** Neon Serverless PostgreSQL (tabelas `users`, `expenses`, `password_resets`, `email_verifications` e view `vw_monthly_summary`).
- **Serviço de E-mail:** Google SMTP (Gmail) para envio de códigos de 6 dígitos no cadastro e recuperação de senha.

---

## 🔑 Passo a Passo para Gerar a Senha de Aplicativo do Google (App Password)

Para enviar e-mails reais através da sua conta do Google/Gmail sem expor sua senha pessoal, o Google exige a criação de uma **Senha de Aplicativo (App Password)** de 16 caracteres:

1. **Acesse a sua Conta Google:**
   - Entre em [myaccount.google.com](https://myaccount.google.com/).
2. **Ative a Verificação em duas etapas (caso ainda não esteja ativada):**
   - No menu à esquerda, clique em **Segurança**.
   - Na seção *"Como você faz login no Google"*, clique em **Verificação em duas etapas** e siga as instruções para ativá-la.
3. **Acesse as Senhas de Aplicativo:**
   - Na barra de busca no topo da página da Conta Google, digite: **Senhas de app** (ou acesse diretamente pelo link: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4. **Gerar a senha:**
   - Dê um nome para o app, por exemplo: `Azulize TCC`.
   - Clique no botão **Criar**.
   - O Google gerará uma senha amarela de 16 letras (exemplo: `abcd efgh ijkl mnop`).
5. **Coloque no arquivo `.env`:**
   - Abra o arquivo `.env` na raiz do projeto e preencha:
     ```env
     EMAIL_USER=seuemail@gmail.com
     EMAIL_PASS=abcdefghijklmnop
     ```
   *(A senha de 16 letras pode ser colada com ou sem espaços).*

> **Nota:** Se você não configurar `EMAIL_USER` e `EMAIL_PASS` imediatamente, o sistema entrará automaticamente em **Modo Simulação**, imprimindo o código no terminal e na tela para que seus testes e apresentações nunca fiquem travados!

---

## 🚀 Como Executar o Projeto

1. Abra o terminal na pasta do projeto:
   ```bash
   cd "c:\Users\professor\Downloads\tcc 19,10"
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Teste a conexão com o banco Neon:
   ```bash
   npm run test-db
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. Abra o navegador em:
   ```text
   http://localhost:3000
   ```

---

## 🗄️ Rotas e Operações no Banco Neon

| Funcionalidade | Rota | Operação no Banco Neon |
|---|---|---|
| **Health Check** | `GET /api/status` | Retorna status do banco, data/hora e status do SMTP |
| **Solicitar Cadastro** | `POST /api/auth/register-request` | Salva em `email_verifications` e envia código de 6 dígitos via Google SMTP |
| **Confirmar Cadastro** | `POST /api/auth/register-confirm` | Valida código, insere em `users` e marca verificado |
| **Login** | `POST /api/auth/login` | `SELECT ... FROM users WHERE email = ...` e validação com salt PBKDF2 |
| **Verificar Sessão** | `GET /api/user/me` | `SELECT ... FROM users WHERE id = ...` |
| **Esqueci Senha** | `POST /api/auth/forgot-password` | Insere em `password_resets` e envia código de 6 dígitos via Google SMTP |
| **Redefinir Senha** | `POST /api/auth/reset-password` | Atualiza senha em `users` e invalida código em `password_resets` |
| **Resumo do Mês** | `GET /api/user/summary` | Consulta em tempo real à view `vw_monthly_summary` no Neon |
| **Listar Gastos** | `GET /api/expenses` | `SELECT * FROM expenses WHERE user_id = ... ORDER BY created_at DESC` |
| **Cadastrar Gasto** | `POST /api/expenses` | `INSERT INTO expenses (...) RETURNING ...` |
| **Excluir Gasto** | `DELETE /api/expenses/:id` | `DELETE FROM expenses WHERE id = ...` |
| **Alterar Orçamento** | `PUT /api/user/budget` | `UPDATE users SET budget = ...` |
