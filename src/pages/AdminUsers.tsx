import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { profils } from "@/lib/adminData";

type UserProfil = "ADMIN" | "ENSEIGN" | "APPREN" | "CLIENT";

type User = {
  code: string;
  email: string;
  nom: string;
  password: string;
  profil: UserProfil;
  etat?: "actif" | "inactif";
};

const getProfilLabel = (profil: UserProfil): string => {
  const p = profils.find(pr => pr.code === profil);
  return p?.libelle || profil;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    { code: "USR001", email: "admin@edu.local", nom: "Administrateur Principal", password: "admin123", profil: "ADMIN", etat: "actif" },
    { code: "USR002", email: "formateur@edu.local", nom: "Martin Dubois", password: "formateur123", profil: "ENSEIGN", etat: "actif" },
    { code: "USR003", email: "student@edu.local", nom: "Fatou Ndiaye", password: "student123", profil: "APPREN", etat: "actif" },
    { code: "USR004", email: "collectivitélocale@edu.local", nom: "École Supérieure", password: "collectivitélocale123", profil: "CLIENT", etat: "actif" },
  ]);

  const [filter, setFilter] = useState("");
  const [profilFilter, setProfilFilter] = useState<UserProfil | "all">("all");
  const [draft, setDraft] = useState<User>({
    code: "",
    email: "",
    nom: "",
    password: "",
    profil: "APPREN",
    etat: "actif",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [editDraft, setEditDraft] = useState<User>({
    code: "",
    email: "",
    nom: "",
    password: "",
    profil: "APPREN",
    etat: "actif",
  });

  const displayed = useMemo(() => {
    return users.filter(u => {
      const matchesFilter = !filter || 
        u.code.toLowerCase().includes(filter.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.toLowerCase()) ||
        u.nom.toLowerCase().includes(filter.toLowerCase());
      const matchesProfil = profilFilter === "all" || u.profil === profilFilter;
      return matchesFilter && matchesProfil;
    });
  }, [users, filter, profilFilter]);

  const add = () => {
    if (!draft.code.trim() || !draft.email.trim() || !draft.nom.trim() || !draft.password.trim()) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires" });
      return;
    }
    if (users.some(u => u.code.toLowerCase() === draft.code.trim().toLowerCase())) {
      toast({ title: "Erreur", description: "Ce code est déjà utilisé" });
      return;
    }
    if (users.some(u => u.email.toLowerCase() === draft.email.trim().toLowerCase())) {
      toast({ title: "Erreur", description: "Cet email est déjà utilisé" });
      return;
    }
    setUsers(prev => [...prev, { ...draft, code: draft.code.trim(), email: draft.email.trim().toLowerCase() }]);
    setDraft({
      code: "",
      email: "",
      nom: "",
      password: "",
      profil: "APPREN",
      etat: "actif",
    });
    toast({ title: "Utilisateur créé avec succès" });
  };

  const remove = (code: string) => {
    if (!window.confirm("Confirmer la suppression de l'utilisateur ?")) return;
    setUsers(prev => prev.filter(u => u.code !== code));
    toast({ title: "Utilisateur supprimé" });
  };

  const openEdit = (u: User) => {
    setSelected(u);
    setEditDraft({ ...u });
    setIsEditOpen(true);
  };

  const confirmEdit = () => {
    if (!selected) return;
    const newCode = editDraft.code.trim();
    const newEmail = editDraft.email.trim().toLowerCase();
    
    if (!newCode || !newEmail || !editDraft.nom.trim() || !editDraft.password.trim()) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires" });
      return;
    }
    
    if (newCode.toLowerCase() !== selected.code.toLowerCase() && 
        users.some(x => x.code.toLowerCase() === newCode.toLowerCase())) {
      toast({ title: "Erreur", description: "Ce code est déjà utilisé" });
      return;
    }
    
    if (newEmail !== selected.email.toLowerCase() && 
        users.some(x => x.email.toLowerCase() === newEmail)) {
      toast({ title: "Erreur", description: "Cet email est déjà utilisé" });
      return;
    }

    setUsers(prev => prev.map(u => 
      u.code === selected.code 
        ? { ...editDraft, code: newCode, email: newEmail }
        : u
    ));
    setIsEditOpen(false);
    toast({ title: "Utilisateur modifié avec succès" });
  };

  const getProfilBadgeVariant = (profil: UserProfil): "default" | "secondary" | "destructive" | "outline" => {
    switch (profil) {
      case "ADMIN":
        return "destructive";
      case "ENSEIGN":
        return "default";
      case "APPREN":
        return "secondary";
      case "CLIENT":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Administration des utilisateurs</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs et de leurs profils</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Liste des utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Input 
                placeholder="Filtrer (code/email/nom)" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="max-w-sm" 
              />
              <Select value={profilFilter} onValueChange={(v) => setProfilFilter(v as UserProfil | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrer par profil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les profils</SelectItem>
                  {profils.map(p => (
                    <SelectItem key={p.code} value={p.code}>{p.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="ml-auto text-sm text-muted-foreground">
                {displayed.length} utilisateur{displayed.length > 1 ? "s" : ""}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold mb-3">Créer un nouvel utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <Input 
                  placeholder="Code*" 
                  value={draft.code} 
                  onChange={(e) => setDraft(prev => ({ ...prev, code: e.target.value }))} 
                />
                <Input 
                  type="email"
                  placeholder="Email*" 
                  value={draft.email} 
                  onChange={(e) => setDraft(prev => ({ ...prev, email: e.target.value }))} 
                />
                <Input 
                  placeholder="Nom complet*" 
                  value={draft.nom} 
                  onChange={(e) => setDraft(prev => ({ ...prev, nom: e.target.value }))} 
                />
                <Input 
                  type="password"
                  placeholder="Mot de passe*" 
                  value={draft.password} 
                  onChange={(e) => setDraft(prev => ({ ...prev, password: e.target.value }))} 
                />
                <Select 
                  value={draft.profil} 
                  onValueChange={(v) => setDraft(prev => ({ ...prev, profil: v as UserProfil }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Profil" />
                  </SelectTrigger>
                  <SelectContent>
                    {profils.map(p => (
                      <SelectItem key={p.code} value={p.code}>{p.libelle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-primary" onClick={add}>Créer</Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Profil</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  displayed.map(u => (
                    <TableRow key={u.code}>
                      <TableCell className="font-medium">{u.code}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.nom}</TableCell>
                      <TableCell>
                        <Badge variant={getProfilBadgeVariant(u.profil)}>
                          {getProfilLabel(u.profil)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.etat === "actif" ? "default" : "secondary"}>
                          {u.etat === "actif" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                          Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(u.code)}>
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Dialog Modifier utilisateur */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Modifier l'utilisateur</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Code*</label>
                    <Input 
                      value={editDraft.code} 
                      onChange={(e) => setEditDraft(prev => ({ ...prev, code: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email*</label>
                    <Input 
                      type="email"
                      value={editDraft.email} 
                      onChange={(e) => setEditDraft(prev => ({ ...prev, email: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nom complet*</label>
                    <Input 
                      value={editDraft.nom} 
                      onChange={(e) => setEditDraft(prev => ({ ...prev, nom: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Mot de passe*</label>
                    <Input 
                      type="password"
                      value={editDraft.password} 
                      onChange={(e) => setEditDraft(prev => ({ ...prev, password: e.target.value }))} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Profil*</label>
                    <Select 
                      value={editDraft.profil} 
                      onValueChange={(v) => setEditDraft(prev => ({ ...prev, profil: v as UserProfil }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un profil" />
                      </SelectTrigger>
                      <SelectContent>
                        {profils.map(p => (
                          <SelectItem key={p.code} value={p.code}>{p.libelle}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">État</label>
                    <Select 
                      value={editDraft.etat || "actif"} 
                      onValueChange={(v) => setEditDraft(prev => ({ ...prev, etat: v as "actif" | "inactif" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un état" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="inactif">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-gradient-primary" onClick={confirmEdit}>
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

