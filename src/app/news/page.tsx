import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../page.module.css";

export const revalidate = 0;

export default async function NewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: 'desc' } });

  return (
    <div className="container section animate-fade-in">
      <h1 className={styles.sectionTitle}>Latest <span className={styles.textAccent}>News</span></h1>
      <div className={styles.grid}>
        {news.map(item => (
          <div key={item.id} className="glass-card">
            <h3>{item.title}</h3>
            <p className={styles.meta}>{new Date(item.publishedAt).toLocaleDateString()}</p>
            <p>{item.summary}</p>
            <Link href={`/news/${item.slug}`} className={styles.readMore}>Read Full Story &rarr;</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
