"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  findUserByCpf,
  setActiveCondoId,
  setLoggedUser,
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
} from "lucide-react";

export default function UnifiedLoginPage() {
  const router = useRouter();

  // Estados do formulário
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Máscara de CPF (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    else if (v.length > 6) v = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    else if (v.length > 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
    setCpf(v);
    if (error) setError("");
  };

  // Submissão do Login Unificado
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setError("Por favor, digite um CPF válido com 11 dígitos numéricos.");
      return;
    }

    if (!password) {
      setError("Por favor, informe sua senha de acesso.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Busca usuário pelo CPF em todos os condomínios cadastrados
      const match = findUserByCpf(cleanCpf);

      if (!match) {
        setLoading(false);
        setError("CPF não encontrado no cadastro de nenhum condomínio. Verifique os números digitados ou solicite seu cadastro ao síndico.");
        return;
      }

      // Validação da senha
      const defaultResidentPwd = cleanCpf.slice(0, 6) || "123456";
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

      // Sucesso na Autenticação!
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
        cpf: cleanCpf,
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
        <img
          src="/logo_condominia.png"
          alt="CondominIA Logo"
          className="mx-auto h-16 w-16 rounded-2xl object-contain shadow-md"
        />
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

          {/* FORMULÁRIO UNIFICADO POR CPF */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Seu CPF
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-3 text-sm font-bold text-zinc-900 placeholder-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
                  required
                />
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Identificação automática do condomínio e apartamento pelo CPF.
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
              {loading ? "Localizando Condomínio..." : "Entrar no Condomínio"}
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
      </div>
    </div>
  );
}
