import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { uvs, cours, modulesCours } from "@/lib/adminData";
import { useNavigate } from "react-router-dom";

type CourseRow = { id: string; uvCode: string; titre: string; nbModules: number };

export default function TeacherCourses() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<CourseRow[]>(() =>
    cours.map(c => ({ id: c.code, uvCode: c.uvCode, titre: c.libelle, nbModules: modulesCours.filter(m => m.coursCode === c.code).length }))
  );
  const [filter, setFilter] = useState("");
  const displayed = useMemo(() => rows.filter(r => !filter || r.titre.toLowerCase().includes(filter.toLowerCase()) || r.uvCode.toLowerCase().includes(filter.toLowerCase())), [rows, filter]);

  const [draft, setDraft] = useState<CourseRow>({ id: "", uvCode: "", titre: "", nbModules: 0 });

  const add = () => {
    if (!draft.uvCode || !draft.titre.trim() || draft.nbModules <= 0) return;
    setRows(prev => [...prev, { ...draft, id: crypto.randomUUID(), titre: draft.titre.trim() }]);
    setDraft({ id: "", uvCode: "", titre: "", nbModules: 0 });
  };

  const remove = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des cours (par UV et modules)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Select value={draft.uvCode} onValueChange={(v)=>setDraft(prev=>({ ...prev, uvCode: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une UV" /></SelectTrigger>
                <SelectContent>
                  {uvs.map(u => (<SelectItem key={u.code} value={u.code}>{u.code} - {u.libelle}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input placeholder="Titre du cours" value={draft.titre} onChange={(e)=>setDraft(prev=>({ ...prev, titre: e.target.value }))} />
              <Input type="number" placeholder="Nombre de modules" value={draft.nbModules} onChange={(e)=>setDraft(prev=>({ ...prev, nbModules: Number(e.target.value)||0 }))} />
              <div className="md:col-span-2 flex justify-end">
                <Button className="bg-gradient-primary" onClick={add}>Ajouter</Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Input placeholder="Filtrer (UV/Titre)" className="w-64" value={filter} onChange={(e)=>setFilter(e.target.value)} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UV</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.uvCode}</TableCell>
                    <TableCell>{r.titre}</TableCell>
                    <TableCell>{r.nbModules}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={()=>navigate(`/teacher/courses/${r.id}/modules`, { state: { course: r } })}>Ajouter modules</Button>
                        <Button size="sm" variant="destructive" onClick={()=>remove(r.id)}>Supprimer</Button>
                      </div>
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


