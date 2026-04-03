import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionTableProps {
  transactions: any[];
  categories: any[];
  onEdit: (transaction: any) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function TransactionTable({
  transactions,
  categories,
  onEdit,
  onDelete,
  isLoading,
}: TransactionTableProps) {
  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Sem categoria";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Carregando...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground mb-2">Nenhuma transação encontrada</p>
        <p className="text-xs text-muted-foreground">Crie uma nova transação para começar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 hover:bg-transparent">
            <TableHead className="text-muted-foreground">Data</TableHead>
            <TableHead className="text-muted-foreground">Categoria</TableHead>
            <TableHead className="text-muted-foreground">Descrição</TableHead>
            <TableHead className="text-muted-foreground">Tipo</TableHead>
            <TableHead className="text-right text-muted-foreground">Valor</TableHead>
            <TableHead className="text-muted-foreground">Método</TableHead>
            <TableHead className="text-right text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="border-border/40 hover:bg-card/50 transition-colors">
              <TableCell className="text-foreground">
                {format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-foreground">
                {getCategoryName(transaction.categoryId)}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-xs truncate">
                {transaction.description || "-"}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.type === "income"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {transaction.type === "income" ? "Receita" : "Despesa"}
                </span>
              </TableCell>
              <TableCell className={`text-right font-semibold ${
                transaction.type === "income" ? "text-green-400" : "text-red-400"
              }`}>
                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {transaction.paymentMethod === "cash" && "Dinheiro"}
                {transaction.paymentMethod === "debit" && "Débito"}
                {transaction.paymentMethod === "credit" && "Crédito"}
                {transaction.paymentMethod === "transfer" && "Transferência"}
                {transaction.paymentMethod === "other" && "Outro"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8 p-0 hover:bg-accent/20"
                  >
                    <Edit2 className="w-4 h-4 text-accent" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
