import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-2 text-6xl font-bold text-gray-300">404</h1>
        <h2 className="mb-2 text-xl font-semibold">Page non trouvee</h2>
        <p className="mb-6 text-muted-foreground">
          La page que vous recherchez n&apos;existe pas.
        </p>
        <Button asChild>
          <Link href="/">Retour a l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
