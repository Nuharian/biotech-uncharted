import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    orderBy: [{ isHighlighted: "desc" }, { publishDate: "desc" }],
  });

  return (
    <div style={{ padding: "5rem 2rem", background: "var(--color-bg)", minHeight: "95vh" }}>
      <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{
            color: "var(--color-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: "0.9rem",
            fontWeight: 800
          }}>
            Peer-Reviewed Research
          </span>
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            marginTop: "0.5rem",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800
          }}>
            Research Publications
          </h1>
          <p style={{ color: "var(--color-text-muted)", maxWidth: "640px", margin: "0 auto", fontSize: "1.15rem", lineHeight: 1.7 }}>
            Our latest peer-reviewed contributions advancing the frontiers of biotechnology and computational biology.
          </p>
        </div>

        {publications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>No Publications Yet</h3>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>Check back soon for our latest research.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {publications.map((pub) => (
              <article
                key={pub.id}
                className={`pub-card${pub.isHighlighted ? " pub-card--featured" : ""}`}
                style={{
                  position: "relative",
                  padding: "2rem 2.25rem",
                  borderRadius: "18px",
                  border: pub.isHighlighted ? "1px solid rgba(255, 196, 64, 0.4)" : "1px solid rgba(64, 224, 208, 0.15)",
                  background: pub.isHighlighted
                    ? "linear-gradient(135deg, rgba(40, 30, 5, 0.5) 0%, rgba(3, 21, 48, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(2, 11, 26, 0.7) 0%, rgba(3, 21, 48, 0.5) 100%)",
                  backdropFilter: "blur(12px)",
                  overflow: "hidden",
                }}
              >
                {/* Accent strip */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: pub.isHighlighted ? "#ffc440" : "var(--color-primary)",
                }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
                    {pub.title}
                  </h3>
                  {pub.isHighlighted && (
                    <span style={{ flexShrink: 0, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ffc440", background: "rgba(255, 196, 64, 0.12)", border: "1px solid rgba(255, 196, 64, 0.4)", padding: "0.3rem 0.6rem", borderRadius: "999px" }}>
                      ★ Featured
                    </span>
                  )}
                </div>

                <p style={{ color: "var(--color-primary)", fontSize: "0.9rem", fontWeight: 600, margin: "0 0 1rem 0" }}>
                  {pub.authors} · <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>{pub.journal}</span>
                  {pub.publishDate && (
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {" · "}{new Date(pub.publishDate).getFullYear()}
                    </span>
                  )}
                </p>

                <p style={{ color: "var(--color-text-muted)", fontSize: "0.98rem", lineHeight: 1.7, margin: 0 }}>
                  {pub.abstract}
                </p>

                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pub-link"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1.25rem", color: pub.isHighlighted ? "#ffc440" : "var(--color-primary)", fontWeight: 600, fontSize: "0.92rem" }}
                  >
                    View Paper
                    <span style={{ transition: "transform 0.25s ease" }}>&rarr;</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .pub-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .pub-card:hover {
          transform: translateY(-5px);
          border-color: rgba(64, 224, 208, 0.4) !important;
          box-shadow: 0 14px 38px rgba(64, 224, 208, 0.16);
        }
        .pub-card--featured:hover {
          border-color: rgba(255, 196, 64, 0.6) !important;
          box-shadow: 0 14px 38px rgba(255, 196, 64, 0.22);
        }
        .pub-link:hover span {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
