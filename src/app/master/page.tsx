"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useMasterStore, MasterCondo, setActiveCondoId, DEMO_CONDO_ID, resetDemoData, isMasterLoggedIn } from "@/lib/store";
import {
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  Check,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Edit3,
  Trash2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function MasterDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { condos, addCondo, updateCondoStatus, updateCondoDetails, deleteCondo } = useMasterStore();

  useEffect(() => {
    if (!isMasterLoggedIn()) {
      router.replace("/master/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Estados dos Modais
  const [showNewCondoModal, setShowNewCondoModal] = useState(false);
  const [syndicResetModal, setSyndicResetModal] = useState<MasterCondo | null>(null);
  const [syndicNewPassword, setSyndicNewPassword] = useState("12345678");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados para Modal de Edição de Condomínio
  const [editingCondo, setEditingCondo] = useState<MasterCondo | null>(null);
  const [editName, setEditName] = useState("");
  const [editSyndicName, setEditSyndicName] = useState("");
  const [editSyndicCpf, setEditSyndicCpf] = useState("");
  const [editSyndicPhone, setEditSyndicPhone] = useState("");
  const [editSyndicEmail, setEditSyndicEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPlanPrice, setEditPlanPrice] = useState("89.00");

  // Campos do Formulário de Cadastro de Novo Condomínio
  const [condoName, setCondoName] = useState("");
  const [syndicName, setSyndicName] = useState("");
  const [syndicCpf, setSyndicCpf] = useState("");
  const [syndicPhone, setSyndicPhone] = useState("");
  const [syndicEmail, setSyndicEmail] = useState("");
  const [condoAddress, setCondoAddress] = useState("");
  const [totalUnits, setTotalUnits] = useState("16");
  const [initialCashBalance, setInitialCashBalance] = useState("0.00");
  const [formError, setFormError] = useState("");

  // Máscara de CPF (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    else if (v.length > 6) v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    else if (v.length > 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
    setSyndicCpf(v);
  };

  // Máscara de WhatsApp ((00) 00000-0000)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    setSyndicPhone(v);
  };

  // Submissão do Novo Condomínio
  const handleCreateCondo = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!condoName.trim()) {
      setFormError("Informe o nome do condomínio.");
      return;
    }
    if (!syndicName.trim()) {
      setFormError("Informe o nome do responsável.");
      return;
    }
    if (syndicCpf.replace(/\D/g, "").length !== 11) {
      setFormError("Informe um CPF válido com 11 dígitos.");
      return;
    }
    if (!syndicPhone.trim()) {
      setFormError("Informe o número de WhatsApp do responsável.");
      return;
    }
    if (!syndicEmail.trim() || !syndicEmail.includes("@")) {
      setFormError("Informe um e-mail válido para o síndico.");
      return;
    }
    if (!condoAddress.trim()) {
      setFormError("Informe o endereço completo do condomínio.");
      return;
    }

    const created = addCondo({
      name: condoName,
      syndicName,
      syndicCpf,
      syndicPhone,
      syndicEmail,
      address: condoAddress,
      city: "São Paulo - SP",
      units: parseInt(totalUnits) || 16,
      initialCashBalance: parseFloat(initialCashBalance) || 0,
    });

    setSuccessMsg(`Condomínio "${created.name}" cadastrado com sucesso! Acesso liberado para o síndico.`);
    setTimeout(() => setSuccessMsg(""), 4500);

    // Limpa formulário e fecha modal
    setCondoName("");
    setSyndicName("");
    setSyndicCpf("");
    setSyndicPhone("");
    setSyndicEmail("");
    setCondoAddress("");
    setInitialCashBalance("0.00");
    setShowNewCondoModal(false);
  };

  // Reset de Senha do Síndico
  const handleResetSyndicPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (syndicNewPassword.length !== 8) {
      alert("A senha do síndico deve conter exatamente 8 dígitos.");
      return;
    }
    setSuccessMsg(`Senha do Síndico (${syndicResetModal?.syndicName}) resetada para: ${syndicNewPassword}`);
    setTimeout(() => {
      setSuccessMsg("");
      setSyndicResetModal(null);
    }, 3000);
  };

  const handleToggleStatus = (condoId: string, currentStatus: "active" | "trial" | "overdue") => {
    const nextStatus = currentStatus === "active" ? "overdue" : "active";
    updateCondoStatus(condoId, nextStatus);
  };

  // Abrir Modal de Edição
  const openEditModal = (c: MasterCondo) => {
    setEditingCondo(c);
    setEditName(c.name);
    setEditSyndicName(c.syndicName);
    setEditSyndicCpf(c.syndicCpf);
    setEditSyndicPhone(c.syndicPhone);
    setEditSyndicEmail(c.syndicEmail);
    setEditAddress(c.address);
    setEditPlanPrice(c.planPrice.toFixed(2));
  };

  // Salvar Edição
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCondo) return;

    updateCondoDetails(editingCondo.id, {
      name: editName.trim(),
      syndicName: editSyndicName.trim(),
      syndicCpf: editSyndicCpf.trim(),
      syndicPhone: editSyndicPhone.trim(),
      syndicEmail: editSyndicEmail.trim(),
      address: editAddress.trim(),
      planPrice: parseFloat(editPlanPrice) || 49.90,
      planName: "Plano Essencial",
    });

    setSuccessMsg(`Condomínio "${editName}" atualizado com sucesso!`);
    setTimeout(() => setSuccessMsg(""), 3500);
    setEditingCondo(null);
  };

  // Excluir Condomínio
  const handleDeleteCondo = (c: MasterCondo) => {
    if (c.isDemo || c.id === DEMO_CONDO_ID) {
      alert("O condomínio de demonstração não pode ser excluído, pois serve de ambiente de testes e apresentação.");
      return;
    }

    if (confirm(`Atenção: Deseja realmente excluir o "${c.name}"?\n\nEsta ação apagará permanentemente o cadastro, moradores e livro caixa deste condomínio.`)) {
      deleteCondo(c.id);
      setSuccessMsg(`Condomínio "${c.name}" excluído com sucesso.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    }
  };

  // Cálculo das métricas gerais (separando dados reais de demonstração)
  const realCondos = condos.filter((c) => !c.isDemo && c.id !== DEMO_CONDO_ID);
  const totalUnitsCount = condos.reduce((acc, c) => acc + c.units, 0);
  const totalMrr = realCondos.filter((c) => c.status === "active").reduce((acc, c) => acc + c.planPrice, 0);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16">
      <Navbar role="master" userName="Administrador Master" condoName="Painel Global do Dono do SaaS" />

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Header do Master */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Visão Geral dos Clientes (Tenants)</h1>
            <p className="text-sm text-zinc-500">Controle total de assinaturas, condomínios e suporte de senhas</p>
          </div>
          <button
            onClick={() => setShowNewCondoModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
          >
            <Plus className="h-4 w-4" /> Cadastrar Novo Condomínio
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Métricas do Negócio SaaS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total de Condomínios</span>
            <div className="text-2xl font-extrabold text-zinc-900 mt-1">{condos.length}</div>
            <span className="text-[11px] text-zinc-400">Ativos no sistema</span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Unidades sob Gestão</span>
            <div className="text-2xl font-extrabold text-zinc-900 mt-1">{totalUnitsCount}</div>
            <span className="text-[11px] text-zinc-400">Apartamentos conectados</span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">MRR Atual (Mensal)</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              R$ {totalMrr.toFixed(2).replace(".", ",")}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Receita recorrente ativa</span>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-xs">
            <span className="text-xs font-semibold text-purple-900 uppercase tracking-wider">Plano Vigente</span>
            <div className="text-2xl font-extrabold text-purple-700 mt-1">Plano Essencial</div>
            <span className="text-[11px] text-purple-800 font-bold">R$ 49,90/mês</span>
          </div>
        </div>

        {/* Tabela de Condomínios Clientes */}
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900">Condomínios Assinantes ({condos.length})</h3>
              <p className="text-xs text-zinc-500">Gestão multi-tenant com isolamento total</p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {condos.map((condo) => (
              <div key={condo.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-zinc-50 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-zinc-900">{condo.name}</h4>
                    {condo.isDemo ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-900 border border-amber-300">
                        <Sparkles className="h-3 w-3 text-amber-600" /> Demonstração Interativa
                      </span>
                    ) : condo.status === "active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> {condo.planName || "Plano Essencial"} (R$ {condo.planPrice.toFixed(2).replace(".", ",")}/mês)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                        <AlertCircle className="h-3 w-3" /> Assinatura Suspensa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>📍 {condo.address}</span>
                    <span>🏢 <strong>{condo.units} unidades</strong></span>
                    <span>👤 Síndico: <strong>{condo.syndicName}</strong></span>
                    <span>🪪 CPF: {condo.syndicCpf}</span>
                    <span>📱 Zap: {condo.syndicPhone}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {condo.isDemo ? (
                    <>
                      {/* Impersonation - Síndico Demo */}
                      <Link
                        href={`/sindico?condoId=${condo.id}`}
                        onClick={() => setActiveCondoId(condo.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-100 px-3 py-2 text-xs font-bold text-purple-900 hover:bg-purple-200 transition shadow-2xs"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-purple-700" /> Síndico (Demo)
                      </Link>

                      {/* Impersonation - Morador Demo */}
                      <Link
                        href={`/morador?condoId=${condo.id}`}
                        onClick={() => setActiveCondoId(condo.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-900 hover:bg-blue-100 transition shadow-2xs"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-blue-700" /> Morador (Demo)
                      </Link>

                      {/* Restaurar Dados Demo */}
                      <button
                        onClick={() => {
                          resetDemoData();
                          setSuccessMsg("Dados do condomínio de demonstração restaurados para o padrão original!");
                          setTimeout(() => setSuccessMsg(""), 3500);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-100/70 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-200 transition shadow-2xs cursor-pointer"
                        title="Restaurar dados originais da demonstração"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-amber-700" /> Restaurar Demo
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Botão Editar Dados do Condomínio */}
                      <button
                        onClick={() => openEditModal(condo)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition shadow-2xs cursor-pointer"
                        title="Editar informações cadastrais do condomínio e contrato"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-zinc-500" /> Editar
                      </button>

                      {/* Botão de Reset de Senha do Síndico */}
                      <button
                        onClick={() => {
                          setSyndicResetModal(condo);
                          setSyndicNewPassword("12345678");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition shadow-2xs cursor-pointer"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-purple-600" /> Resetar Senha
                      </button>

                      {/* Impersonation - Acessar como Síndico */}
                      <Link
                        href={`/sindico?condoId=${condo.id}`}
                        onClick={() => setActiveCondoId(condo.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-900 hover:bg-purple-100 transition shadow-2xs"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-purple-700" /> Acessar Painel
                      </Link>

                      {/* Alternar Status da Assinatura */}
                      <button
                        onClick={() => handleToggleStatus(condo.id, condo.status)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs ${
                          condo.status === "active"
                            ? "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        {condo.status === "active" ? "Suspender" : "Reativar"}
                      </button>

                      {/* Botão Excluir Condomínio */}
                      <button
                        onClick={() => handleDeleteCondo(condo)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/60 px-2.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 hover:border-red-300 transition shadow-2xs cursor-pointer"
                        title="Excluir este condomínio permanentemente"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL: CADASTRO DE NOVO CONDOMÍNIO (6 CAMPOS OBRIGATÓRIOS) */}
        {showNewCondoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 relative my-8">
              <button
                onClick={() => setShowNewCondoModal(false)}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Cadastrar Novo Condomínio</h3>
                  <p className="text-xs text-zinc-500">Crie o tenant e libere o acesso imediato ao síndico</p>
                </div>
              </div>

              {formError && (
                <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCondo} className="mt-4 space-y-3.5 text-left">
                {/* 1. Nome do condomínio */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    1. Nome do Condomínio
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Condomínio Residencial Vista Verde"
                    value={condoName}
                    onChange={(e) => setCondoName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 py-2.5 px-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                {/* 2. Endereço do condomínio */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    2. Endereço Completo do Condomínio
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Ex: Av. Paulista, 1500 - Bela Vista, São Paulo - SP"
                      value={condoAddress}
                      onChange={(e) => setCondoAddress(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 3. Nome do responsável */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      3. Nome do Responsável (Síndico)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Ex: Roberto Almeida"
                        value={syndicName}
                        onChange={(e) => setSyndicName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* 4. CPF do responsável */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      4. CPF do Responsável
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={syndicCpf}
                      onChange={handleCpfChange}
                      className="w-full rounded-xl border border-zinc-300 py-2.5 px-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 5. WhatsApp do responsável */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      5. WhatsApp do Responsável
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        inputMode="tel"
                        placeholder="(00) 00000-0000"
                        value={syndicPhone}
                        onChange={handlePhoneChange}
                        className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* 6. E-mail do responsável */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      6. E-mail do Responsável
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="sindico@email.com"
                        value={syndicEmail}
                        onChange={(e) => setSyndicEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Quantidade de Unidades */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      7. Quantidade de Unidades
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="100"
                      value={totalUnits}
                      onChange={(e) => setTotalUnits(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 py-2.5 px-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-zinc-400">Total de aptos do condomínio</span>
                  </div>

                  {/* Saldo Inicial em Caixa */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      8. Saldo Inicial em Caixa (R$)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-zinc-400">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={initialCashBalance}
                        onChange={(e) => setInitialCashBalance(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-3 text-sm font-bold text-zinc-900 focus:border-purple-600 focus:outline-none"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400">Saldo bancário na data de adesão</span>
                  </div>
                </div>

                {/* Plano Selecionado */}
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-purple-900 block">Plano Essencial Ativo</span>
                    <span className="text-[11px] text-purple-700">Todas as funcionalidades liberadas (Rateio, Livro Caixa, Pix, Mural)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-purple-900">R$ 49,90</span>
                    <span className="text-[10px] text-purple-700 block">/mês</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowNewCondoModal(false)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
                  >
                    Salvar e Ativar Condomínio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: RESET DE SENHA DO SÍNDICO */}
        {syndicResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200">
              <h3 className="text-base font-bold text-zinc-900">Resetar Senha do Síndico</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Condomínio: <strong>{syndicResetModal.name}</strong> • Síndico: <strong>{syndicResetModal.syndicName}</strong>
              </p>

              <form onSubmit={handleResetSyndicPassword} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1">
                    Nova Senha do Síndico (Exatamente 8 Dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={syndicNewPassword}
                    onChange={(e) => setSyndicNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-base font-mono font-bold tracking-wider text-zinc-900 focus:border-purple-500 focus:outline-none"
                    required
                  />
                  <span className="text-[11px] text-zinc-400">Padrão: 12345678</span>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSyndicResetModal(null)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                  >
                    Confirmar Nova Senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDITAR DADOS DO CONDOMÍNIO */}
        {editingCondo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 relative my-8">
              <button
                onClick={() => setEditingCondo(null)}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Editar Dados do Condomínio</h3>
                  <p className="text-xs text-zinc-500">Atualize as informações cadastrais e comerciais deste cliente</p>
                </div>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-left">
                {/* 1. Nome do condomínio */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Nome do Condomínio
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    required
                  />
                </div>

                {/* 2. Nome do Responsável (Síndico) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Nome do Responsável / Síndico
                  </label>
                  <input
                    type="text"
                    value={editSyndicName}
                    onChange={(e) => setEditSyndicName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 3. CPF */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      CPF do Responsável
                    </label>
                    <input
                      type="text"
                      value={editSyndicCpf}
                      onChange={(e) => setEditSyndicCpf(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-mono font-semibold text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      required
                    />
                  </div>

                  {/* 4. WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      WhatsApp do Responsável
                    </label>
                    <input
                      type="text"
                      value={editSyndicPhone}
                      onChange={(e) => setEditSyndicPhone(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 5. E-mail */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                      E-mail do Responsável
                    </label>
                    <input
                      type="email"
                      value={editSyndicEmail}
                      onChange={(e) => setEditSyndicEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      required
                    />
                  </div>

                  {/* Valor do Plano (R$) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-zinc-700">
                        Mensalidade SaaS (R$)
                      </label>
                      <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-1.5 py-0.5 rounded">
                        Plano Essencial
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={editPlanPrice}
                      onChange={(e) => setEditPlanPrice(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-bold text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      required
                    />
                  </div>
                </div>

                {/* 6. Endereço */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setEditingCondo(null)}
                    className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-xs transition cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
