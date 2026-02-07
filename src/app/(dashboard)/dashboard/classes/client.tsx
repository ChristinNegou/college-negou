"use client";

import { useState } from "react";
import { createClass, deleteClass, addClassSubject, removeClassSubject, assignTeacher, removeTeacherAssignment } from "@/actions/class.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, BookOpen, UserPlus } from "lucide-react";
import { LEVELS } from "@/config/cameroon-education";

type ClassData = {
  id: string; name: string; level: string; section: string | null; capacity: number;
  classSubjects: { id: string; coefficient: number; subject: { id: string; name: string } }[];
  teacherAssignments: { id: string; teacher: { id: string; firstName: string; lastName: string }; classSubject: { id: string; subject: { name: string } } }[];
  _count: { enrollments: number };
};
type Subject = { id: string; name: string; code: string; category: string };
type Teacher = { id: string; firstName: string; lastName: string };

export function ClassesClient({ classes, subjects, teachers }: { classes: ClassData[]; subjects: Subject[]; teachers: Teacher[] }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [openTeacher, setOpenTeacher] = useState<string | null>(null);
  const [coeff, setCoeff] = useState("2");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCs, setSelectedCs] = useState("");

  async function handleCreateClass(formData: FormData) {
    await createClass(formData);
    setOpenCreate(false);
  }

  async function handleAddSubject(classId: string) {
    if (!selectedSubject) return;
    await addClassSubject(classId, selectedSubject, parseInt(coeff));
    setOpenSubject(null);
    setSelectedSubject("");
    setCoeff("2");
  }

  async function handleAssignTeacher(classId: string) {
    if (!selectedTeacher || !selectedCs) return;
    await assignTeacher(selectedTeacher, classId, selectedCs);
    setOpenTeacher(null);
    setSelectedTeacher("");
    setSelectedCs("");
  }

  return (
    <div className="space-y-4">
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvelle classe</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Creer une classe</DialogTitle></DialogHeader>
          <form action={handleCreateClass} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom complet (ex: 6eme A)</Label>
              <Input name="name" placeholder="6eme A" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select name="level" required>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input name="section" placeholder="A, B, C, D..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Capacite</Label>
              <Input name="capacity" type="number" defaultValue={60} />
            </div>
            <Button type="submit" className="w-full">Creer</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{cls.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{cls._count.enrollments} eleve(s) / {cls.capacity}</p>
              </div>
              <div className="flex gap-1">
                <Dialog open={openSubject === cls.id} onOpenChange={(o) => setOpenSubject(o ? cls.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><BookOpen className="h-3 w-3" /></Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Ajouter matiere - {cls.name}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger><SelectValue placeholder="Matiere..." /></SelectTrigger>
                        <SelectContent>
                          {subjects.filter((s) => !cls.classSubjects.some((cs) => cs.subject.id === s.id)).map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="space-y-2">
                        <Label>Coefficient</Label>
                        <Input type="number" min={1} max={10} value={coeff} onChange={(e) => setCoeff(e.target.value)} />
                      </div>
                      <Button onClick={() => handleAddSubject(cls.id)} className="w-full">Ajouter</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={openTeacher === cls.id} onOpenChange={(o) => setOpenTeacher(o ? cls.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><UserPlus className="h-3 w-3" /></Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Assigner enseignant - {cls.name}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <Select value={selectedCs} onValueChange={setSelectedCs}>
                        <SelectTrigger><SelectValue placeholder="Matiere..." /></SelectTrigger>
                        <SelectContent>
                          {cls.classSubjects.map((cs) => (
                            <SelectItem key={cs.id} value={cs.id}>{cs.subject.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                        <SelectTrigger><SelectValue placeholder="Enseignant..." /></SelectTrigger>
                        <SelectContent>
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.lastName} {t.firstName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => handleAssignTeacher(cls.id)} className="w-full">Assigner</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <form action={async () => { await deleteClass(cls.id); }}>
                  <Button type="submit" variant="destructive" size="sm"><Trash2 className="h-3 w-3" /></Button>
                </form>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Matieres</p>
                <div className="flex flex-wrap gap-1">
                  {cls.classSubjects.map((cs) => (
                    <Badge key={cs.id} variant="secondary" className="gap-1">
                      {cs.subject.name} (coeff {cs.coefficient})
                      <button onClick={() => removeClassSubject(cs.id)} className="ml-1 hover:text-destructive">&times;</button>
                    </Badge>
                  ))}
                  {cls.classSubjects.length === 0 && <span className="text-xs text-muted-foreground">Aucune matiere</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Enseignants</p>
                <div className="flex flex-wrap gap-1">
                  {cls.teacherAssignments.map((ta) => (
                    <Badge key={ta.id} variant="outline" className="gap-1">
                      {ta.teacher.lastName} - {ta.classSubject.subject.name}
                      <button onClick={() => removeTeacherAssignment(ta.id)} className="ml-1 hover:text-destructive">&times;</button>
                    </Badge>
                  ))}
                  {cls.teacherAssignments.length === 0 && <span className="text-xs text-muted-foreground">Aucun enseignant</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
