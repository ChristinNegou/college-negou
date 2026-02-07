"use client";

import { useState } from "react";
import { createTeacher, deleteTeacher } from "@/actions/teacher.actions";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Teacher = {
  id: string; firstName: string; lastName: string; phone: string | null;
  gender: string; specialty: string | null;
  user: { email: string };
  assignments: { class: { name: string }; classSubject: { subject: { name: string } } }[];
};

const columns: ColumnDef<Teacher>[] = [
  { accessorKey: "lastName", header: "Nom" },
  { accessorKey: "firstName", header: "Prenom" },
  { accessorKey: "gender", header: "Sexe", cell: ({ row }) => <Badge variant="outline">{row.original.gender === "MALE" ? "M" : "F"}</Badge> },
  { accessorKey: "specialty", header: "Specialite", cell: ({ row }) => row.original.specialty || "-" },
  { accessorKey: "phone", header: "Telephone", cell: ({ row }) => row.original.phone || "-" },
  {
    id: "assignments",
    header: "Assignations",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.assignments.slice(0, 3).map((a, i) => (
          <Badge key={i} variant="secondary" className="text-xs">{a.class.name} - {a.classSubject.subject.name}</Badge>
        ))}
        {row.original.assignments.length > 3 && <Badge variant="outline">+{row.original.assignments.length - 3}</Badge>}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <form action={async () => { await deleteTeacher(row.original.id); }}>
        <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </form>
    ),
  },
];

export function TeachersClient({ teachers }: { teachers: Teacher[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await createTeacher({
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      phone: form.get("phone") as string,
      gender: form.get("gender") as "MALE" | "FEMALE",
      specialty: form.get("specialty") as string,
    });

    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Enseignant cree");
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvel enseignant</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Creer un enseignant</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input name="lastName" required />
              </div>
              <div className="space-y-2">
                <Label>Prenom</Label>
                <Input name="firstName" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sexe</Label>
                <Select name="gender" required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Masculin</SelectItem>
                    <SelectItem value="FEMALE">Feminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Specialite</Label>
                <Input name="specialty" placeholder="Mathematiques" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Telephone</Label>
              <Input name="phone" placeholder="+237..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input name="password" type="password" required minLength={6} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation..." : "Creer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={teachers} searchKey="lastName" searchPlaceholder="Chercher un enseignant..." />
    </div>
  );
}
