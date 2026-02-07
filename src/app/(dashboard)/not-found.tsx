import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <h1 className="mb-2 text-6xl font-bold text-gray-300">404</h1>
          <h2 className="mb-2 text-xl font-semibold">Page non trouvee</h2>
          <p className="mb-6 text-muted-foreground">
            Cette page du tableau de bord n&apos;existe pas.
          </p>
          <Button asChild>
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
