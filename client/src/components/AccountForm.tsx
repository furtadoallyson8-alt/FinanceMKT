import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Account } from "@/lib/storageUtils";

interface AccountFormProps {
  onSubmit: (data: Omit<Account, "id" | "createdAt">) => void;
  initialData?: Account;
  isLoading?: boolean;
}

export default function AccountForm({ onSubmit, initialData, isLoading }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    bankName: initialData?.bankName || "",
    type: initialData?.type || "checking",
    initialBalance: initialData?.initialBalance || 0,
    balance: initialData?.balance || 0,
    active: initialData?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.bankName) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nome da Conta *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Conta Corrente"
            className="bg-background/50 border-border/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName" className="text-sm font-medium">
            Nome do Banco *
          </Label>
          <Input
            id="bankName"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            placeholder="Ex: Banco do Brasil"
            className="bg-background/50 border-border/40"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium">
          Tipo de Conta
        </Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
          <SelectTrigger className="bg-background/50 border-border/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Conta Corrente</SelectItem>
            <SelectItem value="savings">Poupança</SelectItem>
            <SelectItem value="investment">Investimento</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialBalance" className="text-sm font-medium">
            Saldo Inicial (em centavos)
          </Label>
          <Input
            id="initialBalance"
            type="number"
            value={formData.initialBalance}
            onChange={(e) => setFormData({ ...formData, initialBalance: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="bg-background/50 border-border/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="balance" className="text-sm font-medium">
            Saldo Atual (em centavos)
          </Label>
          <Input
            id="balance"
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="bg-background/50 border-border/40"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
        />
        <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
          Conta Ativa
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isLoading ? "Salvando..." : initialData ? "Atualizar Conta" : "Adicionar Conta"}
      </Button>
    </form>
  );
}
