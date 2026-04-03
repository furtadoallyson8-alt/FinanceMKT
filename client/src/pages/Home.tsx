import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to dashboard on mount
    setLocation("/dashboard");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Financeiro Premium</h1>
          <p className="text-muted-foreground text-lg">Controle suas finanças com estilo e precisão</p>
        </div>
        <Button
          onClick={() => setLocation("/dashboard")}
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
        >
          Acessar Dashboard
        </Button>
      </div>
    </div>
  );
}
