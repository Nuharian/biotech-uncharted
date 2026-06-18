import Link from "next/link";
import styles from "./Footer.module.css";

const LINKS = [
  { href: "/areas-of-interest", label: "Areas of Interest" },
  { href: "/publications", label: "Publications" },
  { href: "/team", label: "Team" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            BioTech<span className={styles.brandAccent}>Uncharted</span>
          </Link>
          <p className={styles.tagline}>
            Charting the uncharted territories of biological science and AI-driven biotechnology.
          </p>
        </div>

        <nav className={styles.linksCol} aria-label="Footer">
          <h4 className={styles.colTitle}>Explore</h4>
          <ul className={styles.linkList}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`container ${styles.footerBottom}`}>
        <p>&copy; {new Date().getFullYear()} BioTech Uncharted. All rights reserved.</p>
      </div>
    </footer>
  );
}
