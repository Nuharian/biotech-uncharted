/**
 * Seeds (or refreshes) the founder profile shown on the homepage and in the
 * spotlight on /team.
 *
 * The local dev database is SQLite while the deployed site runs on PostgreSQL
 * (see prisma-setup.js), so data written locally does NOT reach production.
 * Run this against whichever database you want to populate:
 *
 *   local:      node scripts/seed-founder.js
 *   production: DATABASE_URL="postgres://..." node scripts/seed-founder.js
 *   (the Vercel build also runs it with --if-missing, see below)
 *
 * It is idempotent — safe to run repeatedly — but it overwrites the founder's
 * profile fields, so edits made in the admin panel at /admin/team are replaced.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const FOUNDER_EMAIL = "ariannuhan41@gmail.com";

// The first paragraph doubles as the lead on the homepage, so it must stand alone.
const profile = [
  "Arian Nuhan is the founder of BioTech Uncharted and the mind behind its research agenda. A computer scientist working where cryptography, machine learning and the life sciences meet, he founded BioTech Uncharted on a simple conviction: that the rigour of computer science can open up territory in biology that has never been mapped.",
  "He graduated from BRAC University with a BSc in Computer Science and Engineering with Highest Distinction (CGPA 3.96/4.00), and was named to the Vice-Chancellor's List in every one of the degree's eleven semesters. He went on to teach at BRAC University as an Adjunct Lecturer, leading laboratory courses in Computer Graphics, Operating Systems and Algorithms.",
  "In computational biology, he is developing a 27-equation multi-scale model of hematopoiesis — the process by which the body produces red blood cells, neutrophils and platelets — that captures the erythropoietin, oxygen and inflammatory signals regulating each lineage, with the longer-term aim of a simulatable digital twin of blood-cell production.",
  "His work in security and AI safety is just as ambitious. He is a co-author of HELO Cryptography, a lightweight cryptographic system for securing peer-to-peer data between resource-constrained IoT devices (arXiv:2605.03948), and the sole author of the Jailbreak Robustness Ladder, a cross-lingual benchmark that tests how reliably open large language models refuse harmful requests in seven languages, using a new comprehension-controlled measure that separates genuine safety failures from simple model confusion. He has also built an inline content-filtering system evaluated on roughly 11,000 real-world posts, is writing two papers on post-quantum security for connected devices, and serves as Research Assistant to Dr. Mohammad Rafiqul Islam at the BRAC Institute of Languages.",
  "Arian has led from the front throughout. As Campus Director of the UN Academic Impact Millennium Fellowship at BRAC University, he trained and supervised a cohort of 26 fellows and was selected to represent the programme at the GET Engaged Conference in Budapest. He was part of the team that won BRAC University's first and highest IC5 seed grant for an autonomous underwater vehicle, was a finalist in the APAC HPC-AI Competition, and co-founded the Development & Unity Alliance, which runs free health camps and child-feeding programmes in Bangladesh.",
].join("\n\n");

// "Value | caption" — the first four also appear on the homepage.
const stats = [
  "3.96 | CGPA out of 4.00 — graduated with Highest Distinction",
  "11 / 11 | Semesters on BRAC University's Vice-Chancellor's List",
  "27 | Equations in his multi-scale model of blood-cell formation",
  "7 | Languages in his cross-lingual LLM safety benchmark",
  "26 | Millennium Fellows led as Campus Director",
].join("\n");

const highlights = [
  "BSc Computer Science & Engineering, BRAC University | Highest Distinction, CGPA 3.96/4.00 — Vice-Chancellor's List in all 11 semesters",
  "Multi-Scale Model of Hematopoiesis | 27-equation model of red-cell, neutrophil and platelet production, being developed toward a simulatable digital twin",
  "HELO Cryptography — arXiv:2605.03948 | Co-author. A lightweight cryptographic system for secure peer-to-peer data transmission between IoT devices",
  "Mental Health and Academic Performance in University Students | Co-author. South Asian Journal of Social Studies and Economics, 23(1):190–207, 2026",
  "Jailbreak Robustness Ladder | Sole author. Cross-lingual LLM safety benchmark across 7 languages and 4 open-weight models — manuscript complete",
  "Content-Filtering Middleman Proxy | Sole author. Text and vision moderation evaluated on ~11,000 real-world posts — being finalised for submission",
  "Post-Quantum Security for IoT | Sole author. Two companion manuscripts on PKI-less device pairing and telemetry, in preparation",
  "Research Assistant to Dr. Mohammad Rafiqul Islam | BRAC Institute of Languages, May 2025 – present",
].join("\n");

const honours = [
  "First & Highest Seed Grant (IC5), BRAC University — 2025 | Awarded to the Autonomous Underwater Vehicle project under the UIHP programme",
  "Finalist, APAC HPC-AI Competition — 2024 | National Supercomputing Centre (NSCC); AI workloads run on the Gadi supercomputer",
  "Adjunct Lecturer, BRAC University — 2025–26 | Computer Graphics, Operating Systems and Algorithms laboratories",
  "Campus Director, Millennium Fellowship — 2022–23 | UN Academic Impact & MCN; trained and supervised a cohort of 26 fellows",
  "GET Engaged Conference, Budapest — 2023 | Selected to represent BRAC University's Millennium Fellows",
  "ICPC Asia Dhaka Regional — 2023 | Onsite contestant",
  "Finalist, Therap JavaFest 2024 & Banglalink SDG Hackathon 3.0 | National software and sustainable-development competitions",
  "Co-founder, Development & Unity Alliance | Free health camps and child-feeding programmes in Bangladesh",
  "The Daily Star Award — 2016 | Excellence in O Level examinations",
].join("\n");

const skills = [
  "Computational Biology",
  "Systems Biology Modelling",
  "Cryptography",
  "Post-Quantum Security",
  "AI Safety",
  "Machine Learning",
  "Deep Learning",
  "Data Science",
  "High-Performance Computing",
  "Python",
  "PyTorch",
  "Research Leadership",
].join(", ");

const data = {
  name: "Arian Nuhan",
  role: "Founder & Director",
  position: "Founder & Director",
  email: FOUNDER_EMAIL,
  bio: skills,
  profile,
  highlights,
  honours,
  stats,
  imageUrl: "/team/arian-nuhan.jpg",
  linkedinUrl: "https://www.linkedin.com/in/arian-nuhan-281831280",
  googleScholarUrl: "https://scholar.google.com/citations?user=MpnHEZQAAAAJ&hl=en",
  researchGateUrl: "https://www.researchgate.net/profile/Arian-Nuhan",
  githubUrl: "https://github.com/Nuharian",
  isFounder: true,
  isHighlighted: true,
  order: 0,
};

// The production build runs this with --if-missing: it seeds only while no member holds the
// founder spotlight, so admin-panel edits are never overwritten and a failure never blocks a deploy.
const IF_MISSING = process.argv.includes("--if-missing");

async function main() {
  if (IF_MISSING) {
    const founder = await prisma.teamMember.findFirst({ where: { isFounder: true } });
    if (founder) {
      console.log(`Founder already set (${founder.name}) — skipping seed.`);
      return;
    }
  }

  const existing = await prisma.teamMember.findFirst({
    where: { OR: [{ email: FOUNDER_EMAIL }, { name: { contains: "Arian" } }] },
  });

  const member = existing
    ? await prisma.teamMember.update({ where: { id: existing.id }, data })
    : await prisma.teamMember.create({ data });

  console.log(`${existing ? "Updated" : "Created"} founder: ${member.name} (${member.position})`);

  // The spotlight is a single slot — clear the flag from anyone else.
  const { count } = await prisma.teamMember.updateMany({
    where: { isFounder: true, id: { not: member.id } },
    data: { isFounder: false },
  });
  if (count) console.log(`Cleared founder flag from ${count} other member(s).`);
}

main()
  .catch((e) => { console.error(e); process.exit(IF_MISSING ? 0 : 1); })
  .finally(() => prisma.$disconnect());
