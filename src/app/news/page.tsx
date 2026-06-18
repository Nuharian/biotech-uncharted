import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0;

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    orderBy: [{ isHighlighted: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div style={{ padding: "5rem 2rem", background: "var(--color-bg)", minHeight: "95vh" }}>
      <div className="container" style={{ maxWidth: "1150px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", fontWeight: 800 }}>
            Newsroom
          </span>
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            marginTop: "0.5rem",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          }}>
            Latest News
          </h1>
          <p style={{ color: "var(--color-text-muted)", maxWidth: "640px", margin: "0 auto", fontSize: "1.15rem", lineHeight: 1.7 }}>
            Discoveries, milestones, and updates from across our research.
          </p>
        </div>

        {news.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>No News Yet</h3>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>Check back soon for updates.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "2rem" }}>
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="news-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "18px",
                  border: item.isHighlighted ? "1px solid rgba(255, 196, 64, 0.4)" : "1px solid rgba(64, 224, 208, 0.15)",
                  background: item.isHighlighted
                    ? "linear-gradient(135deg, rgba(40, 30, 5, 0.5) 0%, rgba(3, 21, 48, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(2, 11, 26, 0.7) 0%, rgba(3, 21, 48, 0.5) 100%)",
                  backdropFilter: "blur(12px)",
                  overflow: "hidden",
                  transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.35s ease",
                }}
              >
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                )}

                <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ color: "var(--color-primary)", fontSize: "0.82rem", fontWeight: 600 }}>
                      {new Date(item.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    {item.isHighlighted && (
                      <span style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ffc440", background: "rgba(255, 196, 64, 0.12)", border: "1px solid rgba(255, 196, 64, 0.4)", padding: "0.12rem 0.5rem", borderRadius: "999px" }}>
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.6rem 0", lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
                    {item.summary}
                  </p>

                  <span className="news-readmore" style={{ marginTop: "1.25rem", color: item.isHighlighted ? "#ffc440" : "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    Read Full Story <span style={{ transition: "transform 0.25s ease" }}>&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .news-card:hover {
          transform: translateY(-6px);
          border-color: rgba(64, 224, 208, 0.4) !important;
          box-shadow: 0 14px 38px rgba(64, 224, 208, 0.18);
        }
        .news-card:hover .news-readmore span {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
