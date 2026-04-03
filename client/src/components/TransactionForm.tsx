import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface TransactionFormProps {
  onSubmit: (data: any) => void;
  categories: any[];
  accounts: any[];
  cards: any[];
  initialData?: any;
  isLoading?: boolean;
}

export default function TransactionForm({
  onSubmit,
  categories,
  accounts,
  cards,
  initialData,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date ? format(new Date(initialData.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    type: initialData?.type || "expense",
    categoryId: initialData?.categoryId || "",
    description: initialData?.description || "",
    amount: initialData?.amount ? (initialData.amount / 100).toString() : "",
    paymentMethod: initialData?.paymentMethod || "debit",
    accountId: initialData?.accountId || "",
    cardId: initialData?.cardId || "",
    month: initialData?.month || new Date().getMonth() + 1,
    year: initialData?.year || new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Data é obrigatória";
    if (!formData.categoryId) newErrors.categoryId = "Categoria é obrigatória";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valor deve ser maior que 0";
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = "Método de pagamento é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const date = new Date(formData.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    onSubmit({
      date: new Date(formData.date),
      type: formData.type,
      categoryId: parseInt(formData.categoryId),
      description: formData.description || undefined,
      amount: Math.round(parseFloat(formData.amount) * 100),
      paymentMethod: formData.paymentMethod,
      accountId: formData.accountId ? parseInt(formData.accountId) : undefined,
      cardId: formData.cardId ? parseInt(formData.cardId) : undefined,
      month,
      year,
    });
  };

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, categoryId: "" })}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receita</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.categoryId.toString()} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
          <SelectTrigger id="category" className={errors.categoryId ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descrição da transação (opcional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={errors.amount ? "border-red-500" : ""}
          />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Método de Pagamento</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
            <SelectTrigger id="paymentMethod" className={errors.paymentMethod ? "border-red-500" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Dinheiro</SelectItem>
              <SelectItem value="debit">Débito</SelectItem>
              <SelectItem value="credit">Crédito</SelectItem>
              <SelectItem value="transfer">Transferência</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod}</p>}
        </div>
      </div>

      {accounts.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="account">Conta/Banco</Label>
          <Select value={formData.accountId.toString()} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
            <SelectTrigger id="account">
              <SelectValue placeholder="Selecione uma conta (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id.toString()}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {cards.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="card">Cartão</Label>
          <Select value={formData.cardId.toString()} onValueChange={(value) => setFormData({ ...formData, cardId: value })}>
            <SelectTrigger id="card">
              <SelectValue placeholder="Selecione um cartão (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id.toString()}>
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t border-border/40">
        <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? "Salvando..." : "Salvar Transação"}
        </Button>
      </div>
    </form>
  );
}
