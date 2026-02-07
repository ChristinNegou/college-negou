import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SCHOOL_NAME, SCHOOL_CITY, SCHOOL_MOTTO } from "@/config/cameroon-education";
import { Target, Eye, BookOpen, Trophy } from "lucide-react";

export const metadata = {
  title: `A Propos - ${SCHOOL_NAME}`,
  description: `Decouvrez l'histoire, la mission et les valeurs du ${SCHOOL_NAME} a ${SCHOOL_CITY}.`,
};

export default function AProposPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">A Propos de notre College</h1>
          <p className="text-lg text-muted-foreground">{SCHOOL_MOTTO}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Notre histoire</h2>
              <p className="text-muted-foreground leading-relaxed">
                Le {SCHOOL_NAME} est un etablissement d&apos;enseignement secondaire situe a {SCHOOL_CITY},
                dans la Region de l&apos;Ouest du Cameroun. Fonde avec la vision de fournir une education
                de qualite accessible a tous, notre college s&apos;est impose comme une reference dans
                la region grace a l&apos;excellence de son enseignement et a ses resultats aux examens officiels.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Former des citoyens responsables, competents et ouverts sur le monde,
                  en offrant un enseignement de qualite conforme aux programmes officiels
                  du Cameroun.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" /> Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Devenir l&apos;etablissement de reference de la Region de l&apos;Ouest pour
                  l&apos;excellence academique et la formation integrale de la jeunesse.
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Nos valeurs</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: BookOpen, title: "Excellence", desc: "Nous visons les plus hauts standards academiques" },
                  { icon: Trophy, title: "Discipline", desc: "Le respect des regles forge le caractere" },
                  { icon: Target, title: "Reussite", desc: "Chaque eleve a le potentiel de reussir" },
                ].map((v, i) => (
                  <div key={i} className="rounded-lg border p-6 text-center">
                    <v.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                    <h3 className="mb-2 font-semibold">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Administration</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { role: "Proviseur", name: "M. / Mme le Proviseur" },
                  { role: "Censeur", name: "M. / Mme le Censeur" },
                  { role: "Surveillant General", name: "M. / Mme le SG" },
                  { role: "Intendant", name: "M. / Mme l'Intendant" },
                ].map((p, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-primary">{p.role}</p>
                    <p className="text-muted-foreground">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
