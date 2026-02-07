"use client";

import { useState } from "react";
import { createParent, deleteParent } from "@/actions/parent.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type ParentData = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  profession: string | null;
  user: { email: string };
  children: { student: { firstName: string; lastName: string } }[];
};

type StudentOption = {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
};

export function ParentsClient({ parents, students }: { parents: ParentData[]; students: StudentOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const columns: ColumnDef<ParentData>[] = [
    { accessorKey: "lastName", header: "Nom" },
    { accessorKey: "firstName", header: "Prenom" },
    { accessorKey: "phone", header: "Telephone" },
    { id: "email", header: "Email", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.user.email}</span> },
    { id: "profession", header: "Profession", cell: ({ row }) => row.original.profession || "-" },
    {
      id: "children",
      header: "Enfants",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.children.map((c) => `${c.student.lastName} ${c.student.firstName}`).join(", ") || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <form action={async () => { await deleteParent(row.original.id); }}>
          <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </form>
      ),
    },
  ];

  function toggleStudent(id: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await createParent({
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      phone: form.get("phone") as string,
      profession: (form.get("profession") as string) || undefined,
      address: (form.get("address") as string) || undefined,
      studentIds: selectedStudentIds.length > 0 ? selectedStudentIds : undefined,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Parent cree avec succes");
      setOpen(false);
      setSelectedStudentIds([]);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouveau parent</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Ajouter un parent</DialogTitle></DialogHeader>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telephone</Label>
                  <Input name="phone" placeholder="+237..." required />
                </div>
                <div className="space-y-2">
                  <Label>Profession (optionnel)</Label>
                  <Input name="profession" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adresse (optionnel)</Label>
                <Input name="address" />
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

            {students.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Enfants (optionnel)</h3>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                  {students.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(s.id)}
                        onChange={() => toggleStudent(s.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{s.lastName} {s.firstName}</span>
                      <span className="text-xs text-muted-foreground font-mono">{s.matricule}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation en cours..." : "Creer le parent"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={parents} searchKey="lastName" searchPlaceholder="Chercher un parent..." />
    </div>
  );
}
