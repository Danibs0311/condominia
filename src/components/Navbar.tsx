"use client";

import { useState } from "react";
import Link from "next/link";
import { setLoggedUser, setMasterLoggedIn } from "@/lib/store";
import {
  Building2,
  LogOut,
  ShieldCheck,
  UserCheck,
  Home,
  Menu,
  X,
  ChevronRight,
  Smartphone,
  ExternalLink,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface NavbarProps {
  role?: "master" | "syndic" | "resident";
  userName?: string;
  unitNumber?: string;
  condoName?: string;
  navItems?: NavItem[];
  activeTab?: string;
  onSelectTab?: (id: any) => void;
  isDemo?: boolean;
}

export function Navbar({
  role = "resident",
  userName = "Carlos Silva",
  unitNumber = "101",
  condoName = "Condomínio Residencial Piloto",
  navItems,
  activeTab,
  onSelectTab,
  isDemo = false,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleBadge = {
    master: { label: "Master (Dono)", bg: "bg-purple-100 text-purple-800 border-purple-300" },
    syndic: { label: isDemo ? "Síndico (Demo)" : "Síndico", bg: "bg-amber-100 text-amber-800 border-amber-300" },
    resident: { label: isDemo ? `Apto ${unitNumber} (Demo)` : `Apto ${unitNumber}`, bg: "bg-blue-100 text-blue-800 border-blue-300" },
  }[role];

  const handleTabClick = (id: string) => {
    if (onSelectTab) {
      onSelectTab(id);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (role === "master") {
      setMasterLoggedIn(false);
    } else if (!isDemo) {
      setLoggedUser(null);
    }
  };

  const homeHref = isDemo ? "/demo" : role === "master" ? "/master/login" : "/";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
          {/* Lado Esquerdo: Botão Hambúrguer (Mobile) + Brand */}
          <div className="flex items-center gap-2.5">
            {/* Botão Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex md:hidden items-center justify-center rounded-xl p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition"
              aria-label="Abrir Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo e Nome do SaaS */}
            <Link href={homeHref} className="flex items-center gap-2">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
                    Condomin<span className="text-blue-600">IA</span>
                  </span>
                  <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-200">
                    {isDemo ? "DEMO" : "APP"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 hidden sm:block truncate max-w-[200px]">{condoName}</p>
              </div>
            </Link>
          </div>

          {/* Lado Direito: Perfil & Ações */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleBadge.bg}`}>
                {role === "master" && <ShieldCheck className="h-3.5 w-3.5" />}
                {role === "syndic" && <UserCheck className="h-3.5 w-3.5" />}
                {role === "resident" && <Home className="h-3.5 w-3.5" />}
                {roleBadge.label}
              </span>
              <span className="text-sm font-medium text-zinc-700 hidden lg:inline-block">
                {userName}
              </span>
            </div>

            <Link
              href={homeHref}
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isDemo ? "Sair da Demo" : "Sair"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* DRAWER / MENU HAMBÚRGUER MOBILE */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop Escuro */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel do Menu Lateral / Drawer Deslizante */}
          <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl border-t border-zinc-200 animate-in slide-in-from-bottom duration-250">
            {/* Header do Menu */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{userName}</h3>
                  <p className="text-xs text-zinc-500">{condoName}</p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Fechar Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Itens de Navegação das Abas (Se fornecidos pela página) */}
            {navItems && navItems.length > 0 && (
              <div className="py-4 border-b border-zinc-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 px-1">
                  Navegação Principal
                </span>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && (
                          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-zinc-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Alternância Rápida de Painel (Para testes na demonstração) */}
            <div className="py-4 border-b border-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 px-1">
                {isDemo ? "Alternar Visão da Demonstração" : "Trocar de Painel"}
              </span>
              <div className={`grid ${role === "master" ? "grid-cols-3" : "grid-cols-2"} gap-2 text-center text-xs`}>
                <Link
                  href={isDemo ? `/morador?condoId=condo-demo` : "/morador"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl p-2.5 border font-semibold ${
                    role === "resident" ? "bg-blue-600 text-white border-blue-600" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                  }`}
                >
                  🏠 Morador
                </Link>
                <Link
                  href={isDemo ? `/sindico?condoId=condo-demo` : "/sindico"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl p-2.5 border font-semibold ${
                    role === "syndic" ? "bg-amber-600 text-white border-amber-600" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                  }`}
                >
                  🏢 Síndico
                </Link>
                {role === "master" && (
                  <Link
                    href="/master"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl p-2.5 border font-semibold bg-purple-600 text-white border-purple-600"
                  >
                    👑 Master
                  </Link>
                )}
              </div>
            </div>

            {/* Botão de Sair */}
            <div className="pt-4">
              <Link
                href={homeHref}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/60 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>{isDemo ? "Sair da Demonstração" : "Encerrar Sessão"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
