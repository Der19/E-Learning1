import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { quizzesActifs } from "@/lib/adminData";
import { useNavigate } from "react-router-dom";

export default function StudentQuizzesList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = useMemo(() => quizzesActifs.filter(q => q.actif && (!search || q.titre.toLowerCase().includes(search.toLowerCase()))), [search]);
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <Input placeholder="Rechercher un quiz" value={search} onChange={(e)=>setSearch(e.target.value)} className="max-w-sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(q => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.titre}</TableCell>
                    <TableCell>{q.questions.length}</TableCell>
                    <TableCell>
                      <Button onClick={()=>navigate(`/student/quizzes/${q.id}`)} className="bg-gradient-primary">Commencer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}




