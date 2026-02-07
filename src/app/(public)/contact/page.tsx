import { SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_PHONE, SCHOOL_EMAIL } from "@/config/cameroon-education";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: `Contact - ${SCHOOL_NAME}`,
  description: `Contactez le ${SCHOOL_NAME} a Bafoussam.`,
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Contactez-nous</h1>
          <p className="text-lg text-muted-foreground">Nous sommes a votre disposition</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Nos coordonnees</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">{SCHOOL_ADDRESS}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Telephone</p>
                      <p className="text-sm text-muted-foreground">{SCHOOL_PHONE}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{SCHOOL_EMAIL}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Horaires</p>
                      <p className="text-sm text-muted-foreground">Lundi - Vendredi : 7h30 - 15h30</p>
                      <p className="text-sm text-muted-foreground">Samedi : 7h30 - 12h30</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Localisation</CardTitle></CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63512.92!2d10.38!3d5.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105f3cba0f682f0d%3A0x29e11f5d56d1c7c8!2sBafoussam%2C%20Cameroon!5e0!3m2!1sfr!2s!4v1"
                      className="h-full w-full rounded-lg"
                      style={{ border: 0, minHeight: "250px" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Envoyez-nous un message</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input placeholder="Votre nom" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Prenom</Label>
                      <Input placeholder="Votre prenom" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="votre@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Telephone</Label>
                    <Input placeholder="+237..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Sujet</Label>
                    <Input placeholder="Objet de votre message" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea placeholder="Votre message..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full">Envoyer</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
