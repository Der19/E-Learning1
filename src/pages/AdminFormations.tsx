import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { formations } from "@/lib/adminData";
import { themes, sousThemes } from "@/lib/adminData";

export default function AdminFormations() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<string>("all");
  const [sousTheme, setSousTheme] = useState<string>("all");
  const [priorite, setPriorite] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const sousThemesOptions = useMemo(() => sousThemes.filter(st => theme === "all" || st.themeCode === theme), [theme]);

  const filtered = useMemo(() => {
    return formations.filter(f => {
      if (search && !f.titre.toLowerCase().includes(search.toLowerCase())) return false;
      if (theme !== "all" && f.themeCode !== theme) return false;
      if (sousTheme !== "all" && f.sousThemeCode !== sousTheme) return false;
      if (priorite !== "all" && String(f.priorite) !== priorite) return false;
      if (type !== "all" && f.type !== type) return false;
      return true;
    });
  }, [search, theme, sousTheme, priorite, type]);

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Formations proposées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Input placeholder="Rechercher par titre" value={search} onChange={(e)=>setSearch(e.target.value)} />
              <Select value={theme} onValueChange={(v)=>{ setTheme(v); setSousTheme("all"); }}>
                <SelectTrigger><SelectValue placeholder="Filtrer par Thème" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {themes.map(t => (
                    <SelectItem key={t.code} value={t.code}>{t.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sousTheme} onValueChange={setSousTheme}>
                <SelectTrigger><SelectValue placeholder="Filtrer par Sous thème" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {sousThemesOptions.map(st => (
                    <SelectItem key={st.code} value={st.code}>{st.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorite} onValueChange={setPriorite}>
                <SelectTrigger><SelectValue placeholder="Priorité" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="1">Débutant</SelectItem>
                  <SelectItem value="2">Intermédiaire</SelectItem>
                  <SelectItem value="3">Avancé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="gratuite">Gratuite</SelectItem>
                  <SelectItem value="payante">Payante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des formations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Thème</TableHead>
                  <TableHead>Sous thème</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.titre}</TableCell>
                    <TableCell>{themes.find(t => t.code === f.themeCode)?.libelle ?? f.themeCode}</TableCell>
                    <TableCell>{sousThemes.find(st => st.code === f.sousThemeCode)?.libelle ?? f.sousThemeCode ?? "-"}</TableCell>
                    <TableCell>{f.priorite === 1 ? "Débutant" : f.priorite === 2 ? "Intermédiaire" : "Avancé"}</TableCell>
                    <TableCell className="capitalize">{f.type}</TableCell>
                    <TableCell>
                      {f.type === 'payante' ? (
                        <Button className="bg-gradient-primary">Acheter la formation</Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">Gratuite</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Total: {filtered.length}</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


