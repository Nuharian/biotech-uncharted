import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";

export const revalidate = 0; // Dynamic for real-time analytics

// Helper function to simplify user agents into clean browser/device badges
function parseUserAgent(uaString: string | null): string {
  if (!uaString) return "Unknown";
  const ua = uaString.toLowerCase();
  
  if (ua.includes("bot") || ua.includes("spider") || ua.includes("crawl")) return "🤖 Bot / Crawler";
  if (ua.includes("postman") || ua.includes("curl") || ua.includes("http")) return "🛠 API Client";
  
  let browser = "Browser";
  if (ua.includes("edg")) browser = "🌐 Edge";
  else if (ua.includes("chrome")) browser = "🌐 Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "🌐 Safari";
  else if (ua.includes("firefox")) browser = "🌐 Firefox";
  else if (ua.includes("opr") || ua.includes("opera")) browser = "🌐 Opera";
  
  let os = "";
  if (ua.includes("iphone") || ua.includes("ipad")) os = " (iOS)";
  else if (ua.includes("android")) os = " (Android)";
  else if (ua.includes("windows")) os = " (Windows)";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = " (macOS)";
  else if (ua.includes("linux")) os = " (Linux)";

  return `${browser}${os}`;
}

export default async function AdminVisits() {
  const visits = await prisma.visit.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Limit to last 100 for performance
  });

  const totalViews = await prisma.visit.count();
  
  // Aggregate unique IPs
  const uniqueIps = await prisma.visit.groupBy({
    by: ["ip"],
    _count: { ip: true }
  });
  const uniqueCount = uniqueIps.length;

  // Aggregate Top Locations
  const countryCounts = await prisma.visit.groupBy({
    by: ["country"],
    _count: { country: true },
    orderBy: { _count: { country: "desc" } },
    take: 3
  });

  // Aggregate Top Pages
  const pageCounts = await prisma.visit.groupBy({
    by: ["path"],
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 3
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Traffic Analytics & IP Tracker</h1>
        <span style={{ 
          background: "rgba(64, 224, 208, 0.1)", 
          color: "var(--color-primary)", 
          padding: "0.4rem 0.8rem", 
          borderRadius: "12px", 
          fontSize: "0.85rem",
          fontWeight: 600,
          border: "1px solid rgba(64, 224, 208, 0.2)"
        }}>
          Live Monitoring
        </span>
      </div>
      <p style={{ color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
        Real-time monitoring of active visitors, parsed IP addresses, and page navigation history.
      </p>

      {/* Analytics Overview Grid */}
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <h3>Total Page Views</h3>
          <p>{totalViews}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Unique Visitors (IPs)</h3>
          <p>{uniqueCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Top Source Country</h3>
          <p style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
            {countryCounts[0] ? `${countryCounts[0].country} (${countryCounts[0]._count.country} hits)` : "N/A"}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Most Popular Page</h3>
          <p style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
            {pageCounts[0] ? `${pageCounts[0].path} (${pageCounts[0]._count.path} hits)` : "N/A"}
          </p>
        </div>
      </div>

      {/* Breakdown grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
        <div className={styles.statCard} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h4 style={{ color: "var(--color-primary)", margin: "0 0 0.5rem 0" }}>Top 3 Visited Pages</h4>
          {pageCounts.map((pc, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
              <span style={{ fontFamily: "monospace" }}>{pc.path}</span>
              <span style={{ fontWeight: 600 }}>{pc._count.path} views</span>
            </div>
          ))}
          {pageCounts.length === 0 && <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>No pages tracked yet.</p>}
        </div>

        <div className={styles.statCard} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h4 style={{ color: "var(--color-primary)", margin: "0 0 0.5rem 0" }}>Top 3 Visitor Locations</h4>
          {countryCounts.map((cc, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
              <span>📍 {cc.country || "Unknown"}</span>
              <span style={{ fontWeight: 600 }}>{cc._count.country} visits</span>
            </div>
          ))}
          {countryCounts.length === 0 && <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>No locations recorded yet.</p>}
        </div>
      </div>

      {/* Visits Log Table */}
      <div style={{ marginTop: "3rem" }}>
        <h3>Real-time Visitor Logs (Last 100 Hits)</h3>
        {visits.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Location</th>
                <th>Page Path</th>
                <th>Device / Browser</th>
                <th>Referer</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id} style={{ fontSize: "0.9rem" }}>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {new Date(visit.createdAt).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                    {visit.ip}
                  </td>
                  <td>
                    <span style={{ 
                      background: visit.country === "Development" ? "rgba(255, 165, 0, 0.15)" : "rgba(64, 224, 208, 0.15)", 
                      color: visit.country === "Development" ? "#ffa500" : "var(--color-primary)", 
                      padding: "0.2rem 0.5rem", 
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600
                    }}>
                      📍 {visit.city ? `${visit.city}, ` : ""}{visit.country}
                    </span>
                  </td>
                  <td style={{ fontFamily: "monospace", color: "#e2e8f0" }}>
                    {visit.path}
                  </td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {parseUserAgent(visit.userAgent)}
                  </td>
                  <td style={{ 
                    maxWidth: "150px", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8rem"
                  }}>
                    {visit.referer ? (
                      <a href={visit.referer} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                        {visit.referer.replace(/https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      "Direct / Organic"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--color-text-muted)", marginTop: "1rem" }}>No page views recorded yet.</p>
        )}
      </div>
    </div>
  );
}
