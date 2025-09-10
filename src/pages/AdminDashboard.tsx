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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Simple parameter tables local state (front-only)
  const [fonctionsItems, setFonctionsItems] = useState(() => [...fonctions]);
  const [profilsItems, setProfilsItems] = useState(() => [...profils]);
  const [statutsItems, setStatutsItems] = useState(() => [...statutsContenu]);
  const [typesQuizItems, setTypesQuizItems] = useState(() => [...typesQuiz]);
  const [modesPaiementItems, setModesPaiementItems] = useState(() => [...modesPaiement]);
  const [typesRessourceItems, setTypesRessourceItems] = useState(() => [...typesRessourcePedagogique]);
  const [ecolesSimpleItems, setEcolesSimpleItems] = useState(() => ecoles.map((e:any) => ({ code: e.code, libelle: e.nom, ordre: e.ordre })));
  const [uvsSimpleItems, setUvsSimpleItems] = useState(() => uvs.map((u:any) => ({ code: u.code, libelle: u.libelle, ordre: u.ordre })));
  const [uvDetailsItems, setUvDetailsItems] = useState<any[]>(() => uvs.map((u:any)=>({ ...u })));
  const [ecoleDetailsItems, setEcoleDetailsItems] = useState<any[]>(() => ecoles.map((e:any)=>({ ...e })));

  // Generic dialog for simple add/edit
  const [simpleOpen, setSimpleOpen] = useState(false);
  const [simpleTable, setSimpleTable] = useState<string | null>(null);
  const [simpleMode, setSimpleMode] = useState<"new" | "edit">("new");
  const [simpleDraft, setSimpleDraft] = useState<{ code: string; libelle: string; ordre: number }>({ code: "", libelle: "", ordre: 1 });

  // Specialized edit dialogs (UV, École)
  const [uvEditOpen, setUvEditOpen] = useState(false);
  const [uvEditingCode, setUvEditingCode] = useState<string | null>(null);
  const [uvDraft, setUvDraft] = useState<any>({ code: "", libelle: "", description: "", presentationEcrite: "", lienTeaserUV: "", coefficient: 0, eliminatoire: "N", noteValidation: 0, ordre: 1 });

  const [ecoleEditOpen, setEcoleEditOpen] = useState(false);
  const [ecoleEditingCode, setEcoleEditingCode] = useState<string | null>(null);
  const [ecoleDraft, setEcoleDraft] = useState<any>({ code: "", nom: "", contacts: "", password: "", etat: "actif", ordre: 1 });

  const getSimpleState = (key: string): { items: any[]; setItems: (fn: any) => void; title: string } => {
    switch (key) {
      case "fonctions": return { items: fonctionsItems, setItems: setFonctionsItems, title: "Fonctions" };
      case "profils": return { items: profilsItems, setItems: setProfilsItems, title: "Profils" };
      case "statutsContenu": return { items: statutsItems, setItems: setStatutsItems, title: "Statuts Contenu" };
      case "typesQuiz": return { items: typesQuizItems, setItems: setTypesQuizItems, title: "Types Quiz" };
      case "modesPaiement": return { items: modesPaiementItems, setItems: setModesPaiementItems, title: "Modes Paiement" };
      case "typesRessourcePedagogique": return { items: typesRessourceItems, setItems: setTypesRessourceItems, title: "Types Ressource Pédagogique" };
      case "ecoles": return { items: ecolesSimpleItems, setItems: setEcolesSimpleItems, title: "Écoles" };
      case "uvs": return { items: uvsSimpleItems, setItems: setUvsSimpleItems, title: "UV" };
      default: return { items: [], setItems: ()=>{}, title: key } as any;
    }
  };

  const openNewSimple = (key: string) => {
    setSimpleTable(key);
    setSimpleMode("new");
    setSimpleDraft({ code: "", libelle: "", ordre: 1 });
    setSimpleOpen(true);
  };
  const openEditSimple = (key: string, item: any) => {
    if (key === "uvs") {
      const found = uvDetailsItems.find((u:any) => u.code === item.code);
      if (!found) return;
      setUvEditingCode(found.code);
      setUvDraft({ ...found });
      setUvEditOpen(true);
      return;
    }
    if (key === "ecoles") {
      const found = ecoleDetailsItems.find((e:any) => e.code === item.code);
      if (!found) return;
      setEcoleEditingCode(found.code);
      setEcoleDraft({ ...found });
      setEcoleEditOpen(true);
      return;
    }
    setSimpleTable(key);
    setSimpleMode("edit");
    setSimpleDraft({ code: item.code, libelle: item.libelle, ordre: Number(item.ordre) || 0 });
    setSimpleOpen(true);
  };
  const confirmSimple = () => {
    if (!simpleTable) return;
    const { items, setItems } = getSimpleState(simpleTable);
    if (!simpleDraft.code.trim() || !simpleDraft.libelle.trim()) return;
    if (simpleMode === "new") {
      if (items.some((x:any) => x.code.toLowerCase() === simpleDraft.code.trim().toLowerCase())) return;
      setItems((prev:any[]) => [...prev, { code: simpleDraft.code.trim(), libelle: simpleDraft.libelle.trim(), ordre: Number(simpleDraft.ordre) || 0 }].sort((a:any,b:any)=>a.ordre-b.ordre));
    } else {
      setItems((prev:any[]) => prev.map((x:any) => x.code === simpleDraft.code ? { ...x, libelle: simpleDraft.libelle.trim(), ordre: Number(simpleDraft.ordre) || 0 } : (x.code.toLowerCase() === simpleDraft.code.toLowerCase() ? { ...x, libelle: simpleDraft.libelle.trim(), ordre: Number(simpleDraft.ordre) || 0 } : x)).sort((a:any,b:any)=>a.ordre-b.ordre));
    }
    setSimpleOpen(false);
  };
  const deleteSimple = (key: string, code: string) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    const { setItems } = getSimpleState(key);
    setItems((prev:any[]) => prev.filter((x:any) => x.code !== code));
  };

  const confirmUvEdit = () => {
    if (!uvEditingCode) return;
    if (!uvDraft.code.trim() || !uvDraft.libelle.trim()) return;
    // Update details
    setUvDetailsItems(prev => prev.map((u:any) => u.code === uvEditingCode ? {
      ...u,
      code: uvDraft.code.trim(),
      libelle: uvDraft.libelle.trim(),
      description: uvDraft.description || "",
      presentationEcrite: uvDraft.presentationEcrite || "",
      lienTeaserUV: uvDraft.lienTeaserUV || "",
      coefficient: Number(uvDraft.coefficient) || 0,
      eliminatoire: uvDraft.eliminatoire,
      noteValidation: Number(uvDraft.noteValidation) || 0,
      ordre: Number(uvDraft.ordre) || 0,
    } : u));
    // Update simple list
    setUvsSimpleItems(prev => prev.map((u:any) => u.code === uvEditingCode ? { code: uvDraft.code.trim(), libelle: uvDraft.libelle.trim(), ordre: Number(uvDraft.ordre) || 0 } : u).sort((a:any,b:any)=>a.ordre-b.ordre));
    if (selectedUvCode === uvEditingCode) setSelectedUvCode(uvDraft.code.trim());
    setUvEditOpen(false);
  };

  const confirmEcoleEdit = () => {
    if (!ecoleEditingCode) return;
    if (!ecoleDraft.code.trim() || !ecoleDraft.nom.trim()) return;
    setEcoleDetailsItems(prev => prev.map((e:any) => e.code === ecoleEditingCode ? {
      ...e,
      code: ecoleDraft.code.trim(),
      nom: ecoleDraft.nom.trim(),
      contacts: ecoleDraft.contacts || "",
      password: ecoleDraft.password || "",
      etat: ecoleDraft.etat || "actif",
      ordre: Number(ecoleDraft.ordre) || 0,
    } : e));
    setEcolesSimpleItems(prev => prev.map((e:any) => e.code === ecoleEditingCode ? { code: ecoleDraft.code.trim(), libelle: ecoleDraft.nom.trim(), ordre: Number(ecoleDraft.ordre) || 0 } : e).sort((a:any,b:any)=>a.ordre-b.ordre));
    setEcoleEditOpen(false);
  };

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
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Fonctions</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("fonctions")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fonctionsItems.map((f) => (
                            <TableRow key={f.code}>
                              <TableCell>{f.code}</TableCell>
                              <TableCell>{f.libelle}</TableCell>
                              <TableCell>{f.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("fonctions", f)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("fonctions", f.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Fonctions (Code, Libellé, Ordre)</TableCaption>
                      </Table>
                    </div>
                  )}

                  {selectedRef === "statutsContenu" && (
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Statuts de contenu</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("statutsContenu")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statutsItems.map((s) => (
                            <TableRow key={s.code}>
                              <TableCell>{s.code}</TableCell>
                              <TableCell>{s.libelle}</TableCell>
                              <TableCell>{s.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("statutsContenu", s)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("statutsContenu", s.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Statuts contenu (Code, Libellé, Ordre)</TableCaption>
                      </Table>
                    </div>
                  )}

                  {selectedRef === "profils" && (
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Profils</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("profils")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {profilsItems.map((p) => (
                            <TableRow key={p.code}>
                              <TableCell>{p.code}</TableCell>
                              <TableCell>{p.libelle}</TableCell>
                              <TableCell>{p.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("profils", p)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("profils", p.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Profils (Code, Libellé, Ordre)</TableCaption>
                      </Table>
                    </div>
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
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Types ressource pédagogique</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("typesRessourcePedagogique")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typesRessourceItems.map((t) => (
                            <TableRow key={t.code}>
                              <TableCell>{t.code}</TableCell>
                              <TableCell>{t.libelle}</TableCell>
                              <TableCell>{t.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("typesRessourcePedagogique", t)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("typesRessourcePedagogique", t.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Types ressource pédagogique</TableCaption>
                      </Table>
                    </div>
                  )}

                  {selectedRef === "typesQuiz" && (
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Types de quiz</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("typesQuiz")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typesQuizItems.map((tq) => (
                            <TableRow key={tq.code}>
                              <TableCell>{tq.code}</TableCell>
                              <TableCell>{tq.libelle}</TableCell>
                              <TableCell>{tq.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("typesQuiz", tq)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("typesQuiz", tq.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Types de Quiz</TableCaption>
                      </Table>
                    </div>
                  )}

                  {selectedRef === "modesPaiement" && (
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Modes de paiement</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("modesPaiement")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {modesPaiementItems.map((m) => (
                            <TableRow key={m.code}>
                              <TableCell>{m.code}</TableCell>
                              <TableCell>{m.libelle}</TableCell>
                              <TableCell>{m.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("modesPaiement", m)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("modesPaiement", m.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Modes de paiement</TableCaption>
                      </Table>
                    </div>
                  )}

                  {selectedRef === "ecoles" && (
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-cyan-500/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des Écoles</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("ecoles")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ecolesSimpleItems.map((e) => (
                            <TableRow key={e.code}>
                              <TableCell>{e.code}</TableCell>
                              <TableCell>{e.libelle}</TableCell>
                              <TableCell>{e.ordre}</TableCell>
                              <TableCell className="space-x-2">
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("ecoles", e)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("ecoles", e.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>Écoles (Code, Libellé, Ordre)</TableCaption>
                      </Table>
                    </div>
                  )}

                  {selectedRef === "uvs" && (
                    <div>
                      <div className="mb-3 flex items-center justify-between rounded bg-primary/20 px-3 py-2">
                        <h3 className="font-semibold">Liste des UV</h3>
                        <Button size="sm" className="bg-gradient-primary" onClick={()=>openNewSimple("uvs")}>Nouveau</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uvsSimpleItems.map((u) => (
                            <TableRow key={u.code} className="cursor-pointer" onClick={() => setSelectedUvCode(u.code)}>
                              <TableCell>{u.code}</TableCell>
                              <TableCell>{u.libelle}</TableCell>
                              <TableCell>{u.ordre}</TableCell>
                              <TableCell className="space-x-2" onClick={(e)=>e.stopPropagation()}>
                                <Button size="sm" variant="link" onClick={()=>openEditSimple("uvs", u)}>Modifier</Button>
                                <Button size="sm" variant="link" className="text-red-600" onClick={()=>deleteSimple("uvs", u.code)}>Supprimer</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>UV (Code, Libellé, Ordre)</TableCaption>
                      </Table>
                    </div>
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
              {/* Simple Add/Edit dialog */}
              <Dialog open={simpleOpen} onOpenChange={setSimpleOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{simpleMode === "new" ? "Nouveau" : "Modifier"} {simpleTable ? getSimpleState(simpleTable).title : ""}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Code</label>
                      <Input value={simpleDraft.code} onChange={(e)=>setSimpleDraft(prev=>({ ...prev, code: e.target.value }))} disabled={simpleMode==='edit'} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Libellé</label>
                      <Input value={simpleDraft.libelle} onChange={(e)=>setSimpleDraft(prev=>({ ...prev, libelle: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Ordre</label>
                      <Input type="number" value={simpleDraft.ordre} onChange={(e)=>setSimpleDraft(prev=>({ ...prev, ordre: Number(e.target.value)||0 }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={()=>setSimpleOpen(false)}>Annuler</Button>
                    <Button className="bg-gradient-primary" onClick={confirmSimple}>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* UV Edit Dialog */}
              <Dialog open={uvEditOpen} onOpenChange={setUvEditOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Modifier UV</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Code</label>
                      <Input value={uvDraft.code} onChange={(e)=>setUvDraft((p:any)=>({ ...p, code: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Libellé</label>
                      <Input value={uvDraft.libelle} onChange={(e)=>setUvDraft((p:any)=>({ ...p, libelle: e.target.value }))} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input value={uvDraft.description} onChange={(e)=>setUvDraft((p:any)=>({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium">Présentation écrite</label>
                      <Input value={uvDraft.presentationEcrite} onChange={(e)=>setUvDraft((p:any)=>({ ...p, presentationEcrite: e.target.value }))} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium">Lien teaser UV</label>
                      <Input value={uvDraft.lienTeaserUV} onChange={(e)=>setUvDraft((p:any)=>({ ...p, lienTeaserUV: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Coefficient</label>
                      <Input type="number" value={uvDraft.coefficient} onChange={(e)=>setUvDraft((p:any)=>({ ...p, coefficient: Number(e.target.value)||0 }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Éliminatoire</label>
                      <Select value={uvDraft.eliminatoire} onValueChange={(v)=>setUvDraft((p:any)=>({ ...p, eliminatoire: v }))}>
                        <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="O">O</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Note de validation</label>
                      <Input type="number" value={uvDraft.noteValidation} onChange={(e)=>setUvDraft((p:any)=>({ ...p, noteValidation: Number(e.target.value)||0 }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Ordre</label>
                      <Input type="number" value={uvDraft.ordre} onChange={(e)=>setUvDraft((p:any)=>({ ...p, ordre: Number(e.target.value)||0 }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={()=>setUvEditOpen(false)}>Annuler</Button>
                    <Button className="bg-gradient-primary" onClick={confirmUvEdit}>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* École Edit Dialog */}
              <Dialog open={ecoleEditOpen} onOpenChange={setEcoleEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier École</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Code</label>
                      <Input value={ecoleDraft.code} onChange={(e)=>setEcoleDraft((p:any)=>({ ...p, code: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Nom</label>
                      <Input value={ecoleDraft.nom} onChange={(e)=>setEcoleDraft((p:any)=>({ ...p, nom: e.target.value }))} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium">Contacts</label>
                      <Input value={ecoleDraft.contacts} onChange={(e)=>setEcoleDraft((p:any)=>({ ...p, contacts: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Mot de passe</label>
                      <Input value={ecoleDraft.password} onChange={(e)=>setEcoleDraft((p:any)=>({ ...p, password: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">État</label>
                      <Select value={ecoleDraft.etat} onValueChange={(v)=>setEcoleDraft((p:any)=>({ ...p, etat: v }))}>
                        <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">actif</SelectItem>
                          <SelectItem value="sommeil">sommeil</SelectItem>
                          <SelectItem value="inactif">inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Ordre</label>
                      <Input type="number" value={ecoleDraft.ordre} onChange={(e)=>setEcoleDraft((p:any)=>({ ...p, ordre: Number(e.target.value)||0 }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={()=>setEcoleEditOpen(false)}>Annuler</Button>
                    <Button className="bg-gradient-primary" onClick={confirmEcoleEdit}>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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