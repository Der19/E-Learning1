import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Learner = { code: string; name: string; password: string; credits: number };

export default function ClientLearners() {
  const [learners, setLearners] = useState<Learner[]>([
    { code: "APPR001", name: "Fatou Ndiaye", password: "fatou123", credits: 120 },
    { code: "APPR002", name: "Mamadou Diop", password: "mamadou123", credits: 60 },
    { code: "APPR003", name: "Aminata Sarr", password: "aminata123", credits: 0 },
  ]);
  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState<Learner>({ code: "", name: "", password: "", credits: 0 });
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<Learner | null>(null);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [editDraft, setEditDraft] = useState<Learner>({ code: "", name: "", password: "", credits: 0 });

  const displayed = useMemo(() => learners.filter(l => !filter || l.code.toLowerCase().includes(filter.toLowerCase()) || l.name.toLowerCase().includes(filter.toLowerCase())), [learners, filter]);

  const add = () => {
    if (!draft.code.trim() || !draft.name.trim()) return;
    if (learners.some(l => l.code.toLowerCase() === draft.code.trim().toLowerCase())) return;
    // Générer un mot de passe par défaut basé sur le code
    const defaultPassword = draft.code.trim().toLowerCase() + "123";
    setLearners(prev => [...prev, { ...draft, code: draft.code.trim(), password: defaultPassword }]);
    setDraft({ code: "", name: "", password: "", credits: 0 });
    toast({ title: "Apprenant créé" });
  };
  const remove = (code: string) => {
    if (!window.confirm("Confirmer la suppression de l'apprenant ?")) return;
    setLearners(prev => prev.filter(l => l.code !== code));
  };
  const addCredits = (code: string, amount: number) => {
    if (amount <= 0) return;
    setLearners(prev => prev.map(l => l.code === code ? { ...l, credits: l.credits + amount } : l));
    toast({ title: `Crédits affectés (+${amount})` });
  };

  const openOffer = (l: Learner) => {
    setSelected(l);
    setOfferAmount(0);
    setIsOfferOpen(true);
  };
  const confirmOffer = () => {
    if (!selected) return;
    addCredits(selected.code, offerAmount);
    setIsOfferOpen(false);
  };

  const openEdit = (l: Learner) => {
    setSelected(l);
    setEditDraft({ ...l });
    setIsEditOpen(true);
  };
  const confirmEdit = () => {
    if (!selected) return;
    const newCode = editDraft.code.trim();
    if (!newCode || !editDraft.name.trim() || !editDraft.password.trim()) return;
    if (newCode.toLowerCase() !== selected.code.toLowerCase() && learners.some(x => x.code.toLowerCase() === newCode.toLowerCase())) {
      toast({ title: "Code déjà utilisé" });
      return;
    }
    setLearners(prev => prev.map(l => l.code === selected.code ? { ...l, code: newCode, name: editDraft.name, password: editDraft.password } : l));
    setIsEditOpen(false);
    toast({ title: "Apprenant modifié" });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des apprenants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Input placeholder="Filtrer (code/nom)" value={filter} onChange={(e)=>setFilter(e.target.value)} className="max-w-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Code" value={draft.code} onChange={(e)=>setDraft(prev=>({ ...prev, code: e.target.value }))} />
              <Input placeholder="Nom" value={draft.name} onChange={(e)=>setDraft(prev=>({ ...prev, name: e.target.value }))} />
              <div className="flex justify-end">
                <Button className="bg-gradient-primary" onClick={add}>Créer</Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Crédits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map(l => (
                  <TableRow key={l.code}>
                    <TableCell>{l.code}</TableCell>
                    <TableCell>{l.name}</TableCell>
                    <TableCell>{l.credits}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={()=>openOffer(l)}>Offrir crédits</Button>
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(l)}>Modifier</Button>
                      <Button size="sm" variant="destructive" onClick={()=>remove(l.code)}>Supprimer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Dialog Offrir crédits */}
            <Dialog open={isOfferOpen} onOpenChange={setIsOfferOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Offrir des crédits {selected ? `(${selected.name})` : ""}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant de crédits</label>
                  <Input type="number" value={offerAmount} onChange={(e)=>setOfferAmount(Number(e.target.value)||0)} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={()=>setIsOfferOpen(false)}>Annuler</Button>
                  <Button className="bg-gradient-primary" onClick={confirmOffer} disabled={offerAmount<=0}>Confirmer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dialog Modifier apprenant */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modifier l'apprenant</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Code</label>
                    <Input value={editDraft.code} onChange={(e)=>setEditDraft(prev=>({ ...prev, code: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nom</label>
                    <Input value={editDraft.name} onChange={(e)=>setEditDraft(prev=>({ ...prev, name: e.target.value }))} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={()=>setIsEditOpen(false)}>Annuler</Button>
                  <Button className="bg-gradient-primary" onClick={confirmEdit}>Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}




