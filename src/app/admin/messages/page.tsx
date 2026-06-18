import { prisma } from "@/lib/prisma";
import { markMessageRead, deleteContactMessage } from "../actions";

export const revalidate = 0;

export default async function AdminMessages() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div style={{ maxWidth: "950px" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Contact Messages</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Messages submitted through the public contact form. {unread > 0 ? `${unread} unread.` : "All caught up."}
      </p>

      {messages.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No messages yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                background: "var(--color-surface-light)",
                borderRadius: "var(--border-radius)",
                border: m.isRead ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(64, 224, 208, 0.4)",
                padding: "1.25rem 1.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <strong style={{ color: "#ffffff" }}>{m.name}</strong>
                    {!m.isRead && (
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-primary)", background: "rgba(64, 224, 208, 0.12)", border: "1px solid rgba(64, 224, 208, 0.4)", padding: "0.1rem 0.45rem", borderRadius: "999px" }}>
                        New
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${m.email}`} style={{ color: "var(--color-primary)", fontSize: "0.85rem" }}>{m.email}</a>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: "0.85rem", color: "#ccd6f6", fontWeight: 600, fontSize: "0.95rem" }}>
                {m.subject}
              </div>
              <p style={{ marginTop: "0.35rem", color: "var(--color-text-muted)", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {m.message}
              </p>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                {!m.isRead && (
                  <form action={markMessageRead.bind(null, m.id)}>
                    <button type="submit" style={{ background: "rgba(64, 224, 208, 0.12)", color: "var(--color-primary)", border: "1px solid rgba(64, 224, 208, 0.3)", padding: "0.4rem 0.8rem", borderRadius: "var(--border-radius)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                      Mark as read
                    </button>
                  </form>
                )}
                <form action={deleteContactMessage.bind(null, m.id)}>
                  <button type="submit" style={{ background: "rgba(255, 68, 68, 0.1)", color: "#ff4444", border: "1px solid rgba(255, 68, 68, 0.2)", padding: "0.4rem 0.8rem", borderRadius: "var(--border-radius)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
