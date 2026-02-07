import { SCHOOL_NAME, LEVELS } from "@/config/cameroon-education";
import { AdmissionsForm } from "./form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = {
  title: `Admissions - ${SCHOOL_NAME}`,
  description: "Conditions d'admission et formulaire de preinscription en ligne.",
};

const conditions = [
  "Dossier scolaire des deux dernieres annees",
  "Certificat de naissance ou jugement suppletif",
  "4 photos d'identite recentes",
  "Certificat medical de moins de 3 mois",
  "Frais de dossier",
  "Entretien avec la direction (si necessaire)",
];

const frais = [
  { label: "Inscription", value: "25 000 - 35 000 XAF" },
  { label: "Scolarite annuelle (College)", value: "75 000 - 100 000 XAF" },
  { label: "Scolarite annuelle (Lycee)", value: "100 000 - 150 000 XAF" },
  { label: "APEE", value: "10 000 XAF" },
];

export default function AdmissionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            <span className="gradient-text">Admissions</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Rejoignez le College Polyvalent Negou
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {/* Timeline steps */}
              <ScrollReveal>
                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                  <CardHeader><CardTitle>Conditions d&apos;admission</CardTitle></CardHeader>
                  <CardContent>
                    <div className="relative space-y-0">
                      {conditions.map((item, i) => (
                        <div key={i} className="group relative flex items-start gap-4 pb-6 last:pb-0">
                          {/* Vertical line */}
                          {i < conditions.length - 1 && (
                            <div className="absolute left-[15px] top-8 h-full w-0.5 bg-gradient-to-b from-primary/30 to-primary/10" />
                          )}
                          {/* Step circle */}
                          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110">
                            {i + 1}
                          </div>
                          <span className="pt-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Fees table */}
              <ScrollReveal delay={100}>
                <Card className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-accent to-primary" />
                  <CardHeader><CardTitle>Frais indicatifs</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-lg border">
                      {frais.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-primary/5 ${
                            i < frais.length - 1 ? "border-b" : ""
                          }`}
                        >
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      La scolarite est payable en 3 tranches. Paiement par Mobile Money accepte.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal direction="right">
              <Card className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                <CardHeader>
                  <CardTitle>Formulaire de preinscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdmissionsForm levels={LEVELS.map((l) => ({ value: l.value, label: l.label }))} />
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
