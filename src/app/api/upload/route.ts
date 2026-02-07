import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSessionUser } from "@/actions/auth.actions";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Type de fichier non autorise. Utilisez JPG, PNG, WebP, GIF ou SVG." },
      { status: 400 }
    );
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Le fichier est trop volumineux (max 5 Mo)" },
      { status: 400 }
    );
  }

  // Generate unique filename
  const ext = path.extname(file.name) || ".jpg";
  const safeName = file.name
    .replace(ext, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 50);
  const uniqueName = `${safeName}-${Date.now()}${ext}`;

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  // Write file
  const bytes = new Uint8Array(await file.arrayBuffer());
  const filePath = path.join(uploadsDir, uniqueName);
  await writeFile(filePath, bytes);

  return NextResponse.json({ url: `/uploads/${uniqueName}` });
}
