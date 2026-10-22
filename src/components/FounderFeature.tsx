import Link from "next/link";
import type { TeamMember } from "@prisma/client";
import { FounderStats } from "@/components/FounderSpotlight";
import { parseEntries, parseParagraphs } from "@/lib/founder";
import styles from "./FounderFeature.module.css";

/**
 * Homepage "Meet the Founder" band, directly under the hero. A condensed version of the
 * /team spotlight — portrait, the lead paragraph of the biography and the headline
 * numbers — linking through to the full profile at /team#founder.
 */
export default function FounderFeature({ member }: { member: TeamMember }) {
  const [lead] = parseParagraphs(member.profile);
  const stats = parseEntries(member.stats).slice(0, 4);
  const firstName = member.name.split(" ")[0];

  const links = [
    { url: member.googleScholarUrl, label: "Google Scholar" },
    { url: member.linkedinUrl, label: "LinkedIn" },
    { url: member.researchGateUrl, label: "ResearchGate" },
    { url: member.githubUrl, label: "GitHub" },
  ].filter((l) => l.url);

  return (
    <section className={styles.band} aria-labelledby="founder-feature-name">
      <div className={`container ${styles.inner}`}>
        <div className={styles.portraitWrap}>
          <div className={styles.halo} aria-hidden />
          {member.imageUrl ? (
            <img src={member.imageUrl} alt={member.name} className={styles.portrait} />
          ) : (
            <div className={`${styles.portrait} ${styles.initials}`}>
              {member.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.body}>
          <span className={styles.eyebrow}>★ Meet the Founder</span>
          <h2 id="founder-feature-name" className={styles.name}>{member.name}</h2>
          <p className={styles.title}>
            {member.position || member.role}
            <span className={styles.titleOrg}> · BioTech Uncharted</span>
          </p>

          {lead && <p className={styles.lead}>{lead}</p>}

          {stats.length > 0 && <FounderStats stats={stats} style={{ marginTop: "1.75rem" }} />}

          <div className={styles.actions}>
            <Link href="/team#founder" className={`btn ${styles.cta}`}>
              Read {firstName}&rsquo;s Full Profile &rarr;
            </Link>
            {links.length > 0 && (
              <div className={styles.links}>
                {links.map((l) => (
                  <a key={l.label} href={l.url as string} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {l.label}<span aria-hidden className={styles.linkArrow}>&#8599;</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
