import type { TeamMember } from "@prisma/client";
import { GOLD, parseEntries, parseParagraphs, parseSkills } from "@/lib/founder";

/**
 * The founder spotlight — a full-width banner rendered above every team category.
 * Deliberately unlike TeamMemberCard: larger portrait, gold treatment and a long-form
 * biography, so the founder reads as the head of the organisation rather than as
 * "the first card in the grid". Only members flagged `isFounder` reach this component.
 */

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function FounderSpotlight({ member }: { member: TeamMember }) {
  const skills = parseSkills(member.bio);
  const paragraphs = parseParagraphs(member.profile);
  const highlights = parseEntries(member.highlights);
  const honours = parseEntries(member.honours);
  const peerReviews = parseEntries(member.peerReviews);
  const stats = parseEntries(member.stats);

  const socials = [
    { url: member.linkedinUrl, title: "LinkedIn", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></> },
    { url: member.googleScholarUrl, title: "Google Scholar", icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></> },
    { url: member.researchGateUrl, title: "ResearchGate", icon: <><circle cx="12" cy="12" r="9" /><path d="M9 16V8h3a2.5 2.5 0 0 1 0 5H9m4 0 3 3" /></> },
    { url: member.githubUrl, title: "GitHub", icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /> },
  ].filter((s) => s.url);

  return (
    <section
      id="founder"
      className="founder-spotlight"
      aria-label={`${member.name} — ${member.position || member.role}`}
      style={{
        position: "relative",
        scrollMarginTop: "6rem", // clear the sticky navbar when linked as /team#founder
        overflow: "hidden",
        borderRadius: "28px",
        // Padding lives in the stylesheet so it can shrink on narrow screens.
        marginBottom: "5rem",
        border: `1px solid rgba(255, 196, 64, 0.45)`,
        background:
          "linear-gradient(135deg, rgba(48, 35, 4, 0.75) 0%, rgba(6, 26, 56, 0.85) 55%, rgba(2, 11, 26, 0.9) 100%)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Ambient glows */}
      <div aria-hidden style={{ position: "absolute", top: "-120px", left: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 196, 64, 0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-140px", right: "-60px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(64, 224, 208, 0.16) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Rank badge */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.72rem",
          fontWeight: 900,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: GOLD,
          background: "rgba(255, 196, 64, 0.12)",
          border: `1px solid rgba(255, 196, 64, 0.5)`,
          padding: "0.4rem 0.9rem",
          borderRadius: "999px",
          marginBottom: "2rem",
        }}
      >
        ★ {member.position || member.role}
      </div>

      {/* Portrait + identity */}
      <div className="founder-spotlight__head" style={{ position: "relative", display: "flex", alignItems: "center", gap: "clamp(1.5rem, 4vw, 3rem)" }}>
        <div className="founder-spotlight__portrait" style={{ position: "relative", flexShrink: 0 }}>
          {/* Rotating conic halo behind the portrait */}
          <div
            aria-hidden
            className="founder-spotlight__halo"
            style={{
              position: "absolute",
              inset: "-14px",
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, ${GOLD}, rgba(255,196,64,0.05), #40E0D0, rgba(255,196,64,0.05), ${GOLD})`,
              filter: "blur(10px)",
              opacity: 0.75,
            }}
          />
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="founder-spotlight__img"
              style={{
                position: "relative",
                display: "block",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                border: `4px solid ${GOLD}`,
                boxShadow: "0 0 45px rgba(255, 196, 64, 0.55)",
              }}
            />
          ) : (
            <div
              className="founder-spotlight__img"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                fontSize: "3.5rem",
                fontWeight: 800,
                color: GOLD,
                background: "rgba(255, 196, 64, 0.1)",
                border: `4px solid ${GOLD}`,
                boxShadow: "0 0 45px rgba(255, 196, 64, 0.45)",
              }}
            >
              {member.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            className="founder-spotlight__name"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 3.75rem)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              background: `linear-gradient(100deg, #ffffff 0%, #ffe9a8 40%, ${GOLD} 75%, #ffb000 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: GOLD,
            }}
          >
            {member.name}
          </h2>

          <p
            style={{
              color: GOLD,
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              fontWeight: 700,
              margin: "0.75rem 0 0 0",
              letterSpacing: "0.03em",
              textShadow: "0 0 14px rgba(255, 196, 64, 0.35)",
            }}
          >
            {member.position || member.role}
            <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}> · BioTech Uncharted</span>
          </p>

          {socials.length > 0 && (
            <div className="founder-spotlight__socials" style={{ display: "flex", marginTop: "1.25rem", flexWrap: "wrap" }}>
              {socials.map((s) => (
                <a
                  key={s.title}
                  href={s.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  aria-label={s.title}
                  className="founder-social"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    color: GOLD,
                    background: "rgba(255, 196, 64, 0.08)",
                    border: "1px solid rgba(255, 196, 64, 0.35)",
                  }}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" {...ICON_PROPS} aria-hidden>
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Headline numbers */}
      {stats.length > 0 && <FounderStats stats={stats} style={{ marginTop: "2.5rem" }} />}

      {/* Long-form biography */}
      {paragraphs.length > 0 && (
        <div style={{ position: "relative", marginTop: "2.5rem", maxWidth: "78ch" }}>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                color: i === 0 ? "#dbe4f5" : "var(--color-text-muted)",
                fontSize: i === 0 ? "1.1rem" : "1rem",
                lineHeight: 1.75,
                margin: i === paragraphs.length - 1 ? 0 : "0 0 1.1rem 0",
              }}
            >
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ position: "relative", marginTop: "2.5rem" }}>
          <h3 style={sectionHeadingStyle}>Focus Areas</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {skills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#ffe9a8",
                  background: "rgba(255, 196, 64, 0.1)",
                  border: "1px solid rgba(255, 196, 64, 0.35)",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                  lineHeight: 1.3,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Research, honours and peer review, side by side on wide screens */}
      {(highlights.length > 0 || honours.length > 0 || peerReviews.length > 0) && (
        <div className="founder-spotlight__lists" style={{ position: "relative", marginTop: "2.5rem", display: "grid", gap: "1.5rem" }}>
          {highlights.length > 0 && (
            <EntryList
              title="Research & Recognition"
              entries={highlights}
              icon={<><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></>}
            />
          )}
          {honours.length > 0 && (
            <EntryList
              title="Honours & Leadership"
              entries={honours}
              icon={<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>}
            />
          )}
          {peerReviews.length > 0 && (
            <EntryList
              title="Peer Review Recognition"
              entries={peerReviews}
              icon={<><circle cx="12" cy="8" r="6" /><path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.12" /></>}
            />
          )}
        </div>
      )}

      {/* Contact footer */}
      {member.email && (
        <div style={{ position: "relative", marginTop: "2.5rem", paddingTop: "1.75rem", borderTop: "1px solid rgba(255, 196, 64, 0.2)" }}>
          <a
            href={`mailto:${member.email}`}
            className="founder-contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: GOLD,
              textDecoration: "none",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" {...ICON_PROPS} aria-hidden>
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {member.email}
          </a>
        </div>
      )}
    </section>
  );
}

// Headline-number tiles. Exported so the homepage founder feature shows the same figures.
export function FounderStats({
  stats,
  style,
}: {
  stats: { label: string; detail: string }[];
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="founder-stats"
      style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", ...style }}
    >
      {stats.map((s, i) => (
        <div
          key={`${s.label}-${i}`}
          style={{
            padding: "1.1rem 1.2rem",
            borderRadius: "16px",
            background: "linear-gradient(160deg, rgba(255, 196, 64, 0.12) 0%, rgba(255, 196, 64, 0.03) 100%)",
            border: "1px solid rgba(255, 196, 64, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 2.1rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: GOLD,
              textShadow: "0 0 18px rgba(255, 196, 64, 0.35)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {s.label}
          </div>
          {s.detail && (
            <div style={{ marginTop: "0.4rem", color: "#c3cde3", fontSize: "0.82rem", lineHeight: 1.45 }}>{s.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const sectionHeadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: GOLD,
  fontWeight: 800,
  margin: "0 0 1rem 0",
};

function EntryList({
  title,
  entries,
  icon,
}: {
  title: string;
  entries: { label: string; detail: string }[];
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "1.4rem 1.5rem",
        borderRadius: "18px",
        background: "linear-gradient(135deg, rgba(255, 196, 64, 0.07) 0%, rgba(255, 196, 64, 0.02) 100%)",
        border: "1px solid rgba(255, 196, 64, 0.25)",
      }}
    >
      <h3 style={sectionHeadingStyle}>
        <svg width="15" height="15" viewBox="0 0 24 24" {...ICON_PROPS} aria-hidden>
          {icon}
        </svg>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {entries.map((e, i) => (
          <div key={`${e.label}-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                marginTop: "3px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                color: GOLD,
                background: "rgba(255, 196, 64, 0.14)",
                border: "1px solid rgba(255, 196, 64, 0.45)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" {...ICON_PROPS}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#ffffff", fontSize: "0.92rem", fontWeight: 700, lineHeight: 1.4 }}>{e.label}</div>
              {e.detail && (
                <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>{e.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
