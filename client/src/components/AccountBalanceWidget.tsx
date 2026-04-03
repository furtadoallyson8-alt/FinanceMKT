import { useMemo } from "react";
import { Account } from "@/lib/storageUtils";
import { Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface AccountBalanceWidgetProps {
  accounts: Account[];
}

export default function AccountBalanceWidget({ accounts }: AccountBalanceWidgetProps) {
  const [, setLocation] = useLocation();

  const activeAccounts = useMemo(() => {
    return accounts.filter((acc) => acc.active);
  }, [accounts]);

  const totalBalance = useMemo(() => {
    return activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [activeAccounts]);

  if (activeAccounts.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: "Corrente",
      savings: "Poupança",
      investment: "Investimento",
      other: "Outro",
    };
    return types[type] || type;
  };

  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-lg p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Landmark className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Saldos por Conta</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/accounts")}
          className="gap-2"
        >
          Gerenciar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {activeAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-background/50 rounded-lg p-4 border border-border/40"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.bankName}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  account.balance >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {formatCurrency(account.balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getAccountTypeLabel(account.type)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-border/40 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
            <p className={`text-lg font-bold ${
              totalBalance >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
