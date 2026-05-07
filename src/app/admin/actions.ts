"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
