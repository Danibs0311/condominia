"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Unit } from "@/lib/mock-data";
import { useCondoStore, DEMO_CONDO_ID, resetDemoData, getLoggedUser } from "@/lib/store";
import { AttachmentModal, Attachment } from "@/components/AttachmentModal";
import { sendPushNotification } from "@/lib/push-notifications";
import {
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  KeyRound,
  Plus,
  RefreshCw,
  Users,
  Building,
  Upload,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Download,
  Trash2,
  Archive,
  RotateCcw,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Receipt,
  CalendarDays,
  Edit3,
  MessageCircle,
  Copy,
  Hash,
  SlidersHorizontal,
  Sparkles,
  LayoutGrid,
  List,
  Search,
  Send,
  Banknote,
  TrendingUp,
} from "lucide-react";

export default function SindicoDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { condo, activeCondoId, updateCondo } = useCondoStore();

  useEffect(() => {
    const isDemo = activeCondoId === DEMO_CONDO_ID || condo.id === DEMO_CONDO_ID;
    if (isDemo) {
      setIsAuthorized(true);
      return;
    }
    const user = getLoggedUser();
    if (!user || user.role !== "syndic") {
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }
  }, [activeCondoId, condo.id, router]);

  const syndicUnit = condo.units.find((u) => u.isSyndic) || condo.units[condo.units.length - 1];
  const [activeTab, setActiveTab] = useState<"rateio" | "baixa" | "caixa" | "avisos" | "moradores">("rateio");
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  // Estados da Calculadora de Rateio
  const [closingMonth, setClosingMonth] = useState(condo.currentClosing.month || "Novembro");
  const [closingYear, setClosingYear] = useState<number | string>(condo.currentClosing.year || 2026);
  const [closingDueDate, setClosingDueDate] = useState(condo.currentClosing.dueDate || "10/11/2026");
  const [closingPreviousBalance, setClosingPreviousBalance] = useState((condo.currentClosing.previousBalance || 0).toString());
  const [waterBill, setWaterBill] = useState(condo.currentClosing.waterAmount.toString());
  const [electricityBill, setElectricityBill] = useState(condo.currentClosing.electricityAmount.toString());
  const [condoFee, setCondoFee] = useState(condo.currentClosing.condoFeeApplied.toString());
  const [isSyndicExempt, setIsSyndicExempt] = useState(condo.currentClosing.isSyndicExempt);
  const [calculationFeedback, setCalculationFeedback] = useState("");

  // Estados dos Dados Pix para Pagamento
  const [pixKeyType, setPixKeyType] = useState(condo.pixKeyType || "CNPJ");
  const [pixKey, setPixKey] = useState(condo.pixKey || "12.345.678/0001-90");
  const [pixBeneficiary, setPixBeneficiary] = useState(condo.pixBeneficiary || condo.name);
  const [pixBank, setPixBank] = useState(condo.pixBank || "Banco Inter (077)");

  useEffect(() => {
    setClosingMonth(condo.currentClosing.month || "Novembro");
    setClosingYear(condo.currentClosing.year || 2026);
    setClosingDueDate(condo.currentClosing.dueDate || "10/11/2026");
    setClosingPreviousBalance((condo.currentClosing.previousBalance || 0).toString());
    setWaterBill(condo.currentClosing.waterAmount.toString());
    setElectricityBill(condo.currentClosing.electricityAmount.toString());
    setCondoFee(condo.currentClosing.condoFeeApplied.toString());
    setIsSyndicExempt(condo.currentClosing.isSyndicExempt);
    setPixKeyType(condo.pixKeyType || "CNPJ");
    setPixKey(condo.pixKey || "12.345.678/0001-90");
    setPixBeneficiary(condo.pixBeneficiary || condo.name);
    setPixBank(condo.pixBank || "Banco Inter (077)");
  }, [
    condo.id,
    condo.currentClosing.month,
    condo.currentClosing.year,
    condo.currentClosing.dueDate,
    condo.currentClosing.previousBalance,
    condo.currentClosing.waterAmount,
    condo.currentClosing.electricityAmount,
    condo.currentClosing.condoFeeApplied,
    condo.currentClosing.isSyndicExempt,
    condo.pixKeyType,
    condo.pixKey,
    condo.pixBeneficiary,
    condo.pixBank,
    condo.name,
  ]);

  // Estado para Reset de Senha de Morador
  const [selectedUnitForReset, setSelectedUnitForReset] = useState<Unit | null>(null);
  const [newPassword, setNewPassword] = useState("123456");
  const [resetSuccess, setResetSuccess] = useState("");

  // Estados para Cadastro e Edição de Morador da Unidade
  const [selectedUnitForEdit, setSelectedUnitForEdit] = useState<Unit | null>(null);
  const [editUnitNumber, setEditUnitNumber] = useState("");
  const [editResidentName, setEditResidentName] = useState("");
  const [editResidentCpf, setEditResidentCpf] = useState("");
  const [editResidentPhone, setEditResidentPhone] = useState("");
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const [copiedInviteUnitId, setCopiedInviteUnitId] = useState<string | null>(null);

  // Estados para Personalização de Numeração em Lote
  const [isBatchNumberingModalOpen, setIsBatchNumberingModalOpen] = useState(false);
  const [batchNumbers, setBatchNumbers] = useState<string[]>([]);

  // Helper: Extrair os 6 primeiros dígitos do CPF como senha padrão
  const getInitialPasswordFromCpf = (cpf: string) => {
    const digits = cpf.replace(/\D/g, "");
    return digits.slice(0, 6) || "123456";
  };

  // Estado para novo aviso
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticePublished, setNoticePublished] = useState(false);
  const [noticeFilter, setNoticeFilter] = useState<"active" | "archived">("active");

  // Estados para o Quadro de Pagamentos das Unidades
  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "paid">("all");
  const [paymentViewMode, setPaymentViewMode] = useState<"grid" | "list">("grid");
  const [paymentSearch, setPaymentSearch] = useState("");

  // Estados para Navegação Histórica Contínua de Meses no Livro Caixa
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  // Estados para Lançamento de Nova Despesa
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState<"water" | "electricity" | "maintenance" | "cleaning">("maintenance");
  const [newExpenseDate, setNewExpenseDate] = useState("2026-11-06");
  const [expenseSuccessMessage, setExpenseSuccessMessage] = useState("");

  const monthNamesPt = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const currentClosingMonthIndex = monthNamesPt.indexOf(condo.currentClosing.month);
  const closingMonthIndex = currentClosingMonthIndex >= 0 ? currentClosingMonthIndex : 10;
  const currentYearNum = typeof closingYear === "string" ? parseInt(closingYear) || 2026 : closingYear;

  // Data do mês ativo na navegação
  const activeDate = new Date(currentYearNum, closingMonthIndex + selectedMonthOffset, 1);
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

  // 3. Saldo Anterior Herdado (Encadeamento sem fallbacks fictícios arbitrários)
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

  // Cálculos dinâmicos da simulação
  const water = parseFloat(waterBill) || 0;
  const electricity = parseFloat(electricityBill) || 0;
  const fee = parseFloat(condoFee) || 0;
  const totalUtilities = water + electricity;

  // Divisão: se isenção ativa, (totalCondoUnits - 1) pagam consumo; se desativada, todas as totalCondoUnits pagam consumo
  const payingUnitsForUtilities = isSyndicExempt ? Math.max(1, totalCondoUnits - 1) : totalCondoUnits;
  const utilitySharePerUnit = totalUtilities / payingUnitsForUtilities;
  const residentTotalShare = utilitySharePerUnit + fee;
  const syndicTotalShare = isSyndicExempt ? fee : residentTotalShare;

  // Aplicar Fechamento
  const handleApplyClosing = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUnits = condo.units.map((unit) => {
      const amount = unit.isSyndic ? syndicTotalShare : residentTotalShare;
      return {
        ...unit,
        currentAmount: parseFloat(amount.toFixed(2)),
      };
    });

    const parsedPreviousBalance = parseFloat(closingPreviousBalance) || 0;
    const currentPaidRevenues = updatedUnits
      .filter((u) => u.paymentStatus === "paid")
      .reduce((acc, u) => acc + u.currentAmount, 0);

    const currentYearParsed = typeof closingYear === "string" ? parseInt(closingYear) || 2026 : closingYear;
    const currentMonthExpenses = condo.expenses
      .filter((exp) => (exp.month === closingMonth && exp.year === currentYearParsed) || (!exp.month && !exp.year))
      .reduce((acc, exp) => acc + exp.amount, 0);

    const newFinalBalance = parsedPreviousBalance + currentPaidRevenues - currentMonthExpenses;

    updateCondo((prev) => ({
      ...prev,
      pixKeyType,
      pixKey,
      pixBeneficiary,
      pixBank,
      cashBalance: parseFloat(newFinalBalance.toFixed(2)),
      currentClosing: {
        ...prev.currentClosing,
        month: closingMonth,
        year: currentYearParsed,
        dueDate: closingDueDate,
        previousBalance: parsedPreviousBalance,
        totalRevenues: parseFloat(currentPaidRevenues.toFixed(2)),
        totalExpenses: parseFloat(currentMonthExpenses.toFixed(2)),
        finalBalance: parseFloat(newFinalBalance.toFixed(2)),
        waterAmount: water,
        electricityAmount: electricity,
        condoFeeApplied: fee,
        isSyndicExempt,
      },
      units: updatedUnits,
    }));

    // Dispara Push Notification nativa para os moradores avisando do novo rateio
    sendPushNotification({
      title: `🔔 Fechamento do Mês • ${condo.name}`,
      body: `A cota de ${closingMonth}/${currentYearParsed} foi calculada (Vencimento: ${closingDueDate}). Acesse o aplicativo para ver e pagar via Pix.`,
      url: "/morador",
    });

    setCalculationFeedback("Cálculo, rateio, saldo em caixa e dados de pagamento atualizados com sucesso!");
    setTimeout(() => setCalculationFeedback(""), 3500);
  };

  // Alternar Pagamento de Unidade (Baixa Manual) com atualização instantânea da receita e saldo de caixa
  const togglePayment = (unitId: string, method: "pix" | "cash") => {
    updateCondo((prev) => {
      const updatedUnits = prev.units.map((u) => {
        if (u.id === unitId) {
          const isCurrentlyPaid = u.paymentStatus === "paid";
          return {
            ...u,
            paymentStatus: isCurrentlyPaid ? ("pending" as const) : ("paid" as const),
            paymentMethod: isCurrentlyPaid ? undefined : method,
            paidAt: isCurrentlyPaid ? undefined : "Hoje às 15:40",
          };
        }
        return u;
      });

      // Recalcula a receita arrecadada real do mês vigente e sincroniza o saldo em caixa
      const newPaidRevenues = updatedUnits
        .filter((u) => u.paymentStatus === "paid")
        .reduce((acc, u) => acc + u.currentAmount, 0);

      const currentExpenses = prev.expenses
        .filter((e) => (e.month === prev.currentClosing.month && e.year === prev.currentClosing.year) || (!e.month && !e.year))
        .reduce((acc, e) => acc + e.amount, 0);

      const newFinalBalance = prev.currentClosing.previousBalance + newPaidRevenues - currentExpenses;

      return {
        ...prev,
        units: updatedUnits,
        cashBalance: parseFloat(newFinalBalance.toFixed(2)),
        currentClosing: {
          ...prev.currentClosing,
          totalRevenues: parseFloat(newPaidRevenues.toFixed(2)),
          finalBalance: parseFloat(newFinalBalance.toFixed(2)),
        },
      };
    });
  };

  // Abrir Modal de Edição de Unidade / Morador
  const openEditUnitModal = (unit: Unit) => {
    setSelectedUnitForEdit(unit);
    setEditUnitNumber(unit.number);
    setEditResidentName(unit.residentName);
    setEditResidentCpf(unit.residentCpf);
    setEditResidentPhone(unit.residentPhone);
  };

  // Salvar Dados do Morador da Unidade
  const handleSaveUnitResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitForEdit) return;

    const rawCpf = editResidentCpf.replace(/\D/g, "");
    if (rawCpf.length !== 11) {
      alert("O CPF deve conter exatamente 11 dígitos numéricos.");
      return;
    }

    const defaultPwd = getInitialPasswordFromCpf(editResidentCpf);
    const updatedNumber = editUnitNumber.trim() || selectedUnitForEdit.number;

    updateCondo((prev) => {
      const updated = prev.units.map((u) => {
        if (u.id === selectedUnitForEdit.id) {
          return {
            ...u,
            number: updatedNumber,
            residentName: editResidentName.trim(),
            residentCpf: editResidentCpf.trim(),
            residentPhone: editResidentPhone.trim(),
          };
        }
        return u;
      });
      return { ...prev, units: updated };
    });

    setEditSuccessMessage(`Unidade ${updatedNumber} atualizada! Login: ${editResidentCpf} • Senha inicial: ${defaultPwd}`);
    setTimeout(() => {
      setEditSuccessMessage("");
      setSelectedUnitForEdit(null);
    }, 2800);
  };

  // Abrir Modal de Numeração em Lote
  const openBatchNumberingModal = () => {
    setBatchNumbers(condo.units.map((u) => u.number));
    setIsBatchNumberingModalOpen(true);
  };

  // Aplicar Template Predefinido no Lote de Acordo com o Total Real de Unidades
  const applyNumberingTemplate = (type: "hundreds" | "tens" | "sequential") => {
    const total = condo.units.length;
    if (type === "hundreds") {
      setBatchNumbers(
        Array.from({ length: total }, (_, i) => {
          const floor = Math.floor(i / 4) + 1;
          const door = (i % 4) + 1;
          return `${floor}0${door}`;
        })
      );
    } else if (type === "tens") {
      setBatchNumbers(
        Array.from({ length: total }, (_, i) => {
          const floor = Math.floor(i / 4) + 1;
          const door = (i % 4) + 1;
          return `${floor}${door}`;
        })
      );
    } else if (type === "sequential") {
      setBatchNumbers(Array.from({ length: total }, (_, i) => String(i + 1).padStart(2, "0")));
    }
  };

  // Disparar Lembrete Amigável de Pagamento via WhatsApp com Chave Pix
  const handleSendPaymentReminder = (unit: Unit) => {
    const cleanPhone = unit.residentPhone.replace(/\D/g, "");
    const dueDateText = condo.currentClosing.dueDate || "10/11/2026";
    const msg = `Olá, ${unit.residentName}! Segue o lembrete da cota condominial do ${condo.name} referente a ${condo.currentClosing.month}/${condo.currentClosing.year}.\n\n🏢 Unidade: ${unit.number}\n💰 Valor: R$ ${unit.currentAmount.toFixed(2).replace(".", ",")}\n📅 Vencimento: ${dueDateText}\n\n🔑 Chave Pix (${condo.pixKeyType}): ${condo.pixKey}\n👤 Titular: ${condo.pixBeneficiary || condo.name}\n🏦 Banco: ${condo.pixBank || "Banco Inter (077)"}\n\nFavor desconsiderar caso já tenha realizado o pagamento. Obrigado!`;
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // Salvar Numerações em Lote
  const handleSaveBatchNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    updateCondo((prev) => {
      const updated = prev.units.map((u, index) => ({
        ...u,
        number: (batchNumbers[index] || u.number).trim(),
      }));
      return { ...prev, units: updated };
    });

    setEditSuccessMessage("Numerações das unidades atualizadas com sucesso!");
    setTimeout(() => {
      setEditSuccessMessage("");
      setIsBatchNumberingModalOpen(false);
    }, 2500);
  };

  // Resetar Senha para o Padrão (6 Primeiros Dígitos do CPF)
  const handleResetToDefaultPassword = (unit: Unit) => {
    const defaultPwd = getInitialPasswordFromCpf(unit.residentCpf);
    setResetSuccess(`Senha do Apto ${unit.number} restaurada para os 6 primeiros dígitos do CPF (${defaultPwd})!`);
    setTimeout(() => setResetSuccess(""), 4000);
  };

  // Copiar Convite de WhatsApp
  const handleCopyInvite = (unit: Unit) => {
    const defaultPwd = getInitialPasswordFromCpf(unit.residentCpf);
    const text = `Olá, ${unit.residentName}! Seu acesso ao aplicativo do ${condo.name} (Apto ${unit.number}) está pronto.\n\n📱 Link: ${typeof window !== "undefined" ? window.location.origin : ""}/morador\n👤 Login: ${unit.residentCpf}\n🔑 Senha inicial: ${defaultPwd} (os 6 primeiros dígitos do seu CPF).`;
    navigator.clipboard.writeText(text);
    setCopiedInviteUnitId(unit.id);
    setTimeout(() => setCopiedInviteUnitId(null), 2500);
  };

  // Executar Reset de Senha Personalizada do Morador
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("A senha deve ter no mínimo 6 dígitos.");
      return;
    }
    setResetSuccess(`Senha do Apto ${selectedUnitForReset?.number} redefinida para: ${newPassword}`);
    setTimeout(() => {
      setResetSuccess("");
      setSelectedUnitForReset(null);
    }, 2500);
  };

  // Publicar Novo Aviso
  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    const newNotice = {
      id: `not-${Date.now()}`,
      title: noticeTitle,
      content: noticeContent,
      date: "Hoje às 15:45",
      author: "Síndico",
    };

    updateCondo((prev) => ({
      ...prev,
      notices: [newNotice, ...prev.notices],
    }));

    // Dispara Push Notification nativa para os moradores avisando do novo comunicado
    sendPushNotification({
      title: `📢 Novo Comunicado • ${condo.name}`,
      body: `${noticeTitle}: ${noticeContent.slice(0, 90)}${noticeContent.length > 90 ? "..." : ""}`,
      url: "/morador",
    });

    setNoticeTitle("");
    setNoticeContent("");
    setNoticePublished(true);
    setTimeout(() => setNoticePublished(false), 3000);
  };

  // Adicionar Nova Despesa ao Livro Caixa
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newExpenseAmount);
    if (!newExpenseDescription || isNaN(amountNum) || amountNum <= 0) {
      alert("Por favor, preencha a descrição e um valor válido para a despesa.");
      return;
    }

    const dateObj = new Date(newExpenseDate + "T12:00:00");
    const dayStr = String(dateObj.getDate()).padStart(2, "0");
    const monthStr = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yearNum = dateObj.getFullYear();
    const formattedDate = `${dayStr}/${monthStr}/${yearNum}`;
    const expMonth = monthNamesPt[dateObj.getMonth()];

    const newExp = {
      id: `exp-${Date.now()}`,
      category: newExpenseCategory,
      description: newExpenseDescription,
      amount: amountNum,
      date: formattedDate,
      month: expMonth,
      year: yearNum,
      receiptUrl: "#",
    };

    updateCondo((prev) => {
      const updatedExpenses = [newExp, ...prev.expenses];
      const newCashBalance = prev.cashBalance - amountNum;
      return {
        ...prev,
        expenses: updatedExpenses,
        cashBalance: parseFloat(newCashBalance.toFixed(2)),
        currentClosing: {
          ...prev.currentClosing,
          totalExpenses: prev.currentClosing.totalExpenses + amountNum,
          finalBalance: parseFloat(newCashBalance.toFixed(2)),
        },
      };
    });

    // Dispara Push Notification nativa para os moradores sobre novo comprovante
    sendPushNotification({
      title: `📄 Novo Comprovante • ${condo.name}`,
      body: `Nova despesa lançada no Livro Caixa: ${newExpenseDescription} (R$ ${amountNum.toFixed(2).replace(".", ",")}). Comprovante disponível para consulta.`,
      url: "/morador",
    });

    setNewExpenseDescription("");
    setNewExpenseAmount("");
    setExpenseSuccessMessage("Despesa adicionada com sucesso no Livro Caixa!");
    setTimeout(() => setExpenseSuccessMessage(""), 3500);
  };

  // Excluir Despesa do Livro Caixa
  const handleDeleteExpense = (expenseId: string, amount: number) => {
    if (!confirm("Deseja realmente excluir este lançamento do Livro Caixa?")) return;
    updateCondo((prev) => {
      const updated = prev.expenses.filter((e) => e.id !== expenseId);
      const newCashBalance = prev.cashBalance + amount;
      return {
        ...prev,
        expenses: updated,
        cashBalance: parseFloat(newCashBalance.toFixed(2)),
        currentClosing: {
          ...prev.currentClosing,
          totalExpenses: Math.max(0, prev.currentClosing.totalExpenses - amount),
          finalBalance: parseFloat(newCashBalance.toFixed(2)),
        },
      };
    });
  };

  // Arquivar Aviso do Mural (Soft delete: sai da visão do morador, mas preserva 100% dos dados e anexos)
  const handleArchiveNotice = (id: string) => {
    updateCondo((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === id ? { ...n, isArchived: true, archivedAt: "Hoje às 16:30" } : n
      ),
    }));
  };

  // Restaurar Aviso Arquivado para o Mural
  const handleRestoreNotice = (id: string) => {
    updateCondo((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === id ? { ...n, isArchived: false, archivedAt: undefined } : n
      ),
    }));
  };

  // Exclusão definitiva caso o síndico queira limpar teste
  const handleHardDeleteNotice = (id: string) => {
    if (confirm("Atenção: Excluir definitivamente removerá este comunicado e seus registros para sempre. Deseja prosseguir?")) {
      updateCondo((prev) => ({
        ...prev,
        notices: prev.notices.filter((n) => n.id !== id),
      }));
    }
  };

  const totalPaidUnits = condo.units.filter((u) => u.paymentStatus === "paid").length;
  const totalPendingUnits = Math.max(0, totalCondoUnits - totalPaidUnits);
  const totalPendingAmount = condo.units
    .filter((u) => u.paymentStatus === "pending")
    .reduce((acc, u) => acc + u.currentAmount, 0);
  const totalExpectedAmount = currentMonthPaidRevenues + totalPendingAmount;
  const adimplenciaPercentage = totalCondoUnits > 0 ? Math.round((totalPaidUnits / totalCondoUnits) * 100) : 0;

  // Filtragem das unidades para o Quadro de Pagamentos
  const filteredUnitsForBoard = condo.units.filter((unit) => {
    if (paymentFilter === "pending" && unit.paymentStatus !== "pending") return false;
    if (paymentFilter === "paid" && unit.paymentStatus !== "paid") return false;
    if (paymentSearch.trim()) {
      const q = paymentSearch.toLowerCase().trim();
      const matchNumber = unit.number.toLowerCase().includes(q);
      const matchName = unit.residentName.toLowerCase().includes(q);
      const matchPhone = unit.residentPhone.toLowerCase().includes(q);
      return matchNumber || matchName || matchPhone;
    }
    return true;
  });

  const isDemoMode = activeCondoId === DEMO_CONDO_ID || condo.id === DEMO_CONDO_ID;

  const navItems = [
    { id: "rateio", label: "Fechamento & Rateio", icon: <Calculator className="h-4 w-4" /> },
    { id: "baixa", label: "Baixa de Pagamentos", icon: <CheckCircle2 className="h-4 w-4" />, badge: `${totalPaidUnits}/${totalCondoUnits}` },
    { id: "caixa", label: "Livro Caixa", icon: <DollarSign className="h-4 w-4" /> },
    { id: "avisos", label: "Mural de Avisos", icon: <FileText className="h-4 w-4" />, badge: condo.notices.filter((n) => !n.isArchived).length },
    { id: "moradores", label: "Moradores & Senhas", icon: <Users className="h-4 w-4" /> },
  ];

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16">
      <Navbar
        role="syndic"
        userName={syndicUnit ? syndicUnit.residentName : "Síndico Responsável"}
        unitNumber={syndicUnit ? syndicUnit.number : "404"}
        condoName={condo.name}
        navItems={navItems}
        activeTab={activeTab}
        onSelectTab={(id) => setActiveTab(id as any)}
        isDemo={isDemoMode}
      />

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Banner do Modo Demonstração */}
        {isDemoMode && (
          <div className="mb-6 rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 via-purple-50 to-indigo-50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Modo Demonstração Ativo
                  </span>
                  <span className="text-xs font-bold text-purple-900">
                    Plano Essencial • R$ 49,90/mês
                  </span>
                </div>
                <p className="text-xs text-zinc-700 mt-0.5">
                  Você está explorando o painel de gestão do síndico em ambiente de testes seguro. Todas as funcionalidades estão liberadas!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/morador?condoId=${DEMO_CONDO_ID}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-3 py-2 text-xs font-bold text-purple-800 hover:bg-purple-100 transition shadow-2xs"
              >
                Visão Morador (Demo)
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

        {/* Navegação por Abas do Síndico */}
        <div className="flex border-b border-zinc-200 overflow-x-auto gap-2 sm:gap-6 mb-6">
          <button
            onClick={() => setActiveTab("rateio")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "rateio"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Calculator className="h-4 w-4" /> Fechamento & Rateio
          </button>
          <button
            onClick={() => setActiveTab("baixa")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "baixa"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" /> Baixa de Pagamentos ({totalPaidUnits}/{totalCondoUnits})
          </button>
          <button
            onClick={() => setActiveTab("caixa")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "caixa"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <DollarSign className="h-4 w-4" /> Livro Caixa
          </button>
          <button
            onClick={() => setActiveTab("avisos")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "avisos"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <FileText className="h-4 w-4" /> Mural de Avisos ({condo.notices.length})
          </button>
          <button
            onClick={() => setActiveTab("moradores")}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === "moradores"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Users className="h-4 w-4" /> Moradores & Senhas
          </button>
        </div>

        {/* ABA 1: RATEIO E FECHAMENTO DO MÊS */}
        {activeTab === "rateio" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">Calculadora de Fechamento do Mês</h2>
              <p className="text-xs text-zinc-500 mb-6">
                Insira os valores recebidos das contas de consumo. O sistema calcula a cota de cada unidade automaticamente.
              </p>

              {calculationFeedback && (
                <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {calculationFeedback}
                </div>
              )}

              <form onSubmit={handleApplyClosing} className="space-y-5">
                {/* 1. Mês de Referência, Ano e Data de Vencimento */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                      Período de Competência e Vencimento da Cota
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {/* Seletor do Mês */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Mês de Referência
                      </label>
                      <select
                        value={closingMonth}
                        onChange={(e) => setClosingMonth(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2 px-3 text-xs font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs cursor-pointer"
                        required
                      >
                        {[
                          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                        ].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ano */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Ano
                      </label>
                      <input
                        type="number"
                        min="2024"
                        max="2035"
                        value={closingYear}
                        onChange={(e) => setClosingYear(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2 px-3 text-xs font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                        required
                      />
                    </div>

                    {/* Data de Vencimento */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Vencimento da Cota
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 10/11/2026"
                        value={closingDueDate}
                        onChange={(e) => setClosingDueDate(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2 px-3 text-xs font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                        required
                      />
                    </div>

                    {/* Saldo Anterior / Inicial */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Saldo Inicial em Caixa
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-bold text-zinc-400">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={closingPreviousBalance}
                          onChange={(e) => setClosingPreviousBalance(e.target.value)}
                          className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-8 pr-2.5 text-xs font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-2 block">
                    * Saldo bancário herdado do mês anterior ou caixa de implantação para a equação do livro caixa.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Conta de Água */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                      Conta de Água (Sabesp/Concessionária)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-zinc-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={waterBill}
                        onChange={(e) => setWaterBill(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Conta de Luz */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                      Conta de Energia (Enel/Concessionária)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-zinc-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={electricityBill}
                        onChange={(e) => setElectricityBill(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Taxa Condominial Fixa Editável */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                    Taxa Condominial Fixa (Fundo de Reserva / Manutenção)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-zinc-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={condoFee}
                      onChange={(e) => setCondoFee(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">Paga por todas as {totalCondoUnits} unidades</p>
                </div>

                {/* Opção de Isenção do Síndico */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Isentar Síndico do Rateio de Água/Luz</h4>
                      <p className="text-xs text-zinc-500">
                        {isSyndicExempt
                          ? `Ativado: Água e luz divididas entre ${Math.max(1, totalCondoUnits - 1)} unidades.`
                          : `Desativado: Água e luz divididas igualmente entre as ${totalCondoUnits} unidades.`}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSyndicExempt}
                        onChange={(e) => setIsSyndicExempt(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>

                {/* Configuração dos Dados para Pagamento em PIX */}
                <div className="rounded-xl border border-amber-200/90 bg-amber-50/30 p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
                      <QrCode className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Configuração dos Dados para Pagamento em Pix</h4>
                      <p className="text-xs text-zinc-500">
                        Defina a chave e dados bancários que aparecerão no painel dos moradores para pagamento da cota.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tipo de Chave */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        Tipo de Chave Pix
                      </label>
                      <select
                        value={pixKeyType}
                        onChange={(e) => setPixKeyType(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                        required
                      >
                        <option value="CNPJ">CNPJ</option>
                        <option value="CPF">CPF</option>
                        <option value="E-mail">E-mail</option>
                        <option value="Celular / Telefone">Celular / Telefone</option>
                        <option value="Chave Aleatória (EVP)">Chave Aleatória (EVP)</option>
                      </select>
                    </div>

                    {/* Chave Pix */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        Chave Pix
                      </label>
                      <input
                        type="text"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder={
                          pixKeyType === "CNPJ"
                            ? "00.000.000/0001-00"
                            : pixKeyType === "CPF"
                            ? "000.000.000-00"
                            : pixKeyType === "E-mail"
                            ? "financeiro@condominio.com"
                            : pixKeyType === "Celular / Telefone"
                            ? "(11) 98888-8888"
                            : "Ex: 9b2d34a1-0000-..."
                        }
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                        required
                      />
                    </div>

                    {/* Favorecido (Titular) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        Favorecido (Titular da Conta)
                      </label>
                      <input
                        type="text"
                        value={pixBeneficiary}
                        onChange={(e) => setPixBeneficiary(e.target.value)}
                        placeholder="Ex: Condomínio Residencial Piloto"
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                        required
                      />
                    </div>

                    {/* Banco / Instituição Financeira */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        Banco / Instituição Financeira
                      </label>
                      <input
                        type="text"
                        value={pixBank}
                        onChange={(e) => setPixBank(e.target.value)}
                        placeholder="Ex: Banco Inter (077), Nubank (260), Itaú..."
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition"
                >
                  <RefreshCw className="h-4 w-4" /> Aplicar Fechamento e Atualizar as {totalCondoUnits} Cobranças
                </button>
              </form>
            </div>

            {/* Prévia do Resultado do Cálculo */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                  Simulação Instantânea da Cota ({closingMonth}/{closingYear})
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="rounded-xl bg-white p-3.5 border border-amber-200/80 shadow-xs">
                    <span className="text-xs text-zinc-500 block">
                      Cota de cada Morador ({isSyndicExempt ? Math.max(1, totalCondoUnits - 1) : totalCondoUnits} unidades)
                    </span>
                    <div className="text-2xl font-extrabold text-zinc-900 mt-1">
                      R$ {residentTotalShare.toFixed(2).replace(".", ",")}
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      (Consumo: R$ {utilitySharePerUnit.toFixed(2)} + Taxa: R$ {fee.toFixed(2)})
                    </span>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 border border-amber-200/80 shadow-xs">
                    <span className="text-xs text-zinc-500 block">Cota da Unidade do Síndico</span>
                    <div className="text-2xl font-extrabold text-zinc-900 mt-1">
                      R$ {syndicTotalShare.toFixed(2).replace(".", ",")}
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      {isSyndicExempt ? "(Apenas taxa fixa condominial)" : "(Valor integral igual aos demais)"}
                    </span>
                  </div>

                  <div className="p-3 bg-amber-100/60 rounded-xl text-xs text-amber-900">
                    <strong>Total a arrecadar no mês:</strong> R${" "}
                    {(residentTotalShare * (isSyndicExempt ? Math.max(1, totalCondoUnits - 1) : totalCondoUnits) + (isSyndicExempt ? syndicTotalShare : 0)).toFixed(2).replace(".", ",")}
                  </div>
                </div>
              </div>

              {/* Card de Prévia do Pix do Morador */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-800">
                    <QrCode className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Como o Morador verá o Pix
                  </h4>
                </div>
                
                <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-3.5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Chave ({pixKeyType}):</span>
                    <span className="font-mono font-bold text-zinc-900 text-xs break-all">{pixKey || "Não configurada"}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Favorecido:</span>
                    <strong className="text-zinc-800 text-right truncate max-w-[170px]">{pixBeneficiary || condo.name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Banco:</span>
                    <strong className="text-zinc-800 text-right truncate max-w-[170px]">{pixBank || "Não informado"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: QUADRO DE PAGAMENTO DAS UNIDADES */}
        {activeTab === "baixa" && (
          <div className="space-y-6">
            {/* CARDS DE RESUMO DO QUADRO DE PAGAMENTOS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Unidades */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-zinc-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total de Unidades</span>
                  <Building className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="text-2xl font-extrabold text-zinc-900">{totalCondoUnits}</div>
                <span className="text-[11px] text-zinc-400">Apartamentos no condomínio</span>
              </div>

              {/* Total Arrecadado */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Arrecadado</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-700">
                  R$ {currentMonthPaidRevenues.toFixed(2).replace(".", ",")}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {totalPaidUnits} de {totalCondoUnits} unidades quitadas
                </span>
              </div>

              {/* Total Pendente */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
                <div className="flex items-center justify-between text-amber-800 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pendente</span>
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-amber-800">
                  R$ {totalPendingAmount.toFixed(2).replace(".", ",")}
                </div>
                <span className="text-[11px] text-amber-800 font-semibold">
                  {totalPendingUnits} aguardando pagamento
                </span>
              </div>

              {/* Taxa de Adimplência */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs">
                <div className="flex items-center justify-between text-blue-800 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Adimplência</span>
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-extrabold text-blue-700">{adimplenciaPercentage}%</div>
                <span className="text-[11px] text-blue-700 font-semibold">
                  {totalPaidUnits} quitados ({totalCondoUnits} total)
                </span>
              </div>
            </div>

            {/* BARRA VISUAL DE PROGRESSO DE ARRECADAÇÃO */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Progresso de Arrecadação ({condo.currentClosing.month}/{currentYearNum})
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    {adimplenciaPercentage}% Recebido
                  </span>
                </div>
                <span className="text-xs font-semibold text-zinc-600">
                  R$ {currentMonthPaidRevenues.toFixed(2).replace(".", ",")} de R${" "}
                  {totalExpectedAmount.toFixed(2).replace(".", ",")} previstos
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 shadow-xs"
                  style={{ width: `${Math.min(100, Math.max(0, adimplenciaPercentage))}%` }}
                />
              </div>
            </div>

            {/* CONTROLES DO QUADRO: FILTROS, BUSCA E MODO DE EXIBIÇÃO */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Filtros de Status */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => setPaymentFilter("all")}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    paymentFilter === "all"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Todas as Unidades ({totalCondoUnits})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter("pending")}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    paymentFilter === "pending"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
                  }`}
                >
                  Aguardando ({totalPendingUnits})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter("paid")}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    paymentFilter === "paid"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
                  }`}
                >
                  Quitadas ({totalPaidUnits})
                </button>
              </div>

              {/* Busca e Alternância de Visualização */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar unidade ou morador..."
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPaymentViewMode("grid")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      paymentViewMode === "grid"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                    title="Exibir como Quadro em Grade"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Quadro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentViewMode("list")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      paymentViewMode === "list"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                    title="Exibir como Lista Detalhada"
                  >
                    <List className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                </div>
              </div>
            </div>

            {/* QUADRO VISUAL EM GRADE DE CARDS (SELEÇÃO PRINCIPAL) */}
            {paymentViewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUnitsForBoard.map((unit) => {
                  const isPaid = unit.paymentStatus === "paid";

                  return (
                    <div
                      key={unit.id}
                      className={`rounded-2xl border p-4.5 transition-all shadow-xs flex flex-col justify-between ${
                        isPaid
                          ? "border-emerald-200 bg-gradient-to-b from-white to-emerald-50/30 hover:border-emerald-300"
                          : "border-zinc-200 bg-white hover:border-amber-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Topo do Card: Unidade e Status */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 font-extrabold text-zinc-900 text-sm border border-zinc-200/80 shadow-2xs">
                              {unit.number}
                            </span>
                            <div>
                              <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider leading-none">
                                Unidade
                              </span>
                              <span className="text-sm font-black text-zinc-900 leading-tight">
                                Apto {unit.number}
                              </span>
                            </div>
                          </div>

                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              PAGO ({unit.paymentMethod?.toUpperCase() || "PIX"})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-900 border border-amber-200">
                              <Clock className="h-3 w-3 text-amber-600" />
                              AGUARDANDO
                            </span>
                          )}
                        </div>

                        {/* Dados do Morador e Valor */}
                        <div className="rounded-xl bg-zinc-50/80 border border-zinc-100 p-3 mb-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium truncate max-w-[150px]">
                              {unit.residentName}
                            </span>
                            {unit.isSyndic && (
                              <span className="rounded bg-amber-100 text-amber-900 px-1.5 py-0.5 text-[9px] font-extrabold">
                                Síndico
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-zinc-400 truncate">
                            WhatsApp: <strong className="text-zinc-700">{unit.residentPhone}</strong>
                          </div>

                          <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-zinc-400">
                              Valor da Cota:
                            </span>
                            <span className="text-base font-extrabold text-zinc-900">
                              R$ {unit.currentAmount.toFixed(2).replace(".", ",")}
                            </span>
                          </div>

                          {isPaid ? (
                            <div className="text-[10px] text-emerald-700 font-medium">
                              Quitado: {unit.paidAt || "Hoje"}
                            </div>
                          ) : (
                            <div className="text-[10px] text-zinc-500 font-medium">
                              Vencimento: <strong className="text-zinc-800">{condo.currentClosing.dueDate || "10/11/2026"}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botões de Ação Direta no Card */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                        {!isPaid ? (
                          <>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => togglePayment(unit.id, "pix")}
                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition shadow-2xs cursor-pointer"
                                title="Confirmar recebimento via Pix"
                              >
                                <QrCode className="h-3.5 w-3.5" />
                                <span>Baixar Pix</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => togglePayment(unit.id, "cash")}
                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-2.5 py-2 text-xs font-bold text-white hover:bg-blue-700 active:scale-95 transition shadow-2xs cursor-pointer"
                                title="Confirmar recebimento em dinheiro"
                              >
                                <Banknote className="h-3.5 w-3.5" />
                                <span>Em Dinheiro</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSendPaymentReminder(unit)}
                              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 active:scale-95 transition cursor-pointer"
                              title="Enviar cobrança educada pelo WhatsApp com a chave Pix"
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Lembrete no Zap</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => togglePayment(unit.id, "pix")}
                            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition cursor-pointer"
                            title="Desfazer baixa caso tenha lançado por engano"
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
                            <span>Desfazer Baixa</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VISUALIZAÇÃO EM LISTA DETALHADA */}
            {paymentViewMode === "list" && (
              <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">
                      Tabela de Baixa das Unidades ({filteredUnitsForBoard.length} exibidas)
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Controle linha a linha com baixa instantânea e sincronização contábil
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-zinc-100">
                  {filteredUnitsForBoard.map((unit) => (
                    <div
                      key={unit.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 font-extrabold text-zinc-800 text-sm border border-zinc-200/80 shadow-2xs">
                          {unit.number}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-zinc-900">
                              Apto {unit.number} • {unit.residentName}
                            </h4>
                            {unit.isSyndic && (
                              <span className="text-[10px] rounded-full bg-amber-100 text-amber-800 font-semibold px-2">
                                Síndico
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500">{unit.residentPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="text-right">
                          <span className="text-sm font-bold text-zinc-900">
                            R$ {unit.currentAmount.toFixed(2).replace(".", ",")}
                          </span>
                          <p className="text-[10px] text-zinc-400">
                            {unit.paymentStatus === "paid"
                              ? `Pago (${unit.paymentMethod?.toUpperCase() || "PIX"})`
                              : `Vencimento: ${condo.currentClosing.dueDate || "10/11/2026"}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {unit.paymentStatus === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => togglePayment(unit.id, "pix")}
                                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 shadow-2xs cursor-pointer"
                              >
                                Baixar Pix
                              </button>
                              <button
                                type="button"
                                onClick={() => togglePayment(unit.id, "cash")}
                                className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition active:scale-95 shadow-2xs cursor-pointer"
                              >
                                Dinheiro
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendPaymentReminder(unit)}
                                className="rounded-xl border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100 transition active:scale-95 cursor-pointer"
                                title="Lembrar no Zap"
                              >
                                <MessageCircle className="h-3.5 w-3.5 text-emerald-700" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => togglePayment(unit.id, "pix")}
                              className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-red-50 hover:text-red-600 transition active:scale-95 cursor-pointer"
                            >
                              Desfazer Baixa
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: LIVRO CAIXA & HISTÓRICO CONTÍNUO DE MESES */}
        {activeTab === "caixa" && (
          <div className="space-y-6">
            {/* SELETOR CONTÍNUO E INFINITO DE MESES */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                    Navegação do Livro Caixa
                  </span>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-amber-600" />
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
                      ? "Exibindo os lançamentos e saldo ativo do mês vigente."
                      : `Visualizando o fechamento e despesas consolidadas de ${activeMonthName}/${activeYear}.`}
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
                        : "Ver mês anterior no histórico"
                    }
                  >
                    <ChevronLeft className="h-4 w-4 text-zinc-600" />
                    <span>Mês Anterior</span>
                  </button>

                  {!isCurrentMonthSelected && (
                    <button
                      type="button"
                      onClick={() => setSelectedMonthOffset(0)}
                      className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700 active:scale-95 transition shadow-2xs"
                      title="Voltar instantaneamente ao mês corrente"
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
              {/* Caixa Mês Anterior */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Caixa Mês Anterior
                </span>
                <div className="text-xl font-bold text-zinc-900 mt-1">
                  R$ {activePreviousBalance.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Herdado de {prevMonthName}/{prevYear}
                </p>
              </div>

              {/* Total Receitas do Mês */}
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

              {/* Total Despesas do Mês */}
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

              {/* Saldo em Caixa */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  {isCurrentMonthSelected ? "Saldo em Caixa Hoje" : `Saldo Final (${activeMonthName})`}
                </span>
                <div className="text-2xl font-extrabold text-amber-700 mt-1">
                  R$ {activeFinalBalance.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  {isCurrentMonthSelected ? "Saldo real consolidado" : `Posição de ${activeMonthName}/${activeYear}`}
                </p>
              </div>
            </div>

            {/* FORMULÁRIO: LANÇAR NOVA DESPESA COM DATA E MÊS */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-amber-600" />
                  Lançar Nova Despesa no Livro Caixa
                </h3>
                <span className="text-xs text-zinc-400">
                  Lançando em: <strong>{activeMonthName}/{activeYear}</strong>
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                Registre os gastos do condomínio especificando a data exata e comprovante para o balancete dos moradores.
              </p>

              {expenseSuccessMessage && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {expenseSuccessMessage}
                </div>
              )}

              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                {/* Data da Despesa */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold uppercase text-zinc-600 mb-1">
                    Data da Despesa
                  </label>
                  <input
                    type="date"
                    value={newExpenseDate}
                    onChange={(e) => setNewExpenseDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                {/* Categoria */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold uppercase text-zinc-600 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  >
                    <option value="water">Água</option>
                    <option value="electricity">Energia</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="cleaning">Limpeza</option>
                  </select>
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase text-zinc-600 mb-1">
                    Descrição do Gasto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Troca de lâmpadas do hall social..."
                    value={newExpenseDescription}
                    onChange={(e) => setNewExpenseDescription(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                {/* Valor */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold uppercase text-zinc-600 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                {/* Botão de Enviar */}
                <div className="sm:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 active:scale-95 transition"
                  >
                    Adicionar Despesa
                  </button>
                </div>
              </form>
            </div>

            {/* QUADRO DE ENTRADAS / RECEITAS DO MÊS */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 overflow-hidden shadow-xs p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-emerald-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                      Entradas e Receitas de {activeMonthName} de {activeYear}
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Arrecadação de cotas condominiais proporcional ao total de {totalCondoUnits} unidades
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

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    {isCurrentMonthSelected
                      ? `${totalPaidUnits} de ${totalCondoUnits} unidades com pagamento confirmado neste mês vigente.`
                      : matchedPastClosing
                      ? `Fechamento arquivado com quitação proporcional das cotas das ${totalCondoUnits} unidades cadastradas.`
                      : `Sem fechamento de receitas arquivado para este período.`}
                  </span>
                </div>

                {isCurrentMonthSelected && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("baixa")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Ver Quadro de Baixa das Unidades &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* LISTAGEM DE DESPESAS COM DATA E MÊS BEM VISÍVEIS */}
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                    Despesas Registradas em {activeMonthName} de {activeYear}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Todas as despesas possuem data, mês e comprovante arquivados para prestação de contas.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200/80 px-2.5 py-1 text-xs font-bold text-zinc-800 self-start sm:self-auto">
                  {filteredExpenses.length} {filteredExpenses.length === 1 ? "despesa" : "despesas"} neste mês
                </span>
              </div>

              {filteredExpenses.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-zinc-700">
                    Nenhuma despesa registrada para {activeMonthName}/{activeYear}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Utilize o formulário acima para lançar uma despesa nesta data.
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
                          <div className="flex flex-col items-center justify-center rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 min-w-[58px] shadow-2xs">
                            <span className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider">
                              {monthPart}
                            </span>
                            <span className="text-lg font-black text-amber-950 leading-none">
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
                              Data do Lançamento: <strong className="text-zinc-700">{expense.date}</strong> • Mês de Referência:{" "}
                              <strong className="text-amber-800">{expense.month || activeMonthName} de {expense.year || activeYear}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Valor e Ações */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                          <span className="text-base font-extrabold text-red-600">
                            - R$ {expense.amount.toFixed(2).replace(".", ",")}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAttachment({
                                  name: `Comprovante / Nota Fiscal - ${expense.description}`,
                                  type: "image",
                                  url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                              title="Ver comprovante da despesa"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Ver NF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(expense.id, expense.amount)}
                              className="rounded-lg border border-zinc-200 bg-white p-1.5 text-xs font-medium text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Remover esta despesa"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 4: MURAL DE AVISOS & PUBLICAR */}
        {activeTab === "avisos" && (
          <div className="space-y-6">
            {/* Formulário de Criação de Aviso */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 mb-1">Criar Novo Comunicado Oficial</h3>
              <p className="text-xs text-zinc-500 mb-5">
                O aviso ficará visível no mural do app para todos os moradores, com suporte a fotos e PDFs.
              </p>

              {noticePublished && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Aviso publicado no mural com sucesso!
                </div>
              )}

              <form onSubmit={handlePublishNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">Título do Aviso</label>
                  <input
                    type="text"
                    placeholder="Ex: Manutenção na rede elétrica na sexta-feira"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">Mensagem Completa</label>
                  <textarea
                    rows={3}
                    placeholder="Digite as instruções e orientações aos moradores..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert("Selecione fotos ou PDFs para anexar")}
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    <Upload className="h-4 w-4" /> Anexar Fotos / PDFs
                  </button>
                  <span className="text-xs text-zinc-400">Arquivos com redundância em nuvem</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition"
                >
                  Publicar Comunicado no Mural
                </button>
              </form>
            </div>

            {/* Lista com Todos os Avisos Já Lançados */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700">
                    Mural Oficial • Gestão de Comunicados
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Ao arquivar um aviso, ele sai da visão dos moradores, mas 100% dos dados, fotos e PDFs continuam arquivados.
                  </p>
                </div>

                {/* Filtro: Ativos vs Arquivados */}
                <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-semibold self-start sm:self-auto">
                  <button
                    onClick={() => setNoticeFilter("active")}
                    className={`rounded-lg px-3 py-1.5 transition ${
                      noticeFilter === "active"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Ativos ({condo.notices.filter((n) => !n.isArchived).length})
                  </button>
                  <button
                    onClick={() => setNoticeFilter("archived")}
                    className={`rounded-lg px-3 py-1.5 transition ${
                      noticeFilter === "archived"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    Histórico Arquivado ({condo.notices.filter((n) => n.isArchived).length})
                  </button>
                </div>
              </div>

              {condo.notices.filter((n) => (noticeFilter === "active" ? !n.isArchived : n.isArchived)).length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
                  <p className="text-sm font-medium text-zinc-600">
                    {noticeFilter === "active"
                      ? "Nenhum comunicado ativo no momento."
                      : "Nenhum comunicado no histórico de arquivados."}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {noticeFilter === "active"
                      ? "Crie um novo comunicado acima para publicar no mural."
                      : "Avisos arquivados pelo síndico são mantidos aqui para auditoria permanente."}
                  </p>
                </div>
              ) : (
                condo.notices
                  .filter((n) => (noticeFilter === "active" ? !n.isArchived : n.isArchived))
                  .map((notice) => (
                    <div
                      key={notice.id}
                      className={`rounded-2xl border p-5 shadow-sm transition ${
                        notice.isArchived
                          ? "bg-zinc-50/80 border-zinc-200 opacity-90"
                          : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-zinc-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-zinc-900">{notice.title}</h4>
                            {notice.isArchived && (
                              <span className="rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5 text-[10px] font-semibold">
                                Arquivado ({notice.archivedAt})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Publicado por {notice.author} • {notice.date}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          {!notice.isArchived ? (
                            <button
                              onClick={() => handleArchiveNotice(notice.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition"
                              title="Oculta do mural dos moradores e arquiva no histórico"
                            >
                              <Archive className="h-3.5 w-3.5" />
                              <span>Arquivar</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestoreNotice(notice.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                              title="Volta a exibir no mural dos moradores"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Restaurar ao Mural</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleHardDeleteNotice(notice.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                            title="Excluir definitivamente"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-700 mt-3 leading-relaxed whitespace-pre-line">
                        {notice.content}
                      </p>

                      {/* Anexos (Fotos e PDFs) */}
                      {notice.attachments && notice.attachments.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-zinc-100">
                          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                            Anexos Integrados (Preservados)
                          </span>
                          <div className="flex flex-wrap gap-3">
                            {notice.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedAttachment(att)}
                                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-amber-50/50 hover:border-amber-300 p-2 text-xs shadow-2xs cursor-pointer transition group"
                                title="Clique para maximizar e visualizar em tela cheia"
                              >
                                {att.type === "image" ? (
                                  <>
                                    <img
                                      src={att.url}
                                      alt={att.name}
                                      className="h-10 w-10 rounded-lg object-cover group-hover:scale-105 transition"
                                    />
                                    <div>
                                      <p className="font-semibold text-zinc-800 group-hover:text-amber-800 transition">{att.name}</p>
                                      <span className="text-[10px] text-zinc-500">Toque para maximizar foto</span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 group-hover:scale-105 transition">
                                      <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-zinc-800 group-hover:text-amber-800 transition">{att.name}</p>
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
          </div>
        )}

        {/* ABA 5: GESTÃO DE MORADORES & SENHAS */}
        {activeTab === "moradores" && (
          <div className="space-y-4">
            {/* Box Informativo da Regra de Login */}
            <div className="rounded-2xl bg-amber-50/80 border border-amber-200/90 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs shrink-0 mt-0.5">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-950">
                    Regra Oficial de Acesso dos Moradores
                  </h3>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    O acesso de cada morador é padronizado e automático: o <strong>Login é o CPF cadastrado</strong> e a <strong>senha inicial são os 6 primeiros dígitos do CPF</strong>. Você pode cadastrar ou atualizar os dados de cada apartamento a qualquer momento.
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagens de Sucesso */}
            {resetSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-2xs">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            {editSuccessMessage && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-2xs">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{editSuccessMessage}</span>
              </div>
            )}

            {/* Lista dos 16 Apartamentos */}
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                    Apartamentos e Moradores Responsáveis ({condo.units.length} unidades)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Cadastre os dados de contato, identificação e credenciais de login de cada unidade.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openBatchNumberingModal}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 active:scale-95 transition shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-amber-700" />
                  <span>Personalizar Numerações (Lote)</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-100">
                {condo.units.map((unit) => {
                  const defaultPwd = getInitialPasswordFromCpf(unit.residentCpf);
                  const isCopied = copiedInviteUnitId === unit.id;

                  return (
                    <div
                      key={unit.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/80 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/80 font-black text-amber-900 text-sm shadow-2xs shrink-0">
                          {unit.number}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-zinc-900">{unit.residentName}</h4>
                            {unit.isSyndic && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                                Unidade Síndico
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-zinc-500">
                            <span>
                              Login (CPF): <strong className="text-zinc-800 font-mono">{unit.residentCpf}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              WhatsApp: <strong className="text-zinc-800">{unit.residentPhone}</strong>
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-mono text-zinc-700">
                              Senha inicial: <strong>{defaultPwd}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação da Unidade */}
                      <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                        {/* Botão de Copiar Convite para WhatsApp */}
                        <button
                          type="button"
                          onClick={() => handleCopyInvite(unit)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs ${
                            isCopied
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : "border-zinc-200 bg-white text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                          }`}
                          title="Copiar mensagem com dados de acesso para enviar pelo WhatsApp"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />}
                          <span>{isCopied ? "Convite Copiado!" : "Convite WhatsApp"}</span>
                        </button>

                        {/* Botão de Editar Morador */}
                        <button
                          type="button"
                          onClick={() => openEditUnitModal(unit)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 active:scale-95 transition cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Editar</span>
                        </button>

                        {/* Botão Restaurar Senha Padrão (6 Dígitos do CPF) */}
                        <button
                          type="button"
                          onClick={() => handleResetToDefaultPassword(unit)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 hover:border-amber-300 active:scale-95 transition cursor-pointer shadow-2xs"
                          title="Restaura a senha de acesso para os 6 primeiros dígitos do CPF do morador"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                          <span>Restaurar Senha</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MODAL DE CADASTRO / EDIÇÃO DE MORADOR */}
            {selectedUnitForEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">
                        Cadastrar / Editar Morador - Unidade {selectedUnitForEdit.number}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Defina o número da unidade, responsável e dados de acesso.
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 font-black text-amber-900 text-sm">
                      {selectedUnitForEdit.number}
                    </span>
                  </div>

                  <form onSubmit={handleSaveUnitResident} className="mt-4 space-y-4">
                    {/* Número / Identificação da Unidade */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        Número / Identificação da Unidade
                      </label>
                      <input
                        type="text"
                        value={editUnitNumber}
                        onChange={(e) => setEditUnitNumber(e.target.value)}
                        placeholder="Ex: 101, 11, Bloco A - 12, Casa 03..."
                        className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Personalize como esta unidade é identificada no condomínio (ex: 101, 11, Casa 02, etc.).
                      </p>
                    </div>

                    {/* Nome do Responsável */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        Nome Completo do Responsável
                      </label>
                      <input
                        type="text"
                        value={editResidentName}
                        onChange={(e) => setEditResidentName(e.target.value)}
                        placeholder="Ex: Mariana Costa"
                        className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    {/* CPF do Responsável */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        CPF do Responsável (Será o Login)
                      </label>
                      <input
                        type="text"
                        value={editResidentCpf}
                        onChange={(e) => setEditResidentCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Digite os 11 dígitos do CPF. O morador usará esse número para entrar.
                      </p>
                    </div>

                    {/* WhatsApp do Responsável */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                        WhatsApp / Celular
                      </label>
                      <input
                        type="text"
                        value={editResidentPhone}
                        onChange={(e) => setEditResidentPhone(e.target.value)}
                        placeholder="(11) 98888-8888"
                        className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    {/* Box Dinâmico com a Prévia da Senha dos 6 Primeiros Dígitos */}
                    <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-950">
                      <span className="font-bold block text-amber-900 mb-0.5">
                        🔑 Credenciais de Login Automáticas da Unidade:
                      </span>
                      <p className="text-zinc-600">
                        • <strong>Login:</strong> {editResidentCpf || "CPF do responsável"}<br />
                        • <strong>Senha inicial:</strong>{" "}
                        <span className="font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          {getInitialPasswordFromCpf(editResidentCpf)}
                        </span>{" "}
                        (os 6 primeiros dígitos do CPF)
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUnitForEdit(null)}
                        className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-xs transition"
                      >
                        Salvar Morador e Atualizar Acesso
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODAL DE PERSONALIZAÇÃO DE NUMERAÇÃO EM LOTE */}
            {isBatchNumberingModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                        Personalizar Numeração das {condo.units.length} Unidades
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Escolha um padrão pré-definido em 1 clique ou digite os números livremente abaixo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBatchNumberingModalOpen(false)}
                      className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveBatchNumbers} className="mt-4 space-y-4">
                    {/* Botões de Padrões Prontos em 1 Clique */}
                    <div>
                      <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-2">
                        Preenchimento Rápido com Padrões Populares:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => applyNumberingTemplate("hundreds")}
                          className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-semibold text-zinc-800 hover:border-amber-400 hover:bg-amber-50/60 active:scale-95 transition cursor-pointer"
                        >
                          <span className="font-bold text-amber-900">Centenas (Andares)</span>
                          <span className="text-[11px] text-zinc-500">Ex: 101, 102...</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => applyNumberingTemplate("tens")}
                          className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-semibold text-zinc-800 hover:border-amber-400 hover:bg-amber-50/60 active:scale-95 transition cursor-pointer"
                        >
                          <span className="font-bold text-amber-900">Dezenas</span>
                          <span className="text-[11px] text-zinc-500">Ex: 11, 12...</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => applyNumberingTemplate("sequential")}
                          className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-semibold text-zinc-800 hover:border-amber-400 hover:bg-amber-50/60 active:scale-95 transition cursor-pointer"
                        >
                          <span className="font-bold text-amber-900">Sequencial Direto</span>
                          <span className="text-[11px] text-zinc-500">01 a {String(condo.units.length).padStart(2, "0")}</span>
                        </button>
                      </div>
                    </div>

                    {/* Grade com os Inputs das Unidades */}
                    <div>
                      <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-2">
                        Edição Manual Livre de Cada Unidade ({condo.units.length} total):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1 border border-zinc-100 rounded-xl">
                        {condo.units.map((unit, idx) => (
                          <div key={unit.id} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-2">
                            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                              Posição {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={batchNumbers[idx] || ""}
                              onChange={(e) => {
                                const updated = [...batchNumbers];
                                updated[idx] = e.target.value;
                                setBatchNumbers(updated);
                              }}
                              className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder={`Apto ${idx + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => setIsBatchNumberingModalOpen(false)}
                        className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-xs transition"
                      >
                        Salvar Nova Numeração das {condo.units.length} Unidades
                      </button>
                    </div>
                  </form>
                </div>
              </div>
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
