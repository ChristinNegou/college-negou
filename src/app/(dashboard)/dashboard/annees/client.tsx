"use client";

import { useState } from "react";
import { createAcademicYear, setCurrentYear, deleteAcademicYear } from "@/actions/academic-year.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Star } from "lucide-react";

type AcademicYear = {
  id: string; name: string; startDate: string; endDate: string; isCurrent: boolean;
  terms: { id: string; name: string; sequenceNumber: number }[];
};

export function AcademicYearsClient({ years }: { years: AcademicYear[] }) {
  const [open, setOpen] = useState(false);

  async function handleCreate(formData: FormData) {
    await createAcademicYear(formData);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvelle annee</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Creer une annee scolaire</DialogTitle></DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom (ex: 2024-2025)</Label>
              <Input id="name" name="name" placeholder="2024-2025" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de debut</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Creer</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {years.map((year) => (
          <Card key={year.id} className={year.isCurrent ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{year.name}</CardTitle>
              {year.isCurrent && <Badge>Annee en cours</Badge>}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {year.terms.map((t) => t.name).join(" | ")}
              </div>
              <div className="flex gap-2">
                {!year.isCurrent && (
                  <form action={async () => { await setCurrentYear(year.id); }}>
                    <Button type="submit" variant="outline" size="sm">
                      <Star className="mr-1 h-3 w-3" />Definir courante
                    </Button>
                  </form>
                )}
                <form action={async () => { await deleteAcademicYear(year.id); }}>
                  <Button type="submit" variant="destructive" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
