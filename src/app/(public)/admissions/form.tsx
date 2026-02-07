"use client";

import { useState } from "react";
import { createPreRegistration } from "@/actions/preregistration.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

type Level = { value: string; label: string };

export function AdmissionsForm({ levels }: { levels: Level[] }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await createPreRegistration({
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      dateOfBirth: form.get("dateOfBirth") as string,
      gender: form.get("gender") as "MALE" | "FEMALE",
      placeOfBirth: form.get("placeOfBirth") as string,
      previousSchool: form.get("previousSchool") as string,
      desiredLevel: form.get("desiredLevel") as string,
      parentName: form.get("parentName") as string,
      parentPhone: form.get("parentPhone") as string,
      parentEmail: form.get("parentEmail") as string,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      setSubmitted(true);
      toast.success("Preinscription envoyee avec succes !");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center space-y-4">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="text-lg font-semibold">Preinscription envoyee !</h3>
        <p className="text-muted-foreground">
          Nous avons bien recu votre demande. Nous vous contacterons bientot.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Nouvelle preinscription
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Informations de l&apos;eleve</h3>
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
            <Label>Date de naissance</Label>
            <Input name="dateOfBirth" type="date" required />
          </div>
          <div className="space-y-2">
            <Label>Sexe</Label>
            <Select name="gender" required>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculin</SelectItem>
                <SelectItem value="FEMALE">Feminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Lieu de naissance</Label>
          <Input name="placeOfBirth" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Classe souhaitee</Label>
            <Select name="desiredLevel" required>
              <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>
                {levels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ecole precedente</Label>
            <Input name="previousSchool" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Informations du parent</h3>
        <div className="space-y-2">
          <Label>Nom complet du parent</Label>
          <Input name="parentName" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Telephone</Label>
            <Input name="parentPhone" placeholder="+237..." required />
          </div>
          <div className="space-y-2">
            <Label>Email (optionnel)</Label>
            <Input name="parentEmail" type="email" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer la preinscription"}
      </Button>
    </form>
  );
}
