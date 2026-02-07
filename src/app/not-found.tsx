import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <h1 className="mb-2 text-6xl font-bold text-gray-300">404</h1>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Page non trouvee
          </h2>
          <p className="mb-6 text-gray-600">
            La page que vous recherchez n&apos;existe pas ou a ete deplacee.
          </p>
          <Button asChild>
            <Link href="/">Retour a l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
