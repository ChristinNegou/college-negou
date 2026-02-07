import Link from "next/link";
import { SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_PHONE, SCHOOL_EMAIL, SCHOOL_MOTTO } from "@/config/cameroon-education";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                CPN
              </div>
              <span className="font-bold">{SCHOOL_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground italic">{SCHOOL_MOTTO}</p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/a-propos" className="text-muted-foreground hover:text-foreground">A Propos</Link></li>
              <li><Link href="/programmes" className="text-muted-foreground hover:text-foreground">Programmes</Link></li>
              <li><Link href="/admissions" className="text-muted-foreground hover:text-foreground">Admissions</Link></li>
              <li><Link href="/galerie" className="text-muted-foreground hover:text-foreground">Galerie</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Portails</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/connexion" className="text-muted-foreground hover:text-foreground">Connexion</Link></li>
              <li><Link href="/actualites" className="text-muted-foreground hover:text-foreground">Actualites</Link></li>
              <li><Link href="/evenements" className="text-muted-foreground hover:text-foreground">Evenements</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{SCHOOL_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{SCHOOL_PHONE}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{SCHOOL_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SCHOOL_NAME}. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
