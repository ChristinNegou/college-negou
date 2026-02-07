import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SCHOOL_NAME, SUBJECTS, LEVELS, SERIES } from "@/config/cameroon-education";

export const metadata = {
  title: `Programmes - ${SCHOOL_NAME}`,
  description: "Decouvrez nos programmes du college (6e-3e) et du lycee (2nde-Tle) avec les series A, C et D.",
};

export default function ProgrammesPage() {
  const collegeLevels = LEVELS.filter((l) => l.cycle === "college");
  const lyceeLevels = LEVELS.filter((l) => l.cycle === "lycee");
  const categories = [...new Set(SUBJECTS.map((s) => s.category))];

  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Nos Programmes</h1>
          <p className="text-lg text-muted-foreground">
            De la 6eme a la Terminale - Systeme educatif francophone camerounais
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-12">
          {/* College */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Cycle College (1er Cycle)</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {collegeLevels.map((level) => (
                <Card key={level.value}>
                  <CardHeader>
                    <CardTitle>{level.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {level.value === "3eme" ? "Classe d'examen - BEPC" : "Enseignement general"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Lycee */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Cycle Lycee (2nd Cycle)</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {lyceeLevels.map((level) => (
                <Card key={level.value}>
                  <CardHeader>
                    <CardTitle>{level.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {level.value === "2nde"
                        ? "Tronc commun - Orientation"
                        : level.value === "1ere"
                        ? "Preparation au Probatoire"
                        : "Preparation au Baccalaureat"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Series */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Series disponibles</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {SERIES.map((serie) => (
                <Card key={serie.value}>
                  <CardHeader>
                    <CardTitle>{serie.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Disponible en: {serie.levels.map((l) => LEVELS.find((lv) => lv.value === l)?.label).join(", ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Matieres */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Matieres enseignees</h2>
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat}>
                  <h3 className="mb-3 text-lg font-semibold text-primary">{cat}</h3>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.filter((s) => s.category === cat).map((s) => (
                      <Badge key={s.code} variant="secondary" className="text-sm">
                        {s.name} (coeff {s.defaultCoeff})
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
