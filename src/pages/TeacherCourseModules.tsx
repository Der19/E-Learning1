import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

type ModuleRow = { id: string; code: string; libelle: string };

export default function TeacherCourseModules() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const course = location.state?.course as { id: string; uvCode: string; titre: string } | undefined;
  const [rows, setRows] = useState<ModuleRow[]>([]);
  const [draft, setDraft] = useState<ModuleRow>({ id: "", code: "", libelle: "" });
  const [filter, setFilter] = useState("");

  const displayed = useMemo(() => rows.filter(r => !filter || r.code.toLowerCase().includes(filter.toLowerCase()) || r.libelle.toLowerCase().includes(filter.toLowerCase())), [rows, filter]);

  const add = () => {
    if (!draft.code.trim() || !draft.libelle.trim()) return;
    setRows(prev => [...prev, { id: crypto.randomUUID(), code: draft.code.trim(), libelle: draft.libelle.trim() }]);
    setDraft({ id: "", code: "", libelle: "" });
  };
  const remove = (mid: string) => setRows(prev => prev.filter(r => r.id !== mid));

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Modules du cours {course?.titre || id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Code module" value={draft.code} onChange={(e)=>setDraft(prev=>({ ...prev, code: e.target.value }))} />
              <Input placeholder="Libellé module" value={draft.libelle} onChange={(e)=>setDraft(prev=>({ ...prev, libelle: e.target.value }))} />
              <div className="flex justify-end"><Button className="bg-gradient-primary" onClick={add}>Ajouter</Button></div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={()=>navigate(-1)}>Retour</Button>
              <Input placeholder="Filtrer (code/libellé)" className="w-64" value={filter} onChange={(e)=>setFilter(e.target.value)} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{m.code}</TableCell>
                    <TableCell>{m.libelle}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={()=>remove(m.id)}>Supprimer</Button>
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


