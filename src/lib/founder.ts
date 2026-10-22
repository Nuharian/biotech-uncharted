import { prisma } from "@/lib/prisma";

// Shared by the homepage founder feature and the /team spotlight, which both read
// the same admin-editable TeamMember fields.

export const GOLD = "#ffc440";

// The founder is a single slot. If several members are flagged, the lowest `order` wins.
export function getFounder() {
  return prisma.teamMember.findFirst({
    where: { isFounder: true },
    orderBy: { order: "asc" },
  });
}

// "Label | detail" per line — used for highlights, honours, peer reviews and stats.
export function parseEntries(raw: string | null) {
  return (raw || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), detail: rest.join("|").trim() };
    });
}

// Long-form biography: blank-line separated paragraphs.
export function parseParagraphs(raw: string | null) {
  return (raw || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Skills are stored comma-separated in `bio`, same convention as TeamMemberCard.
export function parseSkills(raw: string | null) {
  return (raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
