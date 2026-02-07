import Link from "next/link";
import { SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_PHONE, SCHOOL_EMAIL, SCHOOL_MOTTO } from "@/config/cameroon-education";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t bg-muted/50">
      {/* SVG Wave separator */}
      <div className="absolute -top-6 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="relative block h-6 w-full">
          <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" className="fill-muted/50" />
        </svg>
      </div>

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
              {[
                { href: "/a-propos", label: "A Propos" },
                { href: "/programmes", label: "Programmes" },
                { href: "/admissions", label: "Admissions" },
                { href: "/galerie", label: "Galerie" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Portails</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/connexion", label: "Connexion" },
                { href: "/actualites", label: "Actualites" },
                { href: "/evenements", label: "Evenements" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
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
