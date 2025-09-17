import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";
import { useState, useMemo, useEffect } from "react";

interface QuizRow {
  code: string;
  libelle: string;
  description?: string;
  coefficient: number;
  dureeMax: number; // minutes
  dateDebut?: string; // ISO
  dateFin?: string;   // ISO
  ordre: number;
}

interface OptionRow { id: string; text: string; isCorrect: boolean; points: number }
interface QuestionRow { id: string; code: string; libelle: string; ordre: number; options: OptionRow[] }

export default function TeacherQuizzes() {
  const LS_META = "teacher:quizzes:meta";
  const LS_QUEST = "teacher:quizzes:questions";

  const [filter, setFilter] = useState("");
  const [rows, setRows] = useState<QuizRow[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, QuestionRow[]>>({});

  // Load from localStorage (with defaults if empty)
  useEffect(() => {
    try {
      const rawMeta = localStorage.getItem(LS_META);
      const loadedMeta: QuizRow[] | null = rawMeta ? JSON.parse(rawMeta) : null;
      if (loadedMeta && loadedMeta.length) {
        setRows(loadedMeta);
      } else {
        setRows([
          { code: "QZ-DEV-1", libelle: "Devoir JavaScript", description: "Examen sur JS", coefficient: 2, dureeMax: 60, dateDebut: "", dateFin: "", ordre: 1 },
          { code: "QZ-REACT-EXO", libelle: "Exercice React", description: "QCM révision", coefficient: 1, dureeMax: 30, dateDebut: "", dateFin: "", ordre: 2 },
        ]);
      }
    } catch {}
    try {
      const rawQ = localStorage.getItem(LS_QUEST);
      const loadedQ = rawQ ? JSON.parse(rawQ) as Record<string, QuestionRow[]> : {};
      setQuizQuestions(loadedQ || {});
    } catch {}
  }, []);

  const persistMeta = (next: QuizRow[]) => {
    try { localStorage.setItem(LS_META, JSON.stringify(next)); } catch {}
  };
  const persistQuestions = (next: Record<string, QuestionRow[]>) => {
    try { localStorage.setItem(LS_QUEST, JSON.stringify(next)); } catch {}
  };

  const displayed = useMemo(() => rows.filter(r => !filter || r.code.toLowerCase().includes(filter.toLowerCase()) || r.libelle.toLowerCase().includes(filter.toLowerCase())), [rows, filter]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"new"|"edit">("new");
  const [draft, setDraft] = useState<QuizRow>({ code: "", libelle: "", description: "", coefficient: 1, dureeMax: 60, dateDebut: "", dateFin: "", ordre: 1 });

  const openNew = () => { setMode("new"); setDraft({ code: "", libelle: "", description: "", coefficient: 1, dureeMax: 60, dateDebut: "", dateFin: "", ordre: rows.length + 1 }); setOpen(true); };
  const openEdit = (row: QuizRow) => { setMode("edit"); setDraft({ ...row }); setOpen(true); };
  const save = () => {
    if (!draft.code.trim() || !draft.libelle.trim()) return;
    if (mode === "new") {
      if (rows.some(r => r.code.toLowerCase() === draft.code.trim().toLowerCase())) return;
      const next = [...rows, { ...draft, code: draft.code.trim(), libelle: draft.libelle.trim(), coefficient: Number(draft.coefficient)||0, dureeMax: Number(draft.dureeMax)||0, ordre: Number(draft.ordre)||0 }].sort((a,b)=>a.ordre-b.ordre);
      setRows(next);
      persistMeta(next);
    } else {
      const next = rows.map(r => r.code === draft.code ? { ...draft, code: draft.code.trim(), libelle: draft.libelle.trim(), coefficient: Number(draft.coefficient)||0, dureeMax: Number(draft.dureeMax)||0, ordre: Number(draft.ordre)||0 } : r).sort((a,b)=>a.ordre-b.ordre);
      setRows(next);
      persistMeta(next);
    }
    setOpen(false);
  };

  const remove = (code: string) => {
    const next = rows.filter(r => r.code !== code);
    setRows(next);
    persistMeta(next);
    const { [code]: _, ...rest } = quizQuestions;
    setQuizQuestions(rest);
    persistQuestions(rest);
  };

  // Questions management
  const [qOpen, setQOpen] = useState(false);
  const [currentQuizCode, setCurrentQuizCode] = useState<string>("");
  const [qDraft, setQDraft] = useState<QuestionRow>({ id: "", code: "", libelle: "", ordre: 1, options: [] });

  const openQuestions = (code: string) => {
    setCurrentQuizCode(code);
    setQOpen(true);
  };
  const addQuestion = () => {
    if (!qDraft.code.trim() || !qDraft.libelle.trim()) return;
    const newQ: QuestionRow = { ...qDraft, id: crypto.randomUUID(), code: qDraft.code.trim(), libelle: qDraft.libelle.trim(), ordre: Number(qDraft.ordre)||0, options: [...qDraft.options] };
    setQuizQuestions(prev => ({ ...prev, [currentQuizCode]: [...(prev[currentQuizCode]||[]), newQ] }));
    setQDraft({ id: "", code: "", libelle: "", ordre: 1, options: [] });
  };
  const removeQuestion = (id: string) => setQuizQuestions(prev => ({ ...prev, [currentQuizCode]: (prev[currentQuizCode]||[]).filter(q => q.id !== id) }));

  const addOption = (qid: string) => setQuizQuestions(prev => ({
    ...prev,
    [currentQuizCode]: (prev[currentQuizCode]||[]).map(q => q.id === qid ? { ...q, options: [...q.options, { id: crypto.randomUUID(), text: "", isCorrect: false, points: 0 }] } : q)
  }));
  const updateOption = (qid: string, oid: string, patch: Partial<OptionRow>) => setQuizQuestions(prev => ({
    ...prev,
    [currentQuizCode]: (prev[currentQuizCode]||[]).map(q => q.id === qid ? { ...q, options: q.options.map(o => o.id === oid ? { ...o, ...patch } : o) } : q)
  }));
  const removeOption = (qid: string, oid: string) => setQuizQuestions(prev => ({
    ...prev,
    [currentQuizCode]: (prev[currentQuizCode]||[]).map(q => q.id === qid ? { ...q, options: q.options.filter(o => o.id !== oid) } : q)
  }));

  const saveQuestions = () => {
    persistQuestions(quizQuestions);
    setQOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="border-0 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded">
            <CardTitle className="flex items-center justify-between">
              <span>Gestion des quiz</span>
              <Button size="sm" className="bg-gradient-primary" onClick={openNew}>Nouveau</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-end mt-4">
              <Input className="w-64" placeholder="Filtrer (code/libellé)" value={filter} onChange={(e)=>setFilter(e.target.value)} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Coefficient</TableHead>
                  <TableHead>Ordre</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map(r => (
                  <TableRow key={r.code}>
                    <TableCell>{r.code}</TableCell>
                    <TableCell>{r.libelle}</TableCell>
                    <TableCell>{r.coefficient}</TableCell>
                    <TableCell>{r.ordre}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={()=>openEdit(r)}>Modifier</Button>
                      <Button size="sm" onClick={()=>openQuestions(r.code)}>Questions</Button>
                      <Button size="sm" variant="destructive" onClick={()=>remove(r.code)}>Supprimer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Total: {displayed.length}</TableCaption>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{mode === "new" ? "Nouveau quiz" : "Modifier quiz"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input value={draft.code} onChange={(e)=>setDraft(prev=>({ ...prev, code: e.target.value }))} disabled={mode==='edit'} />
              </div>
              <div className="space-y-1">
                <Label>Libellé</Label>
                <Input value={draft.libelle} onChange={(e)=>setDraft(prev=>({ ...prev, libelle: e.target.value }))} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Description</Label>
                <Input value={draft.description} onChange={(e)=>setDraft(prev=>({ ...prev, description: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Coefficient</Label>
                <Input type="number" value={draft.coefficient} onChange={(e)=>setDraft(prev=>({ ...prev, coefficient: Number(e.target.value)||0 }))} />
              </div>
              <div className="space-y-1">
                <Label>Durée max (min)</Label>
                <Input type="number" value={draft.dureeMax} onChange={(e)=>setDraft(prev=>({ ...prev, dureeMax: Number(e.target.value)||0 }))} />
              </div>
              <div className="space-y-1">
                <Label>Début</Label>
                <Input type="datetime-local" value={draft.dateDebut} onChange={(e)=>setDraft(prev=>({ ...prev, dateDebut: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Fin</Label>
                <Input type="datetime-local" value={draft.dateFin} onChange={(e)=>setDraft(prev=>({ ...prev, dateFin: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Ordre</Label>
                <Input type="number" value={draft.ordre} onChange={(e)=>setDraft(prev=>({ ...prev, ordre: Number(e.target.value)||0 }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={()=>setOpen(false)}>Annuler</Button>
              <Button className="bg-gradient-primary" onClick={save}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Questions dialog */}
        <Dialog open={qOpen} onOpenChange={setQOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Questions - {currentQuizCode}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input placeholder="Code question" value={qDraft.code} onChange={(e)=>setQDraft(prev=>({ ...prev, code: e.target.value }))} />
                <Input placeholder="Libellé" value={qDraft.libelle} onChange={(e)=>setQDraft(prev=>({ ...prev, libelle: e.target.value }))} />
                <Input type="number" placeholder="Ordre" value={qDraft.ordre} onChange={(e)=>setQDraft(prev=>({ ...prev, ordre: Number(e.target.value)||0 }))} />
                <div className="flex justify-end"><Button className="bg-gradient-primary" onClick={addQuestion}>Ajouter</Button></div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Énoncé</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(quizQuestions[currentQuizCode] || []).map(q => (
                    <TableRow key={q.id}>
                      <TableCell>{q.code}</TableCell>
                      <TableCell>{q.libelle}</TableCell>
                      <TableCell>{q.ordre}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="outline" onClick={()=>addOption(q.id)}>Réponse +</Button>
                        <Button size="sm" variant="destructive" onClick={()=>removeQuestion(q.id)}>Supprimer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {(quizQuestions[currentQuizCode] || []).map(q => (
                <div key={q.id} className="space-y-3 p-3 bg-muted/40 rounded">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Réponses pour {q.code}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Points max: {Math.max(0, ...(q.options.length ? q.options.map(o => Number(o.points)||0) : [0]))}
                    </div>
                  </div>
                  {q.options.map(o => (
                    <div key={o.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-6">
                        <Input placeholder="Libellé réponse" value={o.text} onChange={(e)=>updateOption(q.id, o.id, { text: e.target.value })} />
                      </div>
                      <div className="md:col-span-3">
                        <Button
                          variant={o.isCorrect ? "default" : "outline"}
                          className={o.isCorrect ? "bg-gradient-primary w-full" : "w-full"}
                          onClick={()=>updateOption(q.id, o.id, { isCorrect: !o.isCorrect })}
                        >
                        {o.isCorrect ? "Bonne réponse" : "Marquer correct"}
                      </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Input type="number" placeholder="Points" value={o.points} onChange={(e)=>updateOption(q.id, o.id, { points: Number(e.target.value)||0 })} />
                    </div>
                      <div className="md:col-span-1 flex justify-end">
                      <Button variant="outline" onClick={()=>removeOption(q.id, o.id)}>Supprimer</Button>
                    </div>
                  </div>
                ))}
              </div>
              ))}
              <div className="flex justify-end">
                <Button className="bg-gradient-primary" onClick={saveQuestions}>Enregistrer</Button>
              </div>
        </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}


