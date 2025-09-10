import { Navbar } from "@/components/navigation/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, School, BookOpen, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fonctions,
  profils,
  statutsContenu,
  themes,
  sousThemes,
  sections,
  ecoles,
  typesRessourcePedagogique,
  typesQuiz,
  modesPaiement,
  uvs,
  cours,
  modulesCours,
  lecons,
  bibliotheques,
  ressources,
  liensContenuBibliotheques,
  liensContenuSections,
} from "@/lib/adminData";
// removed inline param editor for simple display only

type RefKey =
  | "fonctions"
  | "statutsContenu"
  | "profils"
  | "themes"
  | "typesQuiz"
  | "modesPaiement"
  | "typesRessourcePedagogique"
  | "ecoles"
  | "uvs";

export default function AdminDashboard() {
  const [selectedRef, setSelectedRef] = useState<RefKey | null>(null);
  const [selectedThemeCode, setSelectedThemeCode] = useState<string | null>(null);
  const [selectedSousThemeCode, setSelectedSousThemeCode] = useState<string | null>(null);
  const [selectedUvCode, setSelectedUvCode] = useState<string | null>(null);
  // Inline editable lists (front-only state)
  const [themeItems, setThemeItems] = useState(() => [...themes]);
  const [sousThemeItems, setSousThemeItems] = useState(() => [...sousThemes]);
  const [sectionItems, setSectionItems] = useState(() => [...sections]);

  // Thèmes editing state
  const [addingTheme, setAddingTheme] = useState(false);
  const [newTheme, setNewTheme] = useState({ code: "", libelle: "", ordre: themeItems.length + 1 });
  const [editingThemeCode, setEditingThemeCode] = useState<string | null>(null);
  const [editThemeDraft, setEditThemeDraft] = useState<{ code: string; libelle: string; ordre: number } | null>(null);

  // Sous thèmes editing state
  const [addingSousTheme, setAddingSousTheme] = useState(false);
  const [newSousTheme, setNewSousTheme] = useState({ code: "", libelle: "", ordre: 1 });
  const [editingSousThemeCode, setEditingSousThemeCode] = useState<string | null>(null);
  const [editSousThemeDraft, setEditSousThemeDraft] = useState<{ code: string; libelle: string; ordre: number } | null>(null);

  // Sections editing state
  const [addingSection, setAddingSection] = useState(false);
  const [newSection, setNewSection] = useState({ code: "", libelle: "", ordre: 1 });
  const [editingSectionCode, setEditingSectionCode] = useState<string | null>(null);
  const [editSectionDraft, setEditSectionDraft] = useState<{ code: string; libelle: string; ordre: number } | null>(null);
  
  const [themeFilter, setThemeFilter] = useState("");
  const [sousThemeFilter, setSousThemeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const resetDrilldown = () => {
    setSelectedThemeCode(null);
    setSelectedSousThemeCode(null);
    setSelectedUvCode(null);
    
  };

  const selectRef = (key: RefKey) => {
    setSelectedRef(key);
    resetDrilldown();
  };

  // Theme handlers
  const addTheme = () => {
    if (!newTheme.code.trim() || !newTheme.libelle.trim()) return;
    if (themeItems.some(t => t.code.toLowerCase() === newTheme.code.trim().toLowerCase())) return;
    setThemeItems(prev => [...prev, { code: newTheme.code.trim(), libelle: newTheme.libelle.trim(), ordre: Number(newTheme.ordre) || 0 }].sort((a,b)=>a.ordre-b.ordre));
    setNewTheme({ code: "", libelle: "", ordre: themeItems.length + 2 });
    setAddingTheme(false);
  };
  const startEditTheme = (code: string) => {
    const t = themeItems.find(x => x.code === code);
    if (!t) return;
    setEditingThemeCode(code);
    setEditThemeDraft({ code: t.code, libelle: t.libelle, ordre: t.ordre });
  };
  const cancelEditTheme = () => { setEditingThemeCode(null); setEditThemeDraft(null); };
  const saveEditTheme = () => {
    if (!editThemeDraft) return;
    setThemeItems(prev => prev.map(t => t.code === editingThemeCode ? { code: editThemeDraft.code.trim(), libelle: editThemeDraft.libelle.trim(), ordre: Number(editThemeDraft.ordre) || 0 } : t).sort((a,b)=>a.ordre-b.ordre));
    if (selectedThemeCode === editingThemeCode) setSelectedThemeCode(editThemeDraft.code.trim());
    setEditingThemeCode(null); setEditThemeDraft(null);
  };
  const deleteTheme = (code: string) => {
    setThemeItems(prev => prev.filter(t => t.code !== code));
    if (selectedThemeCode === code) { setSelectedThemeCode(null); setSelectedSousThemeCode(null); }
  };

  // Sous thème handlers (scoped to selectedThemeCode)
  const addSousTheme = () => {
    if (!selectedThemeCode) return;
    if (!newSousTheme.code.trim() || !newSousTheme.libelle.trim()) return;
    if (sousThemeItems.some(st => st.code.toLowerCase() === newSousTheme.code.trim().toLowerCase())) return;
    setSousThemeItems(prev => [...prev, { code: newSousTheme.code.trim(), libelle: newSousTheme.libelle.trim(), themeCode: selectedThemeCode, ordre: Number(newSousTheme.ordre) || 0 } as any].sort((a:any,b:any)=>a.ordre-b.ordre));
    setNewSousTheme({ code: "", libelle: "", ordre: 1 });
    setAddingSousTheme(false);
  };
  const startEditSousTheme = (code: string) => {
    const st: any = sousThemeItems.find((x: any) => x.code === code);
    if (!st) return;
    setEditingSousThemeCode(code);
    setEditSousThemeDraft({ code: st.code, libelle: st.libelle, ordre: st.ordre });
  };
  const cancelEditSousTheme = () => { setEditingSousThemeCode(null); setEditSousThemeDraft(null); };
  const saveEditSousTheme = () => {
    if (!editSousThemeDraft) return;
    setSousThemeItems(prev => prev.map((st: any) => st.code === editingSousThemeCode ? { ...st, code: editSousThemeDraft.code.trim(), libelle: editSousThemeDraft.libelle.trim(), ordre: Number(editSousThemeDraft.ordre) || 0 } : st).sort((a:any,b:any)=>a.ordre-b.ordre));
    if (selectedSousThemeCode === editingSousThemeCode) setSelectedSousThemeCode(editSousThemeDraft.code.trim());
    setEditingSousThemeCode(null); setEditSousThemeDraft(null);
  };
  const deleteSousTheme = (code: string) => {
    setSousThemeItems(prev => prev.filter((st:any) => st.code !== code));
    if (selectedSousThemeCode === code) setSelectedSousThemeCode(null);
  };

  // Section handlers (scoped to selectedSousThemeCode)
  const addSection = () => {
    if (!selectedSousThemeCode) return;
    if (!newSection.code.trim() || !newSection.libelle.trim()) return;
    if (sectionItems.some(s => s.code.toLowerCase() === newSection.code.trim().toLowerCase())) return;
    setSectionItems(prev => [...prev, { code: newSection.code.trim(), libelle: newSection.libelle.trim(), sousThemeCode: selectedSousThemeCode, ordre: Number(newSection.ordre) || 0 } as any].sort((a:any,b:any)=>a.ordre-b.ordre));
    setNewSection({ code: "", libelle: "", ordre: 1 });
    setAddingSection(false);
  };
  const startEditSection = (code: string) => {
    const s: any = sectionItems.find((x: any) => x.code === code);
    if (!s) return;
    setEditingSectionCode(code);
    setEditSectionDraft({ code: s.code, libelle: s.libelle, ordre: s.ordre });
  };
  const cancelEditSection = () => { setEditingSectionCode(null); setEditSectionDraft(null); };
  const saveEditSection = () => {
    if (!editSectionDraft) return;
    setSectionItems(prev => prev.map((s:any) => s.code === editingSectionCode ? { ...s, code: editSectionDraft.code.trim(), libelle: editSectionDraft.libelle.trim(), ordre: Number(editSectionDraft.ordre) || 0 } : s).sort((a:any,b:any)=>a.ordre-b.ordre));
    setEditingSectionCode(null); setEditSectionDraft(null);
  };
  const deleteSection = (code: string) => {
    setSectionItems(prev => prev.filter((s:any) => s.code !== code));
  };

  const openSimpleList = (title: string, _items: { code: string; libelle: string; ordre: number }[]) => {
    // noop – dialog removed; only bottom tables are shown
    setSelectedRef(null);
    // set selectedRef by title
    const map: Record<string, RefKey> = {
      "Fonctions": "fonctions",
      "Statuts Contenu": "statutsContenu",
      "Profils": "profils",
      "Thèmes": "themes",
      "Sous thèmes": "sousThemes" as any,
      "Sections": "themes" as any,
      "Types Quiz": "typesQuiz",
      "Modes Paiement": "modesPaiement",
      "Types Ressource Pédagogique": "typesRessourcePedagogique",
      "Écoles": "ecoles",
    };
    setSelectedRef(map[title] || null);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Module Paramétrage
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord administrateur - Gestion globale de la plateforme
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Clients Actifs"
            value="1,248"
            change="+12% ce mois"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Écoles Partenaires"
            value="87"
            change="+3 nouvelles"
            icon={School}
            variant="info"
          />
          <StatsCard
            title="Formations Actives"
            value="342"
            change="+18 publiées"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="CA ce mois"
            value="145k€"
            change="+25% vs dernier mois"
            icon={CreditCard}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gestion des Tables */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Gestion des Tables de Référence
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const buttons = [
                  { label: "Fonctions", count: fonctions.length, onClick: () => openSimpleList("Fonctions", fonctions) },
                  { label: "Statuts Contenu", count: statutsContenu.length, onClick: () => openSimpleList("Statuts Contenu", statutsContenu) },
                  { label: "Profils", count: profils.length, onClick: () => openSimpleList("Profils", profils) },
                  { label: "Thèmes", count: themes.length, onClick: () => openSimpleList("Thèmes", themes) },
                  { label: "Types Quiz", count: typesQuiz.length, onClick: () => openSimpleList("Types Quiz", typesQuiz) },
                  { label: "Modes Paiement", count: modesPaiement.length, onClick: () => openSimpleList("Modes Paiement", modesPaiement) },
                  { label: "Types Ressource Pédagogique", count: typesRessourcePedagogique.length, onClick: () => openSimpleList("Types Ressource Pédagogique", typesRessourcePedagogique) },
                  { label: "Écoles", count: ecoles.length, onClick: () => openSimpleList("Écoles", ecoles.map(e => ({ code: e.code, libelle: e.nom, ordre: e.ordre }))) },
                  { label: "UV", count: uvs.length, onClick: () => selectRef("uvs") },
                ];
                const mid = Math.ceil(buttons.length / 2);
                const left = buttons.slice(0, mid);
                const right = buttons.slice(mid);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {left.map(b => (
                        <button key={b.label} type="button" className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors" onClick={b.onClick}>
                          <span className="font-medium">{b.label}</span>
                          <Badge variant="secondary">{b.count}</Badge>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {right.map(b => (
                        <button key={b.label} type="button" className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors" onClick={b.onClick}>
                          <span className="font-medium">{b.label}</span>
                          <Badge variant="secondary">{b.count}</Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
              

              {/* Tables affichées en dessous selon la sélection */}
              {selectedRef && (
                <div className="mt-8">
                  {selectedRef === "fonctions" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fonctions.map((f) => (
                          <TableRow key={f.code}>
                            <TableCell>{f.code}</TableCell>
                            <TableCell>{f.libelle}</TableCell>
                            <TableCell>{f.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Fonctions (Code, Libellé, Ordre)</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "statutsContenu" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statutsContenu.map((s) => (
                          <TableRow key={s.code}>
                            <TableCell>{s.code}</TableCell>
                            <TableCell>{s.libelle}</TableCell>
                            <TableCell>{s.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Statuts contenu (Code, Libellé, Ordre)</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "profils" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profils.map((p) => (
                          <TableRow key={p.code}>
                            <TableCell>{p.code}</TableCell>
                            <TableCell>{p.libelle}</TableCell>
                            <TableCell>{p.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Profils (Code, Libellé, Ordre)</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "themes" && (
                    <div className="space-y-8">
                      <div className="flex justify-end">
                        <Input
                          placeholder="Filtrer thèmes (code/libellé)"
                          className="w-64"
                          value={themeFilter}
                          onChange={(e)=>setThemeFilter(e.target.value)}
                        />
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {themes
                            .filter((t) => !themeFilter.trim() || t.code.toLowerCase().includes(themeFilter.toLowerCase()) || t.libelle.toLowerCase().includes(themeFilter.toLowerCase()))
                            .map((t) => (
                            <TableRow
                              key={t.code}
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedThemeCode(t.code);
                                setSelectedSousThemeCode(null);
                              }}
                            >
                              <TableCell>{t.code}</TableCell>
                              <TableCell>{t.libelle}</TableCell>
                              <TableCell>{t.ordre}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Thèmes (cliquez pour voir les sous-thèmes)</TableCaption>
                      </Table>

                      {selectedThemeCode && (
                        <div className="space-y-4">
                          <div className="flex justify-end">
                            <Input
                              placeholder="Filtrer sous thèmes (code/libellé)"
                              className="w-64"
                              value={sousThemeFilter}
                              onChange={(e)=>setSousThemeFilter(e.target.value)}
                            />
                          </div>
                          <h3 className="text-lg font-semibold">Sous thèmes du thème: {selectedThemeCode}</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead>Thème</TableHead>
                                <TableHead>Ordre</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sousThemes
                                .filter((st) => st.themeCode === selectedThemeCode)
                                .filter((st) => !sousThemeFilter.trim() || st.code.toLowerCase().includes(sousThemeFilter.toLowerCase()) || st.libelle.toLowerCase().includes(sousThemeFilter.toLowerCase()))
                                .map((st) => (
                                  <TableRow
                                    key={st.code}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedSousThemeCode(st.code)}
                                  >
                                    <TableCell>{st.code}</TableCell>
                                    <TableCell>{st.libelle}</TableCell>
                                    <TableCell>{st.themeCode}</TableCell>
                                    <TableCell>{st.ordre}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption>Sous thèmes (cliquez pour voir les sections)</TableCaption>
                          </Table>
                        </div>
                      )}

                      {selectedSousThemeCode && (
                        <div className="space-y-4">
                          <div className="flex justify-end">
                            <Input
                              placeholder="Filtrer sections (code/libellé)"
                              className="w-64"
                              value={sectionFilter}
                              onChange={(e)=>setSectionFilter(e.target.value)}
                            />
                          </div>
                          <h3 className="text-lg font-semibold">Sections du sous thème: {selectedSousThemeCode}</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead>Sous thème</TableHead>
                                <TableHead>Ordre</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sections
                                .filter((s) => s.sousThemeCode === selectedSousThemeCode)
                                .filter((s) => !sectionFilter.trim() || s.code.toLowerCase().includes(sectionFilter.toLowerCase()) || s.libelle.toLowerCase().includes(sectionFilter.toLowerCase()))
                                .map((s) => (
                                  <TableRow key={s.code}>
                                    <TableCell>{s.code}</TableCell>
                                    <TableCell>{s.libelle}</TableCell>
                                    <TableCell>{s.sousThemeCode}</TableCell>
                                    <TableCell>{s.ordre}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption>Sections</TableCaption>
                          </Table>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRef === "typesRessourcePedagogique" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {typesRessourcePedagogique.map((t) => (
                          <TableRow key={t.code}>
                            <TableCell>{t.code}</TableCell>
                            <TableCell>{t.libelle}</TableCell>
                            <TableCell>{t.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Types ressource pédagogique</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "typesQuiz" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {typesQuiz.map((tq) => (
                          <TableRow key={tq.code}>
                            <TableCell>{tq.code}</TableCell>
                            <TableCell>{tq.libelle}</TableCell>
                            <TableCell>{tq.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Types de Quiz</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "modesPaiement" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modesPaiement.map((m) => (
                          <TableRow key={m.code}>
                            <TableCell>{m.code}</TableCell>
                            <TableCell>{m.libelle}</TableCell>
                            <TableCell>{m.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Modes de paiement</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "ecoles" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Contacts</TableHead>
                          <TableHead>Password</TableHead>
                          <TableHead>État</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ecoles.map((e) => (
                          <TableRow key={e.code}>
                            <TableCell>{e.code}</TableCell>
                            <TableCell>{e.nom}</TableCell>
                            <TableCell>{e.contacts}</TableCell>
                            <TableCell>{e.password}</TableCell>
                            <TableCell className="capitalize">{e.etat}</TableCell>
                            <TableCell>{e.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>Écoles</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "uvs" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Présentation</TableHead>
                          <TableHead>Teaser</TableHead>
                          <TableHead>Coef</TableHead>
                          <TableHead>Élim</TableHead>
                          <TableHead>Note val.</TableHead>
                          <TableHead>Ordre</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uvs.map((u) => (
                          <TableRow key={u.code} className="cursor-pointer" onClick={() => setSelectedUvCode(u.code)}>
                            <TableCell>{u.code}</TableCell>
                            <TableCell>{u.libelle}</TableCell>
                            <TableCell>{u.description}</TableCell>
                            <TableCell>{u.presentationEcrite}</TableCell>
                            <TableCell>{u.lienTeaserUV}</TableCell>
                            <TableCell>{u.coefficient}</TableCell>
                            <TableCell>{u.eliminatoire}</TableCell>
                            <TableCell>{u.noteValidation}</TableCell>
                            <TableCell>{u.ordre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>UV (Code, Libellé, description, présentation, teaser, coefficient, éliminatoire, note validation, ordre)</TableCaption>
                    </Table>
                  )}

                  {selectedRef === "uvs" && (
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold">Liens Contenu ↔ Bibliothèques</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Contenu</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Bibliothèque</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {liensContenuBibliotheques
                            .filter((l) => l.contenuType === "UV")
                            .map((l, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{l.contenuType}</TableCell>
                                <TableCell>{l.contenuCode}</TableCell>
                                <TableCell>{l.bibliothequeCode}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>

                      <h3 className="text-lg font-semibold">Liens Contenu ↔ Sections</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Contenu</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Section</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {liensContenuSections
                            .filter((l) => l.contenuType === "UV")
                            .map((l, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{l.contenuType}</TableCell>
                                <TableCell>{l.contenuCode}</TableCell>
                                <TableCell>{l.sectionCode}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertes et Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                Alertes Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-warning rounded-full mr-2" />
                    <span className="font-medium text-sm">Maintenance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mise à jour prévue ce soir à 22h
                  </p>
                </div>
                
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-success rounded-full mr-2" />
                    <span className="font-medium text-sm">Sauvegarde</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Backup automatique réussi
                  </p>
                </div>
                
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-info rounded-full mr-2" />
                    <span className="font-medium text-sm">Nouveau client</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    École Supérieure inscrite
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}