-- ==============================================================================
-- PROJETO: Azulize — Controle de Gastos
-- BANCO DE DADOS: PostgreSQL (Pronto para Neon Serverless Postgres)
-- ARQUIVO: schema.sql
-- ==============================================================================

-- 1. Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABELA DE USUÁRIOS (users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64),
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. TABELA DE GASTOS / DESPESAS (expenses)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(100) NOT NULL,
    value NUMERIC(12, 2) NOT NULL CHECK (value > 0),
    category VARCHAR(50) DEFAULT 'Geral',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. TABELA DE RECUPERAÇÃO DE SENHA (password_resets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    code CHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. TABELA DE VERIFICAÇÃO DE EMAIL NO CADASTRO (email_verifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0),
    code CHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. ÍNDICES PARA ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_created ON expenses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resets_email_code ON password_resets(email, code) WHERE NOT used;
CREATE INDEX IF NOT EXISTS idx_verifications_email_code ON email_verifications(email, code) WHERE NOT verified;

-- ==============================================================================
-- 6. TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_users ON users;
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 7. VIEW ANALÍTICA: RESUMO MENSAL DO USUÁRIO (vw_monthly_summary)
-- ==============================================================================
CREATE OR REPLACE VIEW vw_monthly_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    u.budget AS user_budget,
    TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM') AS current_month,
    COALESCE(SUM(e.value), 0.00) AS total_spent,
    u.budget - COALESCE(SUM(e.value), 0.00) AS balance,
    CASE 
        WHEN u.budget > 0 THEN ROUND((COALESCE(SUM(e.value), 0.00) / u.budget) * 100, 2)
        WHEN COALESCE(SUM(e.value), 0.00) > 0 THEN 100.00
        ELSE 0.00
    END AS budget_used_percentage
FROM users u
LEFT JOIN expenses e 
    ON u.id = e.user_id 
    AND DATE_TRUNC('month', e.created_at) = DATE_TRUNC('month', CURRENT_TIMESTAMP)
GROUP BY u.id, u.name, u.email, u.budget;
