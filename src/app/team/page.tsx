import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0; // Ensure fresh data on load

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div style={{ padding: "4rem 2rem", background: "var(--color-bg)", minHeight: "90vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ 
            color: "var(--color-primary)", 
            textTransform: "uppercase", 
            letterSpacing: "0.2em", 
            fontSize: "0.85rem",
            fontWeight: 700
          }}>
            Meet the Pioneers
          </span>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            marginTop: "0.5rem", 
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Our Research Team
          </h1>
          <p style={{ 
            color: "var(--color-text-muted)", 
            maxWidth: "600px", 
            margin: "0 auto",
            fontSize: "1.1rem",
            lineHeight: "1.6"
          }}>
            Meet the exceptional minds dedicated to charting the uncharted territories of biological science and AI-driven biotechnology.
          </p>
        </div>

        {/* Team Grid */}
        {team.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "2.5rem",
            marginTop: "2rem"
          }}>
            {team.map((member) => (
              <div 
                key={member.id} 
                className="glass-card" 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  padding: "2.5rem",
                  borderRadius: "16px",
                  border: "1px solid rgba(64, 224, 208, 0.15)",
                  background: "linear-gradient(135deg, rgba(2, 11, 26, 0.6) 0%, rgba(3, 21, 48, 0.4) 100%)",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.4s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Visual Bio Glow effect */}
                <div style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(64, 224, 208, 0.12) 0%, transparent 70%)",
                  pointerEvents: "none"
                }} />

                {/* Profile Pic & Main Details */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: "2px solid var(--color-primary)",
                        boxShadow: "0 0 15px rgba(64, 224, 208, 0.3)"
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      width: "80px", 
                      height: "80px", 
                      borderRadius: "50%", 
                      background: "rgba(64, 224, 208, 0.1)", 
                      border: "2px solid rgba(64, 224, 208, 0.4)",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "1.8rem", 
                      fontWeight: 600,
                      color: "var(--color-primary)",
                      boxShadow: "0 0 15px rgba(64, 224, 208, 0.1)"
                    }}>
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
                      {member.name}
                    </h3>
                    <p style={{ 
                      color: "var(--color-primary)", 
                      fontSize: "0.95rem", 
                      fontWeight: 600, 
                      margin: "0.25rem 0 0 0",
                      textShadow: "0 0 10px rgba(64, 224, 208, 0.2)"
                    }}>
                      {member.position || member.role}
                    </p>
                  </div>
                </div>

                {/* Biography */}
                <p style={{ 
                  color: "var(--color-text-muted)", 
                  fontSize: "0.95rem", 
                  lineHeight: "1.6", 
                  margin: "0 0 1.5rem 0",
                  flexGrow: 1
                }}>
                  {member.bio || "Member of the BioTech Uncharted research team."}
                </p>

                <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.05)", margin: "0 0 1.25rem 0" }} />

                {/* Contact & Socials Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {member.email ? (
                    <a 
                      href={`mailto:${member.email}`} 
                      className="teammate-social-link"
                      style={{ 
                        fontSize: "0.85rem", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.4rem",
                        textDecoration: "none"
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      {member.email}
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.2)" }}>No contact email</span>
                  )}

                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {member.linkedinUrl && (
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="teammate-social-link"
                        title="LinkedIn"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                        </svg>
                      </a>
                    )}

                    {member.researchGateUrl && (
                      <a 
                        href={member.researchGateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="teammate-social-link"
                        title="ResearchGate"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.5 2h-15C3.12 2 2 3.12 2 4.5v15C2 20.88 3.12 22 4.5 22h15c1.38 0 2.5-1.12 2.5-2.5v-15C22 3.12 20.88 2 19.5 2zM9.66 16.7h-1.6v-7.8h1.6v7.8zm4.84-3.41c-.26-.14-.52-.25-.79-.32-.27-.08-.53-.13-.79-.16-.25-.03-.49-.05-.72-.05v-2.28h.74c.26 0 .52.03.77.08c.25.05.47.14.67.26c.2.12.35.29.47.51.11.22.17.48.17.78 0 .34-.07.63-.22.86-.15.23-.37.41-.65.52v.03c.3.09.55.25.75.48c.19.23.29.54.29.93 0 .31-.06.58-.19.82-.12.23-.3.43-.53.58-.23.15-.51.26-.82.32-.32.07-.66.1-1.01.1h-1.92v-2.31h.74c.29 0 .58-.02.85-.07c.28-.05.51-.14.7-.28c.19-.13.33-.31.42-.53c.09-.22.13-.48.13-.77 0-.3-.04-.56-.13-.78c-.09-.21-.24-.38-.43-.5z" />
                        </svg>
                      </a>
                    )}

                    {member.googleScholarUrl && (
                      <a 
                        href={member.googleScholarUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="teammate-social-link"
                        title="Google Scholar"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "4rem", 
            background: "rgba(255,255,255,0.02)", 
            borderRadius: "16px",
            border: "1px dashed rgba(255,255,255,0.1)"
          }}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>No Team Members Found</h3>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
              Teammate listings are empty. Navigate to the Admin Panel to add members!
            </p>
          </div>
        )}
      </div>

      <style>{`
        .teammate-social-link {
          color: var(--color-text-muted);
          transition: color 0.2s ease;
        }
        .teammate-social-link:hover {
          color: var(--color-primary) !important;
        }
      `}</style>
    </div>
  );
}
