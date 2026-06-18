import type { TeamMember } from "@prisma/client";

// A palette of distinct, on-brand accent colours for skill tags.
// Each skill is mapped to one deterministically so colours stay stable across renders.
const SKILL_COLORS = [
  { fg: "#40E0D0", bg: "rgba(64, 224, 208, 0.12)", border: "rgba(64, 224, 208, 0.45)" },   // turquoise
  { fg: "#7CA0FF", bg: "rgba(124, 160, 255, 0.12)", border: "rgba(124, 160, 255, 0.45)" }, // blue
  { fg: "#B07CFF", bg: "rgba(176, 124, 255, 0.12)", border: "rgba(176, 124, 255, 0.45)" }, // violet
  { fg: "#FF8FB1", bg: "rgba(255, 143, 177, 0.12)", border: "rgba(255, 143, 177, 0.45)" }, // pink
  { fg: "#FFC440", bg: "rgba(255, 196, 64, 0.12)", border: "rgba(255, 196, 64, 0.45)" },   // amber
  { fg: "#5FD98A", bg: "rgba(95, 217, 138, 0.12)", border: "rgba(95, 217, 138, 0.45)" },   // green
  { fg: "#FF9D6C", bg: "rgba(255, 157, 108, 0.12)", border: "rgba(255, 157, 108, 0.45)" }, // orange
];

function colorForSkill(skill: string) {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = (hash * 31 + skill.charCodeAt(i)) >>> 0;
  }
  return SKILL_COLORS[hash % SKILL_COLORS.length];
}

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const featured = member.isHighlighted;

  // Split the free-text bio into individual skill tags (comma-separated).
  const skills = (member.bio || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className={`glass-card team-card${featured ? " team-card--featured" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2.5rem",
        borderRadius: "20px",
        border: featured ? "1px solid rgba(255, 196, 64, 0.4)" : "1px solid rgba(64, 224, 208, 0.15)",
        background: featured
          ? "linear-gradient(135deg, rgba(40, 30, 5, 0.55) 0%, rgba(3, 21, 48, 0.6) 100%)"
          : "linear-gradient(135deg, rgba(2, 11, 26, 0.7) 0%, rgba(3, 21, 48, 0.5) 100%)",
        backdropFilter: "blur(12px)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Featured ribbon */}
      {featured && (
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#ffc440",
            background: "rgba(255, 196, 64, 0.12)",
            border: "1px solid rgba(255, 196, 64, 0.4)",
            padding: "0.3rem 0.65rem",
            borderRadius: "999px",
            zIndex: 2,
          }}
        >
          ★ Featured
        </div>
      )}

      {/* Visual Bio Glow effect */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: featured
            ? "radial-gradient(circle, rgba(255, 196, 64, 0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(64, 224, 208, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Profile Pic & Main Details */}
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
              border: featured ? "3px solid #ffc440" : "3px solid var(--color-primary)",
              boxShadow: featured
                ? "0 0 25px rgba(255, 196, 64, 0.45)"
                : "0 0 25px rgba(64, 224, 208, 0.4)",
            }}
          />
        ) : (
          <div
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background: featured ? "rgba(255, 196, 64, 0.1)" : "rgba(64, 224, 208, 0.1)",
              border: featured ? "3px solid rgba(255, 196, 64, 0.5)" : "3px solid rgba(64, 224, 208, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              fontWeight: 700,
              color: featured ? "#ffc440" : "var(--color-primary)",
              boxShadow: featured
                ? "0 0 25px rgba(255, 196, 64, 0.25)"
                : "0 0 25px rgba(64, 224, 208, 0.2)",
              flexShrink: 0,
            }}
          >
            {member.name.substring(0, 2).toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#ffffff", lineHeight: 1.2 }}>
            {member.name}
          </h3>
          <p
            style={{
              color: featured ? "#ffc440" : "var(--color-primary)",
              fontSize: "1rem",
              fontWeight: 700,
              margin: "0.5rem 0 0 0",
              textShadow: featured
                ? "0 0 10px rgba(255, 196, 64, 0.25)"
                : "0 0 10px rgba(64, 224, 208, 0.2)",
              letterSpacing: "0.02em",
            }}
          >
            {member.position || member.role}
          </p>
        </div>
      </div>

      {/* Skills & Interest as coloured tags */}
      <div style={{ margin: "0 0 2rem 0", flexGrow: 1 }}>
        <h4
          style={{
            fontSize: "0.8rem",
            textTransform: "uppercase",
            color: featured ? "#ffc440" : "var(--color-primary)",
            letterSpacing: "0.08em",
            margin: "0 0 0.85rem 0",
            fontWeight: 700,
          }}
        >
          Skills &amp; Interest
        </h4>
        {skills.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skills.map((skill, i) => {
              const c = colorForSkill(skill);
              return (
                <span
                  key={`${skill}-${i}`}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: c.fg,
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    padding: "0.3rem 0.7rem",
                    borderRadius: "999px",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
            Computational biology, biotech research, molecular modeling.
          </p>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.08)", margin: "0 0 1.5rem 0" }} />

      {/* Contact & Socials Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="teammate-social-link"
            style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" {...ICON_PROPS}>
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {member.email}
          </a>
        ) : (
          <span style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.2)" }}>No contact email</span>
        )}

        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="teammate-social-link" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" {...ICON_PROPS}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          )}

          {member.researchGateUrl && (
            <a href={member.researchGateUrl} target="_blank" rel="noopener noreferrer" className="teammate-social-link" title="ResearchGate" style={{ display: "flex", alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 2h-15C3.12 2 2 3.12 2 4.5v15C2 20.88 3.12 22 4.5 22h15c1.38 0 2.5-1.12 2.5-2.5v-15C22 3.12 20.88 2 19.5 2zM9.66 16.7h-1.6v-7.8h1.6v7.8zm4.84-3.41c-.26-.14-.52-.25-.79-.32-.27-.08-.53-.13-.79-.16-.25-.03-.49-.05-.72-.05v-2.28h.74c.26 0 .52.03.77.08c.25.05.47.14.67.26c.2.12.35.29.47.51.11.22.17.48.17.78 0 .34-.07.63-.22.86-.15.23-.37.41-.65.52v.03c.3.09.55.25.75.48c.19.23.29.54.29.93 0 .31-.06.58-.19.82-.12.23-.3.43-.53.58-.23.15-.51.26-.82.32-.32.07-.66.1-1.01.1h-1.92v-2.31h.74c.29 0 .58-.02.85-.07c.28-.05.51-.14.7-.28c.19-.13.33-.31.42-.53c.09-.22.13-.48.13-.77 0-.3-.04-.56-.13-.78c-.09-.21-.24-.38-.43-.5z" />
              </svg>
            </a>
          )}

          {member.googleScholarUrl && (
            <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="teammate-social-link" title="Google Scholar" style={{ display: "flex", alignItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" {...ICON_PROPS}>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
