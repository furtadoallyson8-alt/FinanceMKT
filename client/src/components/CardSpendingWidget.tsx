import { useMemo } from "react";
import { Card } from "@/lib/storageUtils";
import { CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface CardSpendingWidgetProps {
  cards: Card[];
  transactions: any[];
}

export default function CardSpendingWidget({ cards, transactions }: CardSpendingWidgetProps) {
  const [, setLocation] = useLocation();

  const cardSpending = useMemo(() => {
    return cards.map((card) => {
      const spending = transactions
        .filter((t) => t.cardId === card.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...card,
        spending,
        availableCredit: card.creditLimit - spending,
        spendingPercentage: (spending / card.creditLimit) * 100,
      };
    });
  }, [cards, transactions]);

  if (cardSpending.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-lg p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Gastos por Cartão</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/cards")}
          className="gap-2"
        >
          Gerenciar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {cardSpending.map((card) => (
          <div key={card.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
                <span className="text-sm font-medium text-foreground">{card.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(card.spending)}
              </span>
            </div>
            <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  card.spendingPercentage > 80
                    ? "bg-red-500"
                    : card.spendingPercentage > 50
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(card.spendingPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{card.spendingPercentage.toFixed(1)}% utilizado</span>
              <span>{formatCurrency(card.availableCredit)} disponível</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
