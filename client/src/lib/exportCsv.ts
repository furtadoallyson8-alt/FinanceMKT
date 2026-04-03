export function exportTransactionsToCSV(transactions: any[], categories: any[]) {
  if (transactions.length === 0) {
    alert("Nenhuma transação para exportar");
    return;
  }

  const headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor", "Método de Pagamento"];
  const rows = transactions.map((t) => {
    const category = categories.find((c) => c.id === t.categoryId);
    const date = new Date(t.date).toLocaleDateString("pt-BR");
    const type = t.type === "income" ? "Receita" : "Despesa";
    const value = (t.amount / 100).toFixed(2);
    const paymentMethod =
      t.paymentMethod === "cash"
        ? "Dinheiro"
        : t.paymentMethod === "debit"
          ? "Débito"
          : t.paymentMethod === "credit"
            ? "Crédito"
            : t.paymentMethod === "transfer"
              ? "Transferência"
              : "Outro";

    return [date, type, category?.name || "Sem categoria", t.description || "", value, paymentMethod];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          if (typeof cell === "string" && cell.includes(",")) {
            return `"${cell}"`;
          }
          return cell;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `transacoes-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
