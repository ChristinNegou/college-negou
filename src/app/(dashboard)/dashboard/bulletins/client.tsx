"use client";

import { useState } from "react";
import { generateBulletins, getBulletins } from "@/actions/bulletin.actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileBarChart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BulletinDownloadButton } from "@/components/pdf/bulletin-download-button";
import type { BulletinPDFData } from "@/components/pdf/bulletin-pdf";

type ClassData = { id: string; name: string };
type Year = { id: string; name: string; terms: { id: string; name: string; sequenceNumber: number }[] };

type Bulletin = {
  id: string; generalAverage: number | null; rank: number | null; totalStudents: number | null;
  classAverage: number | null; teacherComment: string | null; principalComment: string | null;
  student: { firstName: string; lastName: string; matricule: string };
  term: { name: string; academicYear: { name: string } };
  subjectResults: {
    id: string; average: number; coefficient: number; total: number;
    classAverage: number | null; classMin: number | null; classMax: number | null;
    appreciation: string | null; teacherName: string | null;
    classSubject: { subject: { name: string; category: string } };
  }[];
};

export function BulletinsClient({ classes, years }: { classes: ClassData[]; years: Year[] }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);

  const year = years.find((y) => y.id === selectedYear);
  const terms = year?.terms || [];

  async function handleGenerate() {
    if (!selectedClass || !selectedTerm) {
      toast.error("Selectionnez une classe et un trimestre");
      return;
    }
    setGenerating(true);
    const result = await generateBulletins(selectedClass, selectedTerm);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(`${result.data?.count ?? 0} bulletins generes`);
      handleLoad();
    }
    setGenerating(false);
  }

  async function handleLoad() {
    if (!selectedClass || !selectedTerm) return;
    setLoading(true);
    const data = await getBulletins(selectedClass, selectedTerm);
    setBulletins(data as unknown as Bulletin[]);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Annee scolaire</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {years.map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
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
              <Label>Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileBarChart className="mr-2 h-4 w-4" />}
                Generer
              </Button>
              <Button variant="outline" onClick={handleLoad} disabled={loading}>Charger</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {bulletins.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Bulletins ({bulletins.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rang</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prenom</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Moy. Classe</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulletins.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell><Badge variant="outline">{b.rank}/{b.totalStudents}</Badge></TableCell>
                    <TableCell className="font-mono text-sm">{b.student.matricule}</TableCell>
                    <TableCell className="font-medium">{b.student.lastName}</TableCell>
                    <TableCell>{b.student.firstName}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${(b.generalAverage || 0) >= 10 ? "text-green-600" : "text-red-600"}`}>
                        {b.generalAverage?.toFixed(2)}/20
                      </span>
                    </TableCell>
                    <TableCell>{b.classAverage?.toFixed(2)}/20</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBulletin(b)}>Detail</Button>
                        <BulletinDownloadButton data={b as unknown as BulletinPDFData} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedBulletin} onOpenChange={() => setSelectedBulletin(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBulletin && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>
                    Bulletin - {selectedBulletin.student.lastName} {selectedBulletin.student.firstName}
                  </DialogTitle>
                  <BulletinDownloadButton
                    data={selectedBulletin as unknown as BulletinPDFData}
                    variant="outline"
                    label="Telecharger PDF"
                  />
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><strong>Rang:</strong> {selectedBulletin.rank}/{selectedBulletin.totalStudents}</div>
                  <div><strong>Moyenne:</strong> {selectedBulletin.generalAverage?.toFixed(2)}/20</div>
                  <div><strong>Moy. Classe:</strong> {selectedBulletin.classAverage?.toFixed(2)}/20</div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matiere</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Coeff</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Moy. Classe</TableHead>
                      <TableHead>Min</TableHead>
                      <TableHead>Max</TableHead>
                      <TableHead>Appreciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBulletin.subjectResults.map((sr) => (
                      <TableRow key={sr.id}>
                        <TableCell className="font-medium">{sr.classSubject.subject.name}</TableCell>
                        <TableCell className={sr.average >= 10 ? "text-green-600" : "text-red-600"}>
                          {sr.average.toFixed(2)}
                        </TableCell>
                        <TableCell>{sr.coefficient}</TableCell>
                        <TableCell>{sr.total.toFixed(2)}</TableCell>
                        <TableCell>{sr.classAverage?.toFixed(2)}</TableCell>
                        <TableCell>{sr.classMin?.toFixed(2)}</TableCell>
                        <TableCell>{sr.classMax?.toFixed(2)}</TableCell>
                        <TableCell><Badge variant="secondary">{sr.appreciation}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
