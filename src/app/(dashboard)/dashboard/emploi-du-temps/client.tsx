"use client";

import { useState, useEffect } from "react";
import { getTimetableSlots, createTimetableSlot, deleteTimetableSlot } from "@/actions/timetable.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DAYS_OF_WEEK, TIMETABLE_SLOTS } from "@/config/cameroon-education";
import type { DayOfWeek } from "@prisma/client";

type ClassData = { id: string; name: string };
type Slot = { id: string; subjectName: string; teacherName: string; dayOfWeek: string; startTime: string; endTime: string; room: string | null };

export function TimetableClient({ classes }: { classes: ClassData[] }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedClass) {
      getTimetableSlots(selectedClass).then((s) => setSlots(s as Slot[]));
    }
  }, [selectedClass]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createTimetableSlot({
      classId: selectedClass,
      subjectName: form.get("subjectName") as string,
      teacherName: form.get("teacherName") as string,
      dayOfWeek: form.get("dayOfWeek") as DayOfWeek,
      startTime: form.get("startTime") as string,
      endTime: form.get("endTime") as string,
      room: form.get("room") as string || undefined,
    });
    toast.success("Creneau ajoute");
    setOpen(false);
    getTimetableSlots(selectedClass).then((s) => setSlots(s as Slot[]));
  }

  async function handleDelete(id: string) {
    await deleteTimetableSlot(id);
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  const dayLabel = (d: string) => DAYS_OF_WEEK.find((dw) => dw.value === d)?.label || d;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="space-y-2 w-64">
          <Label>Classe</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger><SelectValue placeholder="Choisir une classe..." /></SelectTrigger>
            <SelectContent>
              {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {selectedClass && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Ajouter un creneau</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Jour</Label>
                  <Select name="dayOfWeek" required>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heure debut</Label>
                    <Select name="startTime" required>
                      <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                      <SelectContent>
                        {TIMETABLE_SLOTS.filter((s) => !s.label.includes("Pause")).map((s) => (
                          <SelectItem key={s.start} value={s.start}>{s.start}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Heure fin</Label>
                    <Select name="endTime" required>
                      <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                      <SelectContent>
                        {TIMETABLE_SLOTS.filter((s) => !s.label.includes("Pause")).map((s) => (
                          <SelectItem key={s.end} value={s.end}>{s.end}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Matiere</Label>
                  <Input name="subjectName" required placeholder="Mathematiques" />
                </div>
                <div className="space-y-2">
                  <Label>Enseignant</Label>
                  <Input name="teacherName" required placeholder="M. Dupont" />
                </div>
                <div className="space-y-2">
                  <Label>Salle</Label>
                  <Input name="room" placeholder="Salle 101" />
                </div>
                <Button type="submit" className="w-full">Ajouter</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {selectedClass && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-2">
              <div className="p-2 font-medium text-sm text-center">Heure</div>
              {DAYS_OF_WEEK.map((d) => (
                <div key={d.value} className="p-2 font-medium text-sm text-center bg-muted rounded-t-lg">{d.label}</div>
              ))}
              {TIMETABLE_SLOTS.filter((ts) => !ts.label.includes("Pause")).map((ts) => (
                <>
                  <div key={ts.start} className="p-2 text-xs text-center border-t">
                    {ts.start}<br />{ts.end}
                  </div>
                  {DAYS_OF_WEEK.map((d) => {
                    const slot = slots.find((s) => s.dayOfWeek === d.value && s.startTime === ts.start);
                    return (
                      <div key={`${d.value}-${ts.start}`} className="relative border-t p-1 min-h-[60px]">
                        {slot ? (
                          <div className="rounded bg-primary/10 p-1.5 text-xs">
                            <p className="font-medium">{slot.subjectName}</p>
                            <p className="text-muted-foreground">{slot.teacherName}</p>
                            {slot.room && <p className="text-muted-foreground">{slot.room}</p>}
                            <button onClick={() => handleDelete(slot.id)} className="absolute top-1 right-1 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
