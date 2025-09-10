import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ParamItem = {
  code: string;
  libelle: string;
  ordre: number;
};

interface ParamListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialItems: ParamItem[];
}

export function ParamListDialog({ open, onOpenChange, title, initialItems }: ParamListDialogProps) {
  const [items, setItems] = useState<ParamItem[]>(() => [...initialItems].sort((a, b) => a.ordre - b.ordre));
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<ParamItem>({ code: "", libelle: "", ordre: items.length + 1 });
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const editingItem = useMemo(() => (editingCode ? items.find(i => i.code === editingCode) ?? null : null), [editingCode, items]);
  const [editDraft, setEditDraft] = useState<ParamItem | null>(null);
  const [filter, setFilter] = useState("");
  const displayed = useMemo(() => {
    if (!filter.trim()) return items;
    const q = filter.toLowerCase();
    return items.filter(i => i.code.toLowerCase().includes(q) || i.libelle.toLowerCase().includes(q));
  }, [items, filter]);

  const resetAdd = () => {
    setIsAdding(false);
    setNewItem({ code: "", libelle: "", ordre: items.length + 1 });
  };

  const startEdit = (code: string) => {
    const it = items.find(i => i.code === code);
    if (!it) return;
    setEditingCode(code);
    setEditDraft({ ...it });
  };

  const cancelEdit = () => {
    setEditingCode(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editDraft) return;
    setItems(prev => prev.map(i => (i.code === editingCode ? { ...editDraft, ordre: Number(editDraft.ordre) || 0 } : i)).sort((a, b) => a.ordre - b.ordre));
    setEditingCode(null);
    setEditDraft(null);
  };

  const removeItem = (code: string) => {
    setItems(prev => prev.filter(i => i.code !== code));
  };

  const addItem = () => {
    const codeExists = items.some(i => i.code.toLowerCase() === newItem.code.trim().toLowerCase());
    if (!newItem.code.trim() || !newItem.libelle.trim() || codeExists) return;
    const itemToAdd: ParamItem = { code: newItem.code.trim(), libelle: newItem.libelle.trim(), ordre: Number(newItem.ordre) || 0 };
    setItems(prev => [...prev, itemToAdd].sort((a, b) => a.ordre - b.ordre));
    resetAdd();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle>Liste des {title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Filtrer (code/libellé)" value={filter} onChange={(e)=>setFilter(e.target.value)} className="w-48" />
              <Button size="sm" className="bg-gradient-primary" onClick={() => setIsAdding(v => !v)}>
                {isAdding ? "Annuler" : "Nouveau"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {isAdding && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
            <Input placeholder="Code" value={newItem.code} onChange={(e) => setNewItem({ ...newItem, code: e.target.value })} />
            <Input placeholder="Libellé" className="sm:col-span-3" value={newItem.libelle} onChange={(e) => setNewItem({ ...newItem, libelle: e.target.value })} />
            <Input placeholder="Ordre" type="number" value={newItem.ordre} onChange={(e) => setNewItem({ ...newItem, ordre: Number(e.target.value) })} />
            <div className="sm:col-span-5 flex justify-end">
              <Button onClick={addItem}>Ajouter</Button>
            </div>
          </div>
        )}

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
            {displayed.map((it) => (
              <TableRow key={it.code}>
                <TableCell className="font-medium">
                  {editingItem && editingItem.code === it.code ? (
                    <Input value={editDraft?.code ?? ""} onChange={(e) => setEditDraft(prev => ({ ...(prev as ParamItem), code: e.target.value }))} />
                  ) : (
                    it.code
                  )}
                </TableCell>
                <TableCell>
                  {editingItem && editingItem.code === it.code ? (
                    <Input value={editDraft?.libelle ?? ""} onChange={(e) => setEditDraft(prev => ({ ...(prev as ParamItem), libelle: e.target.value }))} />
                  ) : (
                    it.libelle
                  )}
                </TableCell>
                <TableCell>
                  {editingItem && editingItem.code === it.code ? (
                    <Input type="number" value={editDraft?.ordre ?? 0} onChange={(e) => setEditDraft(prev => ({ ...(prev as ParamItem), ordre: Number(e.target.value) }))} />
                  ) : (
                    it.ordre
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editingItem && editingItem.code === it.code ? (
                    <>
                      <Button size="sm" onClick={saveEdit}>Enregistrer</Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEdit(it.code)}>Modifier</Button>
                      <Button size="sm" variant="destructive" onClick={() => removeItem(it.code)}>Supprimer</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>Total: {items.length}</TableCaption>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default ParamListDialog;


