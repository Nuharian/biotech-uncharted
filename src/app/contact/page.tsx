"use client";
import styles from "../page.module.css";

export default function ContactPage() {
  return (
    <div className="container section animate-fade-in" style={{ maxWidth: '600px' }}>
      <h1 className={styles.sectionTitle}>Get In <span className={styles.textAccent}>Touch</span></h1>
      <form className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input type="text" id="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(2,11,26,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
        </div>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input type="email" id="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(2,11,26,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
        </div>
        <div>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
          <textarea id="message" rows={5} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(2,11,26,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Send Message</button>
      </form>
    </div>
  );
}
