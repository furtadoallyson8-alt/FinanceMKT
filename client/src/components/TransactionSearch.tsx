import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface TransactionSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
  categories: any[];
}

export default function TransactionSearch({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  categories,
}: TransactionSearchProps) {
  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-lg p-6 mb-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Buscar por descrição</label>
          <Input
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background/50 border-border/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Tipo</label>
          <Select value={filterType} onValueChange={onFilterTypeChange}>
            <SelectTrigger className="bg-background/50 border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="income">Receita</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Categoria</label>
          <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
            <SelectTrigger className="bg-background/50 border-border/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
