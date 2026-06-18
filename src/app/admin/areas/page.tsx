import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { createAreaOfInterest, updateAreaOfInterest, deleteAreaOfInterest } from "../actions";

export const revalidate = 0;

export default async function AdminAreas() {
  const areas = await prisma.areaOfInterest.findMany({ orderBy: { order: "asc" } });

  return (
    <div style={{ maxWidth: "1100px" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Manage Areas of Interest</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Define the research areas shown on the public <strong>Areas of Interest</strong> page. Lower order numbers appear first.
      </p>

      {/* Add Area */}
      <form action={createAreaOfInterest} method="POST" encType="multipart/form-data" className={styles.form}>
        <h3>Add New Area</h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required placeholder="e.g., Synthetic Biology" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="order">Sort Order</label>
            <input type="number" id="order" name="order" min="0" defaultValue="0" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required rows={4} placeholder="Describe this research area…"></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Image (optional)</label>
          <input type="file" id="image" name="image" accept="image/*" style={{ border: "none", background: "transparent", padding: "0.25rem 0" }} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          Save Area
        </button>
      </form>

      {/* Existing areas */}
      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Current Areas</h3>
        {areas.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {areas.map((area) => (
              <div key={area.id} style={{ background: "var(--color-surface-light)", borderRadius: "var(--border-radius)", border: "1px solid rgba(64, 224, 208, 0.15)", overflow: "hidden" }}>
                <details>
                  <summary style={{ listStyle: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" }}>
                    {area.imageUrl ? (
                      <img src={area.imageUrl} alt={area.title} style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--color-primary)" }} />
                    ) : (
                      <div style={{ width: "45px", height: "45px", borderRadius: "8px", background: "rgba(64,224,208,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", flexShrink: 0 }}>◇</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "bold", color: "#ffffff" }}>{area.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Order {area.order}</div>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", whiteSpace: "nowrap" }}>Edit ▾</span>
                  </summary>

                  <form action={updateAreaOfInterest} method="POST" encType="multipart/form-data" className={styles.form} style={{ marginTop: 0, padding: "0 1.25rem 1.5rem", background: "transparent", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <input type="hidden" name="id" value={area.id} />

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginTop: "1.25rem" }}>
                      <div className={styles.formGroup}>
                        <label>Title</label>
                        <input type="text" name="title" required defaultValue={area.title} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Sort Order</label>
                        <input type="number" name="order" min="0" defaultValue={area.order} />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea name="description" rows={4} defaultValue={area.description}></textarea>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Replace Image</label>
                      <input type="file" name="image" accept="image/*" style={{ border: "none", background: "transparent", padding: "0.25rem 0" }} />
                      {area.imageUrl && (
                        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                          <input type="checkbox" name="removeImage" value="yes" style={{ width: "auto" }} />
                          Remove current image
                        </label>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                      <button
                        formAction={deleteAreaOfInterest.bind(null, area.id)}
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
          <p style={{ color: "var(--color-text-muted)" }}>No areas added yet.</p>
        )}
      </div>
    </div>
  );
}
