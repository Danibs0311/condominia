"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useCondoStore, DEMO_CONDO_ID, resetDemoData, getLoggedUser } from "@/lib/store";
import { AttachmentModal, Attachment } from "@/components/AttachmentModal";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  Building,
  Calendar,
  Image as ImageIcon,
  CreditCard,
  Users,
  Bell,
  Droplets,
  Zap,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function MoradorDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { condo, activeCondoId } = useCondoStore();

  useEffect(() => {
    const isDemo = activeCondoId === DEMO_CONDO_ID || condo.id === DEMO_CONDO_ID;
    if (isDemo) {
      setIsAuthorized(true);
      return;
    }
    const user = getLoggedUser();
    if (!user) {
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }
  }, [activeCondoId, condo.id, router]);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"cota" | "balancete" | "avisos">("cota");
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  // Estados para Navegação Histórica Contínua de Meses no Balancete do Morador
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  const monthNamesPt = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const currentClosingMonthIndex = monthNamesPt.indexOf(condo.currentClosing.month);
  const closingMonthIndex = currentClosingMonthIndex >= 0 ? currentClosingMonthIndex : 10;
  const closingYear = condo.currentClosing.year || 2026;

  // Data do mês ativo na navegação
  const activeDate = new Date(closingYear, closingMonthIndex + selectedMonthOffset, 1);
  const activeMonthName = monthNamesPt[activeDate.getMonth()];
  const activeYear = activeDate.getFullYear();
  const isCurrentMonthSelected = selectedMonthOffset === 0;

  // Mês anterior de referência do caixa herdado
  const prevDate = new Date(activeYear, activeDate.getMonth() - 1, 1);
  const prevMonthName = monthNamesPt[prevDate.getMonth()];
  const prevYear = prevDate.getFullYear();

  // Filtragem de despesas para o mês/ano selecionado
  const filteredExpenses = condo.expenses.filter((exp) => {
    if (exp.month && exp.year) {
      return exp.month.toLowerCase() === activeMonthName.toLowerCase() && exp.year === activeYear;
    }
    const parts = exp.date.split("/");
    if (parts.length === 3) {
      const expMonthIdx = parseInt(parts[1], 10) - 1;
      const expYear = parseInt(parts[2], 10);
      return expMonthIdx === activeDate.getMonth() && expYear === activeYear;
    }
    return isCurrentMonthSelected;
  });

  // Total de unidades registrado no condomínio (Referência Absoluta do Cadastro)
  const totalCondoUnits = condo.totalUnits || condo.units.length || 16;

  // Histórico de fechamentos arquivados vinculados ao condomínio
  const availablePastClosings = condo.pastClosings || [];
  const minOffset = -availablePastClosings.length;
  const canGoPrevious = selectedMonthOffset > minOffset;
  const canGoNext = selectedMonthOffset < 0;

  // Busca fechamento histórico arquivado correspondente ao mês/ano visualizado
  const matchedPastClosing = availablePastClosings.find(
    (c) => c.month.toLowerCase() === activeMonthName.toLowerCase() && c.year === activeYear
  );

  // Fator proporcional às unidades cadastradas (base padrão = 16 unidades)
  const unitScaleRatio = totalCondoUnits / 16;

  // Totais do mês visualizado com consistência contábil rigorosa
  const isFutureMonth = selectedMonthOffset > 0;

  // 1. Despesas do Mês (No mês vigente: soma das despesas filtradas; no histórico: valor do fechamento arquivado proporcional às unidades)
  const activeTotalExpenses = isFutureMonth
    ? 0
    : isCurrentMonthSelected
    ? filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    : matchedPastClosing
    ? parseFloat((matchedPastClosing.totalExpenses * unitScaleRatio).toFixed(2))
    : filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // 2. Receitas do Mês (No mês vigente: soma real das cotas quitadas; no histórico: receita real proporcional às unidades cadastradas)
  const currentMonthPaidRevenues = condo.units
    .filter((u) => u.paymentStatus === "paid")
    .reduce((acc, u) => acc + u.currentAmount, 0);

  const activeTotalRevenues = isFutureMonth
    ? 0
    : isCurrentMonthSelected
    ? currentMonthPaidRevenues
    : matchedPastClosing
    ? parseFloat((matchedPastClosing.totalRevenues * unitScaleRatio).toFixed(2))
    : 0;

  // 3. Saldo Anterior Herdado (Sem fallbacks fictícios arbitrários)
  const activePreviousBalance = isFutureMonth
    ? condo.cashBalance
    : isCurrentMonthSelected
    ? condo.currentClosing.previousBalance
    : matchedPastClosing
    ? parseFloat((matchedPastClosing.previousBalance * unitScaleRatio).toFixed(2))
    : condo.cashBalance;

  // 4. Saldo Final em Caixa do Mês (Encadeamento exato: Anterior + Receitas - Despesas)
  const activeFinalBalance = isFutureMonth
    ? condo.cashBalance
    : parseFloat((activePreviousBalance + activeTotalRevenues - activeTotalExpenses).toFixed(2));

  // Identifica a unidade do morador autenticado pelo CPF ou fallback para demonstração
  const loggedUser = typeof window !== "undefined" ? getLoggedUser() : null;
  const myUnit =
    (loggedUser && loggedUser.role === "resident"
      ? condo.units.find(
          (u) =>
            (loggedUser.unitId && u.id === loggedUser.unitId) ||
            u.residentCpf.replace(/\D/g, "") === loggedUser.cpf.replace(/\D/g, "") ||
            (loggedUser.unitNumber && u.number === loggedUser.unitNumber)
        )
      : null) ||
    condo.units.find((u) => u.number === "101") ||
    condo.units[0];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(condo.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeNotices = condo.notices.filter((n) => !n.isArchived);
  const totalPaidUnits = condo.units.filter((u) => u.paymentStatus === "paid").length;

  // Cálculo individual discriminado de água, energia e taxa com base no total cadastrado
  const payingUnitsCount = condo.currentClosing.isSyndicExempt
    ? Math.max(1, totalCondoUnits - 1)
    : totalCondoUnits;
  const isExempt = myUnit.isSyndic && condo.currentClosing.isSyndicExempt;

  const myWaterShare = isExempt ? 0 : condo.currentClosing.waterAmount / payingUnitsCount;
  const myElectricityShare = isExempt ? 0 : condo.currentClosing.electricityAmount / payingUnitsCount;
  const myCondoFee = condo.currentClosing.condoFeeApplied;
  const myTotalCalculated = myWaterShare + myElectricityShare + myCondoFee;

  const isDemoMode = activeCondoId === DEMO_CONDO_ID || condo.id === DEMO_CONDO_ID;

  const navItems = [
    { id: "cota", label: "Minha Cota", icon: <CreditCard className="h-4 w-4" /> },
    { id: "balancete", label: "Balancete (Prestação de Contas)", icon: <DollarSign className="h-4 w-4" /> },
    { id: "avisos", label: "Mural de Avisos", icon: <Bell className="h-4 w-4" />, badge: activeNotices.length },
  ];

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16">
      <Navbar
        role="resident"
        userName={myUnit.residentName}
        unitNumber={myUnit.number}
        condoName={condo.name}
        navItems={navItems}
        activeTab={activeTab}
        onSelectTab={(id) => setActiveTab(id as any)}
        isDemo={isDemoMode}
      />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        {/* Banner do Modo Demonstração no Morador */}
        {isDemoMode && (
          <div className="mb-6 rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 via-blue-50 to-indigo-50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Modo Demonstração • Visão do Morador
                  </span>
                  <span className="text-xs font-bold text-blue-900">
                    Plano Essencial • R$ 49,90/mês
                  </span>
                </div>
                <p className="text-xs text-zinc-700 mt-0.5">
                  Você está experimentando o portal da transparência como morador do Apto {myUnit.number}. Confira o Pix, balancete e mural de avisos!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/sindico?condoId=${DEMO_CONDO_ID}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-3 py-2 text-xs font-bold text-purple-800 hover:bg-purple-100 transition shadow-2xs"
              >
                Visão Síndico (Demo)
              </Link>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  alert("Dados da demonstração restaurados para o padrão original!");
                  window.location.reload();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-100/70 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-200 transition shadow-2xs cursor-pointer"
                title="Restaura os dados originais da demonstração"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restaurar Demo
              </button>
              <Link
                href="/demo"
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition shadow-2xs"
                title="Voltar para a página de apresentação da demonstração"
              >
                Sair da Demo
              </Link>
            </div>
          </div>
        )}

        {/* Gerenciador de Push Notifications no Celular */}
        <div className="mb-6">
          <PushNotificationManager
            condoName={condo.name}
            unitNumber={myUnit.number}
            role="resident"
          />
        </div>

        {/* Navegação por Abas (Estritamente 3 Abas) */}
        <div className="flex border-b border-zinc-200 overflow-x-auto gap-2 sm:gap-6 mb-6">
          <button
            onClick={() => setActiveTab("cota")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "cota"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            💳 Minha Cota
          </button>
          <button
            onClick={() => setActiveTab("balancete")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "balancete"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            📊 Balancete (Prestação de Contas)
          </button>
          <button
            onClick={() => setActiveTab("avisos")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "avisos"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            📢 Mural de Avisos ({activeNotices.length})
          </button>
        </div>

        {/* ABA 1: MINHA COTA */}
        {activeTab === "cota" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-zinc-900">Apartamento {myUnit.number}</h2>
                    {myUnit.paymentStatus === "paid" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Pago
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                        <Clock className="h-3.5 w-3.5" /> Aguardando Pagamento
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    Cota Condominial • Referência: {condo.currentClosing.month}/{condo.currentClosing.year}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Valor Total da Cota</span>
                  <div className="text-3xl font-extrabold text-blue-600">
                    R$ {myUnit.currentAmount.toFixed(2).replace(".", ",")}
                  </div>
                  <span className="text-xs text-zinc-500">
                    Vencimento: {condo.currentClosing.dueDate || `10/${condo.currentClosing.month.slice(0, 3)}`}
                  </span>
                </div>
              </div>

              {/* Composição Detalhada e Separada da Cobrança */}
              <div className="py-4 border-b border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Discriminação dos Valores (Composição da Cota)
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-medium">3 componentes somados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Rateio de Água */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/15 text-blue-600">
                        <Droplets className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-zinc-800">Consumo de Água</span>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-blue-700">
                        R$ {myWaterShare.toFixed(2).replace(".", ",")}
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        Total condomínio: R$ {condo.currentClosing.waterAmount.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  {/* 2. Rateio de Energia */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/15 text-amber-600">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-zinc-800">Consumo de Energia</span>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-amber-700">
                        R$ {myElectricityShare.toFixed(2).replace(".", ",")}
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        Total condomínio: R$ {condo.currentClosing.electricityAmount.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  {/* 3. Taxa Condominial Fixa */}
                  <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/15 text-purple-600">
                        <Building className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-zinc-800">Taxa Condominial</span>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-purple-700">
                        R$ {myCondoFee.toFixed(2).replace(".", ",")}
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        Fundo de reserva e despesas fixas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resumo da Soma */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2 text-xs text-zinc-600 border border-zinc-200/60">
                  <span className="font-medium">
                    Soma: Água (R$ {myWaterShare.toFixed(2)}) + Luz (R$ {myElectricityShare.toFixed(2)}) + Taxa (R$ {myCondoFee.toFixed(2)})
                  </span>
                  <strong className="text-zinc-900 font-bold">
                    = R$ {myTotalCalculated.toFixed(2).replace(".", ",")}
                  </strong>
                </div>
              </div>

              {/* Área Pix com os Dados Configurados pelo Síndico */}
              <div className="pt-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-zinc-900">Pague via Pix</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Identificação Automática
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Copie a chave Pix abaixo e confirme os dados de favorecido e banco no app da sua instituição financeira.
                </p>

                {/* Caixa de Cópia da Chave */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 font-mono text-sm font-bold text-zinc-900 break-all select-all border border-zinc-200/80">
                    {condo.pixKey || "Chave não configurada"}
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copiado!" : "Copiar Chave"}</span>
                  </button>
                </div>

                {/* Grid com os 4 Dados Detalhados */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-zinc-50 border border-zinc-200/70 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Tipo de Chave
                    </span>
                    <strong className="text-zinc-800 text-sm font-semibold">
                      {condo.pixKeyType || "CNPJ"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Favorecido / Titular
                    </span>
                    <strong className="text-zinc-800 text-sm font-semibold block truncate">
                      {condo.pixBeneficiary || condo.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Banco / Instituição
                    </span>
                    <strong className="text-zinc-800 text-sm font-semibold block truncate">
                      {condo.pixBank || "Banco Inter (077)"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: BALANCETE & PRESTAÇÃO DE CONTAS COM NAVEGAÇÃO HISTÓRICA */}
        {activeTab === "balancete" && (
          <div className="space-y-6">
            {/* SELETOR CONTÍNUO E INFINITO DE MESES (NÍVEL VISUALIZAÇÃO) */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                    Transparência & Prestação de Contas
                  </span>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      {activeMonthName} de {activeYear}
                    </h2>
                    {isCurrentMonthSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Mês Vigente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                        Histórico Arquivado ({selectedMonthOffset} meses)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {isCurrentMonthSelected
                      ? "Prestação de contas do mês em aberto para auditoria dos moradores."
                      : `Balancete fechado e auditado referente a ${activeMonthName}/${activeYear}.`}
                  </p>
                </div>

                {/* Controles de Navegação Mês a Mês */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() => setSelectedMonthOffset((prev) => prev - 1)}
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      !canGoPrevious
                        ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-50"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 active:scale-95 cursor-pointer"
                    }`}
                    title={
                      !canGoPrevious
                        ? "Início do histórico deste condomínio. Não há fechamentos anteriores arquivados."
                        : "Ver prestação de contas do mês anterior"
                    }
                  >
                    <ChevronLeft className="h-4 w-4 text-zinc-600" />
                    <span>Mês Anterior</span>
                  </button>

                  {!isCurrentMonthSelected && (
                    <button
                      type="button"
                      onClick={() => setSelectedMonthOffset(0)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 active:scale-95 transition shadow-2xs cursor-pointer"
                      title="Voltar ao mês atual"
                    >
                      Mês Vigente
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isCurrentMonthSelected}
                    onClick={() => setSelectedMonthOffset((prev) => Math.min(0, prev + 1))}
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      isCurrentMonthSelected
                        ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-50"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 active:scale-95 cursor-pointer"
                    }`}
                    title={
                      isCurrentMonthSelected
                        ? "Você já está no mês vigente atual. Meses futuros ainda não possuem lançamentos contábeis."
                        : "Avançar para o próximo mês no histórico"
                    }
                  >
                    <span>Mês Seguinte</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARDS DE TOTAIS ESPECIFICANDO O MÊS VIGENTE / SELECIONADO */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Caixa Mês Anterior
                </span>
                <div className="text-xl font-bold text-zinc-800 mt-1">
                  R$ {activePreviousBalance.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Herdado de {prevMonthName}/{prevYear}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Receitas do Mês
                  </span>
                  {isCurrentMonthSelected && (
                    <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Vigente
                    </span>
                  )}
                </div>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">
                  + R$ {activeTotalRevenues.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Cotas recebidas em {activeMonthName}/{activeYear}
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                    Despesas do Mês
                  </span>
                  {isCurrentMonthSelected && (
                    <span className="text-[9px] uppercase font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                      Vigente
                    </span>
                  )}
                </div>
                <div className="text-xl font-extrabold text-red-600 mt-1">
                  - R$ {activeTotalExpenses.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-[11px] text-red-700 mt-1">
                  Contas pagas em {activeMonthName}/{activeYear}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  {isCurrentMonthSelected ? "Valor em Caixa Hoje" : `Saldo Final (${activeMonthName})`}
                </span>
                <div className="text-2xl font-extrabold text-blue-700 mt-1">
                  R$ {activeFinalBalance.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-[11px] text-blue-800 mt-1">
                  {isCurrentMonthSelected ? "Saldo real consolidado" : `Posição de ${activeMonthName}/${activeYear}`}
                </p>
              </div>
            </div>

            {/* QUADRO DE ENTRADAS / RECEITAS DO MÊS NO BALANCETE */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 overflow-hidden shadow-xs p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-emerald-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                      Entradas e Arrecadação de {activeMonthName} de {activeYear}
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Cotas condominiais quitadas pelos moradores para cobrir as contas do condomínio ({totalCondoUnits} unidades)
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Total Arrecadado
                  </span>
                  <span className="text-lg font-black text-emerald-700">
                    + R$ {activeTotalRevenues.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {isCurrentMonthSelected
                    ? `${totalPaidUnits} de ${totalCondoUnits} unidades com pagamento de cota confirmado no mês vigente.`
                    : matchedPastClosing
                    ? `Fechamento de contas arquivado referente às ${totalCondoUnits} unidades cadastradas.`
                    : `Sem movimentação de receitas arquivada para este período.`}
                </span>
              </div>
            </div>

            {/* LISTAGEM DE DESPESAS COM DATA E MÊS BEM VISÍVEIS */}
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    Despesas Detalhadas de {activeMonthName} de {activeYear}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Notas fiscais, recibos e contas públicas pagas pelo condomínio neste período.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200/80 px-2.5 py-1 text-xs font-bold text-zinc-800 self-start sm:self-auto">
                  {filteredExpenses.length} {filteredExpenses.length === 1 ? "despesa" : "despesas"}
                </span>
              </div>

              {filteredExpenses.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-zinc-700">
                    Nenhuma despesa registrada para {activeMonthName}/{activeYear}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Não há lançamentos de notas fiscais arquivados para este período.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {filteredExpenses.map((expense) => {
                    const categoryBadges: Record<string, { label: string; color: string }> = {
                      water: { label: "Água", color: "bg-blue-50 text-blue-700 border-blue-200" },
                      electricity: { label: "Energia", color: "bg-amber-50 text-amber-700 border-amber-200" },
                      maintenance: { label: "Manutenção", color: "bg-purple-50 text-purple-700 border-purple-200" },
                      cleaning: { label: "Limpeza", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    };
                    const badgeInfo = categoryBadges[expense.category] || {
                      label: "Geral",
                      color: "bg-zinc-100 text-zinc-700 border-zinc-200",
                    };

                    const dayPart = expense.date.split("/")[0] || "01";
                    const monthPart = (expense.month || activeMonthName).slice(0, 3).toUpperCase();

                    return (
                      <div
                        key={expense.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/80 transition"
                      >
                        {/* Bloco de Data e Mês em Destaque */}
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 min-w-[58px] shadow-2xs">
                            <span className="text-[10px] uppercase font-extrabold text-blue-800 tracking-wider">
                              {monthPart}
                            </span>
                            <span className="text-lg font-black text-blue-950 leading-none">
                              {dayPart}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-zinc-900">{expense.description}</h4>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeInfo.color}`}
                              >
                                {badgeInfo.label}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Data do Pagamento: <strong className="text-zinc-700">{expense.date}</strong> • Mês de Referência:{" "}
                              <strong className="text-blue-800">{expense.month || activeMonthName} de {expense.year || activeYear}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Valor e Botão Ver NF */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                          <span className="text-base font-extrabold text-red-600">
                            - R$ {expense.amount.toFixed(2).replace(".", ",")}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedAttachment({
                                name: `Comprovante / Nota Fiscal - ${expense.description}`,
                                type: "image",
                                url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Ver NF</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 4: MURAL DE AVISOS COM FOTOS E PDFS */}
        {activeTab === "avisos" && (
          <div className="space-y-4">
            {activeNotices.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
                <p className="text-sm font-medium text-zinc-600">Nenhum comunicado ativo no momento.</p>
                <p className="text-xs text-zinc-400 mt-1">Todos os comunicados do síndico aparecerão aqui.</p>
              </div>
            ) : (
              activeNotices.map((notice) => (
                <div key={notice.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <h3 className="text-base font-bold text-zinc-900">{notice.title}</h3>
                    <span className="text-xs text-zinc-400">{notice.date}</span>
                  </div>

                  <p className="text-sm text-zinc-700 mt-3 leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>

                  {/* Anexos (Fotos e PDFs) */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-100">
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                        Anexos Oficiais
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {notice.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedAttachment(att)}
                            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-blue-50/50 hover:border-blue-300 p-2 text-xs cursor-pointer transition shadow-2xs group"
                            title="Clique para maximizar e visualizar em tela cheia"
                          >
                            {att.type === "image" ? (
                              <>
                                <img src={att.url} alt={att.name} className="h-10 w-10 rounded-lg object-cover group-hover:scale-105 transition" />
                                <div>
                                  <p className="font-semibold text-zinc-800 group-hover:text-blue-600 transition">{att.name}</p>
                                  <span className="text-[10px] text-zinc-500">Toque para maximizar foto</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 group-hover:scale-105 transition">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-zinc-800 group-hover:text-blue-600 transition">{att.name}</p>
                                  <span className="text-[10px] text-zinc-500">Toque para abrir PDF</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Modal Lightbox para Maximizar Fotos e PDFs */}
      <AttachmentModal
        attachment={selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
      />
    </div>
  );
}
