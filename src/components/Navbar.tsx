"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/areas-of-interest", label: "Areas of Interest" },
  { href: "/publications", label: "Publications" },
  { href: "/team", label: "Team" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link
          href="/"
          className={styles.logo}
          style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo.jpg"
            alt="BioTech Uncharted Logo"
            style={{
              height: "52px",
              borderRadius: "8px",
              objectFit: "contain",
              border: "1px solid rgba(64, 224, 208, 0.25)",
              boxShadow: "0 0 12px rgba(64, 224, 208, 0.2)",
            }}
          />
          <span style={{ display: "flex", alignItems: "center", fontSize: "1.6rem" }}>
            BioTech<span className={styles.logoAccent}>Uncharted</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.menuToggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barTop : ""}`} />
          <span className={`${styles.bar} ${open ? styles.barMid : ""}`} />
          <span className={`${styles.bar} ${open ? styles.barBot : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <nav className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}>
        <ul className={styles.mobileList}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.mobileLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
