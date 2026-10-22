import { prisma } from "@/lib/prisma";
import TeamMemberCard from "@/components/TeamMemberCard";
import FounderSpotlight from "@/components/FounderSpotlight";
import { getFounder } from "@/lib/founder";

export const revalidate = 0; // Ensure fresh data on load

export default async function TeamPage() {
  // The founder is lifted out of the grid entirely and rendered as a spotlight banner
  // above every category.
  const founder = await getFounder();

  // Query all categories along with their sorted members
  const categoriesRaw = await prisma.teamCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      members: {
        orderBy: { order: "asc" },
      }
    }
  });

  // Query members who do not belong to any category
  const uncategorizedRaw = await prisma.teamMember.findMany({
    where: { categoryId: null },
    orderBy: { order: "asc" }
  });

  // Keep the founder from appearing a second time as an ordinary card.
  const categories = categoriesRaw.map((c) => ({
    ...c,
    members: c.members.filter((m) => m.id !== founder?.id),
  }));
  const uncategorizedMembers = uncategorizedRaw.filter((m) => m.id !== founder?.id);
  const hasOtherMembers =
    categories.some((c) => c.members.length > 0) || uncategorizedMembers.length > 0;

  return (
    <div className="team-page" style={{ background: "var(--color-bg)", minHeight: "95vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: founder ? "3rem" : "5rem" }}>
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

        {/* Founder spotlight — always first, above every category */}
        {founder && <FounderSpotlight member={founder} />}

        {/* Categories Section */}
        {!hasOtherMembers ? (
          !founder && (
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
          )
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
                      <TeamMemberCard key={member.id} member={member} />
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
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>

              </div>
            )}

          </div>
        )}
      </div>

      <style>{`
        /* ---- Founder spotlight ---- */
        .founder-spotlight {
          padding: clamp(2rem, 4vw, 3.5rem);
          animation: founderAura 5s ease-in-out infinite;
        }
        .founder-spotlight__socials {
          gap: 1rem;
        }
        @keyframes founderAura {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255, 196, 64, 0.25), 0 20px 60px rgba(255, 196, 64, 0.12); }
          50%      { box-shadow: 0 0 0 1px rgba(255, 196, 64, 0.5),  0 26px 80px rgba(255, 196, 64, 0.24); }
        }
        .founder-spotlight__img {
          width: 220px;
          height: 220px;
        }
        .founder-spotlight__halo {
          animation: founderHalo 9s linear infinite;
        }
        @keyframes founderHalo {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .founder-spotlight__name {
          animation: founderNameGlow 3.5s ease-in-out infinite;
        }
        @keyframes founderNameGlow {
          0%, 100% { filter: drop-shadow(0 0 14px rgba(255, 196, 64, 0.45)); }
          50%      { filter: drop-shadow(0 0 26px rgba(255, 196, 64, 0.8)); }
        }
        .founder-social:hover {
          color: #020B1A !important;
          background: #ffc440 !important;
          transform: translateY(-2px);
        }
        .founder-contact:hover {
          color: #ffe9a8 !important;
        }
        @media (min-width: 900px) {
          .founder-spotlight__lists {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }
        }
        @media (max-width: 720px) {
          .founder-spotlight__head {
            flex-direction: column;
            text-align: center;
          }
          /* align-items:center shrink-wraps the identity column in column mode —
             stretch it back so the name and social row get the full card width. */
          .founder-spotlight__head > div:last-child {
            width: 100%;
          }
          .founder-spotlight__head > div:last-child > div {
            justify-content: center;
          }
          .founder-spotlight__img {
            width: 170px;
            height: 170px;
          }
        }
        /* The page wrapper and .container each add 2rem of side padding. On a narrow
           phone the wrapper drops its share and the card gives some of its own back,
           so the spotlight keeps enough width for two stat tiles per row. */
        .team-page {
          padding: 5rem 2rem;
        }
        @media (max-width: 520px) {
          .team-page {
            padding: 3.5rem 0;
          }
          .founder-spotlight {
            padding: 1.5rem 1.25rem;
          }
          .founder-spotlight__name {
            font-size: 2rem;
          }
          .founder-spotlight__socials {
            gap: 0.6rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .founder-spotlight,
          .founder-spotlight__halo,
          .founder-spotlight__name {
            animation: none;
          }
        }

        .team-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .team-card:hover {
          transform: translateY(-8px) scale(1.015);
          border-color: rgba(64, 224, 208, 0.4) !important;
          box-shadow: 0 15px 40px rgba(64, 224, 208, 0.2);
        }
        .team-card--featured {
          box-shadow: 0 0 0 1px rgba(255, 196, 64, 0.25), 0 12px 35px rgba(255, 196, 64, 0.12);
          animation: featuredGlow 3.5s ease-in-out infinite;
        }
        .team-card--featured:hover {
          border-color: rgba(255, 196, 64, 0.65) !important;
          box-shadow: 0 15px 45px rgba(255, 196, 64, 0.28) !important;
        }
        @keyframes featuredGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255, 196, 64, 0.2), 0 10px 30px rgba(255, 196, 64, 0.1); }
          50% { box-shadow: 0 0 0 1px rgba(255, 196, 64, 0.4), 0 14px 40px rgba(255, 196, 64, 0.2); }
        }
        .member-name--featured {
          animation: nameGlow 3s ease-in-out infinite;
        }
        @keyframes nameGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 196, 64, 0.45)); }
          50% { filter: drop-shadow(0 0 18px rgba(255, 196, 64, 0.75)); }
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
