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
  const githubUrl = formData.get("githubUrl") as string;
  const imageFile = formData.get("image") as File | null;

  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure public/uploads directory exists
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      // Generate unique safe filename
      const safeFilename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filepath = path.join(uploadsDir, safeFilename);
      await fs.writeFile(filepath, buffer);
      
      imageUrl = `/uploads/${safeFilename}`;
    } catch (err) {
      console.error("Failed to save teammate image file:", err);
    }
  }

  await prisma.teamMember.create({
    data: {
      name,
      role: role || position || "Member",
      position: position || role || "Member",
      email: email || null,
      bio: bio || "",
      imageUrl: imageUrl || null,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      order: 0,
    }
  });

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function deleteTeamMember(id: string) {
  try {
    // Clean up physical image file
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (member?.imageUrl && member.imageUrl.startsWith("/uploads/")) {
      const filepath = path.join(process.cwd(), "public", member.imageUrl);
      await fs.unlink(filepath).catch(() => {});
    }

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
