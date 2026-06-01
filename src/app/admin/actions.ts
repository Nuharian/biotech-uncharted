"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

export async function createNews(formData: FormData) {
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const isHighlighted = formData.get("isHighlighted") === "on";

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.news.create({
    data: {
      title,
      slug,
      summary,
      content,
      isHighlighted,
    }
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function createTeamMember(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const email = formData.get("email") as string;
  const position = formData.get("position") as string;
  const bio = formData.get("bio") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const researchGateUrl = formData.get("researchGateUrl") as string;
  const googleScholarUrl = formData.get("googleScholarUrl") as string;
  const imageFile = formData.get("image");

  let imageUrl = "";

  // Convert uploaded image to Base64 data URL to bypass Vercel read-only filesystem limitations
  if (imageFile && typeof imageFile === "object" && "size" in imageFile && imageFile.size > 0) {
    try {
      const file = imageFile as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const base64Data = buffer.toString("base64");
      imageUrl = `data:${file.type || "image/jpeg"};base64,${base64Data}`;
    } catch (err) {
      console.error("Failed to convert image to Base64:", err);
    }
  }

  await prisma.teamMember.create({
    data: {
      name,
      role: role || position || "Member",
      position: position || role || "Member",
      email: email || null,
      bio: bio || null,
      imageUrl: imageUrl || null,
      linkedinUrl: linkedinUrl || null,
      researchGateUrl: researchGateUrl || null,
      googleScholarUrl: googleScholarUrl || null,
      order: 0,
    }
  });

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id }
    });
  } catch (err) {
    console.error("Failed to delete team member:", err);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}
