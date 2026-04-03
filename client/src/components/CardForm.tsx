import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/lib/storageUtils";

interface CardFormProps {
  onSubmit: (data: Omit<Card, "id" | "createdAt">) => void;
  initialData?: Card;
  isLoading?: boolean;
}

const CARD_COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#0ea5e9",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#000000",
];

export default function CardForm({ onSubmit, initialData, isLoading }: CardFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    bank: initialData?.bank || "",
    lastFourDigits: initialData?.lastFourDigits || "",
    creditLimit: initialData?.creditLimit || 0,
    closingDay: initialData?.closingDay || 15,
    dueDate: initialData?.dueDate || 22,
    color: initialData?.color || "#8b5cf6",
    active: initialData?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.bank || !formData.lastFourDigits) {
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
            Nome do Cartão *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Cartão Principal"
            className="bg-background/50 border-border/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank" className="text-sm font-medium">
            Banco *
          </Label>
          <Input
            id="bank"
            value={formData.bank}
            onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
            placeholder="Ex: Nubank"
            className="bg-background/50 border-border/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastFourDigits" className="text-sm font-medium">
            Últimos 4 dígitos *
          </Label>
          <Input
            id="lastFourDigits"
            value={formData.lastFourDigits}
            onChange={(e) =>
              setFormData({
                ...formData,
                lastFourDigits: e.target.value.slice(0, 4),
              })
            }
            placeholder="1234"
            maxLength={4}
            className="bg-background/50 border-border/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditLimit" className="text-sm font-medium">
            Limite de Crédito (em centavos)
          </Label>
          <Input
            id="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
            placeholder="500000"
            className="bg-background/50 border-border/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="closingDay" className="text-sm font-medium">
            Dia de Fechamento
          </Label>
          <Input
            id="closingDay"
            type="number"
            min="1"
            max="31"
            value={formData.closingDay}
            onChange={(e) => setFormData({ ...formData, closingDay: parseInt(e.target.value) || 1 })}
            className="bg-background/50 border-border/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm font-medium">
            Dia de Vencimento
          </Label>
          <Input
            id="dueDate"
            type="number"
            min="1"
            max="31"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: parseInt(e.target.value) || 1 })}
            className="bg-background/50 border-border/40"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Cor do Cartão</Label>
        <div className="grid grid-cols-5 gap-2">
          {CARD_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-full h-10 rounded-md border-2 transition-all ${
                formData.color === color ? "border-white" : "border-border/40"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
        />
        <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
          Cartão Ativo
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isLoading ? "Salvando..." : initialData ? "Atualizar Cartão" : "Adicionar Cartão"}
      </Button>
    </form>
  );
}
