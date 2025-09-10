import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function ClientCredits() {
  const CREDIT_TO_FRANCS = 10; // 1 crédit = 10 F CFA (ex: 100 crédits => 1000 F)

  const [credits, setCredits] = useState<number>(0);
  const [francs, setFrancs] = useState<number>(0);
  const [method, setMethod] = useState<string>("cb");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [eme, setEme] = useState({ provider: "om", phone: "" });

  const setFromCredits = (c: number) => {
    const cSanitized = Math.max(0, Math.floor(c));
    setCredits(cSanitized);
    setFrancs(cSanitized * CREDIT_TO_FRANCS);
  };

  const setFromFrancs = (f: number) => {
    const fSanitized = Math.max(0, Math.floor(f));
    setFrancs(fSanitized);
    setCredits(Math.round(fSanitized / CREDIT_TO_FRANCS));
  };

  const pay = () => {
    const toPay = francs;
    if (credits <= 0 || toPay <= 0) return;
    toast({
      title: "Crédits achetés",
      description: `${credits} crédits (${toPay.toLocaleString()} F CFA) via ${method === "cb" ? "Carte bancaire" : eme.provider.toUpperCase()}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des crédits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={method} onValueChange={(v)=>{ setMethod(v); if (v !== "cb") setEme({ ...eme, provider: v as "om"|"wave" }); }}>
                <SelectTrigger><SelectValue placeholder="Moyen de paiement" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cb">Carte bancaire</SelectItem>
                  <SelectItem value="om">OM</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sélecteurs rapides de crédits */}
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 500].map(v => (
                <Button key={v} variant="outline" size="sm" onClick={()=>setFromCredits(v)}>{v} crédits</Button>
              ))}
            </div>

            {/* Saisie bidirectionnelle crédits ↔ francs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Crédits</label>
                <Input
                  type="number"
                  placeholder="Crédits"
                  value={credits}
                  onChange={(e)=>setFromCredits(Number(e.target.value)||0)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Prix (F CFA)</label>
                <Input
                  type="number"
                  placeholder="Montant (F CFA)"
                  value={francs}
                  onChange={(e)=>setFromFrancs(Number(e.target.value)||0)}
                />
              </div>
            </div>

            {method === "cb" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input placeholder="Numéro de carte" value={card.number} onChange={(e)=>setCard({ ...card, number: e.target.value })} />
                <Input placeholder="Nom sur la carte" value={card.name} onChange={(e)=>setCard({ ...card, name: e.target.value })} />
                <Input placeholder="MM/AA" value={card.exp} onChange={(e)=>setCard({ ...card, exp: e.target.value })} />
                <Input placeholder="CVC" value={card.cvc} onChange={(e)=>setCard({ ...card, cvc: e.target.value })} />
              </div>
            )}

            {method !== "cb" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select value={eme.provider} onValueChange={(v)=>setEme({ ...eme, provider: v })}>
                  <SelectTrigger><SelectValue placeholder="Émetteur" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="om">OM</SelectItem>
                    <SelectItem value="wave">Wave</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Téléphone" value={eme.phone} onChange={(e)=>setEme({ ...eme, phone: e.target.value })} />
              </div>
            )}

            <div className="flex justify-end">
              <Button className="bg-gradient-primary" onClick={pay} disabled={credits<=0 || francs<=0}>
                Payer {francs.toLocaleString()} F CFA
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}




