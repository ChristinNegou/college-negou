"use client";

import { useState } from "react";
import { createFeeStructure, deleteFeeStructure } from "@/actions/payment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LEVELS, FEE_TYPE_LABELS } from "@/config/cameroon-education";

type Fee = { id: string; level: string; feeType: string; amount: number; description: string | null };
type Year = { id: string; name: string };

const feeTypes = Object.entries(FEE_TYPE_LABELS);

const columns: ColumnDef<Fee>[] = [
  { accessorKey: "level", header: "Niveau" },
  { accessorKey: "feeType", header: "Type", cell: ({ row }) => <Badge variant="secondary">{FEE_TYPE_LABELS[row.original.feeType] || row.original.feeType}</Badge> },
  { accessorKey: "amount", header: "Montant (XAF)", cell: ({ row }) => <span className="font-mono">{new Intl.NumberFormat("fr-FR").format(row.original.amount)} XAF</span> },
  { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description || "-" },
  {
    id: "actions",
    cell: ({ row }) => (
      <form action={async () => { await deleteFeeStructure(row.original.id); }}>
        <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </form>
    ),
  },
];

export function FeesClient({ fees, years, currentYearId }: { fees: Fee[]; years: Year[]; currentYearId: string }) {
  const [open, setOpen] = useState(false);
  const [yearId, setYearId] = useState(currentYearId);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createFeeStructure({
      academicYearId: yearId,
      level: form.get("level") as string,
      feeType: form.get("feeType") as string,
      amount: parseInt(form.get("amount") as string),
      description: form.get("description") as string,
    });
    toast.success("Frais cree");
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Ajouter des frais</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveaux frais</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
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
                <Label>Type de frais</Label>
                <Select name="feeType" required>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    {feeTypes.map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Montant (XAF)</Label>
                <Input name="amount" type="number" min={0} step={50} required placeholder="50000" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input name="description" placeholder="Optionnel" />
              </div>
              <Button type="submit" className="w-full">Creer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={fees} searchKey="level" searchPlaceholder="Filtrer par niveau..." />
    </div>
  );
}
