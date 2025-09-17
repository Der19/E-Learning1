import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
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
  liensContenuBibliotheques,
  liensContenuSections,
} from "@/lib/adminData";

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

export default function AdminParametrage() {
  const [selectedRef, setSelectedRef] = useState<RefKey | null>(null);
  const [expandedKey, setExpandedKey] = useState<RefKey | null>(null);
  const [selectedThemeCode, setSelectedThemeCode] = useState<string | null>(null);
  const [selectedSousThemeCode, setSelectedSousThemeCode] = useState<string | null>(null);
  const [selectedUvCode, setSelectedUvCode] = useState<string | null>(null);

  const [themeItems, setThemeItems] = useState(() => [...themes]);
  const [sousThemeItems, setSousThemeItems] = useState(() => [...sousThemes]);
  const [sectionItems, setSectionItems] = useState(() => [...sections]);

  const [themeFilter, setThemeFilter] = useState("");
  const [sousThemeFilter, setSousThemeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [fonctionsItems, setFonctionsItems] = useState(() => [...fonctions]);
  const [profilsItems, setProfilsItems] = useState(() => [...profils]);
  const [statutsItems, setStatutsItems] = useState(() => [...statutsContenu]);
  const [typesQuizItems, setTypesQuizItems] = useState(() => [...typesQuiz]);
  const [modesPaiementItems, setModesPaiementItems] = useState(() => [...modesPaiement]);
  const [typesRessourceItems, setTypesRessourceItems] = useState(() => [...typesRessourcePedagogique]);
  const [ecolesItems, setEcolesItems] = useState(() => [...ecoles]);
  const [uvsItems, setUvsItems] = useState(() => [...uvs]);

  const [simpleOpen, setSimpleOpen] = useState(false);
  const [simpleTable, setSimpleTable] = useState<string | null>(null);
  const [simpleMode, setSimpleMode] = useState<"new" | "edit">("new");
  const [simpleDraft, setSimpleDraft] = useState<{ code: string; libelle: string; ordre: number }>({ code: "", libelle: "", ordre: 1 });
  const [quizCoefDraft, setQuizCoefDraft] = useState<number>(1);

  const openNewSimple = (key: string) => {
    setSimpleTable(key);
    setSimpleMode("new");
    const base: any = { code: "", libelle: "", ordre: 1 };
    if (key === "typesQuiz") { setQuizCoefDraft(1); base.description = ""; base.dureeMaximaleParDefaut = 0; }
    if (key === "sousThemes") base.themeCode = selectedThemeCode ?? "";
    if (key === "sections") base.sousThemeCode = selectedSousThemeCode ?? "";
    if (key === 'uvs') {
      base.description = "Description de l'UV";
      base.presentationEcrite = "Présentation de l'UV";
      base.lienTeaserUV = "https://example.com/teaser";
      base.coefficient = 1;
      base.eliminatoire = 'N';
      base.noteValidation = 10;
    }
    setSimpleDraft(base);
    setSimpleOpen(true);
  };
  const openEditSimple = (key: string, item: any) => {
    setSimpleTable(key);
    setSimpleMode("edit");
    const base: any = { code: item.code, libelle: item.libelle, ordre: Number(item.ordre)||0 };
    if (key === "typesQuiz") { setQuizCoefDraft(Number((item as any).coefficientParDefaut)||0); base.description = (item as any).description || ""; base.dureeMaximaleParDefaut = Number((item as any).dureeMaximaleParDefaut)||0; }
    if (key === "sousThemes") base.themeCode = (item as any).themeCode ?? "";
    if (key === "sections") base.sousThemeCode = (item as any).sousThemeCode ?? "";
    if (key === 'ecoles') {
      const found:any = ecolesItems.find((e:any)=>e.code===item.code);
      if (found) {
        base.libelle = found.nom;
        base.contacts = found.contacts;
        base.password = found.password;
        base.etat = found.etat;
      }
    }
    if (key === 'uvs') {
      const found:any = uvsItems.find((u:any)=>u.code===item.code);
      if (found) {
        base.description = found.description;
        base.presentationEcrite = found.presentationEcrite;
        base.lienTeaserUV = found.lienTeaserUV;
        base.coefficient = found.coefficient;
        base.eliminatoire = found.eliminatoire;
        base.noteValidation = found.noteValidation;
      }
    }
    setSimpleDraft(base);
    setSimpleOpen(true);
  };
  const confirmSimple = () => {
    if (!simpleTable) return;
    const upd = (arr:any[], next:any) => arr.map((x:any)=>x.code===next.code?next:x);
    if (!simpleDraft.code.trim() || !simpleDraft.libelle.trim()) return;
    const base:any = { code: simpleDraft.code.trim(), libelle: simpleDraft.libelle.trim(), ordre: Number(simpleDraft.ordre)||0 };
    if (simpleTable === 'typesQuiz') { base.description = (simpleDraft as any).description||''; base.coefficientParDefaut = Number(quizCoefDraft)||0; base.dureeMaximaleParDefaut = Number((simpleDraft as any).dureeMaximaleParDefaut)||0; }
    if (simpleTable === 'ecoles') {
      const etat = (simpleDraft as any).etat as 'actif'|'sommeil'|'inactif' | undefined;
      const contacts = (simpleDraft as any).contacts ?? '';
      const password = (simpleDraft as any).password ?? '';
      const nom = simpleDraft.libelle; // libellé champs maps to nom for schools list
      (base as any) = { code: base.code, nom, contacts, password, etat: etat ?? 'actif', ordre: base.ordre };
    }
    if (simpleTable === 'uvs') {
      (base as any) = {
        code: base.code,
        libelle: base.libelle,
        description: (simpleDraft as any).description ?? '',
        presentationEcrite: (simpleDraft as any).presentationEcrite ?? '',
        lienTeaserUV: (simpleDraft as any).lienTeaserUV ?? '',
        coefficient: Number((simpleDraft as any).coefficient) || 0,
        eliminatoire: ((simpleDraft as any).eliminatoire === 'O' ? 'O' : 'N') as 'O'|'N',
        noteValidation: Number((simpleDraft as any).noteValidation) || 0,
        ordre: base.ordre,
      };
    }
    if (simpleMode === 'new') {
      switch(simpleTable){
        case 'fonctions': setFonctionsItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'profils': setProfilsItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'statutsContenu': setStatutsItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'typesQuiz': setTypesQuizItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'modesPaiement': setModesPaiementItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'typesRessourcePedagogique': setTypesRessourceItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'themes': setThemeItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'sousThemes': setSousThemeItems(prev=>[...prev, { ...base, themeCode: (simpleDraft as any).themeCode }].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'sections': setSectionItems(prev=>[...prev, { ...base, sousThemeCode: (simpleDraft as any).sousThemeCode }].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'ecoles': setEcolesItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'uvs': setUvsItems(prev=>[...prev, base].sort((a:any,b:any)=>a.ordre-b.ordre)); break;
      }
    } else {
      switch(simpleTable){
        case 'fonctions': setFonctionsItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'profils': setProfilsItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'statutsContenu': setStatutsItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'typesQuiz': setTypesQuizItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'modesPaiement': setModesPaiementItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'typesRessourcePedagogique': setTypesRessourceItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'themes': setThemeItems(prev=>upd(prev, base).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'sousThemes': setSousThemeItems(prev=>prev.map((i:any)=> i.code===base.code ? { ...i, ...base, themeCode: (simpleDraft as any).themeCode } : i).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'sections': setSectionItems(prev=>prev.map((i:any)=> i.code===base.code ? { ...i, ...base, sousThemeCode: (simpleDraft as any).sousThemeCode } : i).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'ecoles': setEcolesItems(prev=>prev.map((e:any)=> e.code===base.code ? { ...(base as any) } : e).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
        case 'uvs': setUvsItems(prev=>prev.map((u:any)=> u.code===base.code ? { ...(base as any) } : u).sort((a:any,b:any)=>a.ordre-b.ordre)); break;
      }
    }
    setSimpleOpen(false);
  };
  const deleteSimple = (key: string, code: string) => {
    const del = (arr:any[]) => arr.filter((x:any)=>x.code!==code);
    switch(key){
      case 'fonctions': setFonctionsItems(prev=>del(prev)); break;
      case 'profils': setProfilsItems(prev=>del(prev)); break;
      case 'statutsContenu': setStatutsItems(prev=>del(prev)); break;
      case 'typesQuiz': setTypesQuizItems(prev=>del(prev)); break;
      case 'modesPaiement': setModesPaiementItems(prev=>del(prev)); break;
      case 'typesRessourcePedagogique': setTypesRessourceItems(prev=>del(prev)); break;
      case 'themes': setThemeItems(prev=>del(prev)); break;
      case 'sousThemes': setSousThemeItems(prev=>del(prev)); break;
      case 'sections': setSectionItems(prev=>del(prev)); break;
      case 'ecoles': setEcolesItems(prev=>del(prev)); break;
      case 'uvs': setUvsItems(prev=>del(prev)); break;
    }
  };

  const resetDrilldown = () => { setSelectedThemeCode(null); setSelectedSousThemeCode(null); setSelectedUvCode(null); };
  const selectRef = (key: RefKey) => {
    setSelectedRef(key);
    setExpandedKey(prev => (prev === key ? null : key));
    resetDrilldown();
  };

  const getItemsForKey = (key: RefKey) => {
    switch (key) {
      case "fonctions": return fonctionsItems;
      case "profils": return profilsItems;
      case "statutsContenu": return statutsItems;
      case "themes": return themeItems;
      case "typesQuiz": return typesQuizItems.map((t:any) => ({ code: t.code, libelle: t.libelle, ordre: t.ordre }));
      case "modesPaiement": return modesPaiementItems;
      case "typesRessourcePedagogique": return typesRessourceItems;
      case "ecoles": return ecolesItems.map((e:any)=>({ code: e.code, libelle: e.nom, ordre: e.ordre }));
      case "uvs": return uvsItems.map((u:any)=>({ code: u.code, libelle: u.libelle, ordre: u.ordre }));
    }
  };

  const chunkBy = <T,>(arr: T[], size: number): T[][] => {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Paramétrage</h1>
          <p className="text-muted-foreground">Gestion des tables de référence</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Gestion des Tables de Référence
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const items = [
                { key: "fonctions" as RefKey, label: "Fonctions", count: fonctionsItems.length },
                { key: "statutsContenu" as RefKey, label: "Statuts Contenu", count: statutsItems.length },
                { key: "profils" as RefKey, label: "Profils", count: profilsItems.length },
                { key: "themes" as RefKey, label: "Thèmes", count: themeItems.length },
                { key: "typesQuiz" as RefKey, label: "Types Quiz", count: typesQuizItems.length },
                { key: "modesPaiement" as RefKey, label: "Modes Paiement", count: modesPaiementItems.length },
                { key: "typesRessourcePedagogique" as RefKey, label: "Types Ressource Pédagogique", count: typesRessourceItems.length },
                { key: "ecoles" as RefKey, label: "Écoles", count: ecolesItems.length },
                { key: "uvs" as RefKey, label: "UV", count: uvsItems.length },
              ];
              const rows = chunkBy(items, 3);
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rows.map((row, rowIdx) => (
                    <div key={`row-${rowIdx}`} className="contents">
                      {row.map(({ key, label, count }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => selectRef(key)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors border ${expandedKey === key ? "text-white bg-gradient-to-r from-sky-600 to-emerald-600 border-transparent shadow" : "bg-muted/50 hover:bg-muted"}`}
                        >
                          <span className="font-medium">{label}</span>
                          <Badge variant="secondary">{count}</Badge>
                      </button>
                    ))}
                      {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
                        <div key={`spacer-${rowIdx}-${i}`} />
                      ))}
                      {row.some(c => c.key === expandedKey) && (
                        <div key={`expanded-${rowIdx}`} className="col-span-1 sm:col-span-2 lg:col-span-3">
                          {expandedKey && (
                            <div className="rounded-lg border p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">{row.find(r => r.key === expandedKey)?.label}</h3>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => openNewSimple(expandedKey)}>Nouveau</Button>
                                  <Button size="sm" variant="outline" onClick={() => setExpandedKey(null)}>Fermer</Button>
                                </div>
                              </div>
                              {/* Root level table */}
                              {expandedKey !== 'themes' && (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Code</TableHead>
                                      <TableHead>Libellé</TableHead>
                                      <TableHead>Ordre</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getItemsForKey(expandedKey)?.map((it:any) => (
                                      <TableRow key={it.code}>
                                        <TableCell className="font-medium">{it.code}</TableCell>
                                        <TableCell>{it.libelle}</TableCell>
                                        <TableCell>{it.ordre}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                          <Button size="sm" variant="outline" onClick={() => openEditSimple(expandedKey, it)}>Modifier</Button>
                                          <Button size="sm" variant="destructive" onClick={() => deleteSimple(expandedKey, it.code)}>Supprimer</Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                  <TableCaption>Total: {getItemsForKey(expandedKey)?.length ?? 0}</TableCaption>
                                </Table>
                              )}

                              {/* Nested grid for Themes -> Sous-thèmes -> Sections */}
                              {expandedKey === 'themes' && (
                                <div className="space-y-6">
                                  {/* Themes row */}
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-semibold">Thèmes</h4>
                                    </div>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Code</TableHead>
                                          <TableHead>Libellé</TableHead>
                                          <TableHead>Ordre</TableHead>
                                          <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {themeItems.map((t:any) => (
                                          <TableRow key={t.code} className={selectedThemeCode === t.code ? 'bg-muted/40' : ''}>
                                            <TableCell className="font-medium">
                                              <button className="underline" onClick={() => { setSelectedThemeCode(prev => prev === t.code ? null : t.code); setSelectedSousThemeCode(null); }}>
                                                {t.code}
                                              </button>
                                            </TableCell>
                                            <TableCell>{t.libelle}</TableCell>
                                            <TableCell>{t.ordre}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                              <Button size="sm" variant="outline" onClick={() => openEditSimple('themes', t)}>Modifier</Button>
                                              <Button size="sm" variant="destructive" onClick={() => deleteSimple('themes', t.code)}>Supprimer</Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                      <TableCaption>Total: {themeItems.length}</TableCaption>
                                    </Table>
                                  </div>

                                  {/* Sous-thèmes row (visible when a theme is selected) */}
                                  {selectedThemeCode && (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold">Sous-thèmes du thème {themeItems.find(t=>t.code===selectedThemeCode)?.libelle} ({selectedThemeCode})</h4>
                                        <Button size="sm" onClick={() => openNewSimple('sousThemes')}>Nouveau sous-thème</Button>
                  </div>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Libellé</TableHead>
                                            <TableHead>Thème</TableHead>
                                            <TableHead>Ordre</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sousThemeItems.filter((st:any)=>st.themeCode===selectedThemeCode).map((st:any) => (
                                            <TableRow key={st.code} className={selectedSousThemeCode === st.code ? 'bg-muted/40' : ''}>
                                              <TableCell className="font-medium">
                                                <button className="underline" onClick={() => setSelectedSousThemeCode(prev => prev === st.code ? null : st.code)}>
                                                  {st.code}
                      </button>
                                              </TableCell>
                                              <TableCell>{st.libelle}</TableCell>
                                              <TableCell>{st.themeCode}</TableCell>
                                              <TableCell>{st.ordre}</TableCell>
                                              <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => openEditSimple('sousThemes', st)}>Modifier</Button>
                                                <Button size="sm" variant="destructive" onClick={() => deleteSimple('sousThemes', st.code)}>Supprimer</Button>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                        <TableCaption>Total: {sousThemeItems.filter((st:any)=>st.themeCode===selectedThemeCode).length}</TableCaption>
                                      </Table>
                                    </div>
                                  )}

                                  {/* Sections row (visible when a sous-thème is selected) */}
                                  {selectedSousThemeCode && (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold">Sections du sous-thème {sousThemeItems.find(st=>st.code===selectedSousThemeCode)?.libelle} ({selectedSousThemeCode})</h4>
                                        <Button size="sm" onClick={() => openNewSimple('sections')}>Nouvelle section</Button>
                                      </div>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Libellé</TableHead>
                                            <TableHead>Sous-thème</TableHead>
                                            <TableHead>Ordre</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sectionItems.filter((s:any)=>s.sousThemeCode===selectedSousThemeCode).map((s:any) => (
                                            <TableRow key={s.code}>
                                              <TableCell className="font-medium">{s.code}</TableCell>
                                              <TableCell>{s.libelle}</TableCell>
                                              <TableCell>{s.sousThemeCode}</TableCell>
                                              <TableCell>{s.ordre}</TableCell>
                                              <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => openEditSimple('sections', s)}>Modifier</Button>
                                                <Button size="sm" variant="destructive" onClick={() => deleteSimple('sections', s.code)}>Supprimer</Button>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                        <TableCaption>Total: {sectionItems.filter((s:any)=>s.sousThemeCode===selectedSousThemeCode).length}</TableCaption>
                                      </Table>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                  </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            <Dialog open={simpleOpen} onOpenChange={setSimpleOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{simpleMode === "new" ? "Nouveau" : "Modifier"} {simpleTable}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Code</label>
                    <Input value={simpleDraft.code} onChange={(e)=>setSimpleDraft(prev=>({ ...prev, code: e.target.value }))} disabled={simpleMode==='edit'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Libellé</label>
                    <Input value={simpleDraft.libelle} onChange={(e)=>setSimpleDraft(prev=>({ ...prev, libelle: e.target.value }))} />
                  </div>
                  {simpleTable === 'sousThemes' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Thème</label>
                      <Select value={(simpleDraft as any).themeCode ?? ''} onValueChange={(v)=>setSimpleDraft(prev=>({ ...(prev as any), themeCode: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un thème" />
                        </SelectTrigger>
                        <SelectContent>
                          {themeItems.map((t:any)=>(
                            <SelectItem key={t.code} value={t.code}>{t.libelle} ({t.code})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {simpleTable === 'sections' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Sous-thème</label>
                      <Select value={(simpleDraft as any).sousThemeCode ?? ''} onValueChange={(v)=>setSimpleDraft(prev=>({ ...(prev as any), sousThemeCode: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un sous-thème" />
                        </SelectTrigger>
                        <SelectContent>
                          {sousThemeItems.map((st:any)=>(
                            <SelectItem key={st.code} value={st.code}>{st.libelle} ({st.code})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {simpleTable === 'typesQuiz' && (
                    <>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea value={(simpleDraft as any).description ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), description: e.target.value }))} />
                      </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Coeff. par défaut</label>
                      <Input type="number" value={quizCoefDraft} onChange={(e)=>setQuizCoefDraft(Number(e.target.value)||0)} />
                    </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Durée max. par défaut (min)</label>
                        <Input type="number" value={(simpleDraft as any).dureeMaximaleParDefaut ?? 0} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), dureeMaximaleParDefaut: Number(e.target.value)||0 }))} />
                      </div>
                    </>
                  )}
                  {simpleTable === 'ecoles' && (
                    <>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium">Nom</label>
                        <Input value={(simpleDraft as any).libelle ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...prev, libelle: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Contacts</label>
                        <Input value={(simpleDraft as any).contacts ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), contacts: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Mot de passe</label>
                        <Input type="password" value={(simpleDraft as any).password ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), password: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">État</label>
                        <Select value={(simpleDraft as any).etat ?? 'actif'} onValueChange={(v)=>setSimpleDraft(prev=>({ ...(prev as any), etat: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir l'état" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="sommeil">Sommeil</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  {simpleTable === 'uvs' && (
                    <>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea value={(simpleDraft as any).description ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), description: e.target.value }))} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium">Présentation écrite</label>
                        <Textarea value={(simpleDraft as any).presentationEcrite ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), presentationEcrite: e.target.value }))} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium">Lien teaser UV</label>
                        <Input value={(simpleDraft as any).lienTeaserUV ?? ''} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), lienTeaserUV: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Coefficient</label>
                        <Input type="number" value={(simpleDraft as any).coefficient ?? 1} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), coefficient: Number(e.target.value)||0 }))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Éliminatoire</label>
                        <Select value={(simpleDraft as any).eliminatoire ?? 'N'} onValueChange={(v)=>setSimpleDraft(prev=>({ ...(prev as any), eliminatoire: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir (O/N)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="O">O</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Note de validation</label>
                        <Input type="number" value={(simpleDraft as any).noteValidation ?? 10} onChange={(e)=>setSimpleDraft(prev=>({ ...(prev as any), noteValidation: Number(e.target.value)||0 }))} />
                      </div>
                    </>
                  )}
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
