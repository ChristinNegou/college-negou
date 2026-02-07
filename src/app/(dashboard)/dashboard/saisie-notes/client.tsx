"use client";

import { useState, useEffect } from "react";
import { saveGrades, getStudentsByClass } from "@/actions/grade.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Save } from "lucide-react";

type Assignment = {
  id: string; classId: string; classSubjectId: string;
  class: { id: string; name: string };
  classSubject: { id: string; subject: { id: string; name: string } };
};
type Term = { id: string; name: string; sequenceNumber: number };
type Student = { id: string; firstName: string; lastName: string; matricule: string };

export function GradeEntryClient({
  teacherId, assignments, terms, academicYearId,
}: {
  teacherId: string; assignments: Assignment[]; terms: Term[]; academicYearId: string;
}) {
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [gradeType, setGradeType] = useState("DEVOIR");
  const [description, setDescription] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const assignment = assignments.find((a) => a.id === selectedAssignment);

  useEffect(() => {
    if (assignment && academicYearId) {
      getStudentsByClass(assignment.classId, academicYearId).then((s) => {
        setStudents(s as Student[]);
        setGrades({});
      });
    }
  }, [assignment, academicYearId]);

  async function handleSave() {
    if (!assignment || !selectedTerm || !description) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    const gradeData = Object.entries(grades)
      .filter(([, v]) => v !== "" && !isNaN(parseFloat(v)))
      .map(([studentId, value]) => ({ studentId, value: parseFloat(value) }));

    if (gradeData.length === 0) {
      toast.error("Aucune note a enregistrer");
      setLoading(false);
      return;
    }

    await saveGrades({
      classSubjectId: assignment.classSubjectId,
      termId: selectedTerm,
      teacherId,
      type: gradeType as "DEVOIR" | "INTERROGATION" | "COMPOSITION",
      description,
      grades: gradeData,
    });
    toast.success(`${gradeData.length} notes enregistrees`);
    setGrades({});
    setDescription("");
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Parametres</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Classe / Matiere</Label>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {assignments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.class.name} - {a.classSubject.subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trimestre</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {terms.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={gradeType} onValueChange={setGradeType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEVOIR">Devoir</SelectItem>
                  <SelectItem value="INTERROGATION">Interrogation</SelectItem>
                  <SelectItem value="COMPOSITION">Composition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Devoir N1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notes ({students.length} eleves)</CardTitle>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />{loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prenom</TableHead>
                  <TableHead className="w-32">Note /20</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm">{s.matricule}</TableCell>
                    <TableCell className="font-medium">{s.lastName}</TableCell>
                    <TableCell>{s.firstName}</TableCell>
                    <TableCell>
                      <Input
                        type="number" min="0" max="20" step="0.25"
                        value={grades[s.id] || ""}
                        onChange={(e) => setGrades((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        className="w-24" placeholder="--"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
