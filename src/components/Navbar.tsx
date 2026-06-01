import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src="/logo.jpg" 
            alt="BioTech Uncharted Logo" 
            style={{ 
              height: '52px', 
              borderRadius: '8px', 
              objectFit: 'contain',
              border: '1px solid rgba(64, 224, 208, 0.25)',
              boxShadow: '0 0 12px rgba(64, 224, 208, 0.2)'
            }} 
          />
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.6rem' }}>
            BioTech<span className={styles.logoAccent}>Uncharted</span>
          </span>
        </Link>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>
            <li><Link href="/areas-of-interest" className={styles.navLink}>Areas of Interest</Link></li>
            <li><Link href="/publications" className={styles.navLink}>Publications</Link></li>
            <li><Link href="/team" className={styles.navLink}>Team</Link></li>
            <li><Link href="/news" className={styles.navLink}>News</Link></li>
            <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
