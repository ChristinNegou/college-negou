import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Verification - College Polyvalent Negou",
};

export default function VerificationPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verifiez votre email</CardTitle>
        <CardDescription>
          Un email de verification a ete envoye a votre adresse.
          Cliquez sur le lien dans l&apos;email pour activer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button asChild variant="outline">
          <Link href="/connexion">Retour a la connexion</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
