import styles from "../page.module.css";
import { createContactMessage } from "../admin/actions";

export const revalidate = 0;

const fieldStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  background: "rgba(2,11,26,0.5)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
} as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="container section animate-fade-in" style={{ maxWidth: "600px" }}>
      <h1 className={styles.sectionTitle}>
        Get In <span className={styles.textAccent}>Touch</span>
      </h1>

      {sent && (
        <div style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "10px", background: "rgba(64, 224, 208, 0.08)", border: "1px solid rgba(64, 224, 208, 0.35)", color: "var(--color-primary)", fontWeight: 600 }}>
          ✓ Thank you! Your message has been sent — we&apos;ll be in touch soon.
        </div>
      )}
      {error && (
        <div style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "10px", background: "rgba(255, 68, 68, 0.08)", border: "1px solid rgba(255, 68, 68, 0.35)", color: "#ff6b6b", fontWeight: 600 }}>
          Something went wrong — please make sure all required fields are filled in.
        </div>
      )}

      <form action={createContactMessage} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
          <input type="text" id="name" name="name" required style={fieldStyle} />
        </div>
        <div>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
          <input type="email" id="email" name="email" required style={fieldStyle} />
        </div>
        <div>
          <label htmlFor="subject" style={{ display: "block", marginBottom: "0.5rem" }}>Subject</label>
          <input type="text" id="subject" name="subject" placeholder="What is this about?" style={fieldStyle} />
        </div>
        <div>
          <label htmlFor="message" style={{ display: "block", marginBottom: "0.5rem" }}>Message</label>
          <textarea id="message" name="message" rows={5} required style={fieldStyle}></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>Send Message</button>
      </form>
    </div>
  );
}
