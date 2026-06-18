import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AreasOfInterestPage() {
  const areas = await prisma.areaOfInterest.findMany({ orderBy: { order: "asc" } });

  return (
    <div style={{ padding: "5rem 2rem", background: "var(--color-bg)", minHeight: "95vh" }}>
      <div className="container" style={{ maxWidth: "1150px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.9rem", fontWeight: 800 }}>
            What We Explore
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
            Areas of Interest
          </h1>
          <p style={{ color: "var(--color-text-muted)", maxWidth: "640px", margin: "0 auto", fontSize: "1.15rem", lineHeight: 1.7 }}>
            The research frontiers where our work is charting new territory across biology, AI, and biotechnology.
          </p>
        </div>

        {areas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>No Areas Yet</h3>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>Research areas will appear here once added from the Admin Panel.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "2rem" }}>
            {areas.map((area) => (
              <article
                key={area.id}
                className="area-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "18px",
                  border: "1px solid rgba(64, 224, 208, 0.15)",
                  background: "linear-gradient(135deg, rgba(2, 11, 26, 0.7) 0%, rgba(3, 21, 48, 0.5) 100%)",
                  backdropFilter: "blur(12px)",
                  overflow: "hidden",
                  transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.35s ease",
                }}
              >
                {area.imageUrl ? (
                  <img src={area.imageUrl} alt={area.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                ) : (
                  <div style={{ height: "120px", background: "radial-gradient(circle at 30% 30%, rgba(64,224,208,0.18) 0%, transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "var(--color-primary)" }}>
                    ◇
                  </div>
                )}

                <div style={{ padding: "1.75rem 1.75rem 2rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.75rem 0", lineHeight: 1.3 }}>
                    {area.title}
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.97rem", lineHeight: 1.7, margin: 0 }}>
                    {area.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .area-card:hover {
          transform: translateY(-6px);
          border-color: rgba(64, 224, 208, 0.4) !important;
          box-shadow: 0 14px 38px rgba(64, 224, 208, 0.18);
        }
      `}</style>
    </div>
  );
}
