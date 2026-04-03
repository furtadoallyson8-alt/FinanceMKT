import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Landmark } from "lucide-react";
import AccountForm from "@/components/AccountForm";
import { getAccounts, addAccount, updateAccount, deleteAccount, Account } from "@/lib/storageUtils";
import { toast } from "sonner";
import { triggerDataRefresh } from "@/hooks/useDataRefresh";

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    setAccounts(getAccounts());
  };

  const handleAddAccount = (data: Omit<Account, "id" | "createdAt">) => {
    addAccount(data);
    toast.success("Conta adicionada com sucesso!");
    loadAccounts();
    setIsFormOpen(false);
    triggerDataRefresh();
  };

  const handleUpdateAccount = (data: Omit<Account, "id" | "createdAt">) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, data);
      toast.success("Conta atualizada com sucesso!");
      loadAccounts();
      setIsFormOpen(false);
      setEditingAccount(null);
      triggerDataRefresh();
    }
  };

  const handleDeleteAccount = () => {
    if (deletingAccount) {
      deleteAccount(deletingAccount.id);
      toast.success("Conta deletada com sucesso!");
      loadAccounts();
      setDeletingAccount(null);
      triggerDataRefresh();
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: "Conta Corrente",
      savings: "Poupança",
      investment: "Investimento",
      other: "Outro",
    };
    return types[type] || type;
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contas Bancárias</h1>
              <p className="text-muted-foreground mt-1">Gerencie suas contas e bancos</p>
            </div>
            <Button
              onClick={() => {
                setEditingAccount(null);
                setIsFormOpen(true);
              }}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Nova Conta
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {accounts.length > 0 && (
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-border/40 shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Saldo Total</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBalance)}</p>
              </div>
              <Landmark className="w-12 h-12 text-accent opacity-50" />
            </div>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="bg-card rounded-xl border border-border/40 shadow-lg p-12 text-center">
            <p className="text-muted-foreground text-lg mb-6">Nenhuma conta cadastrada</p>
            <Button
              onClick={() => {
                setEditingAccount(null);
                setIsFormOpen(true);
              }}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeira Conta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-card rounded-xl border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{account.bankName}</p>
                      <p className="text-xl font-bold text-foreground">{account.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      account.active
                        ? "bg-green-400/20 text-green-400"
                        : "bg-red-400/20 text-red-400"
                    }`}>
                      {account.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="text-sm font-semibold text-foreground">
                        {getAccountTypeLabel(account.type)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Saldo Inicial</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(account.initialBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Saldo Atual</p>
                        <p className={`text-sm font-semibold ${
                          account.balance >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border/40">
                    <Button
                      onClick={() => {
                        setEditingAccount(account);
                        setIsFormOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => setDeletingAccount(account)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-red-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? "Editar Conta" : "Nova Conta Bancária"}
            </DialogTitle>
          </DialogHeader>
          <AccountForm
            onSubmit={editingAccount ? handleUpdateAccount : handleAddAccount}
            initialData={editingAccount || undefined}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingAccount} onOpenChange={(open) => !open && setDeletingAccount(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Deletar Conta</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a conta "{deletingAccount?.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
