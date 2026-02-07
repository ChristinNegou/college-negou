"use client";

import { useState } from "react";
import { createAnnouncement, deleteAnnouncement } from "@/actions/announcement.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@prisma/client";

type Announcement = {
  id: string; title: string; content: string; targetRole: string | null;
  publishedAt: string; targetClass: { name: string } | null;
};
type ClassData = { id: string; name: string };

const roleLabels: Record<string, string> = {
  ADMIN: "Admins", TEACHER: "Enseignants", STUDENT: "Eleves", PARENT: "Parents",
};

export function AnnouncementsClient({
  announcements, classes, isAdmin,
}: {
  announcements: Announcement[]; classes: ClassData[]; isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const targetRole = form.get("targetRole") as string;
    const targetClassId = form.get("targetClassId") as string;

    await createAnnouncement({
      title: form.get("title") as string,
      content: form.get("content") as string,
      targetRole: targetRole && targetRole !== "ALL" ? (targetRole as UserRole) : undefined,
      targetClassId: targetClassId || undefined,
    });
    toast.success("Annonce publiee");
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nouvelle annonce</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Publier une annonce</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea name="content" rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cible (role)</Label>
                  <Select name="targetRole">
                    <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous</SelectItem>
                      <SelectItem value="STUDENT">Eleves</SelectItem>
                      <SelectItem value="TEACHER">Enseignants</SelectItem>
                      <SelectItem value="PARENT">Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classe specifique</Label>
                  <Select name="targetClassId">
                    <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les classes</SelectItem>
                      {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Publier</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <div className="mt-1 flex gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  {a.targetRole && <Badge variant="secondary">{roleLabels[a.targetRole] || a.targetRole}</Badge>}
                  {a.targetClass && <Badge variant="outline">{a.targetClass.name}</Badge>}
                </div>
              </div>
              {isAdmin && (
                <form action={async () => { await deleteAnnouncement(a.id); }}>
                  <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </form>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</p>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">Aucune annonce</div>
        )}
      </div>
    </div>
  );
}
