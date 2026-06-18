import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { createPublication, updatePublication, deletePublication } from "../actions";

export const revalidate = 0;

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default async function AdminPublications() {
  const publications = await prisma.publication.findMany({
    orderBy: [{ isHighlighted: "desc" }, { publishDate: "desc" }],
  });

  const selectStyle = {
    padding: "0.75rem",
    borderRadius: "var(--border-radius)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(2, 11, 26, 0.9)",
    color: "white",
    outline: "none",
  } as const;

  return (
    <div style={{ maxWidth: "1100px" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Manage Publications</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Add papers, set a paper link, and feature key publications on the home page and at the top of the publications list.
      </p>

      {/* Add Publication */}
      <form action={createPublication} className={styles.form}>
        <h3>Add New Publication</h3>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required placeholder="Paper title" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label htmlFor="authors">Authors</label>
            <input type="text" id="authors" name="authors" required placeholder="A. Author, B. Author" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="journal">Journal</label>
            <input type="text" id="journal" name="journal" required placeholder="e.g., Nature Biotechnology" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label htmlFor="publishDate">Publish Date</label>
            <input type="date" id="publishDate" name="publishDate" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="isHighlighted">Feature this publication?</label>
            <select id="isHighlighted" name="isHighlighted" defaultValue="no" style={selectStyle}>
              <option value="no">No — listed normally</option>
              <option value="yes">Yes — featured</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="link">Paper Link (URL)</label>
          <input type="url" id="link" name="link" placeholder="https://doi.org/..." />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="abstract">Abstract</label>
          <textarea id="abstract" name="abstract" required rows={4} placeholder="Short abstract / summary"></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          Save Publication
        </button>
      </form>

      {/* Existing publications */}
      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Current Publications</h3>
        {publications.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {publications.map((pub) => (
              <div
                key={pub.id}
                style={{
                  background: "var(--color-surface-light)",
                  borderRadius: "var(--border-radius)",
                  border: pub.isHighlighted ? "1px solid rgba(255, 196, 64, 0.45)" : "1px solid rgba(64, 224, 208, 0.15)",
                  overflow: "hidden",
                }}
              >
                <details>
                  <summary style={{ listStyle: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "bold", color: "#ffffff", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        {pub.title}
                        {pub.isHighlighted && (
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#ffc440", background: "rgba(255, 196, 64, 0.12)", border: "1px solid rgba(255, 196, 64, 0.4)", padding: "0.1rem 0.5rem", borderRadius: "999px" }}>
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {pub.authors} · {pub.journal} · {new Date(pub.publishDate).getFullYear()}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", whiteSpace: "nowrap" }}>Edit ▾</span>
                  </summary>

                  <form action={updatePublication} method="POST" className={styles.form} style={{ marginTop: 0, padding: "0 1.25rem 1.5rem", background: "transparent", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <input type="hidden" name="id" value={pub.id} />

                    <div className={styles.formGroup} style={{ marginTop: "1.25rem" }}>
                      <label>Title</label>
                      <input type="text" name="title" required defaultValue={pub.title} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div className={styles.formGroup}>
                        <label>Authors</label>
                        <input type="text" name="authors" defaultValue={pub.authors} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Journal</label>
                        <input type="text" name="journal" defaultValue={pub.journal} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div className={styles.formGroup}>
                        <label>Publish Date</label>
                        <input type="date" name="publishDate" defaultValue={toDateInput(pub.publishDate)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Feature this publication?</label>
                        <select name="isHighlighted" defaultValue={pub.isHighlighted ? "yes" : "no"} style={selectStyle}>
                          <option value="no">No — listed normally</option>
                          <option value="yes">Yes — featured</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Paper Link (URL)</label>
                      <input type="url" name="link" defaultValue={pub.link || ""} placeholder="https://doi.org/..." />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Abstract</label>
                      <textarea name="abstract" rows={4} defaultValue={pub.abstract}></textarea>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                      <button
                        formAction={deletePublication.bind(null, pub.id)}
                        type="submit"
                        style={{ background: "rgba(255, 68, 68, 0.1)", color: "#ff4444", border: "1px solid rgba(255, 68, 68, 0.2)", padding: "0.6rem 1rem", borderRadius: "var(--border-radius)", cursor: "pointer", fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--color-text-muted)" }}>No publications added yet.</p>
        )}
      </div>
    </div>
  );
}
