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
  const peerReviews = formData.get("peerReviews") as string;
  const categoryId = formData.get("categoryId") as string;
  const orderStr = formData.get("order") as string;
  const imageFile = formData.get("image");
  const isHighlighted = formData.get("isHighlighted") === "yes";

  let imageUrl = "";
  const order = orderStr ? parseInt(orderStr, 10) : 0;

  // Convert uploaded image to Base64 data URL to bypass Vercel read-only filesystem limitations
  imageUrl = (await fileToDataUrl(imageFile)) || "";

  await prisma.teamMember.create({
    data: {
      name,
      role: role || position || "Member",
      position: position || role || "Member",
      email: email || null,
      bio: bio || null,
      peerReviews: peerReviews || null,
      imageUrl: imageUrl || null,
      linkedinUrl: linkedinUrl || null,
      researchGateUrl: researchGateUrl || null,
      googleScholarUrl: googleScholarUrl || null,
      isHighlighted,
      order: isNaN(order) ? 0 : order,
      categoryId: categoryId && categoryId !== "none" ? categoryId : null,
    }
  });

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

// Convert an uploaded image File into a Base64 data URL (or null if no file).
// Used to bypass Vercel's read-only filesystem so images can live in the DB.
async function fileToDataUrl(imageFile: FormDataEntryValue | null): Promise<string | null> {
  if (imageFile && typeof imageFile === "object" && "size" in imageFile && imageFile.size > 0) {
    try {
      const file = imageFile as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = buffer.toString("base64");
      return `data:${file.type || "image/jpeg"};base64,${base64Data}`;
    } catch (err) {
      console.error("Failed to convert image to Base64:", err);
    }
  }
  return null;
}

// Full edit of an existing team member — every field is updatable from the admin panel.
export async function updateTeamMember(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Member ID is required");
  }

  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const researchGateUrl = formData.get("researchGateUrl") as string;
  const googleScholarUrl = formData.get("googleScholarUrl") as string;
  const peerReviews = formData.get("peerReviews") as string;
  const categoryId = formData.get("categoryId") as string;
  const orderStr = formData.get("order") as string;
  const imageFile = formData.get("image");
  const isHighlighted = formData.get("isHighlighted") === "yes";
  const removeImage = formData.get("removeImage") === "yes";

  const order = orderStr ? parseInt(orderStr, 10) : 0;

  // Only replace the stored image when a new file is uploaded; allow explicit removal.
  const newImageUrl = await fileToDataUrl(imageFile);
  let imageUrl: string | null | undefined = undefined; // undefined = leave unchanged
  if (newImageUrl) {
    imageUrl = newImageUrl;
  } else if (removeImage) {
    imageUrl = null;
  }

  try {
    await prisma.teamMember.update({
      where: { id },
      data: {
        name: name || undefined,
        position: position || null,
        role: position || name || "Member",
        email: email || null,
        bio: bio || null,
        peerReviews: peerReviews || null,
        linkedinUrl: linkedinUrl || null,
        researchGateUrl: researchGateUrl || null,
        googleScholarUrl: googleScholarUrl || null,
        isHighlighted,
        order: isNaN(order) ? 0 : order,
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      }
    });
  } catch (err) {
    console.error("Failed to update team member:", err);
  }

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

export async function createTeamCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const orderStr = formData.get("order") as string;
  const order = orderStr ? parseInt(orderStr, 10) : 0;

  if (!name || name.trim() === "") {
    throw new Error("Category name is required");
  }

  try {
    await prisma.teamCategory.upsert({
      where: { name: name.trim() },
      update: {
        order: isNaN(order) ? 0 : order,
      },
      create: {
        name: name.trim(),
        order: isNaN(order) ? 0 : order,
      }
    });
  } catch (err) {
    console.error("Failed to create or update team category:", err);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function deleteTeamCategory(id: string) {
  try {
    await prisma.teamCategory.delete({
      where: { id }
    });
  } catch (err) {
    console.error("Failed to delete category:", err);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function updateTeamMemberOrderAndCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const categoryId = formData.get("categoryId") as string;
  const orderStr = formData.get("order") as string;
  const order = orderStr ? parseInt(orderStr, 10) : 0;

  if (!id) {
    throw new Error("Member ID is required");
  }

  try {
    await prisma.teamMember.update({
      where: { id },
      data: {
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
        order: isNaN(order) ? 0 : order,
      }
    });
  } catch (err) {
    console.error("Failed to update team member order/category:", err);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function updateTeamCategoryNameAndOrder(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const orderStr = formData.get("order") as string;
  const order = orderStr ? parseInt(orderStr, 10) : 0;

  if (!id) {
    throw new Error("Category ID is required");
  }

  try {
    await prisma.teamCategory.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        order: isNaN(order) ? 0 : order,
      }
    });
  } catch (err) {
    console.error("Failed to update category name/order:", err);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
}


