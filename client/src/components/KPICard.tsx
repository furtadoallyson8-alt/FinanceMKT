import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

export default function KPICard({ title, value, icon, color }: KPICardProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);

  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/60 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`${color} opacity-80`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-foreground">{formattedValue}</div>
      <div className="text-xs text-muted-foreground">
        {value >= 0 ? "+" : ""}{(value / 100).toFixed(2)}
      </div>
    </div>
  );
}
