"use client";

import { useState } from "react";
import { createEnrollment, updateEnrollmentStatus, deleteEnrollment } from "@/actions/enrollment.actions";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Enrollment = {
  id: string; status: string;
  student: { id: string; firstName: string; lastName: string; matricule: string };
  class: { id: string; name: string };
  academicYear: { id: string; name: string };
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  TRANSFERRED: "bg-yellow-100 text-yellow-800",
  WITHDRAWN: "bg-red-100 text-red-800",
  GRADUATED: "bg-blue-100 text-blue-800",
};

export function EnrollmentsClient({
  enrollments, classes, students, years,
}: {
  enrollments: Enrollment[];
  classes: { id: string; name: string }[];
  students: { id: string; firstName: string; lastName: string; matricule: string }[];
  years: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [yearId, setYearId] = useState("");

  const columns: ColumnDef<Enrollment>[] = [
    { id: "matricule", header: "Matricule", cell: ({ row }) => <span className="font-mono text-sm">{row.original.student.matricule}</span> },
    { id: "student", header: "Eleve", cell: ({ row }) => `${row.original.student.lastName} ${row.original.student.firstName}` },
    { id: "class", header: "Classe", cell: ({ row }) => row.original.class.name },
    { id: "year", header: "Annee", cell: ({ row }) => row.original.academicYear.name },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <Badge className={statusColors[row.original.status]}>{row.original.status}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.status === "ACTIVE" && (
            <>
              <form action={async () => { await updateEnrollmentStatus(row.original.id, "TRANSFERRED"); }}>
                <Button type="submit" variant="ghost" size="sm" className="text-xs">Transferer</Button>
              </form>
              <form action={async () => { await updateEnrollmentStatus(row.original.id, "WITHDRAWN"); }}>
                <Button type="submit" variant="ghost" size="sm" className="text-xs">Retirer</Button>
              </form>
            </>
          )}
          <form action={async () => { await deleteEnrollment(row.original.id); }}>
            <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </form>
        </div>
      ),
    },
  ];

  async function handleCreate() {
    if (!studentId || !classId || !yearId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    await createEnrollment(studentId, classId, yearId);
    toast.success("Inscription creee");
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvelle inscription</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Inscrire un eleve</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Eleve</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.matricule})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Annee scolaire</Label>
              <Select value={yearId} onValueChange={setYearId}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {years.map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate} className="w-full">Inscrire</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={enrollments} searchKey="student" searchPlaceholder="Chercher..." />
    </div>
  );
}
