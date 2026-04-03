export interface Transaction {
  id: number;
  date: string;
  type: "income" | "expense";
  categoryId: number;
  description: string;
  amount: number;
  paymentMethod: "cash" | "debit" | "credit" | "transfer" | "other";
  accountId?: number;
  cardId?: number;
  month: number;
  year: number;
}

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface Account {
  id: number;
  name: string;
  bankName: string;
  type: "checking" | "savings" | "investment" | "other";
  initialBalance: number;
  balance: number;
  active: boolean;
  createdAt: string;
}

export interface Card {
  id: number;
  name: string;
  bank: string;
  lastFourDigits: string;
  creditLimit: number;
  closingDay: number;
  dueDate: number;
  color: string;
  active: boolean;
  createdAt: string;
}

// Default categories
export const DEFAULT_CATEGORIES = [
  { id: 1, name: "Salário", type: "income", color: "#10b981" },
  { id: 2, name: "Freelance", type: "income", color: "#06b6d4" },
  { id: 3, name: "Aluguel", type: "expense", color: "#ef4444" },
  { id: 4, name: "Alimentação", type: "expense", color: "#f97316" },
  { id: 5, name: "Transporte", type: "expense", color: "#8b5cf6" },
  { id: 6, name: "Saúde", type: "expense", color: "#ec4899" },
  { id: 7, name: "Educação", type: "expense", color: "#3b82f6" },
  { id: 8, name: "Lazer", type: "expense", color: "#eab308" },
];

// Default accounts
export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 1,
    name: "Conta Corrente",
    bankName: "Banco do Brasil",
    type: "checking",
    initialBalance: 0,
    balance: 0,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Default cards
export const DEFAULT_CARDS: Card[] = [
  {
    id: 1,
    name: "Cartão Principal",
    bank: "Nubank",
    lastFourDigits: "1234",
    creditLimit: 500000,
    closingDay: 15,
    dueDate: 22,
    color: "#8b5cf6",
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Initialize storage with default data
export function initializeStorage() {
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem("accounts")) {
    localStorage.setItem("accounts", JSON.stringify(DEFAULT_ACCOUNTS));
  }
  if (!localStorage.getItem("cards")) {
    localStorage.setItem("cards", JSON.stringify(DEFAULT_CARDS));
  }
  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]));
  }
}

// Transaction operations
export function getTransactions(month?: number, year?: number): Transaction[] {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  if (month && year) {
    return transactions.filter((t: Transaction) => t.month === month && t.year === year);
  }
  return transactions;
}

export function addTransaction(transaction: Omit<Transaction, "id">): Transaction {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const newTransaction: Transaction = {
    ...transaction,
    id: transactions.length > 0 ? Math.max(...transactions.map((t: Transaction) => t.id)) + 1 : 1,
  };
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  return newTransaction;
}

export function updateTransaction(id: number, updates: Partial<Transaction>): Transaction | null {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const index = transactions.findIndex((t: Transaction) => t.id === id);
  if (index === -1) return null;
  transactions[index] = { ...transactions[index], ...updates };
  localStorage.setItem("transactions", JSON.stringify(transactions));
  return transactions[index];
}

export function deleteTransaction(id: number): boolean {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const filtered = transactions.filter((t: Transaction) => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(filtered));
  return filtered.length < transactions.length;
}

// Category operations
export function getCategories(): Category[] {
  return JSON.parse(localStorage.getItem("categories") || "[]");
}

// Account operations
export function getAccounts(): Account[] {
  return JSON.parse(localStorage.getItem("accounts") || "[]");
}

export function addAccount(account: Omit<Account, "id" | "createdAt">): Account {
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const newAccount: Account = {
    ...account,
    id: accounts.length > 0 ? Math.max(...accounts.map((a: Account) => a.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  accounts.push(newAccount);
  localStorage.setItem("accounts", JSON.stringify(accounts));
  return newAccount;
}

export function updateAccount(id: number, updates: Partial<Account>): Account | null {
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const index = accounts.findIndex((a: Account) => a.id === id);
  if (index === -1) return null;
  accounts[index] = { ...accounts[index], ...updates };
  localStorage.setItem("accounts", JSON.stringify(accounts));
  return accounts[index];
}

export function deleteAccount(id: number): boolean {
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const filtered = accounts.filter((a: Account) => a.id !== id);
  localStorage.setItem("accounts", JSON.stringify(filtered));
  return filtered.length < accounts.length;
}

// Card operations
export function getCards(): Card[] {
  return JSON.parse(localStorage.getItem("cards") || "[]");
}

export function addCard(card: Omit<Card, "id" | "createdAt">): Card {
  const cards = JSON.parse(localStorage.getItem("cards") || "[]");
  const newCard: Card = {
    ...card,
    id: cards.length > 0 ? Math.max(...cards.map((c: Card) => c.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  cards.push(newCard);
  localStorage.setItem("cards", JSON.stringify(cards));
  return newCard;
}

export function updateCard(id: number, updates: Partial<Card>): Card | null {
  const cards = JSON.parse(localStorage.getItem("cards") || "[]");
  const index = cards.findIndex((c: Card) => c.id === id);
  if (index === -1) return null;
  cards[index] = { ...cards[index], ...updates };
  localStorage.setItem("cards", JSON.stringify(cards));
  return cards[index];
}

export function deleteCard(id: number): boolean {
  const cards = JSON.parse(localStorage.getItem("cards") || "[]");
  const filtered = cards.filter((c: Card) => c.id !== id);
  localStorage.setItem("cards", JSON.stringify(filtered));
  return filtered.length < cards.length;
}
