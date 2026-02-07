"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Une erreur est survenue
          </h2>
          <p className="mb-6 text-gray-600">
            Une erreur inattendue s&apos;est produite. Veuillez reessayer.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Reessayer
          </button>
        </div>
      </body>
    </html>
  );
}
