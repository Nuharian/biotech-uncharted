import { prisma } from "./prisma";

export async function trackVisit(headersList: Headers, pathname: string) {
  const userAgent = headersList.get("user-agent") || "Unknown";
  const referer = headersList.get("referer") || "";
  
  // Extract client IP address
  const xForwardedFor = headersList.get("x-forwarded-for");
  let ip = "127.0.0.1";
  if (xForwardedFor) {
    ip = xForwardedFor.split(",")[0].trim();
  } else {
    ip = headersList.get("x-real-ip") || "127.0.0.1";
  }

  // Handle local development IPs
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    await prisma.visit.create({
      data: {
        ip: "127.0.0.1",
        userAgent,
        path: pathname,
        referer: referer || null,
        country: "Development",
        region: "Localhost",
        city: "Local Machine",
      }
    });
    return;
  }

  // Parse location details
  let country = headersList.get("x-vercel-ip-country") || null;
  let region = headersList.get("x-vercel-ip-country-region") || null;
  let city = headersList.get("x-vercel-ip-city") || null;

  // If Vercel geolocation headers are missing, fetch from ip-api
  if (!country && ip && ip !== "127.0.0.1" && ip !== "::1") {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout to avoid blocking

      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          country = data.country || null;
          region = data.regionName || null;
          city = data.city || null;
        }
      }
    } catch (err) {
      console.error("Failed to retrieve IP geolocation:", err);
    }
  }

  await prisma.visit.create({
    data: {
      ip,
      userAgent,
      path: pathname,
      referer: referer || null,
      country: country || "Unknown",
      region: region || "Unknown",
      city: city || "Unknown",
    }
  });
}
