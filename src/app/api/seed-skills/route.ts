import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// TEMPORARY one-off endpoint to set Skills & Interest for specific members.
// Protected by a single-use token; removed immediately after running.
const TOKEN = "112a4bed5649c843c2f0389bc1dcc925a996";

// Note: skills are comma-separated; any sub-list inside parentheses uses
// " / " instead of commas so it stays a single tag on the card.
const TARGETS: { match: string; bio: string }[] = [
  {
    match: "nabil",
    bio: [
      "CADD",
      "Target Structure Validation & Ligand Library Preparation",
      "Protein 3D Structure Prediction",
      "Molecular Docking for Structure-Based Drug Design",
      "Molecular Docking using AutoDock",
      "Molecular Docking using ChimeraX",
      "Discovery Studio",
      "ADMET Properties",
      "Drug Repurposing",
      "Molecular Dynamics Simulation",
      "RNA Sequencing",
      "RNA-Seq Experimental Design",
      "Linux Terminal Basics",
      "Upstream Analysis (FASTQ QC / Alignment / Quantification)",
      "Downstream Analysis in R (DEG / MSG / PCA / VP)",
    ].join(", "),
  },
  {
    match: "abir",
    bio: [
      "Genomic Data Analysis",
      "PCR",
      "DNA Extraction",
      "DNA Quantification",
      "Agarose Gel Electrophoresis",
      "SDS-PAGE",
      "ELISA",
      "Genomics (Assembly & Annotation)",
      "Proteomics",
      "SPSS",
    ].join(", "),
  },
  {
    match: "azrin",
    bio: [
      "PCR",
      "DNA Extraction",
      "DNA Quantification",
      "STR Profiling",
      "Forensic DNA Analysis",
      "Sanger Sequencing Data Analysis",
      "Agarose Gel Electrophoresis",
      "SDS-PAGE",
      "ELISA",
      "Microbial Culture Techniques",
      "Gram Staining",
      "Biochemical Identification Assays (Indole / MR / VP / Citrate / TSI / Urease / Catalase / Oxidase)",
      "Population Genetics Analysis",
      "Disease Association Studies",
      "Bioinformatics",
      "Laboratory Quality Assurance",
    ].join(", "),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("token") !== TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const members = await prisma.teamMember.findMany({ select: { id: true, name: true, bio: true } });
  const apply = searchParams.get("apply") === "1";

  const results: { target: string; matched: string[]; updated: boolean }[] = [];

  for (const t of TARGETS) {
    const matches = members.filter((m) => m.name.toLowerCase().includes(t.match));
    if (apply) {
      for (const m of matches) {
        await prisma.teamMember.update({ where: { id: m.id }, data: { bio: t.bio } });
      }
    }
    results.push({ target: t.match, matched: matches.map((m) => m.name), updated: apply && matches.length > 0 });
  }

  if (apply) {
    revalidatePath("/team");
    revalidatePath("/");
  }

  return NextResponse.json({
    ok: true,
    mode: apply ? "applied" : "preview",
    allMemberNames: members.map((m) => m.name),
    results,
  });
}
