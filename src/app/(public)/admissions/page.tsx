import { SCHOOL_NAME, LEVELS } from "@/config/cameroon-education";
import { AdmissionsForm } from "./form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: `Admissions - ${SCHOOL_NAME}`,
  description: "Conditions d'admission et formulaire de preinscription en ligne.",
};

export default function AdmissionsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Admissions</h1>
          <p className="text-lg text-muted-foreground">
            Rejoignez le College Polyvalent Negou
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Conditions d&apos;admission</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Dossier scolaire des deux dernieres annees",
                    "Certificat de naissance ou jugement suppletif",
                    "4 photos d'identite recentes",
                    "Certificat medical de moins de 3 mois",
                    "Frais de dossier",
                    "Entretien avec la direction (si necessaire)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Frais indicatifs</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Inscription</span>
                      <span className="font-medium">25 000 - 35 000 XAF</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Scolarite annuelle (College)</span>
                      <span className="font-medium">75 000 - 100 000 XAF</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Scolarite annuelle (Lycee)</span>
                      <span className="font-medium">100 000 - 150 000 XAF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">APEE</span>
                      <span className="font-medium">10 000 XAF</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    * La scolarite est payable en 3 tranches. Paiement par Mobile Money accepte.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Formulaire de preinscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdmissionsForm levels={LEVELS.map((l) => ({ value: l.value, label: l.label }))} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
