"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <h2 className="mb-2 text-xl font-semibold">
            Une erreur est survenue
          </h2>
          <p className="mb-6 text-muted-foreground">
            Quelque chose s&apos;est mal passe. Veuillez reessayer.
          </p>
          <Button onClick={reset}>Reessayer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
