import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.news.findUnique({ where: { slug } });
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.news.findUnique({ where: { slug } });

  if (!article) notFound();

  return (
    <div style={{ padding: "4rem 2rem", background: "var(--color-bg)", minHeight: "90vh" }}>
      <article className="container" style={{ maxWidth: "820px", margin: "0 auto" }}>
        <Link
          href="/news"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "2rem" }}
        >
          &larr; Back to News
        </Link>

        {article.isHighlighted && (
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ffc440", background: "rgba(255, 196, 64, 0.12)", border: "1px solid rgba(255, 196, 64, 0.4)", padding: "0.3rem 0.65rem", borderRadius: "999px" }}>
              ★ Featured
            </span>
          </div>
        )}

        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", color: "#ffffff", lineHeight: 1.2, marginBottom: "1rem" }}>
          {article.title}
        </h1>

        <p style={{ color: "var(--color-primary)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "2.5rem" }}>
          {new Date(article.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            style={{ width: "100%", borderRadius: "16px", marginBottom: "2.5rem", border: "1px solid rgba(64, 224, 208, 0.15)" }}
          />
        )}

        <p style={{ fontSize: "1.2rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.7, marginBottom: "2rem", paddingLeft: "1.25rem", borderLeft: "3px solid var(--color-primary)" }}>
          {article.summary}
        </p>

        <div style={{ color: "var(--color-text)", fontSize: "1.05rem", lineHeight: 1.9, whiteSpace: "pre-line" }}>
          {article.content}
        </div>
      </article>
    </div>
  );
}
