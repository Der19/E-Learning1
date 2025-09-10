import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type Option = { id: string; text: string; isCorrect: boolean; points: number };
type Question = { id: string; text: string; options: Option[] };

export default function TeacherQuizzes() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [quizMeta, setQuizMeta] = useState({
    code: "",
    libelle: "",
    description: "",
    coefficient: 1,
    dateDebut: "",
    dateFin: "",
    dureeMax: 60,
    ordre: 1,
  });

  const addQuestion = () => {
    const q: Question = { id: crypto.randomUUID(), text: "", options: [
      { id: crypto.randomUUID(), text: "", isCorrect: false, points: 0 },
      { id: crypto.randomUUID(), text: "", isCorrect: false, points: 0 },
    ] };
    setQuestions(prev => [...prev, q]);
  };

  const removeQuestion = (qid: string) => {
    setQuestions(prev => prev.filter(q => q.id !== qid));
  };

  const updateQuestionText = (qid: string, text: string) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, text } : q));
  };

  const addOption = (qid: string) => {
    setQuestions(prev => prev.map(q => q.id === qid ? {
      ...q,
      options: [...q.options, { id: crypto.randomUUID(), text: "", isCorrect: false, points: 0 }]
    } : q));
  };

  const removeOption = (qid: string, oid: string) => {
    setQuestions(prev => prev.map(q => q.id === qid ? {
      ...q,
      options: q.options.filter(o => o.id !== oid)
    } : q));
  };

  const updateOption = (qid: string, oid: string, patch: Partial<Option>) => {
    setQuestions(prev => prev.map(q => q.id === qid ? {
      ...q,
      options: q.options.map(o => o.id === oid ? { ...o, ...patch } : o)
    } : q));
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.options.filter(o => o.isCorrect).reduce((s, o) => s + (o.points || 0), 0), 0);

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Button variant="outline" onClick={()=>setCreateOpen(true)}>Créer un quiz</Button>
            </div>
            <Input placeholder="Titre du quiz" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="flex items-center justify-between">
              <Button onClick={addQuestion} className="bg-gradient-primary">Ajouter une question</Button>
              <div className="text-sm text-muted-foreground">Points totaux (réponses correctes): {totalPoints}</div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau quiz</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Code" value={quizMeta.code} onChange={(e)=>setQuizMeta(prev=>({ ...prev, code: e.target.value }))} />
              <Input placeholder="Libellé" value={quizMeta.libelle} onChange={(e)=>setQuizMeta(prev=>({ ...prev, libelle: e.target.value }))} />
              <Textarea className="md:col-span-2" placeholder="Description" value={quizMeta.description} onChange={(e)=>setQuizMeta(prev=>({ ...prev, description: e.target.value }))} />
              <div className="space-y-1">
                <Label>Coefficient</Label>
                <Input type="number" value={quizMeta.coefficient} onChange={(e)=>setQuizMeta(prev=>({ ...prev, coefficient: Number(e.target.value)||0 }))} />
              </div>
              <div className="space-y-1">
                <Label>Durée max (minutes)</Label>
                <Input type="number" value={quizMeta.dureeMax} onChange={(e)=>setQuizMeta(prev=>({ ...prev, dureeMax: Number(e.target.value)||0 }))} />
              </div>
              <div className="space-y-1">
                <Label>Heure début</Label>
                <Input type="time" value={quizMeta.dateDebut} onChange={(e)=>setQuizMeta(prev=>({ ...prev, dateDebut: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Heure fin</Label>
                <Input type="time" value={quizMeta.dateFin} onChange={(e)=>setQuizMeta(prev=>({ ...prev, dateFin: e.target.value }))} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Ordre</Label>
                <Input type="number" value={quizMeta.ordre} onChange={(e)=>setQuizMeta(prev=>({ ...prev, ordre: Number(e.target.value)||0 }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={()=>setCreateOpen(false)}>Annuler</Button>
              <Button className="bg-gradient-primary" onClick={()=>{
                setCreateOpen(false);
                setTitle(quizMeta.libelle || title);
                toast({ title: "Quiz créé", description: quizMeta.libelle || quizMeta.code || "Nouveau quiz" });
              }}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>

        {questions.map((q, qi) => (
          <Card key={q.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question {qi + 1}</CardTitle>
                <Button variant="destructive" size="sm" onClick={()=>removeQuestion(q.id)}>Supprimer</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Énoncé de la question" value={q.text} onChange={(e)=>updateQuestionText(q.id, e.target.value)} />

              <div className="space-y-3">
                {q.options.map((o, oi) => (
                  <div key={o.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-6">
                      <Input placeholder={`Proposition ${oi + 1}`} value={o.text} onChange={(e)=>updateOption(q.id, o.id, { text: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <Button variant={o.isCorrect ? "default" : "outline"} className={o.isCorrect ? "bg-gradient-primary" : ""} onClick={()=>updateOption(q.id, o.id, { isCorrect: !o.isCorrect })}>
                        {o.isCorrect ? "Bonne réponse" : "Marquer correct"}
                      </Button>
                    </div>
                    <div className="md:col-span-2">
                      <Input type="number" placeholder="Points" value={o.points} onChange={(e)=>updateOption(q.id, o.id, { points: Number(e.target.value) || 0 })} />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button variant="outline" onClick={()=>removeOption(q.id, o.id)}>Supprimer</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={()=>addOption(q.id)}>Ajouter une proposition</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            className="bg-gradient-accent"
            onClick={() => {
              toast({
                title: "Quiz enregistré",
                description: title ? `"${title}" sauvegardé (temporaire)` : "Brouillon sauvegardé (temporaire)",
              });
              navigate("/teacher/quizzes/preview", { state: { title, questions, meta: quizMeta } });
            }}
          >
            Enregistrer (front-only)
          </Button>
        </div>
      </main>
    </div>
  );
}


