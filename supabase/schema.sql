-- ==============================================================================
-- CONDOMINIA - SCHEMA COMPLETO PARA POSTGRESQL / SUPABASE
-- SaaS Multi-Tenant para Pequenos Condomínios (Plano Essencial R$ 49,90/mês)
-- Desenvolvido para DGTECH Soluções Tecnológicas
-- ==============================================================================

-- 1. HABILITAÇÃO DE EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABELA: master_admins (Dono do SaaS DGTECH)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS master_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Administrador Master DGTECH',
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. TABELA: condominiums (Tenants - Cada condomínio assinante)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS condominiums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'São Paulo - SP',
    total_units INTEGER NOT NULL DEFAULT 16 CHECK (total_units >= 2),
    default_condo_fee NUMERIC(10,2) NOT NULL DEFAULT 150.00,
    
    -- Dados de Recebimento via Pix Direto (Sem taxa de boleto)
    pix_key TEXT NOT NULL,
    pix_key_type VARCHAR(20) NOT NULL DEFAULT 'CNPJ' CHECK (pix_key_type IN ('CNPJ', 'CPF', 'E-mail', 'Telefone', 'Aleatória')),
    pix_beneficiary TEXT,
    pix_bank TEXT DEFAULT 'Banco Inter (077)',
    
    -- Saldos e Controle Contábil
    cash_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    initial_cash_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_syndic_exempt_default BOOLEAN NOT NULL DEFAULT true,
    
    -- Dados do Síndico Responsável pelo Contrato
    syndic_name TEXT NOT NULL,
    syndic_cpf VARCHAR(14) NOT NULL,
    syndic_phone VARCHAR(20) NOT NULL,
    syndic_email TEXT NOT NULL,
    
    -- Dados da Assinatura SaaS
    plan_price NUMERIC(10,2) NOT NULL DEFAULT 49.90,
    plan_name TEXT NOT NULL DEFAULT 'Plano Essencial',
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'overdue', 'cancelled')),
    is_demo BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_condominiums_syndic_cpf ON condominiums(syndic_cpf);
CREATE INDEX IF NOT EXISTS idx_condominiums_status ON condominiums(subscription_status);

-- ==============================================================================
-- 4. TABELA: units (Apartamentos / Unidades e Moradores)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    condo_id TEXT NOT NULL REFERENCES condominiums(id) ON DELETE CASCADE,
    unit_number VARCHAR(10) NOT NULL,
    resident_name TEXT NOT NULL,
    resident_cpf VARCHAR(14) NOT NULL,
    resident_phone VARCHAR(20) NOT NULL,
    password_hash TEXT, -- Se nulo, fallback é os 6 primeiros dígitos do CPF
    is_syndic BOOLEAN NOT NULL DEFAULT false,
    is_exempt_from_utilities BOOLEAN NOT NULL DEFAULT false,
    
    -- Status do Mês Vigente
    payment_status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
    payment_method VARCHAR(15) CHECK (payment_method IN ('pix', 'cash', 'transfer')),
    paid_at TIMESTAMPTZ,
    current_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT uq_condo_unit UNIQUE (condo_id, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_units_condo_id ON units(condo_id);
CREATE INDEX IF NOT EXISTS idx_units_resident_cpf ON units(resident_cpf);

-- ==============================================================================
-- 5. TABELA: monthly_closings (Fechamentos de Mês e Histórico de Rateio)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS monthly_closings (
    id TEXT PRIMARY KEY,
    condo_id TEXT NOT NULL REFERENCES condominiums(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    due_date VARCHAR(20),
    
    -- Variáveis de Consumo & Rateio
    water_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    electricity_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    condo_fee_applied NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_syndic_exempt BOOLEAN NOT NULL DEFAULT true,
    
    -- Consistência Contábil: Saldo Final = Anterior + Receitas - Despesas
    previous_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_revenues NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_expenses NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    final_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(10) NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'closed')),
    
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT uq_condo_closing_period UNIQUE (condo_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_closings_condo_id ON monthly_closings(condo_id);

-- ==============================================================================
-- 6. TABELA: expenses (Livro Caixa e Prestação de Contas com Comprovantes)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    condo_id TEXT NOT NULL REFERENCES condominiums(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL CHECK (category IN ('water', 'electricity', 'maintenance', 'cleaning', 'administrative', 'other')),
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    expense_date VARCHAR(20) NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    receipt_url TEXT,
    receipt_storage_path TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_condo_id ON expenses(condo_id);
CREATE INDEX IF NOT EXISTS idx_expenses_period ON expenses(condo_id, year, month);

-- ==============================================================================
-- 7. TABELA: notices (Mural de Avisos e Comunicados aos Moradores)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    condo_id TEXT NOT NULL REFERENCES condominiums(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Síndico',
    is_archived BOOLEAN NOT NULL DEFAULT false,
    archived_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notices_condo_id ON notices(condo_id);

-- ==============================================================================
-- 8. TABELA: notice_attachments (Anexos em Fotos ou PDF dos Comunicados)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notice_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id TEXT NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('image', 'pdf')),
    url TEXT NOT NULL,
    storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 9. TABELA: push_subscriptions (Assinaturas de Notificações Web Push)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    condo_id TEXT NOT NULL REFERENCES condominiums(id) ON DELETE CASCADE,
    unit_id TEXT REFERENCES units(id) ON DELETE SET NULL,
    role VARCHAR(15) NOT NULL CHECK (role IN ('resident', 'syndic')),
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_condo_role ON push_subscriptions(condo_id, role);

-- ==============================================================================
-- 10. TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    CREATE TRIGGER trg_update_master_admins BEFORE UPDATE ON master_admins FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    CREATE TRIGGER trg_update_condominiums BEFORE UPDATE ON condominiums FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    CREATE TRIGGER trg_update_units BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    CREATE TRIGGER trg_update_closings BEFORE UPDATE ON monthly_closings FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    CREATE TRIGGER trg_update_expenses BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    CREATE TRIGGER trg_update_notices BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) - SEGURANÇA MULTI-TENANT NO SUPABASE
-- ==============================================================================
ALTER TABLE master_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE condominiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_closings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Público Controlado para Moradores e Síndicos
CREATE POLICY "Leitura pública de condomínios ativos" ON condominiums FOR SELECT USING (true);
CREATE POLICY "Leitura de unidades por condomínio" ON units FOR SELECT USING (true);
CREATE POLICY "Atualização de pagamentos de unidades" ON units FOR UPDATE USING (true);
CREATE POLICY "Leitura de fechamentos mensais" ON monthly_closings FOR SELECT USING (true);
CREATE POLICY "Inserção e atualização de fechamentos" ON monthly_closings FOR ALL USING (true);
CREATE POLICY "Leitura e inserção de despesas" ON expenses FOR ALL USING (true);
CREATE POLICY "Leitura e moderação de avisos" ON notices FOR ALL USING (true);
CREATE POLICY "Leitura de anexos de avisos" ON notice_attachments FOR SELECT USING (true);
CREATE POLICY "Gestão de push subscriptions" ON push_subscriptions FOR ALL USING (true);

-- ==============================================================================
-- 12. CONFIGURAÇÃO DE BUCKETS NO SUPABASE STORAGE
-- (Execute este bloco no SQL Editor do Supabase)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('notices', 'notices', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para Comprovantes e Notas Fiscais
CREATE POLICY "Acesso público aos comprovantes" ON storage.objects
FOR SELECT USING (bucket_id = 'receipts');

CREATE POLICY "Upload de notas fiscais pelo síndico" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Acesso público a anexos de avisos" ON storage.objects
FOR SELECT USING (bucket_id = 'notices');

CREATE POLICY "Upload de anexos de avisos pelo síndico" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'notices');

-- ==============================================================================
-- 13. SEEDS INICIAIS (CONDOMÍNIO PILOTO, DEMO E USUÁRIOS)
-- ==============================================================================

-- A. Administrador Master DGTECH
INSERT INTO master_admins (email, password_hash, full_name, phone)
VALUES (
    'danibs2109@gmail.com',
    crypt('Danibs0311@', gen_salt('bf')),
    'Administrador Master DGTECH',
    '+55 (75) 98848-1160'
) ON CONFLICT (email) DO UPDATE SET password_hash = crypt('Danibs0311@', gen_salt('bf'));

-- B. Condomínio 1: Condomínio Residencial Piloto
INSERT INTO condominiums (
    id, name, address, city, total_units, default_condo_fee,
    pix_key, pix_key_type, pix_beneficiary, pix_bank,
    cash_balance, initial_cash_balance, is_syndic_exempt_default,
    syndic_name, syndic_cpf, syndic_phone, syndic_email,
    plan_price, plan_name, subscription_status, is_demo
) VALUES (
    'condo-1',
    'Condomínio Residencial Piloto',
    'Rua das Palmeiras, 100 - Centro',
    'São Paulo - SP',
    16,
    150.00,
    '12.345.678/0001-90',
    'CNPJ',
    'Condomínio Residencial Piloto',
    'Banco Inter (077)',
    2957.50,
    1250.00,
    true,
    'Geraldo Alencar',
    '111.111.111-11',
    '(11) 98888-7777',
    'geraldo.sindico@gmail.com',
    49.90,
    'Plano Essencial',
    'active',
    false
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- C. Condomínio 2: Condomínio Bela Vista (Demonstração Pública)
INSERT INTO condominiums (
    id, name, address, city, total_units, default_condo_fee,
    pix_key, pix_key_type, pix_beneficiary, pix_bank,
    cash_balance, initial_cash_balance, is_syndic_exempt_default,
    syndic_name, syndic_cpf, syndic_phone, syndic_email,
    plan_price, plan_name, subscription_status, is_demo
) VALUES (
    'condo-demo',
    'Condomínio Bela Vista (Demonstração)',
    'Av. das Américas, 500 - Barra da Tijuca',
    'Rio de Janeiro - RJ',
    16,
    150.00,
    '12.345.678/0001-90',
    'CNPJ',
    'Condomínio Residencial Piloto',
    'Banco Inter (077)',
    2957.50,
    1250.00,
    true,
    'Síndico Demonstração',
    '000.000.000-00',
    '(21) 99999-8888',
    'demo@condominia.com.br',
    49.90,
    'Plano Essencial',
    'active',
    true
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- D. As 16 Unidades do Condomínio Piloto
INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u1', 'condo-1', '101', 'Carlos Mendes', '222.222.222-22', '(11) 98765-4321', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u2', 'condo-1', '102', 'Ana Souza', '222.222.222-23', '(11) 98765-4322', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u3', 'condo-1', '103', 'Bruno Lima', '222.222.222-24', '(11) 98765-4323', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u4', 'condo-1', '104', 'Carla Dias', '222.222.222-25', '(11) 98765-4324', false, false, 'pending', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u5', 'condo-1', '201', 'Diego Rocha', '222.222.222-26', '(11) 98765-4325', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u6', 'condo-1', '202', 'Eduarda Ramos', '222.222.222-27', '(11) 98765-4326', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u7', 'condo-1', '203', 'Fábio Santos', '222.222.222-28', '(11) 98765-4327', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u8', 'condo-1', '204', 'Gabriela Castro', '222.222.222-29', '(11) 98765-4328', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u9', 'condo-1', '301', 'Helena Faria', '222.222.222-30', '(11) 98765-4329', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u10', 'condo-1', '302', 'Igor Peixoto', '222.222.222-31', '(11) 98765-4330', false, false, 'pending', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u11', 'condo-1', '303', 'Julia Martins', '222.222.222-32', '(11) 98765-4331', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u12', 'condo-1', '304', 'Lucas Silveira', '222.222.222-33', '(11) 98765-4332', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u13', 'condo-1', '401', 'Mariana Freitas', '222.222.222-34', '(11) 98765-4333', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u14', 'condo-1', '402', 'Nelson Pires', '222.222.222-35', '(11) 98765-4334', false, false, 'paid', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u15', 'condo-1', '403', 'Otávio Borges', '222.222.222-36', '(11) 98765-4335', false, false, 'pending', 232.50)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

INSERT INTO units (id, condo_id, unit_number, resident_name, resident_cpf, resident_phone, is_syndic, is_exempt_from_utilities, payment_status, current_amount)
VALUES ('u16', 'condo-1', '404', 'Geraldo Alencar (Síndico)', '111.111.111-11', '(11) 98888-7777', true, true, 'paid', 150.00)
ON CONFLICT (id) DO UPDATE SET resident_name = EXCLUDED.resident_name;

-- E. Fechamento Atual (Novembro/2026) e Histórico Contábil
INSERT INTO monthly_closings (
    id, condo_id, month, year, due_date, water_amount, electricity_amount, condo_fee_applied,
    is_syndic_exempt, previous_balance, total_revenues, total_expenses, final_balance, status
) VALUES
    ('close-set-2026', 'condo-1', 'Setembro', 2026, '10/09/2026', 600.00, 520.00, 150.00, true, 1250.00, 3637.50, 2737.50, 2150.00, 'closed'),
    ('close-out-2026', 'condo-1', 'Outubro', 2026, '10/10/2026', 620.00, 550.00, 150.00, true, 2150.00, 3637.50, 3037.50, 2750.00, 'closed'),
    ('close-nov-2026', 'condo-1', 'Novembro', 2026, '10/11/2026', 650.00, 587.50, 150.00, true, 2150.00, 2475.00, 1667.50, 2957.50, 'current')
ON CONFLICT (id) DO NOTHING;

-- F. Despesas Iniciais do Livro Caixa
INSERT INTO expenses (id, condo_id, category, description, amount, expense_date, month, year, receipt_url)
VALUES
    ('exp-1', 'condo-1', 'water', 'Conta de Água Sabesp', 650.00, '05/11/2026', 'Novembro', 2026, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'),
    ('exp-2', 'condo-1', 'electricity', 'Conta de Energia Enel', 587.50, '07/11/2026', 'Novembro', 2026, 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800'),
    ('exp-3', 'condo-1', 'maintenance', 'Troca de lâmpadas do hall e sensores', 180.00, '08/11/2026', 'Novembro', 2026, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800'),
    ('exp-4', 'condo-1', 'cleaning', 'Produtos de limpeza para áreas comuns', 250.00, '09/11/2026', 'Novembro', 2026, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- G. Avisos Iniciais no Mural
INSERT INTO notices (id, condo_id, title, content, author, is_archived)
VALUES
    ('not-1', 'condo-1', 'Limpeza da Caixa d''Água Semestral', 'Prezados moradores, informamos que na próxima quinta-feira, das 09h às 14h, será realizada a limpeza periódica da caixa d''água. Pedimos que economizem água durante o período.', 'Síndico', false),
    ('not-2', 'condo-1', 'Reforma do Portão Automático', 'A troca dos rolamentos e motor do portão foi concluída ontem. Os novos controles foram calibrados e estão funcionando perfeitamente.', 'Síndico', false),
    ('not-3', 'condo-1', 'Regras de Convivência: Pets nas Áreas Comuns', 'Lembramos a todos os tutores a obrigatoriedade do uso de guia nas áreas comuns e o recolhimento imediato de quaisquer dejetos.', 'Síndico', false)
ON CONFLICT (id) DO NOTHING;
