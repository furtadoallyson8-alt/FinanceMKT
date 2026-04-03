import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FinanceChartsProps {
  transactions: any[];
  categories: any[];
}

export function ExpensesByCategoryChart({ transactions, categories }: FinanceChartsProps) {
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: Record<number, number>, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === parseInt(categoryId));
    return {
      name: category?.name || "Sem categoria",
      value: amount / 100,
      color: category?.color || "#6366f1",
    };
  });

  const COLORS = data.map((d) => d.color);

  if (data.length === 0) {
    return <div className="p-6 text-center text-muted-foreground">Sem despesas neste período</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
        <YAxis stroke="rgba(255,255,255,0.5)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
        />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IncomeDistributionChart({ transactions, categories }: FinanceChartsProps) {
  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
    .reduce((acc: Record<number, number>, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.entries(incomeByCategory).map(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === parseInt(categoryId));
    return {
      name: category?.name || "Sem categoria",
      value: amount / 100,
      color: category?.color || "#10b981",
    };
  });

  const COLORS = data.map((d) => d.color);

  if (data.length === 0) {
    return <div className="p-6 text-center text-muted-foreground">Sem receitas neste período</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CreditCardSpendingChart({ transactions }: FinanceChartsProps) {
  const creditCardTransactions = transactions.filter(
    (t) => t.type === "expense" && t.paymentMethod === "credit"
  );

  const data = [
    {
      name: "Cartão de Crédito",
      value: creditCardTransactions.reduce((sum, t) => sum + t.amount, 0) / 100,
    },
    {
      name: "Outros",
      value:
        transactions
          .filter((t) => t.type === "expense" && t.paymentMethod !== "credit")
          .reduce((sum, t) => sum + t.amount, 0) / 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          <Cell fill="#f97316" />
          <Cell fill="#6366f1" />
        </Pie>
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
