import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

export default function StudentQuizResult() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const state = location.state as { quizId: string; titre?: string; score: number; maxPoints: number } | undefined;

  if (!state) return <Navigate to="/student/quizzes" replace />;

  const percent = state.maxPoints > 0 ? Math.round((state.score / state.maxPoints) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Résultat du quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-lg font-semibold">{state.titre || state.quizId}</div>
            <div className="text-muted-foreground">Score: {state.score} / {state.maxPoints} ({percent}%)</div>
            <div className="flex gap-2 pt-2">
              <Button className="bg-gradient-primary" onClick={()=>navigate("/student/quizzes")}>Retour aux quiz</Button>
              <Button variant="outline" onClick={()=>navigate("/student")}>Aller au tableau de bord</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


