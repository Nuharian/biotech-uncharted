import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav className={styles.nav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/news">News</Link>
          <Link href="/admin/publications">Publications</Link>
          <Link href="/admin/team">Team</Link>
          <Link href="/admin/areas">Areas of Interest</Link>
          <Link href="/admin/messages">Messages</Link>
          <Link href="/admin/visits">Traffic & IPs</Link>
          <Link href="/" target="_blank">View Site &rarr;</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
