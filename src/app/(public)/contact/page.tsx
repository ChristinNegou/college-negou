import { SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_PHONE, SCHOOL_EMAIL } from "@/config/cameroon-education";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = {
  title: `Contact - ${SCHOOL_NAME}`,
  description: `Contactez le ${SCHOOL_NAME} a Bafoussam.`,
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            <span className="gradient-text">Contactez</span>-nous
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>Nous sommes a votre disposition</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {/* Contact cards */}
              <ScrollReveal>
                <Card className="overflow-hidden">
                  <CardHeader><CardTitle>Nos coordonnees</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    {[
                      { icon: MapPin, label: "Adresse", value: SCHOOL_ADDRESS },
                      { icon: Phone, label: "Telephone", value: SCHOOL_PHONE },
                      { icon: Mail, label: "Email", value: SCHOOL_EMAIL },
                      { icon: Clock, label: "Horaires", value: "Lundi - Vendredi : 7h30 - 15h30\nSamedi : 7h30 - 12h30" },
                    ].map((item, i) => (
                      <div key={i} className="group flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 transition-all duration-300 group-hover:from-primary group-hover:to-accent">
                          <item.icon className="h-5 w-5 text-primary transition-colors group-hover:text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <Card className="overflow-hidden">
                  <CardHeader><CardTitle>Localisation</CardTitle></CardHeader>
                  <CardContent>
                    <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63512.92!2d10.38!3d5.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105f3cba0f682f0d%3A0x29e11f5d56d1c7c8!2sBafoussam%2C%20Cameroon!5e0!3m2!1sfr!2s!4v1"
                        className="h-full w-full rounded-xl"
                        style={{ border: 0, minHeight: "250px" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal direction="right">
              <Card className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                <CardHeader><CardTitle>Envoyez-nous un message</CardTitle></CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input placeholder="Votre nom" required className="transition-all duration-200 focus:shadow-md focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label>Prenom</Label>
                        <Input placeholder="Votre prenom" required className="transition-all duration-200 focus:shadow-md focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="votre@email.com" required className="transition-all duration-200 focus:shadow-md focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label>Telephone</Label>
                      <Input placeholder="+237..." className="transition-all duration-200 focus:shadow-md focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sujet</Label>
                      <Input placeholder="Objet de votre message" required className="transition-all duration-200 focus:shadow-md focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea placeholder="Votre message..." rows={5} required className="transition-all duration-200 focus:shadow-md focus:border-primary" />
                    </div>
                    <Button type="submit" className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
