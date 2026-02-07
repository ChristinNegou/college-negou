"use client";

import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h2 className="mb-2 text-xl font-semibold">Une erreur est survenue</h2>
        <p className="mb-6 text-muted-foreground">
          Quelque chose s&apos;est mal passe. Veuillez reessayer.
        </p>
        <Button onClick={reset}>Reessayer</Button>
      </div>
    </div>
  );
}
