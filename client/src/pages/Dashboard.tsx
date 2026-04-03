import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, TrendingDown, CreditCard, Wallet } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionTable from "@/components/TransactionTable";
import KPICard from "@/components/KPICard";
import { ExpensesByCategoryChart, IncomeDistributionChart, CreditCardSpendingChart } from "@/components/FinanceCharts";
import CardSpendingWidget from "@/components/CardSpendingWidget";
import AccountBalanceWidget from "@/components/AccountBalanceWidget";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  initializeStorage,
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  getAccounts,
  getCards,
  type Transaction,
} from "@/lib/storageUtils";
import { exportTransactionsToCSV } from "@/lib/exportCsv";
import { useDataRefresh } from "@/hooks/useDataRefresh";


const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

export default function Dashboard() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCard, setFilterCard] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  // Initialize storage on mount
  useEffect(() => {
    initializeStorage();
    loadData();
  }, []);

  // Reload data when month/year changes
  useEffect(() => {
    loadData();
  }, [month, year]);

  // Listen for data refresh events from Cards/Accounts pages
  useDataRefresh(useCallback(() => {
    loadData();
  }, []));

  const loadData = () => {
    setTransactions(getTransactions(month, year));
    setCategories(getCategories());
    setAccounts(getAccounts());
    setCards(getCards());
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      !searchTerm || (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || !filterType || t.type === filterType;
    const matchesCategory = filterCategory === "all" || !filterCategory || t.categoryId === parseInt(filterCategory);
    const matchesCard = filterCard === "all" || !filterCard || t.cardId === parseInt(filterCard);
    const matchesAccount = filterAccount === "all" || !filterAccount || t.accountId === parseInt(filterAccount);
    return matchesSearch && matchesType && matchesCategory && matchesCard && matchesAccount;
  });

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const creditCardExpenses = filteredTransactions
    .filter((t) => t.type === "expense" && t.paymentMethod === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const handleFormSubmit = (data: any) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      toast.success("Transação atualizada com sucesso!");
    } else {
      addTransaction(data);
      toast.success("Transação criada com sucesso!");
    }
    loadData();
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deleteTransaction(id);
      toast.success("Transação deletada com sucesso!");
      loadData();
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(filteredTransactions, categories);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
              <p className="text-muted-foreground mt-1">
                {format(new Date(year, month - 1), "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingTransaction(null);
                setIsFormOpen(true);
              }}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </Button>
          </div>

          <div className="flex gap-4">
            <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="bg-card rounded-xl border border-border/40 shadow-lg p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="text-accent border-accent hover:bg-accent/10"
            >
              Exportar CSV
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Buscar por descrição</label>
              <input
                type="text"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border/40 rounded-md text-foreground placeholder-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Categoria</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Cartão</label>
              <Select value={filterCard} onValueChange={setFilterCard}>
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Conta</label>
              <Select value={filterAccount} onValueChange={setFilterAccount}>
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Receita"
            value={income}
            icon={<TrendingUp className="w-6 h-6" />}
            color="text-green-400"
          />
          <KPICard
            title="Despesa"
            value={expenses}
            icon={<TrendingDown className="w-6 h-6" />}
            color="text-red-400"
          />
          <KPICard
            title="Saldo"
            value={balance}
            icon={<Wallet className="w-6 h-6" />}
            color={balance >= 0 ? "text-blue-400" : "text-red-400"}
          />
          <KPICard
            title="Cartão de Crédito"
            value={creditCardExpenses}
            icon={<CreditCard className="w-6 h-6" />}
            color="text-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Despesas por Categoria</h3>
            <ExpensesByCategoryChart transactions={filteredTransactions} categories={categories} />
          </div>
          <div className="bg-card rounded-xl border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição de Receitas</h3>
            <IncomeDistributionChart transactions={filteredTransactions} categories={categories} />
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-card rounded-xl border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Gastos em Cartão de Crédito</h3>
            <CreditCardSpendingChart transactions={filteredTransactions} categories={categories} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CardSpendingWidget cards={cards} transactions={filteredTransactions} />
          <AccountBalanceWidget accounts={accounts} />
        </div>

        <div className="bg-card rounded-xl border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/60 overflow-hidden">
          <TransactionTable
            transactions={filteredTransactions}
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={false}
          />
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleFormSubmit}
            initialData={editingTransaction || undefined}
            categories={categories}
            accounts={accounts}
            cards={cards}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
