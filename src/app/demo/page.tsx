"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_CONDO_ID, resetDemoData, setActiveCondoId } from "@/lib/store";
import {
  Building2,
  Sparkles,
  UserCheck,
  Home,
  CheckCircle2,
  DollarSign,
  QrCode,
  FileText,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  X,
  TrendingDown,
  Star,
  Users,
  Smartphone,
  Lock,
  Clock,
  Receipt,
} from "lucide-react";

export default function DemoSalesLandingPage() {
  const router = useRouter();

  // Estados Interativos da Página de Vendas
  const [unitCount, setUnitCount] = useState<number>(16);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Cálculos do Simulador de Economia
  const traditionalAdminCost = Math.max(650, unitCount * 45); // R$ 45/unidade ou mínimo R$ 650
  const condominiaCost = 49.9;
  const monthlySavings = traditionalAdminCost - condominiaCost;
  const annualSavings = monthlySavings * 12;
  const costPerUnit = (condominiaCost / unitCount).toFixed(2).replace(".", ",");

  // Ações de Entrada na Demonstração
  const handleEnterSindico = () => {
    setActiveCondoId(DEMO_CONDO_ID);
    router.push(`/sindico?condoId=${DEMO_CONDO_ID}`);
  };

  const handleEnterMorador = () => {
    setActiveCondoId(DEMO_CONDO_ID);
    router.push(`/morador?condoId=${DEMO_CONDO_ID}`);
  };

  const handleReset = () => {
    resetDemoData();
    alert("Dados da demonstração restaurados com sucesso para o estado original!");
  };

  // Mensagem personalizada do WhatsApp de contratação (DGTECH Comercial)
  const whatsappUrl = `https://wa.me/5575988481160?text=${encodeURIComponent(
    `Olá! Estava conhecendo a demonstração do CondominIA e tenho interesse em implantar o sistema no meu condomínio (${unitCount} apartamentos) pelo Plano Essencial de R$ 49,90/mês. Como funciona a ativação imediata?`
  )}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Nosso condomínio não possui CNPJ. Podemos usar o CondominIA?",
      a: "Sim, com certeza! Mais de 60% dos pequenos prédios e vilas operam sem CNPJ formal. No CondominIA, você configura a chave Pix que o seu condomínio já utiliza (seja uma conta bancária do condomínio, conta conjunta ou conta do síndico responsável). O dinheiro entra direto e o sistema controla as baixas.",
    },
    {
      q: "Preciso emitir boletos bancários caros?",
      a: "Não! Os bancos e administradoras cobram de R$ 3,00 a R$ 6,00 por boleto emitido (ou pago). No CondominIA, os moradores pagam via Pix direto para o condomínio com taxa ZERO. O sistema gera a chave Pix, o código Copia e Cola e o comprovante na hora.",
    },
    {
      q: "E se algum morador for idoso ou tiver dificuldade com tecnologia?",
      a: "O CondominIA foi feito para a realidade dos prédios brasileiros. O morador não precisa cadastrar senhas difíceis nem baixar nada da loja: ele clica em um link enviado pelo WhatsApp, digita o CPF e a cota já aparece na tela dele com a chave Pix em letras grandes e claras.",
    },
    {
      q: "Existe taxa de implantação ou contrato de fidelidade?",
      a: "Zero fidelidade e zero taxa de adesão! Você paga apenas a mensalidade fixa de R$ 49,90/mês. Se por qualquer motivo não quiser mais usar, basta cancelar com 1 clique, sem multas, carências ou constrangimentos.",
    },
    {
      q: "Quanto tempo demora para meu condomínio começar a usar?",
      a: "Menos de 10 minutos! Após a ativação, o síndico apenas revisa o número dos apartamentos e já pode disparar os convites prontos no WhatsApp para os moradores começarem a acompanhar as contas e o rateio do mês.",
    },
    {
      q: "O síndico tem suporte caso tenha alguma dúvida?",
      a: "Sim! Nosso suporte é humano e atende diretamente via WhatsApp para ajudar na configuração inicial, dúvidas sobre o rateio ou cadastros de novos moradores.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-purple-500 selection:text-white pb-24 sm:pb-0">
      {/* 1. BARRA SUPERIOR INSTITUCIONAL */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_condominia.png"
              alt="CondominIA Logo"
              className="h-10 w-10 rounded-2xl object-contain shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-zinc-900">
                  Condomin<span className="text-purple-600">IA</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 border border-emerald-300">
                  <Sparkles className="h-2.5 w-2.5 text-emerald-600" /> R$ 49,90/mês
                </span>
              </div>
              <p className="text-[11px] font-semibold text-zinc-400 hidden sm:block">
                Gestão Descomplicada para Pequenos Condomínios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleReset}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
              title="Restaura os dados originais da demonstração"
            >
              <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
              <span>Restaurar Demo</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-zinc-300 px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
            >
              Já sou Cliente (Login)
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-600 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Falar com Especialista</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION DE ALTA CONVERSÃO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-indigo-50/30 to-white pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Efeitos de Fundo Suaves */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-radial from-purple-200/40 via-transparent to-transparent pointer-events-none blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Badge de Impacto */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-100/90 px-4 py-1.5 text-xs font-extrabold text-purple-900 shadow-xs mb-6">
            <ShieldCheck className="h-4 w-4 text-purple-700" />
            <span>Feito sob medida para prédios de até 30 apartamentos</span>
          </div>

          {/* Headline Magnética */}
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl leading-[1.15]">
            Chega de planilhas confusas e <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600">
              desconfiança na reunião de condomínio
            </span>
          </h1>

          {/* Subheadline Persuasiva */}
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            Calcule o rateio de água e luz em <strong>3 minutos</strong>, mostre a foto das notas fiscais no Livro Caixa para todos os moradores e receba direto via Pix por apenas{" "}
            <strong className="text-purple-700 font-extrabold bg-purple-100 px-2 py-0.5 rounded-md">
              R$ 49,90/mês
            </strong>.
          </p>

          {/* Bullets de Alívio Imediato */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-zinc-700">
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Sem taxas de boletos bancários
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Sem taxa de implantação
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Cancele quando quiser
            </span>
          </div>

          {/* CTAs Principais da Dobra */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/25 hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" />
              Quero Ativar Meu Condomínio
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleEnterSindico}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-purple-300 bg-white px-7 py-4 text-sm font-extrabold text-purple-900 shadow-md hover:bg-purple-50 active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              Testar Demonstração Grátis
            </button>
          </div>

          <p className="mt-3 text-[11px] font-medium text-zinc-400">
            🔒 Demonstração 100% interativa e segura. Nenhum cartão de crédito necessário para testar.
          </p>
        </div>
      </section>

      {/* 3. SIMULADOR INTERATIVO DE ECONOMIA (CALCULADORA DE ROI) */}
      <section className="border-y border-zinc-200 bg-zinc-50/70 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border-2 border-purple-200 bg-white p-6 sm:p-10 shadow-xl shadow-purple-500/5">
            <div className="text-center max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 mb-2">
                <Sliders className="h-3.5 w-3.5 text-purple-600" />
                Simulador de Redução de Custos
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
                Quanto o seu condomínio vai economizar?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1.5">
                Arraste para selecionar a quantidade de apartamentos do seu prédio:
              </p>
            </div>

            {/* Slider de Unidades */}
            <div className="mt-8 max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs font-extrabold text-zinc-700 mb-2">
                <span>4 Unidades</span>
                <span className="text-base text-purple-700 bg-purple-100 px-3 py-1 rounded-xl">
                  {unitCount} Apartamentos
                </span>
                <span>30 Unidades</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="1"
                value={unitCount}
                onChange={(e) => setUnitCount(parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Comparativo de Custos */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {/* Administradora Tradicional */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                  Administradora Tradicional
                </span>
                <div className="text-2xl sm:text-3xl font-black text-red-900 mt-2">
                  R$ {traditionalAdminCost.toFixed(2).replace(".", ",")}
                  <span className="text-xs font-medium text-red-700">/mês</span>
                </div>
                <p className="text-[11px] text-red-600/90 mt-2">
                  Taxas altas, burocracia e cobrança de até R$ 5 por boleto emitido.
                </p>
              </div>

              {/* CondominIA */}
              <div className="rounded-2xl border-2 border-purple-500 bg-purple-50/80 p-5 relative shadow-md">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
                  Plano Fixo
                </span>
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                  Com o CondominIA
                </span>
                <div className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
                  R$ 49,90
                  <span className="text-xs font-medium text-purple-700">/mês</span>
                </div>
                <p className="text-[11px] text-purple-800 font-bold mt-2">
                  Apenas R$ {costPerUnit} por apartamento ao mês!
                </p>
              </div>

              {/* Economia Anual */}
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Economia no Fundo de Reserva
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-2">
                  R$ {annualSavings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  <span className="text-xs font-medium text-emerald-700">/ano</span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium mt-2">
                  Dinheiro que sobra para pintar a fachada, trocar câmeras ou reformar o portão.
                </p>
              </div>
            </div>

            {/* CTA do Simulador */}
            <div className="mt-8 text-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-purple-700 transition"
              >
                Garantir R$ 49,90/mês para meu condomínio
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HUB DE EXPERIMENTAÇÃO EM 1 CLIQUE (A DEMONSTRAÇÃO VIVA) */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Sem cadastro • Sem senha • 100% Grátis
            </span>
            <h2 className="text-3xl font-black text-zinc-950">
              Experimente a facilidade agora mesmo
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              Escolha qual perfil você deseja testar no condomínio modelo de 16 apartamentos:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Visão do Síndico */}
            <div className="rounded-3xl border-2 border-purple-300 bg-gradient-to-b from-white to-purple-50/40 p-6 sm:p-8 shadow-xl hover:border-purple-500 transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/25">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md border border-purple-200">
                    Ambiente do Síndico
                  </span>
                </div>

                <h3 className="text-xl font-black text-zinc-950">
                  Painel de Gestão do Síndico
                </h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  Veja como é simples calcular a divisão de contas, lançar notas no Livro Caixa e gerenciar quem já pagou.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs font-semibold text-zinc-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Calculadora de rateio de água, luz e cota fixa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Quadro de pagamentos com baixa em 1 clique (Pix/Dinheiro)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Lembretes de cobrança amigáveis prontos para o WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Livro Caixa com anexo de comprovantes e fotos de notas</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleEnterSindico}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition cursor-pointer"
              >
                Abrir Painel do Síndico (Demo)
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Card 2: Visão do Morador */}
            <div className="rounded-3xl border-2 border-blue-300 bg-gradient-to-b from-white to-blue-50/40 p-6 sm:p-8 shadow-xl hover:border-blue-500 transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                    <Home className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md border border-blue-200">
                    Ambiente do Morador
                  </span>
                </div>

                <h3 className="text-xl font-black text-zinc-950">
                  Portal de Transparência do Morador
                </h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  Experimente o que o seu vizinho visualiza: total clareza, prestação de contas com comprovantes e Pix sem burocracia.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs font-semibold text-zinc-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Cota do mês discriminada (quanto é água, luz e cota fixa)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Chave Pix oficial com botão Copia e Cola para pagar no app do banco</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Acesso a todas as notas fiscais das despesas do condomínio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Mural de comunicados e regras de convivência</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleEnterMorador}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition cursor-pointer"
              >
                Abrir Visão do Morador - Apto 101 (Demo)
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TABELA DE CONTRASTE: O JEITO ANTIGO VS O JEITO CONDOMINIA */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Comparativo Definitivo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1">
              Por que condomínios estão abandonando planilhas e administradoras?
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-lg">
            <div className="grid grid-cols-2 text-center text-xs sm:text-sm font-bold border-b border-zinc-200">
              <div className="p-4 bg-red-50/60 text-red-900 border-r border-zinc-200">
                ❌ O Jeito Antigo (Planilha / Administradora)
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-950">
                ✅ Com o CondominIA (R$ 49,90/mês)
              </div>
            </div>

            <div className="divide-y divide-zinc-100 text-xs sm:text-sm">
              <div className="grid grid-cols-2 p-4">
                <div className="pr-4 text-zinc-600 border-r border-zinc-100 flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Mensalidade cara de R$ 600 a R$ 1.500/mês para fazer o básico.</span>
                </div>
                <div className="pl-4 text-zinc-900 font-semibold flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Apenas R$ 49,90 fixo, sem importar a quantidade de moradores.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4">
                <div className="pr-4 text-zinc-600 border-r border-zinc-100 flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Taxa de R$ 3 a R$ 5 por boleto emitido, comendo o dinheiro do condomínio.</span>
                </div>
                <div className="pl-4 text-zinc-900 font-semibold flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Recebimento via Pix direto na conta do prédio com taxa zero.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4">
                <div className="pr-4 text-zinc-600 border-r border-zinc-100 flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Morador desconfiado cobrando notas fiscais e extratos no elevador.</span>
                </div>
                <div className="pl-4 text-zinc-900 font-semibold flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Foto da nota fiscal anexada a cada despesa, visível para todos 24h.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4">
                <div className="pr-4 text-zinc-600 border-r border-zinc-100 flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Síndico perde o fim de semana somando contas na calculadora.</span>
                </div>
                <div className="pl-4 text-zinc-900 font-semibold flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fechamento pronto em 3 minutos: digite a água e a luz e pronto.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4">
                <div className="pr-4 text-zinc-600 border-r border-zinc-100 flex items-start gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Cobrança constrangedora de vizinhos no portão ou grupo de WhatsApp.</span>
                </div>
                <div className="pl-4 text-zinc-900 font-semibold flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Lembrete amigável e profissional no privado com chave Pix em 1 clique.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OS 4 PILARES DO CONDOMINIA */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Recursos Essenciais
            </span>
            <h2 className="text-3xl font-black text-zinc-950 mt-1">
              Tudo o que seu condomínio precisa. Nem mais, nem menos.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-950">Rateio em 3 Minutos</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Digite a conta de água e luz. O sistema divide automaticamente entre os apartamentos e suporta isenção de síndico com 1 clique.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-950">Livro Caixa com Fotos</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Tire foto da nota fiscal do reparo da bomba ou da lâmpada. Cada centavo fica auditável, eliminando brigas em assembleias.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-950">Pix Direto na Conta</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                O valor pago pelos moradores cai direto na conta bancária do condomínio, sem intermediadores e sem taxas de emissão de boletos.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-950">App Leve sem Loja (PWA)</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Nenhum morador precisa ir na Play Store ou Apple Store. O acesso é instantâneo via link no WhatsApp e salva na tela de início.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROVA SOCIAL & DEPOIMENTOS REALISTAS */}
      <section className="border-t border-zinc-200 bg-gradient-to-b from-purple-50/50 to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
              <span className="ml-2 text-xs font-bold text-zinc-700">4.9 de 5 estrelas</span>
            </div>
            <h2 className="text-3xl font-black text-zinc-950">
              O que dizem os síndicos que usam o CondominIA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                &ldquo;Nosso prédio tem 12 apartamentos e a administradora cobrava R$ 850/mês. Com o CondominIA pagamos R$ 49,90 e eu fecho o rateio em 5 minutos. Ninguém mais me para na garagem com dúvidas.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <strong className="block text-xs font-bold text-zinc-900">Geraldo M.</strong>
                <span className="text-[11px] text-zinc-500">Síndico Morador • Residencial Vila Nova (SP)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                &ldquo;O que mais me impressionou foi o Livro Caixa com foto das notas. Antes, toda reunião era uma discussão sobre despesas. Agora, cada morador vê a foto do comprovante no celular.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <strong className="block text-xs font-bold text-zinc-900">Mariana Silveira</strong>
                <span className="text-[11px] text-zinc-500">Síndica • Edifício Solar das Flores (RJ)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                &ldquo;Os moradores adoraram não precisar baixar aplicativo de 100MB da Play Store. Eles recebem o link no WhatsApp, clicam e pagam com a chave Pix Copia e Cola na hora.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <strong className="block text-xs font-bold text-zinc-900">Roberto Antunes</strong>
                <span className="text-[11px] text-zinc-500">Síndico • Condomínio Primavera (MG)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OFERTA IRRESISTÍVEL (PRICING SECTION) */}
      <section className="py-14 sm:py-20 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-bold text-purple-300 border border-purple-500/30 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            Condição Especial para Novos Condomínios
          </span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Toda a tranquilidade do seu prédio por um preço simbólico
          </h2>

          <div className="mt-8 rounded-3xl border-2 border-purple-500/40 bg-zinc-800/80 p-8 sm:p-10 shadow-2xl relative">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Plano Essencial CondominIA
              </span>
              <div className="mt-3 flex items-baseline justify-center gap-2">
                <span className="text-zinc-400 text-xl font-bold">R$</span>
                <span className="text-5xl sm:text-6xl font-black text-white">49,90</span>
                <span className="text-zinc-400 text-sm font-semibold">/mês por condomínio</span>
              </div>
              <p className="mt-2 text-xs text-purple-300 font-semibold">
                (Em um prédio de 16 unidades, dá apenas R$ 3,11 por apartamento ao mês)
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs sm:text-sm text-zinc-200">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Unidades ilimitadas cadastradas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Calculadora de rateio de água e luz</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Livro Caixa com fotos de notas fiscais</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Quadro de pagamentos com WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Portal exclusivo para cada morador</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Sem taxa de implantação</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Cancele quando quiser sem multas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Suporte direto via WhatsApp</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-700/60">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 transition cursor-pointer"
              >
                <MessageCircle className="h-5 w-5" />
                Ativar Meu Condomínio Agora no WhatsApp
              </a>
              <p className="mt-2.5 text-[11px] text-zinc-400">
                Ativação em 10 minutos com suporte passo a passo de nossa equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ COM QUEBRA DE OBJEÇÕES (ACCORDION) */}
      <section className="py-14 sm:py-20 bg-zinc-50/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Tire Suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-white overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 hover:bg-zinc-50 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-4 w-4 text-purple-600 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0 ml-2" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. RODAPÉ INSTITUCIONAL */}
      <footer className="border-t border-zinc-200 bg-white py-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo_condominia.png"
              alt="CondominIA Logo"
              className="h-7 w-7 rounded-lg object-contain shadow-2xs"
            />
            <span className="font-extrabold text-zinc-900">CondominIA</span>
            <span className="text-zinc-400">• DGTECH Soluções Tecnológicas</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600">
            <Link href="/" className="hover:text-purple-700 transition">
              Portal do Condomínio
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 transition font-bold"
            >
              Falar no WhatsApp
            </a>
          </div>

          <p className="text-[11px] text-zinc-400">
            © 2026 CondominIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* 11. BARRA FLUTUANTE STICKY DE ALTA CONVERSÃO NO MOBILE */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-md p-3 shadow-2xl flex items-center justify-between gap-2">
        <div className="pl-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block leading-tight">
            Plano Completo
          </span>
          <span className="text-sm font-black text-purple-700">R$ 49,90/mês</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleEnterSindico}
            className="rounded-xl border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-900 cursor-pointer"
          >
            Demo
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Contratar
          </a>
        </div>
      </div>
    </div>
  );
}
