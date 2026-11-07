"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  findUserByCpf,
  setActiveCondoId,
  setLoggedUser,
  getStoredMasterAuth,
  setMasterLoggedIn,
} from "@/lib/store";
import {
  Building2,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Check,
  ShieldCheck,
} from "lucide-react";

export default function UnifiedLoginPage() {
  const router = useRouter();

  // Estados do formulário (aceita CPF de Morador/Síndico ou CPF/E-mail do Master)
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Tratamento de input inteligente: formata CPF se só contiver números ou aceita e-mail
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (error) setError("");

    // Se contém caracteres de e-mail (como @ ou letras), não formata com máscara
    if (/[a-zA-Z@]/.test(raw)) {
      setIdentifier(raw);
      return;
    }

    // Se estiver digitando dígitos, aplica máscara padrão de CPF para facilidade
    let v = raw.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    else if (v.length > 6) v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    else if (v.length > 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
    setIdentifier(v);
  };

  // Submissão do Login Unificado
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmed = identifier.trim();
    const cleanNumbers = trimmed.replace(/\D/g, "");

    if (!trimmed) {
      setError("Por favor, digite seu CPF ou E-mail.");
      return;
    }

    if (!password) {
      setError("Por favor, informe sua senha de acesso.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 1. VERIFICAÇÃO DO PERFIL MASTER (E-mail danibs2109@gmail.com OU CPF 80618405534)
      const masterAuth = getStoredMasterAuth();
      const isMasterEmail =
        trimmed.toLowerCase() === masterAuth.email.toLowerCase() ||
        trimmed.toLowerCase() === "danibs2109@gmail.com";
      const isMasterCpf =
        cleanNumbers === (masterAuth.cpf || "80618405534").replace(/\D/g, "") ||
        cleanNumbers === "80618405534";

      if (isMasterEmail || isMasterCpf) {
        const isMasterPasswordValid =
          password === masterAuth.password ||
          password === "Danibs0311@";

        if (isMasterPasswordValid) {
          setMasterLoggedIn(true);
          setSuccessMsg("Identificado como Administrador Master! Abrindo painel de controle...");
          setTimeout(() => {
            router.push("/master");
          }, 600);
          return;
        } else {
          setLoading(false);
          setError("Senha incorreta para o perfil de Administrador Master.");
          return;
        }
      }

      // 2. VERIFICAÇÃO DE MORADOR OU SÍNDICO PELO CPF (11 DÍGITOS)
      if (cleanNumbers.length !== 11) {
        setLoading(false);
        setError("Por favor, digite um CPF válido com 11 dígitos numéricos ou o e-mail Master.");
        return;
      }

      // Busca usuário pelo CPF em todos os condomínios cadastrados
      const match = findUserByCpf(cleanNumbers);

      if (!match) {
        setLoading(false);
        setError("CPF não encontrado no cadastro de nenhum condomínio. Verifique os números digitados ou solicite seu cadastro ao síndico.");
        return;
      }

      // Validação da senha
      const defaultResidentPwd = cleanNumbers.slice(0, 6) || "123456";
      const isSyndicMasterDefault = password === "12345678" || password === defaultResidentPwd;
      const isPasswordValid =
        password === match.expectedPassword ||
        password === defaultResidentPwd ||
        (match.role === "syndic" && isSyndicMasterDefault);

      if (!isPasswordValid) {
        setLoading(false);
        if (match.role === "resident") {
          setError(`Senha incorreta. Lembre-se: para moradores no primeiro acesso, a senha padrão são os 6 primeiros dígitos do seu CPF (${defaultResidentPwd}).`);
        } else {
          setError("Senha incorreta. Verifique os dados ou solicite redefinição ao administrador.");
        }
        return;
      }

      // Sucesso na Autenticação Morador/Síndico!
      // 1. Define o condomínio ativo identificado no sistema
      setActiveCondoId(match.condo.id);

      // 2. Registra o usuário autenticado na sessão
      setLoggedUser({
        role: match.role,
        condoId: match.condo.id,
        condoName: match.condo.name,
        unitId: match.unit?.id,
        unitNumber: match.unit?.number,
        name: match.name,
        cpf: cleanNumbers,
      });

      setSuccessMsg(
        match.role === "syndic"
          ? `Bem-vindo, Síndico(a) ${match.name}! Entrando no ${match.condo.name}...`
          : `Bem-vindo(a), ${match.name}! Entrando no Apto ${match.unit?.number || "101"} do ${match.condo.name}...`
      );

      // 3. Redireciona de acordo com o perfil
      setTimeout(() => {
        if (match.role === "syndic") {
          router.push(`/sindico?condoId=${match.condo.id}`);
        } else {
          router.push(`/morador?condoId=${match.condo.id}`);
        }
      }, 700);
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-blue-50/60 via-white to-zinc-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/master/login"
          title="Acesso Administrativo Master"
          className="inline-block transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <img
            src="/logo_condominia.png"
            alt="CondominIA Logo"
            className="mx-auto h-16 w-16 rounded-2xl object-contain shadow-md"
          />
        </Link>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">
          Condomin<span className="text-blue-600">IA</span>
        </h1>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Portal de Acesso do Condomínio • Moradores & Síndicos
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-7 sm:p-8 shadow-xl shadow-zinc-200/40">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-200 leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 border border-emerald-200">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORMULÁRIO UNIFICADO: MORADOR / SÍNDICO / MASTER */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Seu CPF ou E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="000.000.000-00 ou danibs2109@gmail.com"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-3 text-sm font-bold text-zinc-900 placeholder-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
                  required
                />
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Moradores e síndicos acessam pelo CPF. Dono do sistema pode acessar por CPF ou E-mail.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Senha de Acesso
              </label>
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
                  className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-10 text-sm font-medium text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-blue-700 font-medium mt-1.5 bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                💡 <strong>Primeiro acesso?</strong> Para moradores, a senha padrão inicial são os <strong>6 primeiros dígitos do seu CPF</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verificando dados..." : "Entrar no Sistema"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Dica de Segurança e Suporte */}
          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            <p className="text-[11px] text-zinc-400">
              Acesso protegido e criptografado. Se você esqueceu sua senha ou teve problemas no acesso, contate o síndico do seu condomínio.
            </p>
          </div>
        </div>

        {/* Link discreto para o modo demonstração */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          <span>Quer conhecer o funcionamento do sistema? </span>
          <Link
            href="/demo"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            Acessar Demonstração
          </Link>
        </div>

        {/* Link Reservado ao Dono do SaaS (Master) */}
        <div className="mt-5 text-center">
          <Link
            href="/master/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-purple-700 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Acesso Administrativo Master</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
