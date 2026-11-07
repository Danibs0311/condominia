-- ====================================================================
-- CondominIA - Dados Iniciais de Teste e Demonstração (Seed)
-- ====================================================================

DO $$
DECLARE
    v_condo_id UUID;
    v_syndic_unit_id UUID;
    v_resident_unit_id UUID;
    v_default_password_hash TEXT;
BEGIN
    -- Gerar hash seguro para a senha inicial '12345678' usando bcrypt via pgcrypto
    v_default_password_hash := crypt('12345678', gen_salt('bf', 10));

    -- 1. CRIAR CONDOMÍNIO PILOTO DE 16 UNIDADES
    INSERT INTO public.condominiums (
        name, address, total_units, default_condo_fee, is_syndic_exempt_default, pix_key, pix_key_type, status
    ) VALUES (
        'Condomínio Residencial Piloto',
        'Rua das Palmeiras, 100 - Centro',
        16,
        150.00,
        true,
        'financeiro@condominia.com.br',
        'email',
        'active'
    ) RETURNING id INTO v_condo_id;

    -- 2. CRIAR AS 16 UNIDADES
    -- Andares 1 a 4 (4 apartamentos por andar)
    INSERT INTO public.units (condo_id, unit_number, is_syndic_unit, is_exempt_from_utilities, resident_name) VALUES
    (v_condo_id, '101', false, false, 'Carlos Silva'),
    (v_condo_id, '102', false, false, 'Mariana Costa'),
    (v_condo_id, '103', false, false, 'Roberto Alves'),
    (v_condo_id, '104', false, false, 'Fernanda Lima'),
    (v_condo_id, '201', false, false, 'João Pedro'),
    (v_condo_id, '202', false, false, 'Beatriz Santos'),
    (v_condo_id, '203', false, false, 'Lucas Mendes'),
    (v_condo_id, '204', false, false, 'Camila Rocha'),
    (v_condo_id, '301', false, false, 'André Oliveira'),
    (v_condo_id, '302', false, false, 'Juliana Martins'),
    (v_condo_id, '303', false, false, 'Paulo Ferreira'),
    (v_condo_id, '304', false, false, 'Renata Souza'),
    (v_condo_id, '401', false, false, 'Marcos Vinicius'),
    (v_condo_id, '402', false, false, 'Aline Ribeiro'),
    (v_condo_id, '403', false, false, 'Thiago Barbosa');

    -- Unidade 404 (Unidade do Síndico - Isenta de rateio de água e energia)
    INSERT INTO public.units (condo_id, unit_number, is_syndic_unit, is_exempt_from_utilities, resident_name)
    VALUES (v_condo_id, '404', true, true, 'Síndico Responsável')
    RETURNING id INTO v_syndic_unit_id;

    -- Recuperar o ID da Unidade 101 para associar o morador de teste
    SELECT id INTO v_resident_unit_id FROM public.units WHERE condo_id = v_condo_id AND unit_number = '101';

    -- 3. CRIAR USUÁRIOS INICIAIS
    
    -- USUÁRIO MASTER (Dono do SaaS)
    -- CPF: 00000000000 | Senha: 12345678
    INSERT INTO public.users (
        condo_id, role, cpf, password_hash, name, phone, email
    ) VALUES (
        NULL, -- Master não fica restrito a um condomínio
        'master',
        '00000000000',
        v_default_password_hash,
        'Administrador Master DGTECH',
        '11999999999',
        'master@condominia.com.br'
    );

    -- USUÁRIO SÍNDICO (Administrador do Condomínio Piloto)
    -- CPF: 11111111111 | Senha: 12345678
    INSERT INTO public.users (
        condo_id, unit_id, role, cpf, password_hash, name, phone, email
    ) VALUES (
        v_condo_id,
        v_syndic_unit_id,
        'syndic',
        '11111111111',
        v_default_password_hash,
        'Síndico Responsável',
        '11988888888',
        'sindico@condominia.com.br'
    );

    -- USUÁRIO MORADOR DE TESTE (Apto 101)
    -- CPF: 22222222222 | Senha: 12345678
    INSERT INTO public.users (
        condo_id, unit_id, role, cpf, password_hash, name, phone, email
    ) VALUES (
        v_condo_id,
        v_resident_unit_id,
        'resident',
        '22222222222',
        v_default_password_hash,
        'Carlos Silva (Apto 101)',
        '11977777777',
        'carlos101@condominia.com.br'
    );

END $$;
