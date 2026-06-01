import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";

export const revalidate = 0; // Dynamic for now

export default async function Home() {
  const news = await prisma.news.findMany({
    where: { isHighlighted: true },
    orderBy: { publishedAt: 'desc' },
    take: 3
  });

  const publications = await prisma.publication.findMany({
    where: { isHighlighted: true },
    orderBy: { publishDate: 'desc' },
    take: 3
  });

  return (
    <div className={styles.homeContainer}>
      <section className={`${styles.hero} animate-fade-in`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1.2', minWidth: '320px' }}>
            <h1 className={styles.heroTitle}>Pioneering the Future of <span className={styles.textAccent}>Biotech</span></h1>
            <p className={styles.heroSubtitle}>Explore the cutting-edge research and unearth the mysteries of biological science with our latest publications and insights.</p>
            <div className={styles.heroActions}>
              <Link href="/publications" className="btn btn-primary">Read Publications</Link>
              <Link href="/news" className="btn btn-outline">Latest News</Link>
            </div>
          </div>
          <div style={{ flex: '0.8', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src="/logo.jpg" 
              alt="BioTech Uncharted Brand Logo" 
              style={{ 
                width: '100%',
                maxWidth: '300px', 
                borderRadius: '24px', 
                border: '1px solid rgba(64, 224, 208, 0.25)', 
                boxShadow: '0 0 35px rgba(64, 224, 208, 0.22)', 
                animation: 'float 5s ease-in-out infinite' 
              }} 
            />
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className={styles.sectionTitle}>Highlighted <span className={styles.textAccent}>News</span></h2>
        <div className={styles.grid}>
          {news.length > 0 ? news.map(item => (
            <div key={item.id} className="glass-card">
              <h3>{item.title}</h3>
              <p className={styles.meta}>{new Date(item.publishedAt).toLocaleDateString()}</p>
              <p>{item.summary}</p>
              <Link href={`/news/${item.slug}`} className={styles.readMore}>Read Full Story &rarr;</Link>
            </div>
          )) : <p>No highlighted news yet.</p>}
        </div>
      </section>

      <section className={`section container ${styles.altSection}`}>
        <h2 className={styles.sectionTitle}>Featured <span className={styles.textAccent}>Publications</span></h2>
        <div className={styles.grid}>
          {publications.length > 0 ? publications.map(pub => (
            <div key={pub.id} className="glass-card">
              <h3>{pub.title}</h3>
              <p className={styles.meta}>{pub.authors} - {pub.journal}</p>
              <p>{pub.abstract.substring(0, 150)}...</p>
              {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.readMore}>View Paper &rarr;</a>}
            </div>
          )) : <p>No featured publications yet.</p>}
        </div>
      </section>
    </div>
  );
}
