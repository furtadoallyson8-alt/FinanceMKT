import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import CardForm from "@/components/CardForm";
import { getCards, addCard, updateCard, deleteCard, Card } from "@/lib/storageUtils";
import { toast } from "sonner";
import { triggerDataRefresh } from "@/hooks/useDataRefresh";

export default function Cards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [deletingCard, setDeletingCard] = useState<Card | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = () => {
    setCards(getCards());
  };

  const handleAddCard = (data: Omit<Card, "id" | "createdAt">) => {
    addCard(data);
    toast.success("Cartão adicionado com sucesso!");
    loadCards();
    setIsFormOpen(false);
    triggerDataRefresh();
  };

  const handleUpdateCard = (data: Omit<Card, "id" | "createdAt">) => {
    if (editingCard) {
      updateCard(editingCard.id, data);
      toast.success("Cartão atualizado com sucesso!");
      loadCards();
      setIsFormOpen(false);
      setEditingCard(null);
      triggerDataRefresh();
    }
  };

  const handleDeleteCard = () => {
    if (deletingCard) {
      deleteCard(deletingCard.id);
      toast.success("Cartão deletado com sucesso!");
      loadCards();
      setDeletingCard(null);
      triggerDataRefresh();
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Cartões de Crédito</h1>
              <p className="text-muted-foreground mt-1">Gerencie seus cartões de crédito</p>
            </div>
            <Button
              onClick={() => {
                setEditingCard(null);
                setIsFormOpen(true);
              }}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Novo Cartão
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {cards.length === 0 ? (
          <div className="bg-card rounded-xl border border-border/40 shadow-lg p-12 text-center">
            <p className="text-muted-foreground text-lg mb-6">Nenhum cartão cadastrado</p>
            <Button
              onClick={() => {
                setEditingCard(null);
                setIsFormOpen(true);
              }}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Cartão
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-card rounded-xl border border-border/40 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="h-32 p-6 flex flex-col justify-between text-white"
                  style={{ backgroundColor: card.color }}
                >
                  <div>
                    <p className="text-sm opacity-80">{card.bank}</p>
                    <p className="text-xl font-bold">{card.name}</p>
                  </div>
                  <p className="text-lg font-mono">**** {card.lastFourDigits}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Limite</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(card.creditLimit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={`text-sm font-semibold ${card.active ? "text-green-400" : "text-red-400"}`}>
                        {card.active ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <p>Fechamento: {card.closingDay}</p>
                    </div>
                    <div>
                      <p>Vencimento: {card.dueDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border/40">
                    <Button
                      onClick={() => {
                        setEditingCard(card);
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
                      onClick={() => setDeletingCard(card)}
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
              {editingCard ? "Editar Cartão" : "Novo Cartão de Crédito"}
            </DialogTitle>
          </DialogHeader>
          <CardForm
            onSubmit={editingCard ? handleUpdateCard : handleAddCard}
            initialData={editingCard || undefined}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCard} onOpenChange={(open) => !open && setDeletingCard(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Deletar Cartão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o cartão "{deletingCard?.name}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
