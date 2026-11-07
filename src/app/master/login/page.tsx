"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMasterStore, setMasterLoggedIn } from "@/lib/store";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function MasterLoginPage() {
  const router = useRouter();
  const { masterAuth, updateMasterPassword } = useMasterStore();

  // Campos de Login do Master
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do Modal "Esqueceu a Senha em 2 Etapas"
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newMasterPassword, setNewMasterPassword] = useState("");
  const [confirmMasterPassword, setConfirmMasterPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState("");

  // Submissão do Login Master
  const handleMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Valida credenciais com o store persistido
      if (email.toLowerCase() === masterAuth.email.toLowerCase() && password === masterAuth.password) {
        setMasterLoggedIn(true);
        router.push("/master");
      } else {
        setLoading(false);
        setError("E-mail ou senha incorretos. Utilize a recuperação de senha abaixo caso necessário.");
      }
    }, 350);
  };

  // Etapa 1: Enviar código para o e-mail Master
  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (!recoveryEmail || !recoveryEmail.includes("@")) {
      setRecoveryError("Informe um e-mail válido.");
      return;
    }

    if (recoveryEmail.toLowerCase() !== masterAuth.email.toLowerCase()) {
      setRecoveryError("E-mail não autorizado para a conta Master.");
      return;
    }

    // Código de 6 dígitos simulado
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setRecoveryStep(2);
  };

  // Etapa 2: Validar código de 6 dígitos e salvar nova senha
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (inputCode !== generatedCode) {
      setRecoveryError("Código de autenticação incorreto. Verifique os 6 dígitos.");
      return;
    }

    if (newMasterPassword.length < 6) {
      setRecoveryError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newMasterPassword !== confirmMasterPassword) {
      setRecoveryError("As senhas digitadas não coincidem.");
      return;
    }

    // Salva a nova senha
    updateMasterPassword(newMasterPassword);
    setPassword(newMasterPassword);
    setRecoveryStep(3);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-purple-50/60 via-white to-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand */}
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-500/25">
          <Building2 className="h-8 w-8" />
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
          Condomin<span className="text-purple-600">IA</span>
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
          Acesso Administrativo Master
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/40">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN MASTER */}
          <form onSubmit={handleMasterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                E-mail do Master
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  placeholder="danibs2109@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setShowForgotModal(true);
                    setRecoveryStep(1);
                    setRecoveryError("");
                  }}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-10 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Autenticando..." : "Entrar no Painel Master"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* LINK PARA VOLTAR AO LOGIN GERAL DE MORADORES/SÍNDICOS */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Portal do Condomínio (Moradores & Síndicos)</span>
          </Link>
        </div>
      </div>

      {/* MODAL DE RECUPERAÇÃO EM 2 ETAPAS */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <KeyRound className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Recuperação de Acesso Master</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Autenticação em duas etapas via código de segurança por e-mail.
            </p>

            {recoveryError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                {recoveryError}
              </div>
            )}

            {/* ETAPA 1: INFORMAR E-MAIL */}
            {recoveryStep === 1 && (
              <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    E-mail Cadastrado
                  </label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="master@condominia.com.br"
                    className="w-full rounded-xl border border-zinc-300 py-2.5 px-3 text-sm font-medium text-zinc-900 focus:border-purple-600 focus:outline-none"
                    required
                  />
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    O código de segurança será enviado para este e-mail.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" /> Enviar Código
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 2: CÓDIGO + NOVA SENHA */}
            {recoveryStep === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="rounded-xl bg-purple-50 p-3 border border-purple-200 text-xs text-purple-900">
                  <p className="font-semibold mb-0.5">Código de Autenticação:</p>
                  <p className="text-[11px]">
                    Use o código recebido:{" "}
                    <strong className="text-base font-mono font-extrabold text-purple-700 tracking-wider">
                      {generatedCode}
                    </strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Código de 6 Dígitos
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="000000"
                    className="w-full rounded-xl border border-zinc-300 py-2 px-3 text-center font-mono text-lg font-bold tracking-widest text-zinc-900 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Nova Senha Master
                  </label>
                  <input
                    type="password"
                    value={newMasterPassword}
                    onChange={(e) => setNewMasterPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-zinc-300 py-2 px-3 text-sm text-zinc-900 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Confirme a Nova Senha
                  </label>
                  <input
                    type="password"
                    value={confirmMasterPassword}
                    onChange={(e) => setConfirmMasterPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full rounded-xl border border-zinc-300 py-2 px-3 text-sm text-zinc-900 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep(1)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
                  >
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 3: CONFIRMAÇÃO DE SUCESSO */}
            {recoveryStep === 3 && (
              <div className="py-4 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Senha Master Atualizada!</h4>
                <p className="text-xs text-zinc-500">
                  Sua senha foi redefinida com sucesso.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm"
                >
                  Entrar com a Nova Senha
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
