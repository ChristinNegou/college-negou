"use client";

import { useState } from "react";
import { createStudent, deleteStudent } from "@/actions/student.actions";
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

type Student = {
  id: string; matricule: string; firstName: string; lastName: string; gender: string;
  user: { email: string };
  enrollments: { class: { name: string } }[];
};
type ClassData = { id: string; name: string };

export function StudentsClient({ students, classes, currentYearId }: { students: Student[]; classes: ClassData[]; currentYearId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Student>[] = [
    { accessorKey: "matricule", header: "Matricule", cell: ({ row }) => <span className="font-mono text-sm">{row.original.matricule}</span> },
    { accessorKey: "lastName", header: "Nom" },
    { accessorKey: "firstName", header: "Prenom" },
    { accessorKey: "gender", header: "Sexe", cell: ({ row }) => <Badge variant="outline">{row.original.gender === "MALE" ? "M" : "F"}</Badge> },
    { id: "class", header: "Classe", cell: ({ row }) => row.original.enrollments[0]?.class?.name || "-" },
    { id: "email", header: "Email", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.user.email}</span> },
    {
      id: "actions",
      cell: ({ row }) => (
        <form action={async () => { await deleteStudent(row.original.id); }}>
          <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </form>
      ),
    },
  ];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await createStudent({
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      dateOfBirth: form.get("dateOfBirth") as string,
      gender: form.get("gender") as "MALE" | "FEMALE",
      placeOfBirth: form.get("placeOfBirth") as string,
      phone: form.get("phone") as string,
      classId: form.get("classId") as string || undefined,
      academicYearId: currentYearId || undefined,
      parentName: form.get("parentName") as string || undefined,
      parentPhone: form.get("parentPhone") as string || undefined,
      parentEmail: form.get("parentEmail") as string || undefined,
    });

    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success(`Eleve cree - Matricule: ${result?.data?.matricule}`);
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvel eleve</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Inscrire un eleve</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Informations personnelles</h3>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date de naissance</Label>
                  <Input name="dateOfBirth" type="date" required />
                </div>
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
                  <Label>Lieu de naissance</Label>
                  <Input name="placeOfBirth" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telephone</Label>
                <Input name="phone" placeholder="+237..." />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Compte utilisateur</h3>
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
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Inscription</h3>
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select name="classId">
                  <SelectTrigger><SelectValue placeholder="Choisir une classe..." /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Parent/Tuteur (optionnel)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom du parent</Label>
                  <Input name="parentName" />
                </div>
                <div className="space-y-2">
                  <Label>Telephone du parent</Label>
                  <Input name="parentPhone" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email du parent</Label>
                <Input name="parentEmail" type="email" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation en cours..." : "Creer l'eleve"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={students} searchKey="lastName" searchPlaceholder="Chercher un eleve..." />
    </div>
  );
}
