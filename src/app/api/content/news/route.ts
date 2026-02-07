import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const article = await prisma.newsArticle.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || null,
        imageUrl: body.imageUrl || null,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return NextResponse.json({ error: "Erreur lors de la creation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
