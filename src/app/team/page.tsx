import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0; // Ensure fresh data on load

export default async function TeamPage() {
  // Query all categories along with their sorted members
  const categories = await prisma.teamCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      members: {
        orderBy: { order: "asc" },
      }
    }
  });

  // Query members who do not belong to any category
  const uncategorizedMembers = await prisma.teamMember.findMany({
    where: { categoryId: null },
    orderBy: { order: "asc" }
  });

  return (
    <div style={{ padding: "5rem 2rem", background: "var(--color-bg)", minHeight: "95vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span style={{ 
            color: "var(--color-primary)", 
            textTransform: "uppercase", 
            letterSpacing: "0.2em", 
            fontSize: "0.9rem",
            fontWeight: 800
          }}>
            Meet the Pioneers
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
            Our Research Team
          </h1>
          <p style={{ 
            color: "var(--color-text-muted)", 
            maxWidth: "650px", 
            margin: "0 auto",
            fontSize: "1.15rem",
            lineHeight: "1.7"
          }}>
            Meet the exceptional minds dedicated to charting the uncharted territories of biological science and AI-driven biotechnology.
          </p>
        </div>

        {/* Categories Section */}
        {categories.length === 0 && uncategorizedMembers.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "5rem", 
            background: "rgba(255,255,255,0.02)", 
            borderRadius: "16px",
            border: "1px dashed rgba(255,255,255,0.1)"
          }}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>No Team Members Found</h3>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
              Teammate listings are empty. Navigate to the Admin Panel to add members!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
            
            {/* Loop through admin-defined categories */}
            {categories.map((category) => {
              if (category.members.length === 0) return null;
              
              return (
                <div key={category.id} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                  
                  {/* Category Header Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h2 style={{ 
                      fontSize: "1.8rem", 
                      color: "#ffffff", 
                      fontWeight: 700, 
                      margin: 0,
                      letterSpacing: "0.05em",
                      background: "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>
                      {category.name}
                    </h2>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(64, 224, 208, 0.4) 0%, transparent 100%)" }} />
                  </div>

                  {/* Teammates under this Category */}
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", 
                    gap: "2.5rem"
                  }}>
                    {category.members.map((member) => (
                      <div 
                        key={member.id} 
                        className="glass-card team-card" 
                        style={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          padding: "2.5rem",
                          borderRadius: "20px",
                          border: "1px solid rgba(64, 224, 208, 0.15)",
                          background: "linear-gradient(135deg, rgba(2, 11, 26, 0.7) 0%, rgba(3, 21, 48, 0.5) 100%)",
                          backdropFilter: "blur(12px)",
                          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        {/* Visual Bio Glow effect */}
                        <div style={{
                          position: "absolute",
                          top: "-50px",
                          right: "-50px",
                          width: "140px",
                          height: "140px",
                          borderRadius: "50%",
                          background: "radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)",
                          pointerEvents: "none"
                        }} />

                        {/* Profile Pic & Main Details (Larger and beautifully visible) */}
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
                          {member.imageUrl ? (
                            <img 
                              src={member.imageUrl} 
                              alt={member.name} 
                              style={{ 
                                width: "130px", 
                                height: "130px", 
                                borderRadius: "50%", 
                                objectFit: "cover",
                                border: "3px solid var(--color-primary)",
                                boxShadow: "0 0 25px rgba(64, 224, 208, 0.4)"
                              }} 
                            />
                          ) : (
                            <div style={{ 
                              width: "130px", 
                              height: "130px", 
                              borderRadius: "50%", 
                              background: "rgba(64, 224, 208, 0.1)", 
                              border: "3px solid rgba(64, 224, 208, 0.4)",
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              fontSize: "2.5rem", 
                              fontWeight: 700,
                              color: "var(--color-primary)",
                              boxShadow: "0 0 25px rgba(64, 224, 208, 0.2)"
                            }}>
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#ffffff", lineHeight: 1.2 }}>
                              {member.name}
                            </h3>
                            <p style={{ 
                              color: "var(--color-primary)", 
                              fontSize: "1rem", 
                              fontWeight: 700, 
                              margin: "0.5rem 0 0 0",
                              textShadow: "0 0 10px rgba(64, 224, 208, 0.2)",
                              letterSpacing: "0.02em"
                            }}>
                              {member.position || member.role}
                            </p>
                          </div>
                        </div>

                        {/* Skills & Interest */}
                        <div style={{ margin: "0 0 2rem 0", flexGrow: 1 }}>
                          <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--color-primary)", letterSpacing: "0.08em", margin: "0 0 0.5rem 0", fontWeight: 700 }}>
                            Skills & Interest
                          </h4>
                          <p style={{ 
                            color: "var(--color-text-muted)", 
                            fontSize: "0.95rem", 
                            lineHeight: "1.6", 
                            margin: 0
                          }}>
                            {member.bio || "Computational biology, biotech research, molecular modeling."}
                          </p>
                        </div>

                        <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.08)", margin: "0 0 1.5rem 0" }} />

                        {/* Contact & Socials Footer */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {member.email ? (
                            <a 
                              href={`mailto:${member.email}`} 
                              className="teammate-social-link"
                              style={{ 
                                fontSize: "0.9rem", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "0.5rem",
                                textDecoration: "none"
                              }}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                              </svg>
                              {member.email}
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.2)" }}>No contact email</span>
                          )}

                          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                            {member.linkedinUrl && (
                              <a 
                                href={member.linkedinUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="teammate-social-link"
                                title="LinkedIn"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                </div>
              );
            })}

            {/* Uncategorized / General Members Section (Rendered at the end) */}
            {uncategorizedMembers.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                
                {/* Category Header Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <h2 style={{ 
                    fontSize: "1.8rem", 
                    color: "#ffffff", 
                    fontWeight: 700, 
                    margin: 0,
                    letterSpacing: "0.05em",
                    background: "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    General Members
                  </h2>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(64, 224, 208, 0.4) 0%, transparent 100%)" }} />
                </div>

                {/* Teammates under this Section */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", 
                  gap: "2.5rem"
                }}>
                  {uncategorizedMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="glass-card team-card" 
                      style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        padding: "2.5rem",
                        borderRadius: "20px",
                        border: "1px solid rgba(64, 224, 208, 0.15)",
                        background: "linear-gradient(135deg, rgba(2, 11, 26, 0.7) 0%, rgba(3, 21, 48, 0.5) 100%)",
                        backdropFilter: "blur(12px)",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {/* Visual Bio Glow effect */}
                      <div style={{
                        position: "absolute",
                        top: "-50px",
                        right: "-50px",
                        width: "140px",
                        height: "140px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)",
                        pointerEvents: "none"
                      }} />

                      {/* Profile Pic & Main Details (Larger and beautifully visible) */}
                      <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
                        {member.imageUrl ? (
                          <img 
                            src={member.imageUrl} 
                            alt={member.name} 
                            style={{ 
                              width: "130px", 
                              height: "130px", 
                              borderRadius: "50%", 
                              objectFit: "cover",
                              border: "3px solid var(--color-primary)",
                              boxShadow: "0 0 25px rgba(64, 224, 208, 0.4)"
                            }} 
                          />
                        ) : (
                          <div style={{ 
                            width: "130px", 
                            height: "130px", 
                            borderRadius: "50%", 
                            background: "rgba(64, 224, 208, 0.1)", 
                            border: "3px solid rgba(64, 224, 208, 0.4)",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontSize: "2.5rem", 
                            fontWeight: 700,
                            color: "var(--color-primary)",
                            boxShadow: "0 0 25px rgba(64, 224, 208, 0.2)"
                          }}>
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#ffffff", lineHeight: 1.2 }}>
                            {member.name}
                          </h3>
                          <p style={{ 
                            color: "var(--color-primary)", 
                            fontSize: "1rem", 
                            fontWeight: 700, 
                            margin: "0.5rem 0 0 0",
                            textShadow: "0 0 10px rgba(64, 224, 208, 0.2)",
                            letterSpacing: "0.02em"
                          }}>
                            {member.position || member.role}
                          </p>
                        </div>
                      </div>

                      {/* Skills & Interest */}
                      <div style={{ margin: "0 0 2rem 0", flexGrow: 1 }}>
                        <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--color-primary)", letterSpacing: "0.08em", margin: "0 0 0.5rem 0", fontWeight: 700 }}>
                          Skills & Interest
                        </h4>
                        <p style={{ 
                          color: "var(--color-text-muted)", 
                          fontSize: "0.95rem", 
                          lineHeight: "1.6", 
                          margin: 0
                        }}>
                          {member.bio || "Computational biology, biotech research, molecular modeling."}
                        </p>
                      </div>

                      <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.08)", margin: "0 0 1.5rem 0" }} />

                      {/* Contact & Socials Footer */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {member.email ? (
                          <a 
                            href={`mailto:${member.email}`} 
                            className="teammate-social-link"
                            style={{ 
                              fontSize: "0.9rem", 
                              display: "flex", 
                              alignItems: "center", 
                              gap: "0.5rem",
                              textDecoration: "none"
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            {member.email}
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.2)" }}>No contact email</span>
                        )}

                        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                          {member.linkedinUrl && (
                            <a 
                              href={member.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="teammate-social-link"
                              title="LinkedIn"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

              </div>
            )}

          </div>
        )}
      </div>

      <style>{`
        .team-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .team-card:hover {
          transform: translateY(-8px) scale(1.015);
          border-color: rgba(64, 224, 208, 0.4) !important;
          box-shadow: 0 15px 40px rgba(64, 224, 208, 0.2);
        }
        .teammate-social-link {
          color: var(--color-text-muted);
          transition: all 0.25s ease;
        }
        .teammate-social-link:hover {
          color: var(--color-primary) !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
