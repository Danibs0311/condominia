"use client";

import { useState, useEffect } from "react";
import { INITIAL_CONDO, CondoData, Unit, Notice, Expense } from "./mock-data";

const STORAGE_KEY = "condominia_store_v1";
const CONDO_PREFIX = "condominia_condo_data_";
const ACTIVE_CONDO_KEY = "condominia_active_condo_id_v1";
const MASTER_CONDOS_KEY = "condominia_master_condos_v1";
const MASTER_AUTH_KEY = "condominia_master_auth_v1";

export interface MasterCondo {
  id: string;
  name: string;
  address: string;
  city: string;
  units: number;
  syndicName: string;
  syndicCpf: string;
  syndicPhone: string;
  syndicEmail: string;
  planPrice: number;
  planName?: string;
  isDemo?: boolean;
  status: "active" | "trial" | "overdue";
  joinedAt: string;
}

export const DEMO_CONDO_ID = "condo-demo";

export interface MasterAuth {
  email: string;
  cpf: string;
  password: string;
}

export const INITIAL_MASTER_CONDOS: MasterCondo[] = [
  {
    id: DEMO_CONDO_ID,
    name: "Condomínio Bela Vista (Demonstração)",
    address: "Av. das Américas, 500 - Barra da Tijuca",
    city: "Rio de Janeiro - RJ",
    units: 16,
    syndicName: "Síndico Demonstração",
    syndicCpf: "000.000.000-00",
    syndicPhone: "(21) 99999-8888",
    syndicEmail: "demo@condominia.com.br",
    planPrice: 49.90,
    planName: "Plano Essencial",
    isDemo: true,
    status: "active",
    joinedAt: "01/11/2026",
  },
  {
    id: "condo-1",
    name: "Condomínio Residencial Piloto",
    address: "Rua das Palmeiras, 100 - Centro",
    city: "São Paulo - SP",
    units: 16,
    syndicName: "Geraldo Síndico",
    syndicCpf: "111.111.111-11",
    syndicPhone: "(11) 98888-8888",
    syndicEmail: "sindico@condominia.com.br",
    planPrice: 49.90,
    planName: "Plano Essencial",
    status: "active",
    joinedAt: "01/10/2026",
  },
  {
    id: "condo-2",
    name: "Condomínio Solar das Flores",
    address: "Av. Paulista, 1500 - Bela Vista",
    city: "São Paulo - SP",
    units: 16,
    syndicName: "Marcos Vinicius",
    syndicCpf: "222.222.222-34",
    syndicPhone: "(11) 97777-1401",
    syndicEmail: "marcos.sindico@solardasflores.com",
    planPrice: 49.90,
    planName: "Plano Essencial",
    status: "active",
    joinedAt: "05/11/2026",
  },
];

export const INITIAL_MASTER_AUTH: MasterAuth = {
  email: "danibs2109@gmail.com",
  cpf: "80618405534",
  password: "Danibs0311@",
};

// Gerador de dados isolados para cada novo condomínio
export function createInitialCondoData(
  id: string,
  name: string,
  address: string,
  syndicName: string,
  syndicCpf: string,
  syndicPhone: string,
  unitsCount: number = 16,
  initialCashBalance: number = 0
): CondoData {
  if (id === "condo-1") {
    return INITIAL_CONDO;
  }

  if (id === DEMO_CONDO_ID) {
    return {
      ...INITIAL_CONDO,
      id: DEMO_CONDO_ID,
      name: "Condomínio Bela Vista (Demonstração)",
      address: "Av. das Américas, 500 - Barra da Tijuca, Rio de Janeiro - RJ",
    };
  }

  const initialBal = Math.max(0, initialCashBalance);

  // Gera dados virgens para novo condomínio
  const cleanUnits: Unit[] = Array.from({ length: unitsCount }, (_, i) => {
    const floor = Math.floor(i / 4) + 1;
    const door = (i % 4) + 1;
    const num = `${floor}0${door}`;
    const isSyndicUnit = i === unitsCount - 1;

    return {
      id: `u-${id}-${num}`,
      number: num,
      residentName: isSyndicUnit ? syndicName : `Morador Apto ${num}`,
      residentCpf: isSyndicUnit ? syndicCpf.replace(/\D/g, "") : `333333333${String(i).padStart(2, "0")}`,
      residentPhone: isSyndicUnit ? syndicPhone : `(11) 98000-${num}`,
      isSyndic: isSyndicUnit,
      isExemptFromUtilities: isSyndicUnit,
      paymentStatus: "pending",
      paymentMethod: undefined,
      currentAmount: 160.00,
    };
  });

  return {
    id,
    name,
    address,
    totalUnits: unitsCount,
    defaultCondoFee: 160.00,
    pixKeyType: "CNPJ",
    pixKey: "44.555.666/0001-77",
    pixBeneficiary: name,
    pixBank: "Banco Inter (077)",
    cashBalance: initialBal,
    isSyndicExemptDefault: true,
    subscriptionStatus: "active",
    currentClosing: {
      month: "Novembro",
      year: 2026,
      dueDate: "10/11/2026",
      waterAmount: 0.00,
      electricityAmount: 0.00,
      condoFeeApplied: 160.00,
      isSyndicExempt: true,
      previousBalance: initialBal,
      totalRevenues: 0.00,
      totalExpenses: 0.00,
      finalBalance: initialBal,
      status: "current",
    },
    pastClosings: [],
    units: cleanUnits,
    notices: [
      {
        id: `not-${id}-1`,
        title: `Boas-vindas ao CondominIA no ${name}`,
        content: `Informamos a todos os moradores que a gestão digital do condomínio foi ativada. Todas as cotas e balancetes podem ser acompanhados online.`,
        date: "05/11/2026 às 09:00",
        author: syndicName,
      },
    ],
    expenses: [],
  };
}

// Helpers para Gerenciar o Condomínio Ativo
export function getActiveCondoId(): string {
  if (typeof window === "undefined") return "condo-1";
  try {
    const id = localStorage.getItem(ACTIVE_CONDO_KEY);
    return id || "condo-1";
  } catch (e) {
    return "condo-1";
  }
}

export function setActiveCondoId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_CONDO_KEY, id);
    window.dispatchEvent(new Event("condominia_active_condo_changed"));
    window.dispatchEvent(new Event("condominia_data_changed"));
  } catch (e) {}
}

export interface LoggedUser {
  role: "syndic" | "resident";
  condoId: string;
  condoName: string;
  unitId?: string;
  unitNumber?: string;
  name: string;
  cpf: string;
}

const LOGGED_USER_KEY = "condominia_logged_user_v1";

export function getLoggedUser(): LoggedUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOGGED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setLoggedUser(user: LoggedUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOGGED_USER_KEY);
    }
    window.dispatchEvent(new Event("condominia_logged_user_changed"));
  } catch (e) {}
}

export interface UserAuthMatch {
  role: "syndic" | "resident";
  condo: MasterCondo;
  condoData: CondoData;
  unit?: Unit;
  name: string;
  cpf: string;
  expectedPassword: string;
}

export function findUserByCpf(rawCpf: string): UserAuthMatch | null {
  const cleanCpf = rawCpf.replace(/\D/g, "");
  if (!cleanCpf) return null;

  const masterCondos = getStoredMasterCondos();

  for (const masterCondo of masterCondos) {
    const condoData = getStoredCondoData(masterCondo.id);

    // 1. Checa se é o CPF do Síndico do Condomínio
    const cleanSyndicCpf = masterCondo.syndicCpf.replace(/\D/g, "");
    if (cleanSyndicCpf === cleanCpf) {
      const defaultPwd = cleanCpf.slice(0, 6) || "123456";
      return {
        role: "syndic",
        condo: masterCondo,
        condoData,
        name: masterCondo.syndicName,
        cpf: cleanCpf,
        expectedPassword: defaultPwd,
      };
    }

    // 2. Checa se o CPF pertence a algum morador das unidades cadastradas
    const matchedUnit = condoData.units.find(
      (u) => u.residentCpf.replace(/\D/g, "") === cleanCpf
    );

    if (matchedUnit) {
      const defaultPwd = cleanCpf.slice(0, 6) || "123456";
      return {
        role: matchedUnit.isSyndic ? "syndic" : "resident",
        condo: masterCondo,
        condoData,
        unit: matchedUnit,
        name: matchedUnit.residentName,
        cpf: cleanCpf,
        expectedPassword: defaultPwd,
      };
    }
  }

  return null;
}

// Helper para ler os dados do condomínio específico do localStorage
export function getStoredCondoData(targetId?: string): CondoData {
  const id = targetId || getActiveCondoId();
  if (typeof window === "undefined") {
    return id === "condo-1" ? INITIAL_CONDO : createInitialCondoData(id, "Solar das Flores", "Av. Paulista, 1500", "Marcos Síndico", "222.222.222-34", "(11) 97777-1401");
  }

  const key = `${CONDO_PREFIX}${id}`;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      // Se for condo-1 e existir o store antigo
      if (id === "condo-1") {
        const legacy = localStorage.getItem(STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        }
        localStorage.setItem(key, JSON.stringify(INITIAL_CONDO));
        return INITIAL_CONDO;
      }

      // Procura nos master condos
      const masterCondos = getStoredMasterCondos();
      const found = masterCondos.find((c) => c.id === id);
      const initial = found
        ? createInitialCondoData(found.id, found.name, found.address, found.syndicName, found.syndicCpf, found.syndicPhone, found.units)
        : createInitialCondoData(id, "Condomínio", "Endereço", "Síndico", "000.000.000-00", "(11) 99999-9999");

      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(item);
  } catch (e) {
    return INITIAL_CONDO;
  }
}

export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  const demoData = {
    ...INITIAL_CONDO,
    id: DEMO_CONDO_ID,
    name: "Condomínio Bela Vista (Demonstração)",
    address: "Av. das Américas, 500 - Barra da Tijuca, Rio de Janeiro - RJ",
  };
  try {
    localStorage.setItem(`${CONDO_PREFIX}${DEMO_CONDO_ID}`, JSON.stringify(demoData));
    window.dispatchEvent(new Event("condominia_data_changed"));
  } catch (e) {}
}

export function saveCondoData(data: CondoData, targetId?: string): void {
  if (typeof window === "undefined") return;
  const id = targetId || data.id || getActiveCondoId();
  const key = `${CONDO_PREFIX}${id}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (id === "condo-1") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    window.dispatchEvent(new Event("condominia_data_changed"));
  } catch (e) {}
}

export function getStoredMasterCondos(): MasterCondo[] {
  if (typeof window === "undefined") return INITIAL_MASTER_CONDOS;
  try {
    const item = localStorage.getItem(MASTER_CONDOS_KEY);
    if (!item) {
      localStorage.setItem(MASTER_CONDOS_KEY, JSON.stringify(INITIAL_MASTER_CONDOS));
      return INITIAL_MASTER_CONDOS;
    }
    return JSON.parse(item);
  } catch (e) {
    return INITIAL_MASTER_CONDOS;
  }
}

export function saveMasterCondos(data: MasterCondo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MASTER_CONDOS_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("condominia_master_condos_changed"));
  } catch (e) {}
}

export function getStoredMasterAuth(): MasterAuth {
  if (typeof window === "undefined") return INITIAL_MASTER_AUTH;
  try {
    const item = localStorage.getItem(MASTER_AUTH_KEY);
    if (!item) {
      localStorage.setItem(MASTER_AUTH_KEY, JSON.stringify(INITIAL_MASTER_AUTH));
      return INITIAL_MASTER_AUTH;
    }
    const parsed = JSON.parse(item);
    if (parsed.email === "master@condominia.com.br" || !parsed.cpf) {
      const updated = { ...INITIAL_MASTER_AUTH, ...parsed, cpf: "80618405534", email: "danibs2109@gmail.com" };
      localStorage.setItem(MASTER_AUTH_KEY, JSON.stringify(updated));
      return updated;
    }
    return parsed;
  } catch (e) {
    return INITIAL_MASTER_AUTH;
  }
}

export function saveMasterAuth(auth: MasterAuth): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MASTER_AUTH_KEY, JSON.stringify(auth));
    window.dispatchEvent(new Event("condominia_master_auth_changed"));
  } catch (e) {}
}

const MASTER_SESSION_KEY = "condominia_master_logged_session_v1";

export function isMasterLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      sessionStorage.getItem(MASTER_SESSION_KEY) === "true" ||
      localStorage.getItem(MASTER_SESSION_KEY) === "true"
    );
  } catch (e) {
    return false;
  }
}

export function setMasterLoggedIn(status: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (status) {
      sessionStorage.setItem(MASTER_SESSION_KEY, "true");
      localStorage.setItem(MASTER_SESSION_KEY, "true");
    } else {
      sessionStorage.removeItem(MASTER_SESSION_KEY);
      localStorage.removeItem(MASTER_SESSION_KEY);
    }
  } catch (e) {}
}

// Hook reativo sincronizado do Condomínio Multi-Tenant
export function useCondoStore(explicitCondoId?: string) {
  const [activeId, setActiveIdState] = useState<string>(() => explicitCondoId || getActiveCondoId());
  const [condo, setCondo] = useState<CondoData>(() => getStoredCondoData(explicitCondoId || getActiveCondoId()));
  const [allMasterCondos, setAllMasterCondos] = useState<MasterCondo[]>(() => getStoredMasterCondos());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Verifica query param na URL (?condoId=...) se não for passado explicitamente
    let target = explicitCondoId;
    if (!target && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("condoId");
      if (q) {
        target = q;
        setActiveCondoId(q);
      }
    }

    const currentId = target || getActiveCondoId();
    setActiveIdState(currentId);
    setCondo(getStoredCondoData(currentId));
    setAllMasterCondos(getStoredMasterCondos());
    setIsLoaded(true);

    const handleStorageChange = () => {
      const current = target || getActiveCondoId();
      setActiveIdState(current);
      setCondo(getStoredCondoData(current));
      setAllMasterCondos(getStoredMasterCondos());
    };

    window.addEventListener("condominia_data_changed", handleStorageChange);
    window.addEventListener("condominia_active_condo_changed", handleStorageChange);
    window.addEventListener("condominia_master_condos_changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("condominia_data_changed", handleStorageChange);
      window.removeEventListener("condominia_active_condo_changed", handleStorageChange);
      window.removeEventListener("condominia_master_condos_changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [explicitCondoId]);

  const updateCondo = (updater: (prev: CondoData) => CondoData) => {
    setCondo((prev) => {
      const next = updater(prev);
      saveCondoData(next, prev.id);
      return next;
    });
  };

  const switchCondo = (newCondoId: string) => {
    setActiveCondoId(newCondoId);
    setActiveIdState(newCondoId);
    setCondo(getStoredCondoData(newCondoId));
  };

  return {
    condo,
    activeCondoId: activeId,
    allMasterCondos,
    isLoaded,
    updateCondo,
    switchCondo,
  };
}

// Hook reativo sincronizado do Master (Condomínios e Autenticação)
export function useMasterStore() {
  const [condos, setCondos] = useState<MasterCondo[]>(INITIAL_MASTER_CONDOS);
  const [masterAuth, setMasterAuth] = useState<MasterAuth>(INITIAL_MASTER_AUTH);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCondos(getStoredMasterCondos());
    setMasterAuth(getStoredMasterAuth());
    setIsLoaded(true);

    const handleCondosChange = () => {
      setCondos(getStoredMasterCondos());
    };

    const handleAuthChange = () => {
      setMasterAuth(getStoredMasterAuth());
    };

    window.addEventListener("condominia_master_condos_changed", handleCondosChange);
    window.addEventListener("condominia_master_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleCondosChange);

    return () => {
      window.removeEventListener("condominia_master_condos_changed", handleCondosChange);
      window.removeEventListener("condominia_master_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleCondosChange);
    };
  }, []);

  const addCondo = (newCondo: Omit<MasterCondo, "id" | "joinedAt" | "status" | "planPrice"> & { planPrice?: number; planName?: string; initialCashBalance?: number }) => {
    const created: MasterCondo = {
      ...newCondo,
      id: `condo-${Date.now()}`,
      status: "active",
      planPrice: newCondo.planPrice ?? 49.90,
      planName: newCondo.planName ?? "Plano Essencial",
      joinedAt: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [created, ...condos];
    setCondos(updated);
    saveMasterCondos(updated);

    // Cria e salva imediatamente o banco isolado do novo condomínio
    const initialData = createInitialCondoData(
      created.id,
      created.name,
      created.address,
      created.syndicName,
      created.syndicCpf,
      created.syndicPhone,
      created.units,
      newCondo.initialCashBalance || 0
    );
    saveCondoData(initialData, created.id);

    return created;
  };

  const updateCondoStatus = (id: string, status: "active" | "trial" | "overdue") => {
    const updated = condos.map((c) => (c.id === id ? { ...c, status } : c));
    setCondos(updated);
    saveMasterCondos(updated);
  };

  const updateCondoDetails = (id: string, updatedData: Partial<MasterCondo>) => {
    const updated = condos.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    setCondos(updated);
    saveMasterCondos(updated);

    // Atualiza também os dados cadastrais no CondoData isolado
    try {
      const stored = getStoredCondoData(id);
      if (stored) {
        const nextCondo: CondoData = {
          ...stored,
          name: updatedData.name || stored.name,
          address: updatedData.address || stored.address,
        };
        saveCondoData(nextCondo, id);
      }
    } catch (e) {}
  };

  const deleteCondo = (id: string) => {
    const updated = condos.filter((c) => c.id !== id);
    setCondos(updated);
    saveMasterCondos(updated);

    // Remove do localStorage a chave do condomínio
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${CONDO_PREFIX}${id}`);
      } catch (e) {}

      const currentActive = getActiveCondoId();
      if (currentActive === id && updated.length > 0) {
        setActiveCondoId(updated[0].id);
      }
    }
  };

  const updateMasterPassword = (newPassword: string) => {
    const updated = { ...masterAuth, password: newPassword };
    setMasterAuth(updated);
    saveMasterAuth(updated);
  };

  return {
    condos,
    masterAuth,
    isLoaded,
    addCondo,
    updateCondoStatus,
    updateCondoDetails,
    deleteCondo,
    updateMasterPassword,
  };
}
