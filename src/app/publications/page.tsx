import { prisma } from "@/lib/prisma";
import styles from "../page.module.css";

export const revalidate = 0;

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({ orderBy: { publishDate: 'desc' } });

  return (
    <div className="container section animate-fade-in">
      <h1 className={styles.sectionTitle}>Research <span className={styles.textAccent}>Publications</span></h1>
      <div className={styles.grid}>
        {publications.map(pub => (
          <div key={pub.id} className="glass-card">
            <h3>{pub.title}</h3>
            <p className={styles.meta}>{pub.authors} - {pub.journal}</p>
            <p>{pub.abstract}</p>
            {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.readMore}>View Paper &rarr;</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
