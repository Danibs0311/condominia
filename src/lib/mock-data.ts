// Mock Data inicial para teste interativo completo do CondominIA sem depender do Supabase

export interface Unit {
  id: string;
  number: string;
  residentName: string;
  residentCpf: string;
  residentPhone: string;
  isSyndic: boolean;
  isExemptFromUtilities: boolean;
  paymentStatus: "paid" | "pending";
  paymentMethod?: "pix" | "cash" | "transfer";
  paidAt?: string;
  currentAmount: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isArchived?: boolean;
  archivedAt?: string;
  attachments?: {
    name: string;
    type: "image" | "pdf";
    url: string;
  }[];
}

export interface Expense {
  id: string;
  category: "water" | "electricity" | "maintenance" | "cleaning";
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  month?: string;
  year?: number;
}

export interface MonthlyClosing {
  month: string;
  year: number;
  dueDate?: string;
  waterAmount: number;
  electricityAmount: number;
  condoFeeApplied: number;
  isSyndicExempt: boolean;
  previousBalance: number;
  totalRevenues: number;
  totalExpenses: number;
  finalBalance: number;
  status: "closed" | "current";
}

export interface CondoData {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  defaultCondoFee: number;
  pixKey: string;
  pixKeyType: string;
  pixBeneficiary?: string;
  pixBank?: string;
  cashBalance: number;
  isSyndicExemptDefault: boolean;
  subscriptionStatus: "active" | "trial" | "overdue";
  units: Unit[];
  notices: Notice[];
  expenses: Expense[];
  currentClosing: MonthlyClosing;
  pastClosings?: MonthlyClosing[];
}

export const INITIAL_CONDO: CondoData = {
  id: "condo-1",
  name: "Condomínio Residencial Piloto",
  address: "Rua das Palmeiras, 100 - Centro",
  totalUnits: 16,
  defaultCondoFee: 150.00,
  pixKeyType: "CNPJ",
  pixKey: "12.345.678/0001-90",
  pixBeneficiary: "Condomínio Residencial Piloto",
  pixBank: "Banco Inter (077)",
  cashBalance: 2957.50,
  isSyndicExemptDefault: true,
  subscriptionStatus: "active",
  currentClosing: {
    month: "Novembro",
    year: 2026,
    dueDate: "10/11/2026",
    waterAmount: 650.00,
    electricityAmount: 587.50,
    condoFeeApplied: 150.00,
    isSyndicExempt: true,
    previousBalance: 2150.00,
    totalRevenues: 2475.00,
    totalExpenses: 1667.50,
    finalBalance: 2957.50,
    status: "current",
  },
  pastClosings: [
    {
      month: "Outubro",
      year: 2026,
      dueDate: "10/10/2026",
      waterAmount: 615.00,
      electricityAmount: 542.00,
      condoFeeApplied: 150.00,
      isSyndicExempt: true,
      previousBalance: 1250.00,
      totalRevenues: 2722.00,
      totalExpenses: 1822.00,
      finalBalance: 2150.00,
      status: "closed",
    },
    {
      month: "Setembro",
      year: 2026,
      dueDate: "10/09/2026",
      waterAmount: 590.00,
      electricityAmount: 520.00,
      condoFeeApplied: 150.00,
      isSyndicExempt: true,
      previousBalance: 980.00,
      totalRevenues: 1730.00,
      totalExpenses: 1460.00,
      finalBalance: 1250.00,
      status: "closed",
    },
  ],
  units: [
    { id: "u-101", number: "101", residentName: "Carlos Silva", residentCpf: "22222222222", residentPhone: "(11) 97777-1101", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "05/11/2026 às 14:32", currentAmount: 232.50 },
    { id: "u-102", number: "102", residentName: "Mariana Costa", residentCpf: "22222222223", residentPhone: "(11) 97777-1102", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "06/11/2026 às 09:15", currentAmount: 232.50 },
    { id: "u-103", number: "103", residentName: "Roberto Alves", residentCpf: "22222222224", residentPhone: "(11) 97777-1103", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "pending", currentAmount: 232.50 },
    { id: "u-104", number: "104", residentName: "Fernanda Lima", residentCpf: "22222222225", residentPhone: "(11) 97777-1104", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "cash", paidAt: "07/11/2026 às 18:20", currentAmount: 232.50 },
    { id: "u-201", number: "201", residentName: "João Pedro", residentCpf: "22222222226", residentPhone: "(11) 97777-1201", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "05/11/2026 às 11:45", currentAmount: 232.50 },
    { id: "u-202", number: "202", residentName: "Beatriz Santos", residentCpf: "22222222227", residentPhone: "(11) 97777-1202", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "pending", currentAmount: 232.50 },
    { id: "u-203", number: "203", residentName: "Lucas Mendes", residentCpf: "22222222228", residentPhone: "(11) 97777-1203", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "06/11/2026 às 16:10", currentAmount: 232.50 },
    { id: "u-204", number: "204", residentName: "Camila Rocha", residentCpf: "22222222229", residentPhone: "(11) 97777-1204", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "pending", currentAmount: 232.50 },
    { id: "u-301", number: "301", residentName: "André Oliveira", residentCpf: "22222222230", residentPhone: "(11) 97777-1301", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "04/11/2026 às 20:05", currentAmount: 232.50 },
    { id: "u-302", number: "302", residentName: "Juliana Martins", residentCpf: "22222222231", residentPhone: "(11) 97777-1302", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "05/11/2026 às 13:50", currentAmount: 232.50 },
    { id: "u-303", number: "303", residentName: "Paulo Ferreira", residentCpf: "22222222232", residentPhone: "(11) 97777-1303", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "pending", currentAmount: 232.50 },
    { id: "u-304", number: "304", residentName: "Renata Souza", residentCpf: "22222222233", residentPhone: "(11) 97777-1304", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "cash", paidAt: "06/11/2026 às 17:40", currentAmount: 232.50 },
    { id: "u-401", number: "401", residentName: "Marcos Vinicius", residentCpf: "22222222234", residentPhone: "(11) 97777-1401", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "05/11/2026 às 10:22", currentAmount: 232.50 },
    { id: "u-402", number: "402", residentName: "Aline Ribeiro", residentCpf: "22222222235", residentPhone: "(11) 97777-1402", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "paid", paymentMethod: "pix", paidAt: "05/11/2026 às 15:30", currentAmount: 232.50 },
    { id: "u-403", number: "403", residentName: "Thiago Barbosa", residentCpf: "22222222236", residentPhone: "(11) 97777-1403", isSyndic: false, isExemptFromUtilities: false, paymentStatus: "pending", currentAmount: 232.50 },
    { id: "u-404", number: "404", residentName: "Geraldo Síndico", residentCpf: "11111111111", residentPhone: "(11) 98888-8888", isSyndic: true, isExemptFromUtilities: true, paymentStatus: "paid", paymentMethod: "pix", paidAt: "01/11/2026 às 08:00", currentAmount: 150.00 },
  ],
  notices: [
    {
      id: "not-1",
      title: "Limpeza da Caixa d'Água Semestral",
      content: "Informamos a todos os moradores que na próxima quarta-feira (11/11), das 08h às 13h, será realizada a limpeza das caixas d'água superior e inferior. Pedimos que economizem água durante o período.",
      date: "04/11/2026 às 10:00",
      author: "Síndico",
      attachments: [
        { name: "ordem_servico_limpeza.pdf", type: "pdf", url: "#" },
        { name: "foto_produto_autorizado.jpg", type: "image", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
      ],
    },
    {
      id: "not-2",
      title: "Conserto do Motor do Portão Eletrônico",
      content: "O motor do portão da garagem foi revisado e as peças desgastadas foram trocadas. A nota fiscal do serviço já está anexada e disponível na prestação de contas deste mês.",
      date: "02/11/2026 às 16:30",
      author: "Síndico",
      attachments: [
        { name: "nf_manutencao_portao.pdf", type: "pdf", url: "#" },
        { name: "foto_peca_substituida.jpg", type: "image", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
      ],
    },
  ],
  expenses: [
    // Novembro / 2026 (Mês Vigente)
    { id: "exp-1", category: "water", description: "Conta de Água Sabesp - Consumo Geral", amount: 650.00, date: "03/11/2026", month: "Novembro", year: 2026, receiptUrl: "#" },
    { id: "exp-2", category: "electricity", description: "Conta de Luz Enel - Áreas Comuns e Bombas", amount: 587.50, date: "03/11/2026", month: "Novembro", year: 2026, receiptUrl: "#" },
    { id: "exp-3", category: "maintenance", description: "Manutenção Preventiva do Portão e Interfonia", amount: 320.00, date: "02/11/2026", month: "Novembro", year: 2026, receiptUrl: "#" },
    { id: "exp-4", category: "cleaning", description: "Kit Mensal de Produtos de Limpeza e Sacos", amount: 110.00, date: "01/11/2026", month: "Novembro", year: 2026, receiptUrl: "#" },

    // Outubro / 2026 (Mês Anterior)
    { id: "exp-5", category: "water", description: "Conta de Água Sabesp - Ref. Setembro", amount: 615.00, date: "03/10/2026", month: "Outubro", year: 2026, receiptUrl: "#" },
    { id: "exp-6", category: "electricity", description: "Conta de Luz Enel - Ref. Setembro", amount: 542.00, date: "03/10/2026", month: "Outubro", year: 2026, receiptUrl: "#" },
    { id: "exp-7", category: "maintenance", description: "Troca de Lâmpadas LED do Hall e Garagem", amount: 185.00, date: "15/10/2026", month: "Outubro", year: 2026, receiptUrl: "#" },
    { id: "exp-8", category: "cleaning", description: "Dedetização Semestral das Caixas e Áreas Comuns", amount: 480.00, date: "05/10/2026", month: "Outubro", year: 2026, receiptUrl: "#" },

    // Setembro / 2026 (Histórico)
    { id: "exp-9", category: "water", description: "Conta de Água Sabesp", amount: 590.00, date: "04/09/2026", month: "Setembro", year: 2026, receiptUrl: "#" },
    { id: "exp-10", category: "electricity", description: "Conta de Luz Enel", amount: 520.00, date: "04/09/2026", month: "Setembro", year: 2026, receiptUrl: "#" },
    { id: "exp-11", category: "maintenance", description: "Reparo e Pintura no Portão de Acesso Pedestres", amount: 350.00, date: "18/09/2026", month: "Setembro", year: 2026, receiptUrl: "#" },
  ],
};
