import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useLocation, Navigate } from "react-router-dom";

type Option = { id: string; text: string; isCorrect: boolean; points: number };
type Question = { id: string; text: string; options: Option[] };

export default function TeacherQuizPreview() {
  const location = useLocation() as any;
  const state = location.state as { title: string; questions: Question[]; meta?: { code: string; libelle: string; description: string; coefficient: number; dateDebut: string; dateFin: string; dureeMax: number; ordre: number } } | undefined;
  if (!state) return <Navigate to="/teacher/quizzes" replace />;

  const total = state.questions.reduce((sum, q) => sum + q.options.filter(o => o.isCorrect).reduce((s, o) => s + (o.points || 0), 0), 0);

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prévisualisation du quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold mb-1">{state.title || state.meta?.libelle || "Sans titre"}</div>
            <div className="text-sm text-muted-foreground">Points totaux: {total}</div>
            {state.meta && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div><span className="font-medium">Code:</span> {state.meta.code || '-'}</div>
                <div className="md:col-span-2"><span className="font-medium">Libellé:</span> {state.meta.libelle || '-'}</div>
                <div><span className="font-medium">Ordre:</span> {state.meta.ordre}</div>
                <div className="md:col-span-4"><span className="font-medium">Description:</span> {state.meta.description || '-'}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {state.questions.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>Q{idx + 1}. {q.text || "(Énoncé vide)"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposition</TableHead>
                    <TableHead>Correct</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {q.options.map(o => (
                    <TableRow key={o.id}>
                      <TableCell>{o.text || "(vide)"}</TableCell>
                      <TableCell>{o.isCorrect ? "Oui" : "Non"}</TableCell>
                      <TableCell>{o.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}




