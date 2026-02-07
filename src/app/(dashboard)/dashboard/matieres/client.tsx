"use client";

import { useState } from "react";
import { createSubject, deleteSubject, seedDefaultSubjects } from "@/actions/subject.actions";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Subject = { id: string; name: string; code: string; category: string };

const categories = ["Sciences", "Lettres", "Langues", "Sciences Humaines", "Arts et Sport", "Technique"];

const columns: ColumnDef<Subject>[] = [
  { accessorKey: "name", header: "Matiere" },
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "category",
    header: "Categorie",
    cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <form action={async () => { await deleteSubject(row.original.id); }}>
        <Button type="submit" variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </form>
    ),
  },
];

export function SubjectsClient({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState(false);

  async function handleCreate(formData: FormData) {
    await createSubject(formData);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Ajouter une matiere</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle matiere</DialogTitle></DialogHeader>
            <form action={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" placeholder="Mathematiques" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" placeholder="MATH" required />
              </div>
              <div className="space-y-2">
                <Label>Categorie</Label>
                <Select name="category" required>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Creer</Button>
            </form>
          </DialogContent>
        </Dialog>
        <form action={async () => { await seedDefaultSubjects(); }}>
          <Button type="submit" variant="outline">
            <Download className="mr-2 h-4 w-4" />Charger matieres par defaut
          </Button>
        </form>
      </div>
      <DataTable columns={columns} data={subjects} searchKey="name" searchPlaceholder="Chercher une matiere..." />
    </div>
  );
}
