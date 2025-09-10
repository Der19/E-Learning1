import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { quizzesActifs } from "@/lib/adminData";
import { Checkbox } from "@/components/ui/checkbox";

export default function StudentQuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = useMemo(() => quizzesActifs.find(q => q.id === id), [id]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  if (!quiz) return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card><CardContent className="p-6">Quiz introuvable.</CardContent></Card>
      </main>
    </div>
  );

  const question = quiz.questions[index];

  const toggleAnswer = (qid: string, oid: string) => {
    setAnswers(prev => {
      const prevArr = prev[qid] || [];
      const exists = prevArr.includes(oid);
      const nextArr = exists ? prevArr.filter(x => x !== oid) : [...prevArr, oid];
      return { ...prev, [qid]: nextArr };
    });
  };

  const next = () => {
    if (index < quiz.questions.length - 1) setIndex(index + 1);
  };
  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };
  const finish = () => {
    // front-only score
    let score = 0;
    let maxPoints = 0;
    quiz.questions.forEach(q => {
      const selected = answers[q.id] || [];
      q.options.forEach(o => {
        if (o.isCorrect) maxPoints += o.points || 0;
        if (o.isCorrect && selected.includes(o.id)) score += o.points || 0;
      });
    });
    navigate("/student/quizzes/result", { state: { quizId: quiz.id, titre: quiz.titre, score, maxPoints } });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.titre}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Question {index + 1} / {quiz.questions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 p-3 rounded border border-border">
                <Checkbox checked={(answers[question.id] || []).includes(opt.id)} onCheckedChange={()=>toggleAnswer(question.id, opt.id)} />
                <span>{opt.text}</span>
              </label>
            ))}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prev} disabled={index === 0}>Précédent</Button>
              {index < quiz.questions.length - 1 ? (
                <Button className="bg-gradient-primary" onClick={next}>Suivant</Button>
              ) : (
                <Button className="bg-gradient-accent" onClick={finish}>Terminer</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}




