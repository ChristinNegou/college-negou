import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SCHOOL_NAME, SUBJECTS, LEVELS, SERIES } from "@/config/cameroon-education";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            Nos <span className="gradient-text">Programmes</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            De la 6eme a la Terminale - Systeme educatif francophone camerounais
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">
          {/* College */}
          <div>
            <ScrollReveal>
              <h2 className="mb-6 text-2xl font-bold">Cycle <span className="gradient-text">College</span> (1er Cycle)</h2>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-4">
              {collegeLevels.map((level, i) => (
                <ScrollReveal key={level.value} delay={i * 100}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-2xl font-bold gradient-text">{level.label.split(" ")[0]}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {level.value === "3eme" ? "Classe d'examen - BEPC" : "Enseignement general"}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Lycee */}
          <div>
            <ScrollReveal>
              <h2 className="mb-6 text-2xl font-bold">Cycle <span className="gradient-text">Lycee</span> (2nd Cycle)</h2>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-3">
              {lyceeLevels.map((level, i) => (
                <ScrollReveal key={level.value} delay={i * 100}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-primary" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-2xl font-bold gradient-text">{level.label.split(" ")[0]}</span>
                      </CardTitle>
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
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          {/* Series */}
          <div>
            <ScrollReveal>
              <h2 className="mb-6 text-2xl font-bold">Series <span className="gradient-text">disponibles</span></h2>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-3">
              {SERIES.map((serie, i) => (
                <ScrollReveal key={serie.value} delay={i * 100}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110">
                          {serie.value}
                        </div>
                        {serie.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Disponible en: {serie.levels.map((l) => LEVELS.find((lv) => lv.value === l)?.label).join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Matieres */}
          <div>
            <ScrollReveal>
              <h2 className="mb-6 text-2xl font-bold">Matieres <span className="gradient-text">enseignees</span></h2>
            </ScrollReveal>
            <div className="space-y-8">
              {categories.map((cat, i) => (
                <ScrollReveal key={cat} delay={i * 80}>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-primary">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.filter((s) => s.category === cat).map((s) => (
                        <Badge key={s.code} variant="secondary" className="text-sm transition-all duration-200 hover:scale-105 hover:bg-primary/10 hover:text-primary">
                          {s.name} (coeff {s.defaultCoeff})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
