"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-6 text-center">
        <h2 className="mb-2 text-xl font-semibold">Une erreur est survenue</h2>
        <p className="mb-6 text-muted-foreground">
          Un probleme est survenu lors de l&apos;authentification.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={reset}>Reessayer</Button>
          <Button variant="outline" asChild>
            <Link href="/connexion">Retour a la connexion</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
